from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.domain.extraction.service import extraction_service
from app.domain.extraction.schemas import ExtractionPreviewRequest
from app.domain.matching.service import matching_engine
from app.domain.needed_ads.schemas import NeededAdBase

router = APIRouter()

class SearchQuery(BaseModel):
    query: str

@router.post("/query")
async def search_natural_language(request: SearchQuery, db: Session = Depends(get_db)):
    # 1. Parse natural language into basic Need structure
    extract_req = ExtractionPreviewRequest(raw_text=request.query, ad_type="NEEDED")
    preview = await extraction_service.preview_extraction(extract_req)
    
    if "parsing_error" in preview.warnings:
        from fastapi import HTTPException
        raise HTTPException(status_code=503, detail=f"AI Extraction failed due to rate limits or API error: {preview.warnings['parsing_error']}")
        
    # 2. Use that to search db
    needed_ad = NeededAdBase(**preview.extracted_data)
    
    # 3. Use matching engine to find available stuff
    # We create a mock NeededAd database model out of the schema for the engine
    from app.infrastructure.db.models.needed_ad import NeededAd
    mock_needed = NeededAd(**needed_ad.model_dump())
    
    results = matching_engine.find_matches_for_needed(db, mock_needed)
    
    from app.domain.available_ads.schemas import AvailableAdInDBBase
    return {
        "understood_query": preview.extracted_data,
        "matches": [
            {
                "score": r["score"],
                "explanation": r["explanation"],
                "ad": AvailableAdInDBBase.model_validate(r["available_ad"]).model_dump()
            } for r in results[:1] 
        ]
    }

@router.post("/structured")
async def search_structured():
    pass
