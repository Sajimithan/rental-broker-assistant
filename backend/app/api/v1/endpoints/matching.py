from fastapi import APIRouter

router = APIRouter()

@router.post("/query")
async def find_matches():
    pass

@router.get("/available/{id}")
async def get_matches_for_available_ad(id: int):
    pass

@router.get("/needed/{id}")
async def get_matches_for_needed_ad(id: int):
    pass
