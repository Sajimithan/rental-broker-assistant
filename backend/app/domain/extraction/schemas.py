from typing import Optional, Dict, Any
from pydantic import BaseModel

class ExtractionPreviewRequest(BaseModel):
    raw_text: str
    ad_type: str  # "AVAILABLE" or "NEEDED"

class ExtractionPreviewResponse(BaseModel):
    extracted_data: Dict[str, Any]
    confidence_score: float
    warnings: Optional[Dict[str, Any]] = None
    normalized_text: Optional[str] = None
