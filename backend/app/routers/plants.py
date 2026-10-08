from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.plant import Plant
from app.schemas.plant import PlantCreate, PlantResponse


# =================================
# PLANT ROUTER
# =================================
#
# Intha router-la plant related
# API endpoints irukkum.
#
# Example:
#
# POST   /plants/
# GET    /plants/
# DELETE /plants/{plant_id}
#
router = APIRouter(
    prefix="/plants",
    tags=["Plants"]
)


# =================================
# ADD PLANT
# =================================
#
# User new plant add pannumbothu
# intha API call aagum.
#
# Frontend:
# addPlant()
#
# Backend:
# POST /plants/
#
@router.post(
    "/",
    response_model=PlantResponse
)
def add_plant(
    plant_data: PlantCreate,
    db: Session = Depends(get_db)
):

    # Frontend-la irundhu varra
    # plant details use panni
    # Plant object create pannrom.
    #
    # owner_name:
    # Login pannirukkura user's name.
    #
    plant = Plant(

        name=plant_data.name,

        plant_type=plant_data.plant_type,

        location=plant_data.location,

        owner_name=plant_data.owner_name

    )


    # New plant-a database session-ku add pannrom.
    db.add(plant)


    # Database-la permanently save pannrom.
    db.commit()


    # Database create panna ID etc.
    # updated values-a object-kku refresh pannrom.
    db.refresh(plant)


    # Created plant-a frontend-ku return pannrom.
    return plant


# =================================
# GET PLANTS
# =================================
#
# User My Plants page open pannumbothu
# intha API call aagum.
#
# Search irundhaalum illainaalum
# currently login pannirukkura user's
# plants mattum return aagum.
#
@router.get(
    "/",
    response_model=list[PlantResponse]
)
def get_plants(

    # User search panna plant name.
    #
    # Example:
    # search = "Tomato"
    #
    search: str = "",


    # Currently login pannirukkura
    # user's name.
    #
    # Example:
    # owner_name = "Resia"
    #
    owner_name: str = "",


    db: Session = Depends(get_db)
):

    # =================================
    # START DATABASE QUERY
    # =================================

    # First database-la irukkura
    # Plant table-a query pannrom.
    query = db.query(Plant)


    # =================================
    # FILTER BY OWNER
    # =================================

    # owner_name irundha,
    # antha owner-oda plants mattum
    # filter pannrom.
    #
    # Example:
    #
    # owner_name = "Resia"
    #
    # Resia-oda plants mattum varum.
    #
    if owner_name:

        query = query.filter(
            Plant.owner_name == owner_name
        )


    # =================================
    # SEARCH PLANTS
    # =================================

    # User search value enter pannirundha
    # plant name-la search pannrom.
    #
    # IMPORTANT:
    #
    # Already owner filter apply panniyachu.
    #
    # So search result:
    #
    # Resia's plants
    #       +
    # Tomato search
    #
    # rendu condition-um satisfy aaganum.
    #
    if search:

        query = query.filter(
            Plant.name.ilike(
                f"%{search}%"
            )
        )


    # =================================
    # GET FINAL RESULTS
    # =================================

    # All filters apply pannina apram
    # database-la irundhu plants fetch pannrom.
    plants = query.all()


    # Filter panna plants frontend-ku
    # return pannrom.
    return plants


# =================================
# DELETE PLANT
# =================================
#
# User Delete button click pannumbothu
# intha API call aagum.
#
# Frontend:
#
# deletePlant(
#     plant.id,
#     ownerName
# )
#
# Backend:
#
# DELETE /plants/{plant_id}
#
@router.delete(
    "/{plant_id}"
)
def delete_plant(

    # Delete panna pora plant ID.
    plant_id: int,


    # Currently login pannirukkura
    # user's name.
    owner_name: str,


    db: Session = Depends(get_db)
):

    # =================================
    # FIND PLANT
    # =================================

    # Plant ID mattum check panna koodathu.
    #
    # Plant ID + owner name
    # rendu check pannrom.
    #
    # Ithu important because:
    #
    # User A
    #    ↓
    # User B-oda plant delete
    # panna koodathu.
    #
    plant = db.query(Plant).filter(

        Plant.id == plant_id,

        Plant.owner_name == owner_name

    ).first()


    # =================================
    # PLANT NOT FOUND / NOT OWNER
    # =================================

    # Plant illa na,
    # or antha plant vera user-oda na,
    # error return pannrom.
    if not plant:

        raise HTTPException(

            status_code=404,

            detail=(
                "Plant not found or "
                "you do not have permission "
                "to delete this plant."
            )
        )


    # =================================
    # DELETE
    # =================================

    # Plant correct owner-oda irundha
    # database-la irundhu delete pannrom.
    db.delete(plant)


    # Delete change-a database-la
    # permanently save pannrom.
    db.commit()


    # Frontend-ku success message.
    return {
        "message": "Plant deleted successfully"
    }