import asyncio
from app.domain.extraction.service import extraction_service
from app.domain.extraction.schemas import ExtractionPreviewRequest

async def test_extraction():
    extract_req = ExtractionPreviewRequest(raw_text="looking for a room in nugegoda", ad_type="NEEDED")
    preview = await extraction_service.preview_extraction(extract_req)
    print("Extracted Data:", preview.extracted_data)
    print("Warnings:", preview.warnings)

if __name__ == "__main__":
    asyncio.run(test_extraction())
