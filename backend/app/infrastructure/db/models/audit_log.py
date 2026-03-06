from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.infrastructure.db.base import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False, index=True)  # e.g., "CREATE_AVAILABLE_AD", "MATCH_UPDATE"
    entity_type = Column(String, nullable=False, index=True)  # "AVAILABLE_AD", "NEEDED_AD", "MATCH"
    entity_id = Column(Integer, nullable=False, index=True)
    
    old_data = Column(JSON, nullable=True)
    new_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
