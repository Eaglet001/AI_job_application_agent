from pydantic import BaseModel, Field
from typing import List, Optional


# ── CV Parser Output ──────────────────────────────────────────────────────────

class Experience(BaseModel):
    company: str
    role: str
    duration: str
    responsibilities: List[str]


class Education(BaseModel):
    institution: str
    degree: str
    year: str


class ParsedCV(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    summary: str
    skills: List[str]
    experience: List[Experience]
    education: List[Education]
    certifications: Optional[List[str]] = []


# ── JD Parser Output ──────────────────────────────────────────────────────────

class ParsedJD(BaseModel):
    role_title: str
    company: Optional[str] = None
    required_skills: List[str]
    nice_to_have: Optional[List[str]] = []
    responsibilities: List[str]
    keywords: List[str]
    experience_level: Optional[str] = None   # e.g. "3-5 years"
    education_requirement: Optional[str] = None


# ── Gap Analysis Output ───────────────────────────────────────────────────────

class GapAnalysis(BaseModel):
    match_score: int = Field(..., ge=0, le=100, description="Match % between CV and JD")
    matching_skills: List[str]
    missing_skills: List[str]
    weak_sections: List[str]
    keyword_gaps: List[str]
    recommendations: List[str]


# ── Rewritten CV Output ───────────────────────────────────────────────────────

class TailoredCV(BaseModel):
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    tailored_summary: str
    skills: List[str]
    experience: List[Experience]
    education: List[Education]
    certifications: Optional[List[str]] = []


# ── Cover Letter Output ───────────────────────────────────────────────────────

class CoverLetter(BaseModel):
    content: str


# ── Full Pipeline State (LangGraph) ──────────────────────────────────────────

class AgentState(BaseModel):
    raw_cv_text: str = ""
    raw_jd_text: str = ""
    parsed_cv: Optional[ParsedCV] = None
    parsed_jd: Optional[ParsedJD] = None
    gap_analysis: Optional[GapAnalysis] = None
    tailored_cv: Optional[TailoredCV] = None
    cover_letter: Optional[CoverLetter] = None
    error: Optional[str] = None


# ── API Request / Response ────────────────────────────────────────────────────

class JobApplicationRequest(BaseModel):
    cv_text: Optional[str] = None          # raw text if not uploading file
    jd_text: str                            # job description text or pasted content


class JobApplicationResponse(BaseModel):
    match_score: int
    missing_skills: List[str]
    keyword_gaps: List[str]
    recommendations: List[str]
    tailored_cv: TailoredCV
    cover_letter: str
