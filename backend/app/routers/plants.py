from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.plant import Plant
from app.schemas.plant import PlantCreate, PlantResponse


router = APIRouter(
    prefix="/plants",
    tags=["Plants"]
)


@router.post("/", response_model=PlantResponse)
def add_plant(
    plant_data: PlantCreate,
    db: Session = Depends(get_db)
):

    plant = Plant(
        name=plant_data.name,
        plant_type=plant_data.plant_type,
        location=plant_data.location,
        owner_name=plant_data.owner_name
    )

    db.add(plant)
    db.commit()
    db.refresh(plant)

    return plant


@router.get("/", response_model=list[PlantResponse])
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


@router.delete("/{plant_id}")
def delete_plant(
    plant_id: int,
    db: Session = Depends(get_db)
):

    plant = db.query(Plant).filter(
        Plant.id == plant_id
    ).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail="Plant not found"
        )

    db.delete(plant)
    db.commit()

    return {
        "message": "Plant deleted successfully"
    }