from sqlalchemy import Column, Integer, String
from app.database import Base

# Plant details store panna database table define pannrom.
class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True)

    # Plant name and type-ku string length define pannrom.
    name = Column(String(100), nullable=False)
    plant_type = Column(String(100), nullable=False)

    # Location optional; value illa na NULL save aagum.
    location = Column(String(255), nullable=True)

    # Plant owner name store pannrom.
    owner_name = Column(String(100), nullable=False)