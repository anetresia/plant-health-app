from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.plant import Plant
from app.models.plant_check import PlantCheck
from app.schemas.plant_check import (
    PlantCheckCreate,
    PlantCheckResponse
)
from app.services.service import analyze_plant


router = APIRouter(
    prefix="/plant-checks",
    tags=["Plant Checks"]
)


@router.post(
    "/",
    response_model=PlantCheckResponse
)
def create_plant_check(
    check_data: PlantCheckCreate,
    db: Session = Depends(get_db)
):

    plant = db.query(Plant).filter(
        Plant.id == check_data.plant_id
    ).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail="Plant not found"
        )


    plant_check = PlantCheck(
        plant_id=check_data.plant_id,
        symptoms=check_data.symptoms,
        check_date=check_data.check_date
    )


    db.add(plant_check)
    db.commit()
    db.refresh(plant_check)


    return plant_check


@router.post(
    "/{check_id}/analyze",
    response_model=PlantCheckResponse
)
def analyze_plant_check(
    check_id: int,
    db: Session = Depends(get_db)
):

    plant_check = db.query(PlantCheck).filter(
        PlantCheck.id == check_id
    ).first()

    if not plant_check:
        raise HTTPException(
            status_code=404,
            detail="Plant check not found"
        )


    plant = db.query(Plant).filter(
        Plant.id == plant_check.plant_id
    ).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail="Plant not found"
        )


    ai_result = analyze_plant(
        plant_name=plant.name,
        plant_type=plant.plant_type,
        symptoms=plant_check.symptoms
    )


    plant_check.ai_result = ai_result

    db.commit()
    db.refresh(plant_check)


    return plant_check


@router.get(
    "/plant/{plant_id}",
    response_model=list[PlantCheckResponse]
)
def get_plant_checks(
    plant_id: int,
    db: Session = Depends(get_db)
):

    checks = db.query(PlantCheck).filter(
        PlantCheck.plant_id == plant_id
    ).order_by(
        PlantCheck.check_date.desc()
    ).all()


    return checks