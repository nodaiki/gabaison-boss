import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

# .envの環境変数を取得（ユーザー名も取得するように変更）
db_user = os.getenv("POSTGRES_USER", "user")
db_password = os.getenv("POSTGRES_PASSWORD", "user1234")
db_name = os.getenv("POSTGRES_DB", "db")

# URLの構築（ユーザー名を db_user に変更）
DATABASE_URL = f"postgresql+psycopg://{db_user}:{db_password}@db:5432/{db_name}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()