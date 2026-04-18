from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import logging
from src.memory.engine import MemoryEngine
from src.llm.client import OllamaClient
from src.setup.profile import UserProfileManager

logger = logging.getLogger("brain.api")

router = APIRouter()
memory_engine = MemoryEngine()
llm_client = OllamaClient()
profile_manager = UserProfileManager()

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

class ReadyResponse(BaseModel):
    status: str  # "ready", "degraded", "starting"
    service: str = "identra-brain"
    checks: Dict[str, Any] = {}

@router.get("/health")
def health():
    return {"status": "ok", "service": "identra-brain"}

@router.get("/ready", response_model=ReadyResponse)
async def ready():
    """Readiness check including dependencies (Ollama, ChromaDB)."""
    checks = {}
    overall_status = "ready"
    
    # 1. Check Ollama connectivity
    try:
        ollama_available = await llm_client.check_health()
        checks["ollama"] = {"available": ollama_available, "url": llm_client.base_url}
        if not ollama_available:
            overall_status = "degraded"
    except Exception as e:
        checks["ollama"] = {"available": False, "error": str(e)}
        overall_status = "degraded"
        logger.warning(f"Ollama health check failed: {e}")
    
    # 2. Check ChromaDB collection readiness
    try:
        collection_count = memory_engine.get_collection_count()
        checks["memory"] = {"collection_ready": True, "memory_count": collection_count}
    except Exception as e:
        checks["memory"] = {"collection_ready": False, "error": str(e)}
        overall_status = "degraded"
        logger.warning(f"Memory collection check failed: {e}")
    
    return ReadyResponse(status=overall_status, checks=checks)

@router.post("/chat")
async def chat(req: ChatRequest):
    captured_name = profile_manager.update_from_text(req.prompt)
    if captured_name:
        llm_client.user_name = captured_name
    else:
        llm_client.user_name = profile_manager.get_name()

    # RAG Pipeline
    # 1. Retrieve top memories
    memories = memory_engine.retrieve_memory(req.prompt, top_k=3)
    memory_context = "\n".join([f"- {m['text']}" for m in memories])

    # 2. Build system prompt
    system_prompt = llm_client.build_system_prompt(
        req.prompt,
        memory_context=memory_context,
        active_window=req.active_window or "",
        selected_text=req.selected_text or "",
    )
    
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

class RecordInteractionRequest(BaseModel):
    user_prompt: str
    assistant_response: str

@router.post("/chat/record")
def record_interaction(req: RecordInteractionRequest):
    from src.main import distiller
    memory_engine.add_memory(
        f"User said: {req.user_prompt}\nAssistant replied: {req.assistant_response}",
        source="chat-history",
    )
    distiller.record_interaction(req.user_prompt, req.assistant_response)
    return {"status": "ok"}

class LogEntry(BaseModel):
    timestamp: str
    level: str
    message: str

@router.get("/debug/logs", response_model=list[LogEntry])
def get_debug_logs(limit: int = 100):
    """Retrieve recent logs from Brain service. Default last 100 lines, configurable via limit param."""
    import os
    import pathlib
    
    log_dir = pathlib.Path.home() / ".identra" / "logs"
    log_file = log_dir / "brain.log"
    
    entries = []
    
    # Ensure directory and file exist
    if not log_file.exists():
        return entries
    
    try:
        with open(log_file, 'r') as f:
            lines = f.readlines()
            # Get last 'limit' lines
            recent_lines = lines[-limit:] if len(lines) > limit else lines
            
            for line in recent_lines:
                # Parse log line format: "2024-01-15 10:30:45,123 - LOG_LEVEL - message"
                try:
                    parts = line.strip().split(' - ')
                    if len(parts) >= 3:
                        timestamp = parts[0]
                        level = parts[1]
                        message = ' - '.join(parts[2:])
                        entries.append(LogEntry(
                            timestamp=timestamp,
                            level=level,
                            message=message
                        ))
                except Exception:
                    # Ignore malformed lines
                    pass
    except Exception as e:
        logger.error(f"Failed to read log file: {e}")
    
    return entries
