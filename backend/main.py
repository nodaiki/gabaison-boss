import os
from fastapi import FastAPI
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

app = FastAPI()

@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1")).scalar_one()
    return {"ok": True}
