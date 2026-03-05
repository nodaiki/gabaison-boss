from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
import crud.task as crud
import schemas.task as schemas

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/task")
def create_task(
    task: schemas.TaskCreate,
    db: Session = Depends(get_db)
):
    return crud.create_task(db, task)