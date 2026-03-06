from sqlalchemy.orm import Session
from app.infrastructure.db.session import SessionLocal
from app.domain.available_ads.schemas import AvailableAdCreate
from app.domain.available_ads.service import available_ad_service

def seed_db():
    db: Session = SessionLocal()
    
    # Check if already seeded
    if len(available_ad_service.get_multi(db)) > 0:
        print("Database already seeded.")
        return

    # Seed data
    ads = [
        AvailableAdCreate(
            raw_text="Room for rent in Nugegoda for 2 boys. 25000",
            normalized_text="room rent nugegoda 2 boys 25000",
            city="Nugegoda",
            rent_max=25000.0,
            people_count=2,
            gender_preference="male",
            property_type="room"
        ),
        AvailableAdCreate(
            raw_text="Looking for someone to share annex in Maharagama. Attached bath. 15000",
            normalized_text="share annex maharagama attached bathroom 15000",
            city="Maharagama",
            rent_max=15000.0,
            people_count=1,
            property_type="annex",
            attached_bathroom=True
        )
    ]

    for ad in ads:
        available_ad_service.create(db, ad)
        
    print("Database seeded with sample available ads.")

if __name__ == "__main__":
    seed_db()
