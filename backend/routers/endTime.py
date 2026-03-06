from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from crud import endTime
from database import get_db

router = APIRouter(prefix="/time", tags=["time"])

@router.put("/{time_id}")
def end_time(time_id: UUID, db: Session = Depends(get_db)):

    result = endTime.end_time(db, time_id)

    if not result:
        raise HTTPException(status_code=404, detail="time not found")

    return result