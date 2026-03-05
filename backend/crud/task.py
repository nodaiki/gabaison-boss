from sqlalchemy.orm import Session
from fastapi import HTTPException

from models import Task, User, Member
from schemas.task import TaskCreate


def create_task(db: Session, task: TaskCreate):

    db_task = Task(
        name=task.name,
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