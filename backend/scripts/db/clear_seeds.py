"""
Script to clean all seed/placeholder data from the DB.
Deletes any available_ad where the raw_text matches known placeholders.
"""
import sys
sys.path.insert(0, '.')

from app.infrastructure.db.session import SessionLocal
from app.infrastructure.db.models.available_ad import AvailableAd

SEED_PATTERNS = [
    "Room for rent in Nugegoda",
    "Apartment for rent in Colombo",
    "House for rent in Kandy",
]

db = SessionLocal()
try:
    deleted = 0
    for pattern in SEED_PATTERNS:
        ads = db.query(AvailableAd).filter(AvailableAd.raw_text.ilike(f"%{pattern}%")).all()
        for ad in ads:
            print(f"Deleting seed ad ID={ad.id}: {ad.raw_text[:60]!r}")
            db.delete(ad)
            deleted += 1
    db.commit()
    print(f"\nDone. Deleted {deleted} seed record(s).")
    remaining = db.query(AvailableAd).count()
    print(f"Remaining available_ads in DB: {remaining}")
finally:
    db.close()
