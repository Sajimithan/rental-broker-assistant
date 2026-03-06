from typing import Optional, Dict, Any
from app.domain.extraction.schemas import ExtractionPreviewRequest, ExtractionPreviewResponse
from app.domain.available_ads.schemas import AvailableAdBase
from app.domain.needed_ads.schemas import NeededAdBase
from app.infrastructure.llm.structured_extractor import StructuredExtractor
from app.domain.extraction.prompts import AVAILABLE_AD_EXTRACTION_PROMPT, NEEDED_AD_EXTRACTION_PROMPT

class ExtractionService:
    def __init__(self):
        self.extractor = StructuredExtractor()

    async def preview_extraction(self, request: ExtractionPreviewRequest) -> ExtractionPreviewResponse:
        confidence = 0.9 # Hardcoded heuristic for now
        warnings = {}
        
        try:
            if request.ad_type == "AVAILABLE":
                extracted = await self.extractor.extract(
                    text=request.raw_text,
                    schema=AvailableAdBase,
                    prompt_template=AVAILABLE_AD_EXTRACTION_PROMPT
                )
            elif request.ad_type == "NEEDED":
                extracted = await self.extractor.extract(
                    text=request.raw_text,
                    schema=NeededAdBase,
                    prompt_template=NEEDED_AD_EXTRACTION_PROMPT
                )
            else:
                raise ValueError("Invalid ad type")
                
            return ExtractionPreviewResponse(
                extracted_data=extracted.model_dump(),
                confidence_score=confidence,
                warnings=warnings,
                normalized_text=None
            )
        except Exception as e:
            warnings["parsing_error"] = str(e)
            return ExtractionPreviewResponse(
                extracted_data={},
                confidence_score=0.1,
                warnings=warnings,
                normalized_text=None
            )

extraction_service = ExtractionService()
