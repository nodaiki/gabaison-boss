from sqlalchemy import Column, String, TIMESTAMP, text, Integer, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
import uuid



class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=text("gen_random_uuid()"))
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    created_date_time = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"), nullable=False)


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)

    goal_time = Column(Integer, nullable=False)
    sum_time = Column(Integer, nullable=False, default=0)
    online_member_count = Column(Integer, nullable=False, default=0)

    created_date_time = Column(TIMESTAMP, server_default=func.now())


class Member(Base):
    __tablename__ = "members"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    task_id = Column(UUID(as_uuid=True), ForeignKey("tasks.id"), nullable=False)

    sum_time = Column(Integer, nullable=False)

    created_date_time = Column(DateTime, server_default=func.now())

    