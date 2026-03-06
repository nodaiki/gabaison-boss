from sqlalchemy.orm import Session
from fastapi import HTTPException
from uuid import UUID

from models import Task, User, Member, Time
from schemas.task import TaskCreate


def create_task(db: Session, task: TaskCreate):


    db_task = Task(
        name=task.name,
        planet_id=task.planet_id,
        goal_time=task.goal_time,
        total_time=0,
        leave_time=task.goal_time,
        online_member_count=0
    )

    db.add(db_task)
    db.flush()

    users = db.query(User).filter(User.email.in_(task.member_emails)).all()

    if len(users) != len(task.member_emails):
        raise HTTPException(status_code=400, detail="Some users not found")

    members = []
    response_members = []

    for user in users:
        member = Member(
            user_id=user.id,
            task_id=db_task.id,
            sum_time=0
        )

        db.add(member)
        db.flush()

        response_members.append({
            "member_id": member.id
        })

    db.commit()

    return {
        "task_id": db_task.id,
        "members": response_members
    }



def get_member_tasks_by_user(db: Session, user_id):

    rows = (
        db.query(Member, Task)
        .join(Task, Member.task_id == Task.id)
        .filter(Member.user_id == user_id)
        .all()
    )

    result = []

    for member, task in rows:
        result.append({
            "member_id": member.id,
            "task_id": task.id,
            "task_name": task.name,
            "goal_time": task.goal_time,
            "leave_time": task.leave_time,
            "total_time": task.total_time,
            "planet_id": task.planet_id,
            "online_member_count": task.online_member_count
        })

    return result


def invite_member_by_email(db: Session, task_id: UUID, email: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="user not found")

    existing = (
        db.query(Member)
        .filter(Member.task_id == task_id, Member.user_id == user.id)
        .first()
    )
    if existing:
        return {"task_id": task_id, "member_id": existing.id}

    member = Member(user_id=user.id, task_id=task_id, sum_time=0)
    db.add(member)
    db.commit()
    db.refresh(member)

    return {"task_id": task_id, "member_id": member.id}


def get_task_members(db: Session, task_id: UUID):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")

    rows = (
        db.query(Member, User)
        .join(User, Member.user_id == User.id)
        .filter(Member.task_id == task_id)
        .all()
    )

    members = []
    for member, user in rows:
        is_online = (
            db.query(Time.id)
            .filter(Time.member_id == member.id, Time.end_time.is_(None))
            .first()
            is not None
        )
        members.append({
            "member_id": member.id,
            "user_id": user.id,
            "name": user.name,
            "email": user.email,
            "sum_time": member.sum_time,
            "is_online": is_online,
        })

    return {"task_id": task_id, "members": members}


def get_task_status(db: Session, task_id: UUID):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="task not found")

    return {
        "task_id": task.id,
        "goal_time": task.goal_time,
        "total_time": task.total_time,
        "leave_time": task.leave_time,
        "online_member_count": task.online_member_count,
    }
