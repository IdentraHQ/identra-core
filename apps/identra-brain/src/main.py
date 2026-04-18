import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.routers import router

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

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Identra Brain Service is starting up...")
    yield
    logger.info("Identra Brain Service is shutting down...")

app = FastAPI(title="Identra Brain", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
