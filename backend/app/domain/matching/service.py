from typing import List, Optional
from sqlalchemy.orm import Session
from app.infrastructure.db.models.available_ad import AvailableAd
from app.infrastructure.db.models.needed_ad import NeededAd

def compute_match_score(available: AvailableAd, needed: NeededAd) -> float:
    score = 0.0
    
    # Base match: Rent overlap
    if available.rent_max and needed.rent_min:
        if available.rent_max >= needed.rent_min:
            score += 20.0
    
    # Location match
    if available.city and needed.city and available.city.lower() == needed.city.lower():
        score += 30.0

    # Property type fit
    if available.property_type and needed.property_type and available.property_type.lower() == needed.property_type.lower():
        score += 20.0

    # Capacity
    if available.people_count and needed.people_count and available.people_count >= needed.people_count:
        score += 10.0
        
    # Facilities bonus
    if needed.attached_bathroom and available.attached_bathroom:
        score += 5.0

    if needed.parking_available and available.parking_available:
        score += 5.0

    return min(100.0, score)

class MatchingEngine:
    def find_matches_for_needed(self, db: Session, needed_ad: NeededAd) -> List[dict]:
        # Very basic deterministic filtering
        query = db.query(AvailableAd).filter(AvailableAd.status == "ACTIVE")
        
        if needed_ad.city:
            query = query.filter(AvailableAd.city.ilike(f"%{needed_ad.city}%"))

        results = query.all()
        matches = []
        
        for available in results:
            score = compute_match_score(available, needed_ad)
            if score > 0:
                matches.append({
                    "available_ad": available,
                    "score": score,
                    "explanation": f"Matched based on score: {score}"
                })
                
        # Sort by score descending
        matches.sort(key=lambda x: x["score"], reverse=True)
        return matches

matching_engine = MatchingEngine()
