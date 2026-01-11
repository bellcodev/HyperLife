from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import sqlite3
from datetime import datetime
import pandas as pd
import plotly.express as px
from fastapi import Body

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
app.mount("/src", StaticFiles(directory="/"), name="src")

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
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS logros (
            logro1 TEXT,
            logro2 TEXT,
            logro3 TEXT,
            logro4 TEXT,
            logro5 TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS dayLogros (
            day INTEGER,
            total INTEGER
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
    cursor.execute("DELETE FROM dayLogros")
    conn.commit()
    return {"status": "reset"}

@app.get("/getLogros")
async def get_logros():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM logros")
    data = cursor.fetchone()
    return data


@app.post("/addLogros")
async def addLogros(
    data: dict = Body(...)
):
    l1, l2, l3, l4, l5 = data["l1"], data["l2"], data["l3"], data["l4"], data["l5"]
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO logros (logro1, logro2, logro3, logro4, logro5) VALUES (?, ?, ?, ?, ?)",
        (l1, l2, l3, l4, l5)
    )
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.post("/sendDayLogros")
async def send_day_logros(
    data: dict = Body(...)
):
    day = int(data.get("day", False))
    total = int(data.get("total", False))

    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO dayLogros (day, total)
        VALUES (?, ?)
    """, (day, total))
    conn.commit()
    conn.close()

    return {"status": "ok", "msg": "Logros del día guardados"}

@app.get("/stats")
async def stats():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("""SELECT * FROM dayLogros""")
    data = cursor.fetchall()

    dias = []
    total = []
    for d in data:
        dias.append(d[0])
        total.append(d[1])

    datos = {
        "Día": dias,
        "Metas Cumplidas": total
    }
    df = pd.DataFrame(datos).sort_values(by="Día")
    meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    fig = px.line(
        df,
        x="Día",
        y="Metas Cumplidas",
        markers=True,
        title=f"Estadística de metas cumplidas de {meses[datetime.now().month - 1]}/{datetime.now().year}"
    )
    fig.show()

    conn.close()
    return {"status": "ok"}

@app.post("/resetLogros")
def resetLogros():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute("DELETE FROM logros")
    conn.commit()
    conn.close()
    return "sucess"

@app.delete("/delCurrentRel")
async def delCurrentDay():
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM relevante WHERE day = {datetime.now().day}")
    conn.commit()
    conn.close()
    return "sucess"

@app.delete("/delRelevante")
async def delRelevante(
    data: dict = Body(...)
):
    d = int(data.get("d", False))
    conn = sqlite3.connect("data.db")
    cursor = conn.cursor()
    cursor.execute(f"DELETE FROM relevante WHERE day = {d}")
    conn.commit()
    conn.close()
    return "sucess"
