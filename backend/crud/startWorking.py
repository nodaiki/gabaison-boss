from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime
from uuid import UUID

from models import Task, Time, Member
from schemas.manageTime import StartWorking, StartWorkingResponse

def create_time(db: Session, member: StartWorking):
    
    db_time = Time(
        member_id=member.member_id,
        start_time=datetime.now()
    )
    
    db.add(db_time)
    db.flush()
    
def increment_online_member_count(db: Session, member_id: UUID):
    """
    指定された member_id に紐づくタスクの online_member_count を1増やす
    """
    
    # 1. まず member_id から紐づく task_id を取得する
    member = db.query(Member.task_id).filter(Member.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="メンバーが見つかりません")

    task_id = member.task_id

    # 2. 対象の Task の online_member_count をアトミックに +1 する
    # Task.online_member_count + 1 と書くことで、SQLの UPDATE tasks SET online_member_count = online_member_count + 1 に変換されます
    updated_count = db.query(Task).filter(Task.id == task_id).update(
        {"online_member_count": Task.online_member_count + 1}
    )

    # 万が一タスクが存在しなかった場合（通常はあり得ませんが念のため）
    if updated_count == 0:
        db.rollback()
        raise HTTPException(status_code=404, detail="対象のタスクが見つかりません")

    # 3. データベースに変更を確定（コミット）する
    db.commit()

    return {"message": "online_member_count を1増やしました", "task_id": task_id}

def get_task_by_member_id(db: Session, member_id: UUID):
    result = (
        db.query(
            Task.id,
            Task.goal_time,
            Task.total_time,
            Task.leave_time,
            Task.online_member_count
        )
        .select_from(Member)
        .join(Task, Member.task_id == Task.id)
        .filter(Member.id == member_id)
        .first()
    )

    if not result:
        raise HTTPException(
            status_code=404, 
            detail="指定されたメンバー、または関連するタスクが見つかりませんでした"
        )

    db.commit() # 変更をデータベースに保存

    # StartWorkingResponseスキーマに合わせて id を追加して返却
    return {
        "id": result.id, 
        "goal_time": result.goal_time,
        "total_time": result.total_time,
        "leave_time": result.leave_time,
        "online_member_count": result.online_member_count
    }