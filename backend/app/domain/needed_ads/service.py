from sqlalchemy.orm import Session
from app.infrastructure.db.models.needed_ad import NeededAd
from app.domain.needed_ads.schemas import NeededAdCreate, NeededAdUpdate
from typing import List, Optional

class NeededAdService:
    def get(self, db: Session, id: int) -> Optional[NeededAd]:
        return db.query(NeededAd).filter(NeededAd.id == id).first()

    def get_multi(self, db: Session, skip: int = 0, limit: int = 100) -> List[NeededAd]:
        return db.query(NeededAd).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: NeededAdCreate) -> NeededAd:
        db_obj = NeededAd(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(self, db: Session, db_obj: NeededAd, obj_in: NeededAdUpdate) -> NeededAd:
        update_data = obj_in.model_dump(exclude_unset=True)
        for field in update_data:
            setattr(db_obj, field, update_data[field])
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, id: int) -> NeededAd:
        obj = db.query(NeededAd).get(id)
        db.delete(obj)
        db.commit()
        return obj

needed_ad_service = NeededAdService()
