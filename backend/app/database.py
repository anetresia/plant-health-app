import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# .env file-la irukkura database details-a load pannrom.
load_dotenv()

# MySQL connection details-a environment variables-la irundhu edukkrom.
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("DB_NAME", "ai_plant_health_db")

# Password-la special characters irundhaalum connection URL correct-aa
# create panna URL.create use pannrom.
from sqlalchemy.engine import URL

DATABASE_URL = URL.create(
    drivername="mysql+pymysql",
    username=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=int(DB_PORT),
    database=DB_NAME,
)

# MySQL database-oda connection engine create pannrom.
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

# Database operations-ku session create pannrom.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# SQLAlchemy models inherit panna base class.
Base = declarative_base()


# API request-ku database session provide pannrom.
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()