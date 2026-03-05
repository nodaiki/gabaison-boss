from pydantic import BaseModel
from uuid import UUID
from typing import List


class TaskCreate(BaseModel):
    name: str
    planet_id: UUID
    member_emails: List[str]