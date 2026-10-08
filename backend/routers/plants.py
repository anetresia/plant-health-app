from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Plant


router = APIRouter(
    prefix="/plants",
    tags=["Plants"]
)


# Add Plant
@router.post("/")
def add_plant(
    name: str,
    plant_type: str,
    location: str = "",
    symptoms: str = "",
    db: Session = Depends(get_db)
):

    plant = Plant(
        name=name,
        plant_type=plant_type,
        location=location,
        symptoms=symptoms
    )

    db.add(plant)
    db.commit()
    db.refresh(plant)

    return plant


# Get/Search Plants
@router.get("/")
def get_plants(
    search: str = "",
    db: Session = Depends(get_db)
):

    if search:

        plants = db.query(Plant).filter(
            Plant.name.ilike(f"%{search}%")
        ).all()

    else:

        plants = db.query(Plant).all()

    return plants


# Delete Plant
@router.delete("/{plant_id}")
def delete_plant(
    plant_id: int,
    db: Session = Depends(get_db)
):

    plant = db.query(Plant).filter(
        Plant.id == plant_id
    ).first()

    if not plant:

        return {
            "message": "Plant not found"
        }

    db.delete(plant)
    db.commit()

    return {
        "message": "Plant deleted successfully"
    }