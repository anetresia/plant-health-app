
import json
from datetime import date
from typing import Optional

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
)
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.plant import Plant
from app.models.plant_check import PlantCheck
from app.schemas.plant_check import (
    PlantAIResult,
    PlantCheckResponse,
)
from app.services.service import (
    analyze_plant,
    verify_plant_image,
    PlantImageValidationError,
)

router = APIRouter(prefix="/plant-checks", tags=["Plant Checks"])

MAX_IMAGE_SIZE = 5 * 1024 * 1024

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": b"\xff\xd8\xff",
    "image/png": b"\x89PNG\r\n\x1a\n",
    "image/webp": b"RIFF",
}

PLANT_SYMPTOM_KEYWORDS = {
    "yellow", "yellowing", "brown", "spots", "spot",
    "curl", "curling", "curled", "wilting", "wilt",
    "drooping", "dry", "drying", "holes", "hole",
    "insects", "insect", "pests", "pest", "aphids",
    "fungus", "fungal", "mold", "mildew", "rot",
    "rotting", "black", "white", "powder", "sticky",
    "stunted", "discoloration", "discolored", "dying",
    "decay", "leaves", "leaf", "stem", "root", "roots",
    "flowers", "flower", "fruit", "blight", "lesions",
    "damage", "damaged", "growth", "falling", "fallen",
    "burnt", "burning",
}


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
            detail="Please describe your plant symptoms.",
        )

    if not words.intersection(PLANT_SYMPTOM_KEYWORDS):
        raise HTTPException(
            status_code=422,
            detail=(
                "Describe plant symptoms such as yellow leaves, "
                "curling leaves, or brown spots."
            ),
        )


async def validate_image(image: Optional[UploadFile]):
    if image is None:
        print("[IMAGE CHECK] No image uploaded. Text-only analysis.")
        return None, None

    content_type = (image.content_type or "").lower()

    print(
        f"[IMAGE CHECK] Uploaded file: {image.filename}; "
        f"type: {content_type}"
    )

    if content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPG, PNG, or WebP image.",
        )

    image_bytes = await image.read(MAX_IMAGE_SIZE + 1)

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded image is empty.",
        )

    if len(image_bytes) > MAX_IMAGE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image size must not exceed 5 MB.",
        )

    if not image_bytes.startswith(ALLOWED_IMAGE_TYPES[content_type]):
        raise HTTPException(
            status_code=400,
            detail="The uploaded file does not match its image type.",
        )

    if content_type == "image/webp":
        if len(image_bytes) < 12 or image_bytes[8:12] != b"WEBP":
            raise HTTPException(
                status_code=400,
                detail="The uploaded WebP image is invalid.",
            )

    print(f"[IMAGE CHECK] Received {len(image_bytes)} bytes.")
    return image_bytes, content_type


def parse_ai_result(value):
    if not value:
        return None

    try:
        result = json.loads(value)

        if not isinstance(result, dict):
            return None

        return PlantAIResult.model_validate(result).model_dump()

    except (json.JSONDecodeError, ValidationError, TypeError):
        return None


def build_plant_check_response(check: PlantCheck):
    return {
        "id": check.id,
        "plant_id": check.plant_id,
        "symptoms": check.symptoms,
        "ai_result": parse_ai_result(check.ai_result),
        "check_date": check.check_date,
    }


@router.post("/", response_model=PlantCheckResponse)
def create_plant_check(
    plant_id: int = Form(...),
    symptoms: str = Form(...),
    check_date: date = Form(...),
    db: Session = Depends(get_db),
):
    validate_symptoms(symptoms)

    plant = db.query(Plant).filter(Plant.id == plant_id).first()

    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")

    plant_check = PlantCheck(
        plant_id=plant_id,
        symptoms=symptoms.strip(),
        check_date=check_date,
    )

    db.add(plant_check)
    db.commit()
    db.refresh(plant_check)

    return build_plant_check_response(plant_check)


@router.post("/{check_id}/analyze", response_model=PlantCheckResponse)
async def analyze_plant_check(
    check_id: int,
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    print(f"[REQUEST] Analysis requested for check {check_id}")

    plant_check = (
        db.query(PlantCheck)
        .filter(PlantCheck.id == check_id)
        .first()
    )

    if not plant_check:
        raise HTTPException(
            status_code=404,
            detail="Plant check not found.",
        )

    validate_symptoms(plant_check.symptoms)

    plant = (
        db.query(Plant)
        .filter(Plant.id == plant_check.plant_id)
        .first()
    )

    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found.")

    image_bytes, image_mime_type = await validate_image(image)

    try:
        # Images must pass verification before disease analysis.
        if image_bytes is not None:
            print(
                f"[IMAGE CHECK] Selected plant: {plant.name}; "
                f"type: {plant.plant_type}"
            )
            print("[IMAGE CHECK] Verification started.")

            verification = verify_plant_image(
                plant_name=plant.name,
                plant_type=plant.plant_type,
                image_bytes=image_bytes,
                image_mime_type=image_mime_type,
            )

            print(
                "[IMAGE CHECK] Verification passed:",
                verification,
            )

        print("[PLANT ANALYSIS] Analysis started.")

        raw_result = analyze_plant(
            plant_name=plant.name,
            plant_type=plant.plant_type,
            symptoms=plant_check.symptoms,
            image_bytes=image_bytes,
            image_mime_type=image_mime_type,
        )

    except PlantImageValidationError as error:
        print(f"[IMAGE CHECK] Rejected: {error}")

        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    except RuntimeError as error:
        print(f"[AI ERROR] {error}")

        raise HTTPException(
            status_code=503,
            detail="AI analysis is temporarily unavailable. Please try again.",
        ) from error

    try:
        validated_result = PlantAIResult.model_validate(raw_result)
    except ValidationError as error:
        print(f"[AI ERROR] Invalid result: {error}")

        raise HTTPException(
            status_code=502,
            detail="The AI returned an invalid result.",
        ) from error

    # Save the AI result only after successful verification and analysis.
    plant_check.ai_result = json.dumps(
        validated_result.model_dump(),
        ensure_ascii=False,
    )

    db.commit()
    db.refresh(plant_check)

    print(f"[PLANT ANALYSIS] Result saved for check {check_id}")

    return build_plant_check_response(plant_check)


@router.get(
    "/plant/{plant_id}",
    response_model=list[PlantCheckResponse],
)
def get_plant_checks(
    plant_id: int,
    db: Session = Depends(get_db),
):
    checks = (
        db.query(PlantCheck)
        .filter(PlantCheck.plant_id == plant_id)
        .order_by(PlantCheck.check_date.desc())
        .all()
    )

    return [build_plant_check_response(check) for check in checks]
