import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    planet_id = Column(UUID(as_uuid=True), ForeignKey("planets.id"), nullable=False)

    goal_time = Column(Integer, nullable=False)
    sum_time = Column(Integer, nullable=False, default=0)
    online_member_count = Column(Integer, nullable=False, default=0)

    created_date_time = Column(TIMESTAMP, server_default=func.now())