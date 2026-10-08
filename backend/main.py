from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
from routers import person, plants


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Plant Health Analysis System"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(person.router)
app.include_router(plants.router)


@app.get("/")
def home():
    return {
        "message": "AI Plant Health API is running"
    }