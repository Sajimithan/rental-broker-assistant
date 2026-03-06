from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

class MatchResultBase(BaseModel):
    available_ad_id: int
    needed_ad_id: int
    score: float
    matched_fields_summary: Dict[str, Any]
    explanation: Optional[str] = None

class MatchResult(MatchResultBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
