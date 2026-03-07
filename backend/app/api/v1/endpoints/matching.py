from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.infrastructure.db.models.needed_ad import NeededAd
from app.infrastructure.db.models.available_ad import AvailableAd
from app.domain.matching.service import matching_engine, compute_match_score, build_explanation
from app.domain.available_ads.schemas import AvailableAdInDBBase
from app.domain.needed_ads.schemas import NeededAd as NeededAdSchema

router = APIRouter()

@router.get("/all")
def get_all_matches(db: Session = Depends(get_db)):
    """
    Cross-match every needed ad against every available ad.
    Returns a list of needed ads, each with their top 3 available matches.
    """
    needed_ads = db.query(NeededAd).all()
    available_ads = db.query(AvailableAd).filter(
        AvailableAd.status.in_(["ACTIVE", "PENDING"])
    ).all()

    results = []
    for needed in needed_ads:
        scored = []
        for available in available_ads:
            score = compute_match_score(available, needed)
            if score > 0:
                scored.append({
                    "score": score,
                    "explanation": build_explanation(available, needed, score),
                    "ad": AvailableAdInDBBase.model_validate(available).model_dump(),
                })
        scored.sort(key=lambda x: x["score"], reverse=True)

        results.append({
            "needed": {
                "id": needed.id,
                "raw_text": needed.raw_text,
                "city": needed.city,
                "area": needed.area,
                "property_type": needed.property_type,
                "rent_min": needed.rent_min,
                "rent_max": needed.rent_max,
                "gender_preference": needed.gender_preference,
                "people_count": needed.people_count,
                "contact_phone": needed.contact_phone,
                "contact_whatsapp": needed.contact_whatsapp,
                "special_notes": needed.special_notes,
            },
            "top_matches": scored[:3],
            "total_matches": len(scored),
        })

    # Sort: needed ads with most/best matches first
    results.sort(key=lambda x: x["total_matches"], reverse=True)
    return {"pairs": results, "total_needed": len(needed_ads), "total_available": len(available_ads)}


@router.get("/needed/{id}")
def get_matches_for_needed_ad(id: int, db: Session = Depends(get_db)):
    needed = db.query(NeededAd).filter(NeededAd.id == id).first()
    if not needed:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Needed ad not found")
    matches = matching_engine.find_matches_for_needed(db, needed)
    return {
        "matches": [
            {
                "score": r["score"],
                "explanation": r["explanation"],
                "ad": AvailableAdInDBBase.model_validate(r["available_ad"]).model_dump()
            } for r in matches[:5]
        ]
    }
