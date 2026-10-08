from pydantic import BaseModel, EmailStr


class PersonCreate(BaseModel):
    name: str
    email: EmailStr


class PersonResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True