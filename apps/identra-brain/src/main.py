import os
import logging
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import router, memory_engine, llm_client
from src.memory.distiller import MemoryDistiller
from src.setup import StateManager
from src.setup.profile import UserProfileManager

log_dir = os.path.expanduser("~/.identra/logs")
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=logging.INFO, 
    format="[%(asctime)s] [%(name)s] [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler(os.path.join(log_dir, "brain.log"))
    ]
)
logger = logging.getLogger("brain")

state_manager = StateManager()
profile_manager = UserProfileManager()
distiller = MemoryDistiller(memory_engine, llm_client)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Identra Brain Service is starting up...")
    
    # Mark brain as starting
    state_manager.set_brain_ready(False)
    
    try:
        llm_client.user_name = profile_manager.get_name()

        # Start distiller background task
        distiller_task = asyncio.create_task(distiller.start())
        
        # Verify memory engine is ready
        memory_count = memory_engine.get_collection_count()
        logger.info(f"Memory engine ready with {memory_count} existing memories")
        
        # Verify Ollama is ready
        ollama_ok = await llm_client.check_health()
        if ollama_ok:
            logger.info("Ollama client verified")
            state_manager.set_ollama_checked(True)
            state_manager.set_models_ready(True)
        else:
            logger.warning("Ollama is not responding - service will operate in degraded mode")
        
        # Mark brain as ready
        state_manager.set_brain_ready(True)
        state_manager.set_setup_complete(True)
        logger.info("Identra Brain Service is ready")
        
        yield
        
    finally:
        logger.info("Identra Brain Service is shutting down...")
        await distiller.stop()
        distiller_task.cancel()
        state_manager.set_brain_ready(False)

app = FastAPI(title="Identra Brain", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
