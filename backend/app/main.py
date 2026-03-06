from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Rental Broker Assistant API",
    description="Backend API for Rental Broker Assistant with LangChain + Gemini",
    version="1.0.0",
)

# CORS configuration
# Ideally read from settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.v1.router import api_router

@app.get("/api/v1/health")
async def health_check():
    return {"status": "ok", "message": "Rental Broker API is running"}

app.include_router(api_router, prefix=settings.API_V1_STR)

