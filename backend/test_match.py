from app.domain.matching.service import compute_match_score
from app.infrastructure.db.models.available_ad import AvailableAd
from app.infrastructure.db.models.needed_ad import NeededAd

def test_manual_match():
    available = AvailableAd(
        rent_max=25000.0,
        city="Hokandara",
        property_type="Annex",
        people_count=2,
    )
    needed = NeededAd(
        rent_min=25000.0,
        rent_max=None,
    )
    score = compute_match_score(available, needed)
    print(f"Match Score: {score}")

if __name__ == "__main__":
    test_manual_match()
