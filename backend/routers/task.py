from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

from database import SessionLocal
import crud.task as crud
from schemas.task import TaskCreate, MemberResponse, TaskCreateResponse, MemberTaskResponse

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


@router.get("/me", response_model=MemberTaskResponse)
def get_my_member_tasks(user_id, db: Session = Depends(get_db)):

    members = crud.get_member_tasks_by_user(db, user_id)

    return {"members": members}