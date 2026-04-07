from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np

app = FastAPI()

# Allow React frontend to talk to this server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load saved model
with open("model.pkl", "rb") as f:
    artifacts = pickle.load(f)
    model  = artifacts["model"]
    scaler = artifacts["scaler"]

# Input structure
class HouseFeatures(BaseModel):
    med_inc:    float
    house_age:  float
    ave_rooms:  float
    ave_bedrms: float
    population: float
    ave_occup:  float
    latitude:   float
    longitude:  float

@app.post("/predict")
def predict(features: HouseFeatures):
    input_data = np.array([[
        features.med_inc,
        features.house_age,
        features.ave_rooms,
        features.ave_bedrms,
        features.population,
        features.ave_occup,
        features.latitude,
        features.longitude
    ]])
    scaled = scaler.transform(input_data)
    prediction = model.predict(scaled)[0]
    price = round(prediction * 100_000, 2)
    return {"predicted_price": price}

@app.get("/")
def root():
    return {"status": "ML API is running"}