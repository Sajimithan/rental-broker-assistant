from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db
from app.domain.available_ads.schemas import AvailableAd, AvailableAdCreate, AvailableAdUpdate
from app.domain.available_ads.service import available_ad_service

router = APIRouter()

@router.post("/", response_model=AvailableAd)
async def create_available_ad(ad_in: AvailableAdCreate, db: Session = Depends(get_db)):
    return available_ad_service.create(db, obj_in=ad_in)

@router.get("/", response_model=List[AvailableAd])
async def list_available_ads(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return available_ad_service.get_multi(db, skip=skip, limit=limit)

@router.get("/{id}", response_model=AvailableAd)
async def get_available_ad(id: int, db: Session = Depends(get_db)):
    ad = available_ad_service.get(db, id=id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return ad

@router.put("/{id}", response_model=AvailableAd)
async def update_available_ad(id: int, ad_in: AvailableAdUpdate, db: Session = Depends(get_db)):
    ad = available_ad_service.get(db, id=id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return available_ad_service.update(db, db_obj=ad, obj_in=ad_in)

@router.delete("/{id}", response_model=AvailableAd)
async def delete_available_ad(id: int, db: Session = Depends(get_db)):
    ad = available_ad_service.get(db, id=id)
    if not ad:
        raise HTTPException(status_code=404, detail="Ad not found")
    return available_ad_service.remove(db, id=id)
