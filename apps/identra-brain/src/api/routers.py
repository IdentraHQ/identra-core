from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
from src.memory.engine import MemoryEngine
from src.llm.client import OllamaClient

router = APIRouter()
memory_engine = MemoryEngine()
llm_client = OllamaClient()

class ChatRequest(BaseModel):
    prompt: str
    active_window: Optional[str] = None
    selected_text: Optional[str] = None

class MemoryAddRequest(BaseModel):
    text: str
    source: str = "chat"

class MemoryQueryRequest(BaseModel):
    query: str
    top_k: int = 5

@router.get("/health")
def health():
    return {"status": "ok", "service": "identra-brain"}

@router.post("/chat")
async def chat(req: ChatRequest):
    # RAG Pipeline
    # 1. Retrieve top memories
    memories = memory_engine.retrieve_memory(req.prompt, top_k=3)
    memory_context = "\n".join([f"- {m['text']}" for m in memories])
    
    # 2. Build system prompt
    system_prompt = "You are Identra, a personal AI agent with access to the user's memories and active screen context.\n"
    if memory_context:
        system_prompt += f"\nRelevant past memories:\n{memory_context}\n"
    if req.active_window:
        system_prompt += f"\nThe user is currently looking at application: {req.active_window}\n"
    if req.selected_text:
        system_prompt += f"\nThe user has highlighted the following text:\n{req.selected_text}\n"
        
    system_prompt += "\nAnswer the user's prompt concisely."
    
    # 3. Stream from Ollama
    return StreamingResponse(
        llm_client.stream_chat(req.prompt, system_prompt),
        media_type="text/event-stream"
    )

@router.post("/memory/add")
def add_memory(req: MemoryAddRequest):
    doc_id = memory_engine.add_memory(req.text, req.source)
    return {"status": "ok", "id": doc_id}

@router.post("/memory/retrieve")
def retrieve_memory(req: MemoryQueryRequest):
    results = memory_engine.retrieve_memory(req.query, req.top_k)
    return {"status": "ok", "memories": results}
