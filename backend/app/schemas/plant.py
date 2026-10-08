from pydantic import BaseModel


class PlantCreate(BaseModel):
    name: str
    plant_type: str
    location: str | None = None
    owner_name: str


class PlantResponse(BaseModel):
    id: int
    name: str
    plant_type: str
    location: str | None
    owner_name: str

    class Config:
        from_attributes = True