from pydantic import BaseModel
from uuid import UUID


class StartWorking(BaseModel):
    member_id: UUID

class StartResponse(BaseModel):
    id: UUID
    goal_time: int #FROM tasks
    total_time: int #FROM tasks
    leave_time: int #FROM tasks
    online_member_count: int #FROM tasks


class EndTimeResponse(BaseModel):
    message: str
    added_time: int
    task_total_time: int
    leave_time: int

    class Config:
        from_attributes = True
