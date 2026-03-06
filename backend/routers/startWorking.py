from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal

import crud.startWorking as crud

from models import Task, Time
from schemas.manageTime import StartWorking, StartWorkingResponse

router = APIRouter(prefix="/work", tags=["work"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/start", response_model=StartWorkingResponse)
def start_working(member: StartWorking, db: Session = Depends(get_db)):
    time_id = crud.create_time(db=db, member=member)
    crud.increment_online_member_count(db=db, member_id=member.member_id)
    return crud.get_task_by_member_id(db=db, member_id=member.member_id, time_id=time_id)
