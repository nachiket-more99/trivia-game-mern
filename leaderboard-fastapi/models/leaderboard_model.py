from pydantic import BaseModel
from typing import Optional

class Leaderboard(BaseModel):
    username: str
    correct_answers: int
    date: str
    time_seconds: Optional[int] = None