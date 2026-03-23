from fastapi import FastAPI
from routes.leaderboard_routes import leaderboard_app_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "message": "FastAPI backend is running"
    }
    
app.include_router(leaderboard_app_router)