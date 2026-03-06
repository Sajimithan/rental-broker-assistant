from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import settings

def get_gemini_client() -> ChatGoogleGenerativeAI:
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-pro",
        temperature=0.0,
        google_api_key=settings.GEMINI_API_KEY,
        max_output_tokens=1024,
    )
