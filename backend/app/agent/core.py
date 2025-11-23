import asyncio
from typing import List, Set, Dict, Any
from playwright.async_api import async_playwright
from app.models import Issue
from app.agent.detection import detect_issues, detect_form_issues

class Observation:
    def __init__(self, url, text):
        self.url = url
        self.text = text

class QABrowserAgent:
    def __init__(self, start_url: str, max_steps: int = 10):
        self.start_url = start_url
        self.max_steps = max_steps
        self.visited_urls: Set[str] = set()
        self.steps_log: List[Dict[str, Any]] = []
        self.issues: List[Issue] = []
        self.current_step = 0
        self.prev_url = "START"

    async def run(self):
        async with async_playwright() as p:
            # Launch browser in visible mode (headless=False)
            browser = await p.chromium.launch(headless=False)
            context = await browser.new_context()
            page = await context.new_page()

            try:
                # Step 1: Go to start URL
                print(f"Visiting {self.start_url}")
                try:
                    await page.goto(self.start_url, timeout=30000)
                    await page.wait_for_load_state("domcontentloaded")
                except Exception as e:
                    print(f"Failed to load start URL: {e}")
                    return

                # Initial observation
                await self._process_page(page, f"goto('{self.start_url}')")
                
                # Exploration Loop
                while self.current_step < self.max_steps:
                    # Find candidate links
                    # We look for links that are internal (start with / or match domain)
                    links = await page.query_selector_all("a[href]")
                    
                    next_link = None
                    next_href = None
                    
                    for link in links:
                        href = await link.get_attribute("href")
                        if not href:
                            continue
                            
                        # Simple normalization
                        full_url = href
                        if not href.startswith("http"):
                            if href.startswith("/"):
                                base = self.start_url.rstrip("/")
                                # Handle case where start_url might have path
                                from urllib.parse import urlparse
                                parsed = urlparse(self.start_url)
                                base = f"{parsed.scheme}://{parsed.netloc}"
                                full_url = base + href
                            else:
                                full_url = self.start_url.rstrip("/") + "/" + href
                        
                        # Check if it's same domain
                        if self.start_url in full_url or (href.startswith("/") and not href.startswith("//")):
                            if full_url not in self.visited_urls:
                                next_link = link
                                next_href = href
                                break
                    
                    if next_link:
                        print(f"Clicking link: {next_href}")
                        try:
                            # We need to be careful about navigation vs new tab
                            # For now, assume simple navigation
                            await next_link.click()
                            try:
                                await page.wait_for_load_state("domcontentloaded", timeout=10000)
                            except:
                                pass # Timeout is okay, maybe it's a SPA
                                
                            await self._process_page(page, f"click('{next_href}')")
                        except Exception as e:
                            print(f"Failed to click {next_href}: {e}")
                            # Mark as visited so we don't try again
                            self.visited_urls.add(full_url)
                    else:
                        print("No new internal links found, stopping.")
                        break
                        
                    await asyncio.sleep(1) # Slow down slightly so user can see

            except Exception as e:
                print(f"Error during run: {e}")
            finally:
                await browser.close()

    async def _process_page(self, page, action_desc):
        url = page.url
        try:
            text = await page.inner_text("body")
        except:
            text = ""
        
        self.visited_urls.add(url)
        
        # Log step
        self.steps_log.append({
            "step": self.current_step,
            "from_url": self.prev_url,
            "action": action_desc,
            "to_url": url
        })
        
        # Detect issues
        issues = detect_issues(url, text, self.prev_url, action_desc)
        for issue in issues:
            issue.id = len(self.issues) + 1
            self.issues.append(issue)
            
        self.current_step += 1
        self.prev_url = url

    # Keep the old methods for compatibility if needed, or remove them
    def process_step(self, prev_obs, action, new_obs):
        pass

    def select_next_action(self, observation) -> str:
        return "wait()"
