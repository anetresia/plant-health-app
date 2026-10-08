from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import Person

router = APIRouter(prefix="/persons", tags=["Persons"])


@router.post("/")
def create_person(
    name: str,
    email: str,
    db: Session = Depends(get_db)
):

    person = Person(
        name=name,
        email=email
    )

    db.add(person)
    db.commit()
    db.refresh(person)

    return person


@router.get("/verify")
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

    return {
        "message": "Person verified successfully",
        "person": person
    }