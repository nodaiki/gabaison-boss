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
