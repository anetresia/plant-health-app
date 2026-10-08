from sqlalchemy import Column, Date, ForeignKey, Integer, Text
from app.database import Base


class PlantCheck(Base):
    __tablename__ = "plant_checks"

    id = Column(Integer, primary_key=True)

    plant_id = Column(
        Integer,
        ForeignKey("plants.id"),
        nullable=False
    )

    symptoms = Column(Text, nullable=False)

    ai_result = Column(
        Text,
        nullable=True
    )

    check_date = Column(
        Date,
        nullable=False
    )