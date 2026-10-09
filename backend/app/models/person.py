from sqlalchemy import Column, Integer, String
from app.database import Base

# Person details store panna database table define pannrom.
class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True)

    # Name-ku maximum 100 characters allow pannrom.
    name = Column(String(100), nullable=False)

    # Email-ku maximum 255 characters allow pannrom.
    email = Column(String(255), nullable=False, unique=True)