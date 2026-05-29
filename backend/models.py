from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Boolean
from .database import Base
import datetime

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    date = Column(Date, index=True)
    time = Column(String, nullable=True)
    repeat = Column(String, nullable=True)
    completed = Column(Boolean, default=False)

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String, index=True)  # notes, ideas, journal
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    plan = Column(Text)
    tech_stack = Column(String)
    usecase = Column(Text)
    purpose = Column(Text)

class Learning(Base):
    __tablename__ = "learnings"
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, index=True)
    resource = Column(String)
    prerequisites = Column(Text)
