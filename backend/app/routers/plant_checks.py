
import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.plant import Plant
from app.models.plant_check import PlantCheck
from app.schemas.plant_check import (
    PlantAIResult,
    PlantCheckCreate,
    PlantCheckResponse,
)
from app.services.service import analyze_plant


router = APIRouter(
    prefix="/plant-checks",
    tags=["Plant Checks"],
)


# Plant symptoms identify panna keywords.
PLANT_SYMPTOM_KEYWORDS = {
    "yellow", "yellowing", "brown", "spots", "spot",
    "curl", "curling", "curled", "wilting", "wilt",
    "drooping", "dry", "drying", "holes", "hole",
    "insects", "insect", "pests", "pest", "aphids",
    "fungus", "fungal", "mold", "mildew", "rot",
    "rotting", "black", "white", "powder", "sticky",
    "stunted", "discoloration", "discolored",
    "dying", "decay", "leaves", "leaf", "stem",
    "root", "roots", "flowers", "fruit", "blight",
    "lesions", "damage", "damaged", "growth",
    "falling", "fallen", "burnt", "burning",
}


# ==========================================
# VALIDATE SYMPTOMS
# ==========================================

def validate_symptoms(symptoms: str):
    words = set(
        symptoms.lower()
        .replace(",", " ")
        .replace(".", " ")
        .replace("-", " ")
        .split()
    )

    if len(symptoms.strip()) < 5:
        raise HTTPException(
            status_code=422,
            detail=(
                "Insufficient information. Please describe "
                "your plant symptoms."
            ),
        )

    if not words.intersection(PLANT_SYMPTOM_KEYWORDS):
        raise HTTPException(
            status_code=422,
            detail=(
                "Please enter actual plant symptoms, such as "
                "yellow leaves, curling leaves, or brown spots."
            ),
        )


# ==========================================
# SAFE JSON PARSER
# ==========================================

def parse_ai_result(value):
    # AI result illai-na None return pannrom.
    if not value:
        return None

    try:
        result = json.loads(value)

        if not isinstance(result, dict):
            return None

        # Old records new schema-ku match aagudha-nu check pannrom.
        validated_result = PlantAIResult.model_validate(result)

        return validated_result.model_dump()

    except (json.JSONDecodeError, ValidationError, TypeError):
        # Old plain-text / incompatible records-ku safe fallback.
        return None


# ==========================================
# BUILD RESPONSE
# ==========================================

def build_plant_check_response(check: PlantCheck):
    return {
        "id": check.id,
        "plant_id": check.plant_id,
        "symptoms": check.symptoms,
        "ai_result": parse_ai_result(check.ai_result),
        "check_date": check.check_date,
    }


# ==========================================
# CREATE PLANT CHECK
# ==========================================

@router.post(
    "/",
    response_model=PlantCheckResponse,
)
def create_plant_check(
    check_data: PlantCheckCreate,
    db: Session = Depends(get_db),
):
    validate_symptoms(check_data.symptoms)

    plant = db.query(Plant).filter(
        Plant.id == check_data.plant_id
    ).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail="Plant not found",
        )

    plant_check = PlantCheck(
        plant_id=check_data.plant_id,
        symptoms=check_data.symptoms,
        check_date=check_data.check_date,
    )

    db.add(plant_check)
    db.commit()
    db.refresh(plant_check)

    return build_plant_check_response(plant_check)


# ==========================================
# ANALYZE PLANT CHECK
# ==========================================

@router.post(
    "/{check_id}/analyze",
    response_model=PlantCheckResponse,
)
def analyze_plant_check(
    check_id: int,
    db: Session = Depends(get_db),
):
    plant_check = db.query(PlantCheck).filter(
        PlantCheck.id == check_id
    ).first()

    if not plant_check:
        raise HTTPException(
            status_code=404,
            detail="Plant check not found",
        )

    validate_symptoms(plant_check.symptoms)

    plant = db.query(Plant).filter(
        Plant.id == plant_check.plant_id
    ).first()

    if not plant:
        raise HTTPException(
            status_code=404,
            detail="Plant not found",
        )

    # Gemini service-ai call pannrom.
    try:
        raw_result = analyze_plant(
            plant_name=plant.name,
            plant_type=plant.plant_type,
            symptoms=plant_check.symptoms,
        )

    except RuntimeError as error:
        raise HTTPException(
            status_code=503,
            detail="AI analysis service is temporarily unavailable.",
        ) from error

    # Service dictionary return pannudha-nu check pannrom.
    if not isinstance(raw_result, dict):
        raise HTTPException(
            status_code=502,
            detail="AI service returned an invalid response format.",
        )

    # Pydantic schema moolama AI result validate pannrom.
    try:
        validated_result = PlantAIResult.model_validate(
            raw_result
        )

    except ValidationError as error:
        raise HTTPException(
            status_code=502,
            detail={
                "message": (
                    "AI result does not match the required schema."
                ),
                "errors": error.errors(
                    include_input=False,
                    include_context=False,
                ),
            },
        ) from error

    # Dictionary-ai JSON string-aa database-la save pannrom.
    plant_check.ai_result = json.dumps(
        validated_result.model_dump(),
        ensure_ascii=False,
    )

    db.commit()
    db.refresh(plant_check)

    return build_plant_check_response(plant_check)


# ==========================================
# GET PLANT CHECK HISTORY
# ==========================================

@router.get(
    "/plant/{plant_id}",
    response_model=list[PlantCheckResponse],
)
def get_plant_checks(
    plant_id: int,
    db: Session = Depends(get_db),
):
    checks = db.query(PlantCheck).filter(
        PlantCheck.plant_id == plant_id
    ).order_by(
        PlantCheck.check_date.desc()
    ).all()

    return [
        build_plant_check_response(check)
        for check in checks
    ]
