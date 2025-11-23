import re
from typing import List, Optional
from app.models import Issue

def detect_issues(url: str, page_text: str, prev_url: str, action_desc: str) -> List[Issue]:
    issues = []
    text_lower = page_text.lower()
    
    # 1. Broken Links / 404
    if "404" in text_lower and "not found" in text_lower:
        issues.append(Issue(
            id=0, # Placeholder, will be assigned by runner
            severity="high",
            type="Broken Link",
            url=url,
            steps=[f"Open {prev_url}", f"Action: {action_desc}"],
            observed="Page showed 404 Not Found",
            expected="Page should load content"
        ))
        
    # 2. Server Errors / 500
    if "500" in text_lower and "internal server error" in text_lower:
        issues.append(Issue(
            id=0,
            severity="high",
            type="Server Error",
            url=url,
            steps=[f"Open {prev_url}", f"Action: {action_desc}"],
            observed="Page showed 500 Internal Server Error",
            expected="Page should load content"
        ))
        
    # 3. Blank Page (Heuristic)
    if len(page_text.strip()) < 50:
        issues.append(Issue(
            id=0,
            severity="medium",
            type="Blank Page",
            url=url,
            steps=[f"Open {prev_url}", f"Action: {action_desc}"],
            observed="Page appears to be empty",
            expected="Page should have content"
        ))
        
    return issues

def detect_form_issues(url: str, before_text: str, after_text: str, action_desc: str) -> List[Issue]:
    issues = []
    # Simple heuristic: if text didn't change much and URL didn't change (handled by caller), might be broken
    # This is very naive for MVP
    if before_text == after_text:
         issues.append(Issue(
            id=0,
            severity="medium",
            type="Form Issue",
            url=url,
            steps=[f"Open {url}", f"Action: {action_desc}"],
            observed="Form submission resulted in no visible change",
            expected="Form should show success message or redirect"
        ))
    return issues
