# 🤖 Job Application AI Agent

An AI-powered job application assistant built with **LangGraph**, **Llama 3.1 70B** (via HuggingFace Inference), and **FastAPI**.

It parses your CV, analyzes job descriptions, identifies skill gaps, rewrites your CV to match the role, and generates a personalized cover letter — all automatically.

---

## Architecture

```
CV (PDF/DOCX/Text)  +  Job Description
         │
         ▼
 ┌───────────────┐    ┌───────────────┐
 │  CV Parser    │    │  JD Parser    │
 │   Agent  1    │    │   Agent  2    │
 └──────┬────────┘    └──────┬────────┘
        │                    │
        └──────────┬─────────┘
                   ▼
         ┌──────────────────┐
         │  Gap Analyzer    │
         │    Agent  3      │
         └────────┬─────────┘
                  ▼
         ┌──────────────────┐
         │  CV Rewriter     │
         │    Agent  4      │
         └────────┬─────────┘
                  ▼
         ┌──────────────────┐
         │  Cover Letter    │
         │    Agent  5      │
         └────────┬─────────┘
                  ▼
        Tailored CV + Cover Letter
```

---

## Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo>
cd job-agent
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your HuggingFace token:

```env
HF_TOKEN= ""
```

> Get your free HuggingFace token at: https://huggingface.co/settings/tokens  
> Request access to Llama 3.1 at: https://huggingface.co/meta-llama/Meta-Llama-3.1-70B-Instruct  
> When creating your token, select **Read** access only.

### 3. Run the server

```bash
python main.py
# or
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Visit the interactive docs at: **http://localhost:8000/docs**

---

## 🚀 Deploy to Render

### Quick Deploy (1-Click Setup)

1. **Create a GitHub repo** with your code and push everything
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Go to [Render.com](https://render.com)** and sign up (free tier available)

3. **Create a new Web Service:**
   - Click **New +** → **Web Service**
   - Connect your GitHub repo
   - Name: `job-application-ai` (or your choice)
   - Runtime: `Docker`
   - Leave other settings as default

4. **Add Environment Variable:**
   - In the Render dashboard, go to **Environment**
   - Add variable:
     - **Key:** `HF_TOKEN`
     - **Value:** Your HuggingFace token (from https://huggingface.co/settings/tokens)
   - Click **Save**

5. **Deploy:**
   - Click **Create Web Service**
   - Render will automatically build and deploy your app
   - Your app will be live at: `https://your-app-name.onrender.com`

### Share with Others

Once deployed:
- **API Docs:** `https://your-app-name.onrender.com/docs` (interactive Swagger UI)
- **Health Check:** `https://your-app-name.onrender.com/health`
- **API Endpoint:** `https://your-app-name.onrender.com/apply`

### Cost & Performance
- **Free tier:** ~$0/month (limited, may sleep when inactive)
- **Pro tier:** ~$7+/month (always on, better performance)
- Render auto-scales to handle traffic

---

## API Endpoints

### `POST /apply`
Full pipeline with plain text CV input.

```json
{
  "cv_text": "John Doe\nSoftware Engineer...",
  "jd_text": "We are looking for a Senior Python Engineer..."
}
```

**Response:**
```json
{
  "match_score": 78,
  "missing_skills": ["Kubernetes", "Terraform"],
  "keyword_gaps": ["microservices", "CI/CD"],
  "recommendations": ["Quantify your impact in experience bullets", "..."],
  "tailored_cv": { ... },
  "cover_letter": "Dear Hiring Manager, ..."
}
```

---

### `POST /apply/upload`
Full pipeline with CV file upload (PDF or DOCX).

```bash
curl -X POST http://localhost:8000/apply/upload \
  -F "cv_file=@my_cv.pdf" \
  -F "jd_text=We are looking for a Senior Python Engineer..."
```

---

### `POST /apply/download/cv`
Returns tailored CV as a downloadable **DOCX** file.

---

### `POST /apply/download/cover-letter`
Returns cover letter as a downloadable **DOCX** file.

---

## Project Structure

```
job-agent/
├── main.py                  # FastAPI entrypoint + all routes
├── config.py                # HuggingFace LLM setup
├── requirements.txt
├── .env.example
├── agents/
│   ├── cv_parser.py         # Agent 1: Parse CV → structured JSON
│   ├── jd_parser.py         # Agent 2: Parse JD → structured JSON
│   ├── gap_analyzer.py      # Agent 3: CV vs JD → gap analysis
│   ├── cv_rewriter.py       # Agent 4: Rewrite CV for target role
│   ├── cover_letter.py      # Agent 5: Generate cover letter
│   └── orchestrator.py      # LangGraph pipeline
├── tools/
│   ├── file_reader.py       # PDF/DOCX text extractor
│   └── doc_generator.py     # Output tailored DOCX files
└── models/
    └── schemas.py           # Pydantic schemas for all agents
```

---

## Extending the Agent

| Feature | How to add |
|---|---|
| Web scraping job URLs | Add `tools/job_scraper.py` using `requests` + `BeautifulSoup` |
| LinkedIn auto-apply | Integrate Selenium or Playwright in a new agent |
| Memory / history | Add ChromaDB to store past CVs and applications |
| Multi-user support | Add user sessions with JWT auth middleware |
| Frontend UI | Build a Next.js frontend consuming these API endpoints |

---

## Model Notes

- **Llama 3.1 70B Instruct** is recommended for best quality output
- For faster/cheaper inference use **Llama 3.1 8B** — change `HF_MODEL_ID` in `config.py`
- HuggingFace free tier has rate limits; for production use **Together AI** or **Groq**