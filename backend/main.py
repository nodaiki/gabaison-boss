import os
from fastapi import FastAPI
from sqlalchemy import create_engine
from routers import auth
import models
from database import engine, Base

# モデルからテーブルを作成（既存のテーブルがある場合はスキップされます）
Base.metadata.create_all(bind=engine)

from routers import task


DATABASE_URL = os.environ["DATABASE_URL"]
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

app = FastAPI()

# ルーターの読み込み
app.include_router(auth.router)

@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1")).scalar_one()
    return {"ok": True}

