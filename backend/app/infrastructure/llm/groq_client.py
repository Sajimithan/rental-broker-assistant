from langchain_groq import ChatGroq
from app.core.config import settings

def get_groq_client() -> ChatGroq:
    """
    Initialize the Groq LLM client using the provided API key.
    We use the fast Llama 3.3 70B model which is great for parsing and extraction.
    """
    return ChatGroq(
        model_name="llama-3.3-70b-versatile",
        temperature=0.0,
        api_key=settings.GROQ_API_KEY,
        max_tokens=1024,
    )
