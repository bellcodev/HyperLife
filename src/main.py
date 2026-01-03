from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import sqlite3
from datetime import datetime

app = FastAPI()

# CORS (IMPORTANTE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/frontend", StaticFiles(directory="frontend"), name="frontend")
app.mount("/audio", StaticFiles(directory="../audio"), name="audio")
app.mount("/assets", StaticFiles(directory="../assets"), name="assets")

class Relevante(BaseModel):
    relevante: str

def createTable():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS relevante (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            day INTEGER,
            hecho TEXT
        )
    """)
    conn.commit()
    conn.close()

@app.get("/")
def root():
    createTable()
    return FileResponse("frontend/index.html")

@app.post("/newRelevante")
def new_relevante(data: Relevante):
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO relevante (day, hecho) VALUES (?, ?)",
        (datetime.now().day, data.relevante)
    )
    conn.commit()
    return {"status": "ok"}

@app.get("/getRelevante")
def get_relevante():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT day, hecho FROM relevante")
    data = cursor.fetchall()
    return data

@app.post("/resetMonth")
def reset_month():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM relevante")
    conn.commit()
    return {"status": "reset"}
