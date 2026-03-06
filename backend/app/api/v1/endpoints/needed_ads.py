from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db
from app.domain.needed_ads.schemas import NeededAd, NeededAdCreate, NeededAdUpdate
from app.domain.needed_ads.service import needed_ad_service

router = APIRouter()

@router.post("/", response_model=NeededAd)
async def create_needed_ad(ad_in: NeededAdCreate, db: Session = Depends(get_db)):
    return needed_ad_service.create(db, obj_in=ad_in)

@router.get("/", response_model=List[NeededAd])
async def list_needed_ads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return needed_ad_service.get_multi(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=NeededAd)
async def get_needed_ad(id: int, db: Session = Depends(get_db)):
    ad = needed_ad_service.get(db, id=id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return ad

@router.put("/{id}", response_model=NeededAd)
async def update_needed_ad(id: int, ad_in: NeededAdUpdate, db: Session = Depends(get_db)):
    ad = needed_ad_service.get(db, id=id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return needed_ad_service.update(db, db_obj=ad, obj_in=ad_in)

@router.delete("/{id}", response_model=NeededAd)
async def delete_needed_ad(id: int, db: Session = Depends(get_db)):
    ad = needed_ad_service.get(db, id=id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return needed_ad_service.remove(db, id=id)
