from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class GoalCreate(BaseModel):
    title: str
    description: Optional[str] = None


@router.post("/goals")
async def create_goal(goal: GoalCreate):
    return {
        "success": True,
        "goal": goal.dict()
    }
