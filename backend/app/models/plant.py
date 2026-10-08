from sqlalchemy import Column, Integer, String

from app.database import Base


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    plant_type = Column(String, nullable=False)
    location = Column(String, nullable=True)
    owner_name = Column(String, nullable=False)