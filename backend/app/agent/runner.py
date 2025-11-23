from typing import Dict
import asyncio
from app.models import TestResult, Issue
from app.agent.core import QABrowserAgent
from app.agent.reporting import generate_markdown_report

async def run_agent_task(run_id: str, url: str, site_type: str, runs: Dict[str, TestResult]):
    print(f"Starting agent run {run_id} for {url}")
    
    try:
        # Initialize Agent
        agent = QABrowserAgent(start_url=url)
        
        # Run Agent (Real Browser)
        await agent.run()
        
        # Generate Report
        report = await generate_markdown_report(url, len(agent.steps_log), agent.issues)
        
        # Update Result
        runs[run_id].status = "completed"
        runs[run_id].reportMarkdown = report
        runs[run_id].summary = {
            "issues": len(agent.issues),
            "high": len([i for i in agent.issues if i.severity == 'high']),
            "medium": len([i for i in agent.issues if i.severity == 'medium']),
            "low": len([i for i in agent.issues if i.severity == 'low'])
        }
        runs[run_id].issues = agent.issues
        
        print(f"Agent run {run_id} completed")
        
    except Exception as e:
        print(f"Agent run {run_id} failed: {e}")
        runs[run_id].status = "error"
