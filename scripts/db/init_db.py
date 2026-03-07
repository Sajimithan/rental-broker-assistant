from app.infrastructure.db.base import Base
from app.infrastructure.db.session import engine
# Import all models to ensure they are registered with Base.metadata
from app.infrastructure.db.models import available_ad, needed_ad, match, audit_log

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
