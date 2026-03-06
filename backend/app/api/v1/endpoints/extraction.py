from fastapi import APIRouter, Depends
from app.domain.extraction.schemas import ExtractionPreviewRequest, ExtractionPreviewResponse
from app.domain.extraction.service import extraction_service

router = APIRouter()

@router.post("/available/preview", response_model=ExtractionPreviewResponse)
async def extract_available_ad_preview(request: ExtractionPreviewRequest):
    request.ad_type = "AVAILABLE"
    return await extraction_service.preview_extraction(request)

@router.post("/needed/preview", response_model=ExtractionPreviewResponse)
async def extract_needed_ad_preview(request: ExtractionPreviewRequest):
    request.ad_type = "NEEDED"
    return await extraction_service.preview_extraction(request)
