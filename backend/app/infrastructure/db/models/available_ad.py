from sqlalchemy import Column, Integer, String, Text, Float, Boolean, JSON, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
import enum
from app.infrastructure.db.base import Base

class AdStatus(str, enum.Enum):
    PENDING = "PENDING"
    ACTIVE = "ACTIVE"
    REJECTED = "REJECTED"
    INACTIVE = "INACTIVE"

class AvailableAd(Base):
    __tablename__ = "available_ads"

    id = Column(Integer, primary_key=True, index=True)
    raw_text = Column(Text, nullable=False)
    normalized_text = Column(Text, nullable=True)
    source = Column(String, index=True, nullable=True)
    
    # Contact
    contact_name = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    contact_whatsapp = Column(String, nullable=True)
    
    # Financial
    rent_min = Column(Float, index=True, nullable=True)
    rent_max = Column(Float, index=True, nullable=True)
    
    # Property details
    property_type = Column(String, index=True, nullable=True)
    
    # Location
    city = Column(String, index=True, nullable=True)
    area = Column(String, index=True, nullable=True)
    location_text = Column(Text, nullable=True)
    nearby_places = Column(JSON, nullable=True)
    
    # Suitability & Capacity
    gender_preference = Column(String, index=True, nullable=True)
    people_count = Column(Integer, nullable=True)
    
    # Features
    rooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    beds = Column(Integer, nullable=True)
    kitchen_available = Column(Boolean, nullable=True)
    attached_bathroom = Column(Boolean, nullable=True)
    separate_entrance = Column(Boolean, nullable=True)
    parking_available = Column(Boolean, nullable=True)
    furnished_status = Column(Boolean, nullable=True)
    facilities_json = Column(JSON, nullable=True)
    special_notes = Column(Text, nullable=True)
    
    # Meta
    extraction_confidence = Column(Float, nullable=True)
    extraction_warnings = Column(JSON, nullable=True)
    status = Column(String, default=AdStatus.PENDING.value, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
