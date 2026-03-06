from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from uuid import UUID

from database import SessionLocal
import crud.task as crud
from schemas.task import (
    TaskCreate,
    TaskCreateResponse,
    MemberTaskResponse,
    TaskInviteRequest,
    TaskInviteResponse,
    TaskMembersResponse,
    TaskStatusResponse,
)

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
def get_my_member_tasks(user_id: UUID, db: Session = Depends(get_db)):

    members = crud.get_member_tasks_by_user(db, user_id)

    return {"members": members}


@router.post("/{task_id}/invite", response_model=TaskInviteResponse)
def invite_member(task_id: UUID, req: TaskInviteRequest, db: Session = Depends(get_db)):
    return crud.invite_member_by_email(db, task_id, req.email)


@router.get("/{task_id}/members", response_model=TaskMembersResponse)
def get_members(task_id: UUID, db: Session = Depends(get_db)):
    return crud.get_task_members(db, task_id)


@router.get("/{task_id}/status", response_model=TaskStatusResponse)
def get_status(task_id: UUID, db: Session = Depends(get_db)):
    return crud.get_task_status(db, task_id)
