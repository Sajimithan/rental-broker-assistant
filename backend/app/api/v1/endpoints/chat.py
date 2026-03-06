from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class ChatQuery(BaseModel):
    message: str

@router.post("/query")
async def chat_interaction(request: ChatQuery):
    pass
