from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.infrastructure.db.models.available_ad import AdStatus

class AvailableAdBase(BaseModel):
    raw_text: str
    normalized_text: Optional[str] = None
    source: Optional[str] = None
    
    contact_name: Optional[str] = None
    contact_phone: Optional[str] = None
    contact_whatsapp: Optional[str] = None
    
    rent_min: Optional[float] = None
    rent_max: Optional[float] = None
    
    property_type: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    location_text: Optional[str] = None
    nearby_places: Optional[List[str]] = None
    
    gender_preference: Optional[str] = None
    people_count: Optional[int] = None
    
    rooms: Optional[int] = None
    bathrooms: Optional[int] = None
    beds: Optional[int] = None
    kitchen_available: Optional[bool] = None
    attached_bathroom: Optional[bool] = None
    separate_entrance: Optional[bool] = None
    parking_available: Optional[bool] = None
    furnished_status: Optional[bool] = None
    facilities_json: Optional[Dict[str, Any]] = None
    special_notes: Optional[str] = None

class AvailableAdCreate(AvailableAdBase):
    extraction_confidence: Optional[float] = None
    extraction_warnings: Optional[Dict[str, Any]] = None
    status: AdStatus = AdStatus.PENDING

class AvailableAdUpdate(AvailableAdBase):
    raw_text: Optional[str] = None
    status: Optional[AdStatus] = None

class AvailableAdInDBBase(AvailableAdBase):
    id: int
    extraction_confidence: Optional[float] = None
    extraction_warnings: Optional[Dict[str, Any]] = None
    status: AdStatus
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AvailableAd(AvailableAdInDBBase):
    pass
