from sqlalchemy.orm import Session
from app.infrastructure.db.models.available_ad import AvailableAd
from app.domain.available_ads.schemas import AvailableAdCreate, AvailableAdUpdate
from typing import List, Optional

class AvailableAdService:
    def get(self, db: Session, id: int) -> Optional[AvailableAd]:
        return db.query(AvailableAd).filter(AvailableAd.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[AvailableAd]:
        return db.query(AvailableAd).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: AvailableAdCreate) -> AvailableAd:
        db_obj = AvailableAd(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: AvailableAd, obj_in: AvailableAdUpdate) -> AvailableAd:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, id: int) -> AvailableAd:
        obj = db.query(AvailableAd).get(id)
        db.delete(obj)
        db.commit()
        return obj

available_ad_service = AvailableAdService()
