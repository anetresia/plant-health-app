from sqlalchemy import Column, Integer, String
from database import Base


class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    plant_type = Column(String, nullable=False)
    location = Column(String, nullable=True)
    symptoms = Column(String, nullable=True)