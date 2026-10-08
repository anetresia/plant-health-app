from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.person import Person
from app.schemas.person import PersonCreate, PersonResponse


router = APIRouter(
    prefix="/persons",
    tags=["Persons"]
)


@router.post("/", response_model=PersonResponse)
def create_person(
    person_data: PersonCreate,
    db: Session = Depends(get_db)
):

    existing_person = db.query(Person).filter(
        Person.email == person_data.email
    ).first()

    if existing_person:
        raise HTTPException(
            status_code=400,
            detail="Person with this email already exists"
        )

    person = Person(
        name=person_data.name,
        email=person_data.email
    )

    db.add(person)
    db.commit()
    db.refresh(person)

    return person


@router.get("/verify", response_model=PersonResponse)
def verify_person(
    name: str,
    email: str,
    db: Session = Depends(get_db)
):

    person = db.query(Person).filter(
        Person.name == name,
        Person.email == email
    ).first()

    if not person:
        raise HTTPException(
            status_code=404,
            detail="Person not found"
        )

    return person