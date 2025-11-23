from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from app.models import TestRequest, TestResponse, TestResult, Issue
from app.agent.runner import run_agent_task
import uuid
from typing import Dict

app = FastAPI(title="Autonomous Web QA Agent")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For hackathon, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for hackathon
RUNS: Dict[str, TestResult] = {}

@app.post("/run-test", response_model=TestResponse)
async def run_test(request: TestRequest, background_tasks: BackgroundTasks):
    run_id = str(uuid.uuid4())
    
    # Initialize result
    RUNS[run_id] = TestResult(
        runId=run_id,
        status="running"
    )
    
    # Start agent in background
    background_tasks.add_task(run_agent_task, run_id, request.url, request.siteType, RUNS)
    
    return TestResponse(runId=run_id, status="started")

@app.get("/result/{run_id}", response_model=TestResult)
async def get_result(run_id: str):
    if run_id not in RUNS:
        raise HTTPException(status_code=404, detail="Run not found")
    return RUNS[run_id]

@app.get("/")
async def root():
    return {"message": "QA Agent API is running"}
