from sqlalchemy import Column, Integer, Float, JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.infrastructure.db.base import Base

class Match(Base):
    __tablename__ = "matches"

    id = Column(Integer, primary_key=True, index=True)
    available_ad_id = Column(Integer, ForeignKey("available_ads.id", ondelete="CASCADE"), nullable=False, index=True)
    needed_ad_id = Column(Integer, ForeignKey("needed_ads.id", ondelete="CASCADE"), nullable=False, index=True)
    
    score = Column(Float, nullable=False, index=True)
    matched_fields_summary = Column(JSON, nullable=True)
    explanation = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships (if needed to load via ORM)
    # available_ad = relationship("AvailableAd", backref="matches")
    # needed_ad = relationship("NeededAd", backref="matches")
