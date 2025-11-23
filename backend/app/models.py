from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class TestRequest(BaseModel):
    url: str
    siteType: Optional[str] = "marketing"

class Issue(BaseModel):
    id: int
    severity: str  # "high", "medium", "low"
    type: str      # e.g., "Broken Link"
    url: str
    steps: List[str]
    expected: str
    observed: str
    screenshot_path: Optional[str] = None

class TestResult(BaseModel):
    runId: str
    status: str  # "queued", "running", "completed", "error"
    reportMarkdown: Optional[str] = None
    summary: Optional[Dict[str, int]] = None # {high: 2, medium: 1...}
    issues: Optional[List[Issue]] = None

class TestResponse(BaseModel):
    runId: str
    status: str