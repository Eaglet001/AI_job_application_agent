import os
import uuid
import shutil
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from schemas import JobApplicationRequest, JobApplicationResponse
from agents.orchestrator import run_pipeline
from tools.file_reader import read_file
from tools.doc_generator import generate_tailored_cv_docx, generate_cover_letter_docx

app = FastAPI(
    title="Job Application AI Agent",
    description="AI-powered job application assistant using Llama 3.1 70B via HuggingFace Inference",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


# ── Health Check ──────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok", "model": "meta-llama/Meta-Llama-3.1-70B-Instruct"}


# ── Main Pipeline Endpoint (text input) ───────────────────────────────────────

@app.post("/apply", response_model=JobApplicationResponse)
def apply_for_job(request: JobApplicationRequest):
    """
    Full pipeline: CV text + JD text → tailored CV + cover letter + gap analysis.
    """
    if not request.cv_text:
        raise HTTPException(status_code=400, detail="cv_text is required. Use /apply/upload for file uploads.")

    state = run_pipeline(cv_text=request.cv_text, jd_text=request.jd_text)

    if state.error:
        raise HTTPException(status_code=500, detail=state.error)

    return JobApplicationResponse(
        match_score=state.gap_analysis.match_score,
        missing_skills=state.gap_analysis.missing_skills,
        keyword_gaps=state.gap_analysis.keyword_gaps,
        recommendations=state.gap_analysis.recommendations,
        tailored_cv=state.tailored_cv,
        cover_letter=state.cover_letter.content,
    )


# ── File Upload Endpoint ──────────────────────────────────────────────────────

@app.post("/apply/upload", response_model=JobApplicationResponse)
async def apply_with_file(
    cv_file: UploadFile = File(..., description="CV file (PDF or DOCX)"),
    jd_text: str = Form(..., description="Job description text"),
):
    """
    Full pipeline: CV file (PDF/DOCX) + JD text → tailored CV + cover letter.
    """
    # Save uploaded file
    ext = os.path.splitext(cv_file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".txt"]:
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT.")

    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{ext}")

    with open(file_path, "wb") as f:
        shutil.copyfileobj(cv_file.file, f)

    # Extract text
    try:
        cv_text = read_file(file_path)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Could not read file: {str(e)}")

    # Run pipeline
    state = run_pipeline(cv_text=cv_text, jd_text=jd_text)

    if state.error:
        raise HTTPException(status_code=500, detail=state.error)

    return JobApplicationResponse(
        match_score=state.gap_analysis.match_score,
        missing_skills=state.gap_analysis.missing_skills,
        keyword_gaps=state.gap_analysis.keyword_gaps,
        recommendations=state.gap_analysis.recommendations,
        tailored_cv=state.tailored_cv,
        cover_letter=state.cover_letter.content,
    )


# ── Download Tailored CV as DOCX ─────────────────────────────────────────────

@app.post("/apply/download/cv")
def download_tailored_cv(request: JobApplicationRequest):
    """
    Runs pipeline and returns the tailored CV as a downloadable DOCX file.
    """
    if not request.cv_text:
        raise HTTPException(status_code=400, detail="cv_text is required.")

    state = run_pipeline(cv_text=request.cv_text, jd_text=request.jd_text)

    if state.error:
        raise HTTPException(status_code=500, detail=state.error)

    file_id = str(uuid.uuid4())
    output_path = os.path.join(OUTPUT_DIR, f"tailored_cv_{file_id}.docx")
    generate_tailored_cv_docx(state.tailored_cv, output_path)

    return FileResponse(
        path=output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="tailored_cv.docx",
    )


# ── Download Cover Letter as DOCX ─────────────────────────────────────────────

@app.post("/apply/download/cover-letter")
def download_cover_letter(request: JobApplicationRequest):
    """
    Runs pipeline and returns the cover letter as a downloadable DOCX file.
    """
    if not request.cv_text:
        raise HTTPException(status_code=400, detail="cv_text is required.")

    state = run_pipeline(cv_text=request.cv_text, jd_text=request.jd_text)

    if state.error:
        raise HTTPException(status_code=500, detail=state.error)

    file_id = str(uuid.uuid4())
    output_path = os.path.join(OUTPUT_DIR, f"cover_letter_{file_id}.docx")
    generate_cover_letter_docx(state.tailored_cv.name, state.cover_letter, output_path)

    return FileResponse(
        path=output_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename="cover_letter.docx",
    )


# Mount static files for the frontend (after all API routes)
app.mount("/", StaticFiles(directory="frontend/out", html=True), name="frontend")


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
