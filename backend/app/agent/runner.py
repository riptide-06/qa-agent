from typing import Dict
from app.models import TestResult
from app.agent.core import QABrowserAgent
from app.agent.reporting import generate_markdown_report

async def run_agent_task(run_id: str, url: str, site_type: str, runs: Dict[str, TestResult]):
    print(f"[START] Starting agent run {run_id} for {url}")
    
    try:
        runs[run_id].status = "running"
        
        # 1. Initialize & Run Agent
        agent = QABrowserAgent(start_url=url, max_steps=15) # Increased steps slightly for better coverage
        await agent.run()
        
        # 2. Generate Intelligence Report
        print("[INFO] Analyzing results with GPT-4o...")
        
        # --- CHANGE IS HERE: Passing 'agent.steps_log' instead of len() ---
        report = await generate_markdown_report(url, agent.steps_log, agent.issues)
        
        # 3. Save Results
        runs[run_id].status = "completed"
        runs[run_id].reportMarkdown = report
        runs[run_id].issues = agent.issues
        runs[run_id].summary = {
            "issues": len(agent.issues),
            "high": len([i for i in agent.issues if i.severity == "high"]),
            "medium": len([i for i in agent.issues if i.severity == "medium"]),
            "low": len([i for i in agent.issues if i.severity == "low"]),
        }
        
        print(f"[SUCCESS] Run {run_id} finished successfully.")
        
    except Exception as e:
        print(f"[ERROR] Run {run_id} CRASHED: {e}")
        runs[run_id].status = "error"
        runs[run_id].reportMarkdown = f"# Critical System Error\n{str(e)}"