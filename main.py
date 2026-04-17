from fastapi import FastAPI
from signal_generator import generate_signal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "NeuroTrack API running"}

@app.get("/signal")
def get_signal():
    return generate_signal()