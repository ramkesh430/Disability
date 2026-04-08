import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _load_env_file():
    """Load environment variables from .env file"""
    env_path = Path(__file__).resolve().parents[1] / '.env'
    if not env_path.exists():
        print(f"Warning: .env file not found at {env_path}")
        return
    
    try:
        for line in env_path.read_text(encoding='utf-8').splitlines():
            line = line.strip()
            if not line or line.startswith('#') or '=' not in line:
                continue
            key, value = line.split('=', 1)
            os.environ.setdefault(key.strip(), value.strip())
    except Exception as e:
        print(f"Error loading .env file: {e}")


_load_env_file()

# Use environment variables with fallback
DATABASE_URL = os.getenv('DATABASE_URL', 'mysql+pymysql://root:Mews1234@localhost:3306/disability_id_system')

engine = create_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)
Base = declarative_base()


def get_db():
    """Dependency function to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
