from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    available_ads,
    needed_ads,
    extraction,
    matching,
    search,
    chat
)

api_router = APIRouter()
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(available_ads.router, prefix="/available-ads", tags=["available-ads"])
api_router.include_router(needed_ads.router, prefix="/needed-ads", tags=["needed-ads"])
api_router.include_router(extraction.router, prefix="/extraction", tags=["extraction"])
api_router.include_router(matching.router, prefix="/matching", tags=["matching"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
