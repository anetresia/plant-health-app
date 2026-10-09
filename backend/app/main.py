from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Database tables create aaguradhukku models import pannrom.
from app.models.person import Person
from app.models.plant import Plant
from app.models.plant_check import PlantCheck

# API routers import pannrom.
from app.routers.person import router as person_router
from app.routers.plants import router as plants_router
from app.routers.plant_checks import router as plant_checks_router


# =================================
# DATABASE TABLE CREATION
# =================================
# Imported models ellathayum use panni
# configured database-la tables create pannrom.
# Table already irundhaa adhai recreate pannaadhu.

try:
    Base.metadata.create_all(bind=engine)

    print("Database tables created or already exist.")
    print(f"Connected database: {engine.url.database}")

except Exception as error:
    print("Database connection or table creation failed.")
    print(f"Error details: {error}")

    # Error-a hide pannaama backend startup fail aagattum.
    raise


# =================================
# FASTAPI APPLICATION
# =================================
# Main FastAPI application create pannrom.

app = FastAPI(
    title="AI Plant Health Analysis System",
    version="1.0.0"
)


# =================================
# CORS CONFIGURATION
# =================================
# React frontend backend API-a access panna allow pannrom.

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =================================
# REGISTER API ROUTERS
# =================================
# Person, plant, plant check endpoints-a
# main FastAPI application-oda connect pannrom.

app.include_router(person_router)
app.include_router(plants_router)
app.include_router(plant_checks_router)


# =================================
# HOME API
# =================================
# Backend running-aa irukkaa-nu check panna endpoint.

@app.get("/")
def home():

    return {
        "message": "AI Plant Health API is running"
    }