
from datetime import date

from pydantic import BaseModel


# Lecturer worksheet: structured AI response.
class PlantAIResult(BaseModel):
    possible_issue: str
    explanation: str
    care_suggestions: list[str]
    expert_advice_needed: bool


# New plant check create panna use aagum.
class PlantCheckCreate(BaseModel):
    plant_id: int
    symptoms: str
    check_date: date


# API response schema.
class PlantCheckResponse(BaseModel):
    id: int
    plant_id: int
    symptoms: str
    ai_result: PlantAIResult | None = None
    check_date: date

    class Config:
        from_attributes = True
