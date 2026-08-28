from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.events import router as events_router


app = FastAPI(
    title="Real-Time Countdown API"
)


# Allow React frontend to communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    events_router,
    prefix="/api/events"
)


@app.get("/")
def root():
    return {
        "message": "Countdown API is running"
    }