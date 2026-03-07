from typing import List, Optional
from sqlalchemy.orm import Session
from app.infrastructure.db.models.available_ad import AvailableAd
from app.infrastructure.db.models.needed_ad import NeededAd

def compute_match_score(available: AvailableAd, needed: NeededAd) -> float:
    score = 0.0
    
    # Base match: Rent overlap
    # Typically needed ads specify a max budget, and available ads specify an asking price (min or max)
    avail_rent = available.rent_min or available.rent_max
    needed_rent = needed.rent_max or needed.rent_min
    
    if avail_rent and needed_rent:
        if avail_rent <= needed_rent:
            score += 40.0
    elif needed_rent is None:
        # If user didn't specify rent, don't penalize
        pass
    
    # Location match
    if available.city and needed.city:
        if needed.city.lower() in available.city.lower() or available.city.lower() in needed.city.lower():
            score += 30.0

    # Property type fit
    if available.property_type and needed.property_type:
        if available.property_type.lower() in needed.property_type.lower() or needed.property_type.lower() in available.property_type.lower():
            score += 20.0

    # Capacity
    if available.people_count and needed.people_count and available.people_count >= needed.people_count:
        score += 10.0
        
    # Facilities bonus
    if needed.attached_bathroom and available.attached_bathroom:
        score += 5.0

    if needed.parking_available and available.parking_available:
        score += 5.0

    # If the user queried almost nothing, or nothing explicitly matched but it wasn't rejected,
    # give a tiny base score so it shows up in general searches rather than returning empty.
    if score == 0.0 and (not needed.rent_max and not needed.rent_min and not needed.city and not needed.property_type):
        score = 1.0

    return min(100.0, score)

def is_vague_query(needed_ad: NeededAd) -> bool:
    """Returns True if the user gave no specific filter criteria."""
    return not any([
        needed_ad.city,
        needed_ad.property_type,
        needed_ad.rent_min,
        needed_ad.rent_max,
        needed_ad.gender_preference,
        needed_ad.people_count,
        needed_ad.rooms,
    ])

def build_explanation(available: AvailableAd, needed: NeededAd, score: float) -> str:
    reasons = []
    if available.city and needed.city and (
        needed.city.lower() in available.city.lower() or available.city.lower() in needed.city.lower()
    ):
        reasons.append(f"Location match ({available.city})")
    if available.rent_max and needed.rent_max and available.rent_max <= needed.rent_max:
        reasons.append(f"Within budget (Rs. {available.rent_max:,.0f})")
    if available.property_type and needed.property_type and (
        available.property_type.lower() in needed.property_type.lower()
    ):
        reasons.append(f"Property type match ({available.property_type})")
    if not reasons:
        return "Available listing"
    return " · ".join(reasons)

class MatchingEngine:
    def find_matches_for_needed(self, db: Session, needed_ad: NeededAd) -> List[dict]:
        # Include both ACTIVE and PENDING since we don't have an admin approval loop built out yet
        query = db.query(AvailableAd).filter(AvailableAd.status.in_(["ACTIVE", "PENDING"]))

        vague = is_vague_query(needed_ad)

        # Only apply hard city filter when user explicitly asked for a city
        if needed_ad.city and not vague:
            query = query.filter(AvailableAd.city.ilike(f"%{needed_ad.city}%"))

        results = query.all()
        matches = []

        for available in results:
            if vague:
                # Show all listings, ranked by most recent (id desc)
                score = 50.0
            else:
                score = compute_match_score(available, needed_ad)
                if score <= 0:
                    continue  # Filter out genuinely zero-score results only when the query was specific

            matches.append({
                "available_ad": available,
                "score": score,
                "explanation": build_explanation(available, needed_ad, score),
            })

        # Sort by score descending, then by id descending (newest first) as tiebreaker
        matches.sort(key=lambda x: (x["score"], x["available_ad"].id), reverse=True)
        return matches

matching_engine = MatchingEngine()
