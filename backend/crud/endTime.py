from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

import models


def end_time(db: Session, time_id):

    time_record = db.query(models.Time).filter(models.Time.id == time_id).first()

    if not time_record:
        return None

    now = datetime.utcnow()


    # timesテーブルを更新
    time_record.end_time = now

    diff = now - time_record.start_time
    sum_time = int(diff.total_seconds())

    time_record.sum_time = sum_time

    member_id = time_record.member_id

    # membersを計算して更新

    member_sum = db.query(
        func.coalesce(func.sum(models.Time.sum_time), 0)
    ).filter(
        models.Time.member_id == member_id
    ).scalar()

    member = db.query(models.Member).filter(models.Member.id == member_id).first()

    member.sum_time = member_sum

    # tasks を計算して更新

    task_id = member.task_id

    task_sum = db.query(
        func.coalesce(func.sum(models.Member.sum_time), 0)
    ).filter(
        models.Member.task_id == task_id
    ).scalar()

    task = db.query(models.Task).filter(models.Task.id == task_id).first()

    task.total_time = task_sum
    task.online_member_count -= 1

    leave_time = task.goal_time - task.total_time

    db.commit()

    return {
        "message": "time updated",
        "member_sum_time": member_sum,
        "task_total_time": task.total_time,
        "leave_time": leave_time,
        "online_member_count": task.online_member_count
    }