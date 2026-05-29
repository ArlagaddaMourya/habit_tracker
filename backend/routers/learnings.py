from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models
from ..database import SessionLocal
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/learnings", tags=["learnings"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class LearningBase(BaseModel):
    topic: str
    resource: str
    prerequisites: str

class LearningCreate(LearningBase):
    pass

class Learning(LearningBase):
    id: int
    class Config:
        orm_mode = True

@router.post("/", response_model=Learning)
def create_learning(learning: LearningCreate, db: Session = Depends(get_db)):
    db_learning = models.Learning(**learning.dict())
    db.add(db_learning)
    db.commit()
    db.refresh(db_learning)
    return db_learning

@router.get("/", response_model=List[Learning])
def read_learnings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Learning).offset(skip).limit(limit).all()

@router.get("/{learning_id}", response_model=Learning)
def read_learning(learning_id: int, db: Session = Depends(get_db)):
    learning = db.query(models.Learning).filter(models.Learning.id == learning_id).first()
    if not learning:
        raise HTTPException(status_code=404, detail="Learning not found")
    return learning

@router.put("/{learning_id}", response_model=Learning)
def update_learning(learning_id: int, learning: LearningCreate, db: Session = Depends(get_db)):
    db_learning = db.query(models.Learning).filter(models.Learning.id == learning_id).first()
    if not db_learning:
        raise HTTPException(status_code=404, detail="Learning not found")
    for key, value in learning.dict().items():
        setattr(db_learning, key, value)
    db.commit()
    db.refresh(db_learning)
    return db_learning

@router.delete("/{learning_id}")
def delete_learning(learning_id: int, db: Session = Depends(get_db)):
    db_learning = db.query(models.Learning).filter(models.Learning.id == learning_id).first()
    if not db_learning:
        raise HTTPException(status_code=404, detail="Learning not found")
    db.delete(db_learning)
    db.commit()
    return {"ok": True}
