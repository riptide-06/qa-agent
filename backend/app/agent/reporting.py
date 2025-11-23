from typing import List
from app.models import Issue
import os
# import openai 

# Mocking OpenAI call for now to avoid key errors if not set
async def generate_markdown_report(url: str, steps_count: int, issues: List[Issue]) -> str:
    """
    Generates a markdown report from the issues found.
    """
    
    # In real app:
    # client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    # response = await client.chat.completions.create(...)
    
    # For MVP/Stub:
    report = f"# QA Report for {url}\n\n"
    report += f"**Total Steps:** {steps_count}\n"
    report += f"**Issues Found:** {len(issues)}\n\n"
    
    if not issues:
        report += "✅ No obvious issues detected.\n"
        return report
        
    report += "## Issues Detected\n\n"
    for issue in issues:
        report += f"### [{issue.severity.upper()}] {issue.type}\n"
        report += f"**URL:** {issue.url}\n\n"
        report += "**Steps to Reproduce:**\n"
        for step in issue.steps:
            report += f"1. {step}\n"
        report += f"\n**Expected:** {issue.expected}\n"
        report += f"**Observed:** {issue.observed}\n"
        report += "---\n"
        
    return report
