from sqlalchemy.orm import Session
from fastapi import HTTPException
from datetime import datetime # importを修正
from uuid import UUID

from models import Task, Time, Member
from schemas.manageTime import StartWorking, StartWorkingResponse

def create_time(db: Session, member: StartWorking):
    
    db_time = Time(
        member_id=member.member_id,
        start_time=datetime.now() # now()の呼び出しを修正
    )
    
    db.add(db_time)
    db.flush() # ここで db_time.id が発番される前提
    
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