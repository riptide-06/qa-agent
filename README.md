# Autonomous Web QA Agent

An autonomous QA agent that explores your site and generates a bug report.

## Why?
Developers often ship web apps without thorough manual QA. Manual testing is boring and easy to skip. This tool provides a one-click "smoke test" that behaves like a junior QA engineer trying to break a site.

## How it works
1. **Input**: You provide a URL.
2. **Explore**: An autonomous browser agent (powered by AGI SDK) navigates the site, clicking links and trying forms.
3. **Detect**: The agent looks for 404s, 500s, broken forms, and other obvious issues.
4. **Report**: An LLM summarizes the findings into a human-readable Markdown report.

## Tech Stack
- **Backend**: Python 3.11+, FastAPI, AGI SDK
- **Frontend**: Next.js, Tailwind CSS
- **AI**: GPT-4o (via OpenAI), AGI SDK (Browser Agent)

## How to Run

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
playwright install
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Limitations
- Only run on websites you own or have permission to test.
- This is a smoke test tool, not a full security scanner.

## Potential problems you may face while trying to run project:
- This is not optimized for MacOS, so you may face issues while trying to run on mac.
- Due to the limited development time we, the devs, had to develop this, there may be a few bugs while running, but please be assured the system works.
