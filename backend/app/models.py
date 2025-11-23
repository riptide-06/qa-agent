from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TestRequest(BaseModel):
    url: str
    siteType: Optional[str] = "marketing"

class Issue(BaseModel):
    id: int
    severity: str  # "low", "medium", "high"
    type: str
    url: str
    steps: List[str]
    observed: str
    expected: str
    screenshot_path: Optional[str] = None

class TestResult(BaseModel):
    runId: str
    status: str  # "running", "completed", "error"
    reportMarkdown: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None
    issues: Optional[List[Issue]] = None

class TestResponse(BaseModel):
    runId: str
    status: str
