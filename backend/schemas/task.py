from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import List

class TaskCreate(BaseModel):
    name: str
    planet_id: int
    goal_time: int
    leave_time: int
    member_emails: List[EmailStr]

class MemberResponse(BaseModel):
    member_id: UUID

class TaskCreateResponse(BaseModel):
    task_id: UUID
    members: List[MemberResponse]


