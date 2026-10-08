from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.person import Person
from app.models.plant import Plant
from app.models.plant_check import PlantCheck

from app.routers.person import router as person_router
from app.routers.plants import router as plants_router
from app.routers.plant_checks import router as plant_checks_router


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Plant Health Analysis System",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routers
app.include_router(person_router)
app.include_router(plants_router)
app.include_router(plant_checks_router)


@app.get("/")
def home():

    return {
        "message": "AI Plant Health API is running"
    }