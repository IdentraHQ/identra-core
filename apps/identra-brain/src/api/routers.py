from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health():
    return {"status": "ok", "service": "identra-brain"}

@router.post("/chat")
async def chat():
    return {"response": "Identra brain alive"}
