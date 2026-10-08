from sqlalchemy import Column, Integer, String

from app.database import Base


class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)