import asyncio
import os
import time
import json
from typing import List, Set, Dict, Any
from playwright.async_api import async_playwright
from app.models import Issue
from app.agent.detection import detect_issues
from openai import AsyncOpenAI

class QABrowserAgent:
    def __init__(self, start_url: str, max_steps: int = 15):
        self.start_url = start_url
        self.max_steps = max_steps
        self.visited_urls: Set[str] = set()
        self.steps_log: List[Dict[str, Any]] = []
        self.issues: List[Issue] = []
        self.current_step = 0
        self.prev_url = "START"
        self.action_history: List[str] = [] # Short-term memory
        
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        os.makedirs("static/screenshots", exist_ok=True)

    async def run(self):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            # Use a larger viewport to ensure elements are visible
            context = await browser.new_context(viewport={"width": 1280, "height": 800})
            page = await context.new_page()

            try:
                print(f"[INFO] Visiting {self.start_url}")
                try:
                    await page.goto(self.start_url, timeout=60000)
                    await page.wait_for_load_state("domcontentloaded")
                except Exception as e:
                    self._log_critical_failure(f"Failed to load start URL: {e}")
                    return

                await self._process_step(page, f"Opened {self.start_url}")
                
                # --- THE HUMAN AI LOOP ---
                while self.current_step < self.max_steps:
                    self.current_step += 1
                    print(f"[STEP] {self.current_step}/{self.max_steps} - Analyzing page...")
                    
                    # 1. CAPTURE RICH CONTEXT (Inputs, Buttons, Errors)
                    page_context = await self._get_page_context(page)
                    
                    # 2. ASK THE BRAIN (With Memory)
                    action_plan = await self._analyze_page_for_actions(page_context)
                    
                    if not action_plan:
                        print("[BRAIN] No clear actions found. Ending exploration.")
                        break
                        
                    reasoning = action_plan.get('reasoning')
                    print(f"[BRAIN] {reasoning}")
                    
                    # 3. EXECUTE THE PLAN
                    action_type = action_plan.get("action")
                    selector = action_plan.get("selector")
                    value = action_plan.get("value")
                    
                    action_desc = f"{action_type}: {selector}"
                    success = False

                    try:
                        if action_type == "fill":
                            # Clear first to avoid "adminadmin"
                            await page.fill(selector, "")
                            await page.fill(selector, value)
                            print(f"[ACTION] Typed '{value}' into {selector}")
                            success = True
                            
                        elif action_type == "click":
                            await page.click(selector)
                            print(f"[ACTION] Clicked {selector}")
                            success = True
                            # Wait for navigation or UI update
                            try: await page.wait_for_load_state("networkidle", timeout=3000)
                            except: pass
                            
                        elif action_type == "press_enter":
                            # Human fallback: Press Enter if button click is hard
                            await page.press(selector, "Enter")
                            print(f"[ACTION] Pressed Enter on {selector}")
                            success = True
                            try: await page.wait_for_load_state("networkidle", timeout=3000)
                            except: pass

                        elif action_type == "navigate":
                            await page.goto(value)
                            success = True

                        if success:
                            self.action_history.append(f"Step {self.current_step}: {reasoning}")
                            # Keep memory short (last 3 steps)
                            if len(self.action_history) > 3: self.action_history.pop(0)
                            
                            await self._process_step(page, action_desc)
                        
                    except Exception as e:
                        print(f"[WARN] Action failed: {e}")
                        self.action_history.append(f"Step {self.current_step}: FAILED to {action_desc}. Error: {str(e)}")

                    await asyncio.sleep(1) 

            except Exception as e:
                print(f"[ERROR] Critical Agent Failure: {e}")
            finally:
                await browser.close()

    async def _get_page_context(self, page) -> str:
        """
        Scrapes the page for interactive elements AND 'data-test' attributes (SauceDemo specific).
        """
        # Extract visible text to catch errors like "Locked out user"
        visible_text = await page.inner_text("body")
        error_text = "None"
        if "error" in visible_text.lower() or "fail" in visible_text.lower():
             error_text = visible_text[:500] # Grab top of page text where errors usually are

        # Get inputs with better selectors
        inputs = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('input, textarea, select')).map(el => ({
                tag: el.tagName.toLowerCase(),
                type: el.type || '',
                id: el.id ? '#' + el.id : '',
                name: el.name || '',
                placeholder: el.placeholder || '',
                'data-test': el.getAttribute('data-test') ? `[data-test="${el.getAttribute('data-test')}"]` : '',
                value: el.value,
                isVisible: el.getBoundingClientRect().width > 0
            })).filter(el => el.isVisible)
        }""")
        
        # Get buttons/links
        clickables = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('button, a[href], input[type="submit"], div[role="button"]')).map(el => ({
                tag: el.tagName.toLowerCase(),
                text: el.innerText.slice(0, 50).replace(/\\n/g, ' ').trim(),
                id: el.id ? '#' + el.id : '',
                'data-test': el.getAttribute('data-test') ? `[data-test="${el.getAttribute('data-test')}"]` : '',
                href: el.getAttribute('href') || '',
                isVisible: el.getBoundingClientRect().width > 0
            })).filter(el => el.isVisible && (el.text.length > 0 || el['data-test'])).slice(0, 20)
        }""")
        
        return json.dumps({
            "current_url": page.url,
            "visible_error_text": error_text,
            "last_actions": self.action_history,
            "forms": inputs,
            "interactive_elements": clickables
        }, indent=2)

    async def _analyze_page_for_actions(self, page_context: str) -> Dict[str, Any]:
        prompt = f"""
        You are an intelligent QA Human Simulator. You are testing a website.
        
        CURRENT STATE:
        {page_context}
        
        YOUR MEMORY (Previous Actions):
        {self.action_history}
        
        RULES:
        1. **Login Priority:** If you see a login form and haven't logged in, DO IT. 
           - For 'saucedemo.com', use user: "standard_user", pass: "secret_sauce".
           - For others, use "qa_test@example.com" / "password123".
        2. **Do Not Repeat:** If your memory says you just filled the username, DO NOT fill it again. Fill the password.
        3. **Submit:** If you filled both fields, CLICK the login button. If clicking failed previously, use 'press_enter' on the password field.
        4. **Selectors:** Prefer 'data-test' selectors if available (e.g. [data-test="username"]). They are most reliable.
        5. **Shopping:** If logged in (URL changed or see products), click "Add to Cart" or product links.
        
        Return JSON ONLY:
        {{
            "reasoning": "I see username is filled, so I will fill password.",
            "action": "fill" | "click" | "navigate" | "press_enter",
            "selector": "The best CSS selector from the list",
            "value": "Text to type (for fill) or URL (for navigate)"
        }}
        """
        
        try:
            response = await self.client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"},
                temperature=0.2 # Lower temp = more robotic/precise adherence to rules
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"[BRAIN ERROR] {e}")
            return None

    async def _process_step(self, page, action_desc):
        # Standard logging (same as before)
        url = page.url
        filename = f"run_{int(time.time())}_step_{self.current_step}.png"
        filepath = f"static/screenshots/{filename}"
        try: await page.screenshot(path=filepath)
        except: filename = None

        self.steps_log.append({
            "step": self.current_step, "action": action_desc, "url": url, "screenshot": filename
        })
        
        try: text = await page.inner_text("body")
        except: text = ""
        
        new_issues = detect_issues(url, text, self.prev_url, action_desc)
        for issue in new_issues:
            issue.id = len(self.issues) + 1
            issue.screenshot_path = filename
            self.issues.append(issue)
            
        self.prev_url = url

    def _log_critical_failure(self, error_msg):
        self.issues.append(Issue(
            id=1, severity="high", type="Critical Failure",
            url=self.start_url, steps=["Open URL"],
            observed=error_msg, expected="Page should load"
        ))