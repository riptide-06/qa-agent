import os
from typing import List, Dict, Any
from app.models import Issue
from openai import AsyncOpenAI

async def generate_markdown_report(url: str, steps: List[Dict[str, Any]], issues: List[Issue]) -> str:
    """
    Generates a detailed narrative report using GPT-4o.
    """
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "⚠️ **Error:** OPENAI_API_KEY not found. Please set it in the backend environment."

    client = AsyncOpenAI(api_key=api_key)
    
    # 1. Convert step logs into a readable history for the AI
    # We take the last 15 steps to avoid hitting token limits
    history_text = ""
    if not steps:
        history_text = "No actions logged. The agent might have crashed immediately."
    else:
        for s in steps[-20:]: # Log last 20 steps
            history_text += f"- Step {s.get('step')}: {s.get('action')} (URL: {s.get('url')})\n"

    # 2. Format Issues
    issues_text = "No critical issues detected."
    if issues:
        issues_text = "\n".join([f"- [{i.severity.upper()}] {i.type}: {i.observed} (Expected: {i.expected})" for i in issues])

    # 3. The "Storyteller" Prompt
    prompt = f"""
    You are a Senior QA Lead. An autonomous agent has just finished testing the website: {url}.
    
    Here is the Agent's Activity Log (What it did):
    ---
    {history_text}
    ---
    
    Here are the Issues it flagged:
    ---
    {issues_text}
    ---
    
    **YOUR TASK:**
    Write a professional, human-readable Markdown report.
    
    **STRUCTURE:**
    1. **Executive Summary:** - If 0 issues: Describe the "Happy Path" the agent took (e.g., "The agent successfully logged in, navigated to X, and verified Y").
       - If issues: Summarize the critical failure (e.g., "The agent could not load the page, suggesting an Invalid URL or Server Down").
    
    2. **Test Coverage:** - Bullet points of main areas visited (e.g., Login Page, Inventory, Cart).
       
    3. **Findings & Recommendations:**
       - If 0 errors: "No regressions found. Site latency and navigation appear stable."
       - If errors: List them with a suggested fix.
       
    **TONE:** Professional, concise, encouraging.
    """
    
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7 # Slight creativity for the narrative
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"# Error Generating Report\nOpenAI failed to generate the summary: {str(e)}\n\n**Raw Logs:**\n{history_text}"