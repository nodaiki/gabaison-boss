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



class MemberTaskInfo(BaseModel):
    member_id: UUID
    task_id: UUID
    task_name: str
    goal_time: int
    leave_time: int
    total_time: int
    planet_id: int
    online_member_count: int


class MemberTaskResponse(BaseModel):
    members: List[MemberTaskInfo]


class TaskInviteRequest(BaseModel):
    email: EmailStr


class TaskInviteResponse(BaseModel):
    task_id: UUID
    member_id: UUID


class TaskMemberInfo(BaseModel):
    member_id: UUID
    user_id: UUID
    name: str
    email: EmailStr
    sum_time: int
    is_online: bool


class TaskMembersResponse(BaseModel):
    task_id: UUID
    members: List[TaskMemberInfo]


class TaskStatusResponse(BaseModel):
    task_id: UUID
    goal_time: int
    total_time: int
    leave_time: int
    online_member_count: int
