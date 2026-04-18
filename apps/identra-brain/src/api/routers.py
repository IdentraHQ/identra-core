from fastapi import APIRouter
from pydantic import BaseModel
from src.memory.engine import MemoryEngine

router = APIRouter()
memory_engine = MemoryEngine()

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
async def chat():
    return {"response": "Identra brain alive"}

@router.post("/memory/add")
def add_memory(req: MemoryAddRequest):
    doc_id = memory_engine.add_memory(req.text, req.source)
    return {"status": "ok", "id": doc_id}

@router.post("/memory/retrieve")
def retrieve_memory(req: MemoryQueryRequest):
    results = memory_engine.retrieve_memory(req.query, req.top_k)
    return {"status": "ok", "memories": results}
