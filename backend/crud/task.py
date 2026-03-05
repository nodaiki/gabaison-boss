from sqlalchemy.orm import Session
from fastapi import HTTPException

from models.task import Task
from models.user import User
from models.planet import Planet
from models.member import Member

from schemas.task import TaskCreate


def create_task(db: Session, task: schemas.TaskCreate):

    # planet取得
    planet = (
        db.query(models.Planet)
        .filter(models.Planet.id == task.planet_id)
        .first()
    )

    if not planet:
        raise HTTPException(status_code=404, detail="planet not found")

    # task作成
    db_task = models.Task(
        name=task.name,
        planet_id=task.planet_id,
        goal_time=planet.planet_time,
        sum_time=0,
        online_member_count=0
    )

    db.add(db_task)
    db.flush()

    # emailからuser取得
    users = (
        db.query(models.User)
        .filter(models.User.email.in_(task.member_emails))
        .all()
    )
    if len(users) != len(task.member_emails):
        raise HTTPException(400, "Some users not found")

    # member作成
    members = []

    for user in users:
        members.append(
            models.Member(
                user_id=user.id,
                task_id=db_task.id,
                sum_time=0
            )
        )

    db.add_all(members)

    db.commit()
    db.refresh(db_task)

    return db_task