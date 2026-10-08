from datetime import date

from pydantic import BaseModel


class PlantCheckCreate(BaseModel):

    plant_id: int

    symptoms: str

    check_date: date


class PlantCheckResponse(BaseModel):

    id: int

    plant_id: int

    symptoms: str

    ai_result: str | None

    check_date: date

    class Config:
        from_attributes = True