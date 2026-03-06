import pytest
from app.domain.matching.service import compute_match_score
from app.infrastructure.db.models.available_ad import AvailableAd
from app.infrastructure.db.models.needed_ad import NeededAd

def test_compute_match_score_exact_city():
    av = AvailableAd(city="Colombo", rent_max=30000)
    nd = NeededAd(city="colombo", rent_min=25000)
    
    score = compute_match_score(av, nd)
    assert score >= 50.0  # Should match city and rent

def test_compute_match_score_mismatch_city():
    av = AvailableAd(city="Kandy", rent_max=30000)
    nd = NeededAd(city="Colombo", rent_min=25000)
    
    score = compute_match_score(av, nd)
    assert score == 20.0  # Only rent matches
