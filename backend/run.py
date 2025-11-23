import sys
import asyncio
import uvicorn
from dotenv import load_dotenv

load_dotenv()

# 1. FORCE WINDOWS TO USE THE CORRECT EVENT LOOP (PROACTOR)
if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# 2. LAUNCH THE SERVER
if __name__ == "__main__":
    # REPLACED EMOJI WITH PLAIN TEXT TO PREVENT CRASH
    print("[START] Launching SiteSentry Backend with Proactor Loop...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False)