import sys
import asyncio

# 🚨 FORCE WINDOWS TO USE THE CORRECT EVENT LOOP 🚨
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.models import TestRequest, TestResponse, TestResult
from app.agent.runner import run_agent_task
import uuid
import os
from typing import Dict

app = FastAPI(title="QA Agent API")

# CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve Screenshots
os.makedirs("static/screenshots", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

RUNS: Dict[str, TestResult] = {}

@app.post("/run-test", response_model=TestResponse)
async def run_test(request: TestRequest, background_tasks: BackgroundTasks):
    run_id = str(uuid.uuid4())
    RUNS[run_id] = TestResult(runId=run_id, status="queued")
    background_tasks.add_task(run_agent_task, run_id, request.url, request.siteType, RUNS)
    return TestResponse(runId=run_id, status="queued")

@app.get("/result/{run_id}", response_model=TestResult)
async def get_result(run_id: str):
    if run_id not in RUNS:
        raise HTTPException(status_code=404, detail="Run not found")
    return RUNS[run_id]