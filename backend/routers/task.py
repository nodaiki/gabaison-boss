from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

from database import SessionLocal
import crud.task as crud
from schemas.task import TaskCreate, MemberResponse, TaskCreateResponse

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)


@router.post("/task", response_model=TaskCreateResponse)

def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
):
    return crud.create_task(db, task)


