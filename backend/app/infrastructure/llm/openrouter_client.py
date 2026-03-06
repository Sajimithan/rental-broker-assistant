from langchain_openai import ChatOpenAI
from app.core.config import settings

def get_openrouter_client() -> ChatOpenAI:
    return ChatOpenAI(
        model="google/gemma-3-27b-it:free",
        temperature=0.0,
        openai_api_key=settings.OPENROUTER_API_KEY,
        openai_api_base="https://openrouter.ai/api/v1",
        max_tokens=1024,
        default_headers={
            "HTTP-Referer": "http://localhost:8000",
            "X-OpenRouter-Title": "Rental Broker Assistant",
        }
    )
