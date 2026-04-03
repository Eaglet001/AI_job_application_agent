import json
from config import call_llm
from schemas import TailoredCV, AgentState

PROMPT = """
You are an elite CV writer and career strategist. Rewrite the candidate's CV to be perfectly tailored for the target role.

Rules:
- Keep all facts truthful — do NOT invent experience or skills the candidate doesn't have
- Inject relevant keywords from the job description naturally into existing content
- Rewrite the professional summary to speak directly to the role
- Strengthen experience bullet points to be impact-driven and quantified where possible
- Reorder skills to prioritize those most relevant to the JD
- Only add skills from the "missing_skills" list if there's reasonable evidence in existing experience

Return ONLY a valid JSON object with this exact structure (no markdown, no preamble):
{{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "tailored_summary": "Rewritten summary targeting this specific role...",
  "skills": ["Most Relevant Skill First", "Skill2", "Skill3"],
  "experience": [
    {{
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2020 - Present",
      "responsibilities": [
        "Rewritten, keyword-rich, impact-driven bullet",
        "Another strong bullet"
      ]
    }}
  ],
  "education": [
    {{
      "institution": "University Name",
      "degree": "Degree",
      "year": "2019"
    }}
  ],
  "certifications": ["cert1"]
}}

ORIGINAL CV:
{parsed_cv}

JOB DESCRIPTION:
{parsed_jd}

GAP ANALYSIS:
{gap_analysis}

TAILORED CV JSON OUTPUT:
"""


def cv_rewriter_agent(state: AgentState) -> AgentState:
    """
    Agent 4: Rewrites and tailors the CV based on JD requirements and gap analysis.
    """
    try:
        if not state.parsed_cv or not state.parsed_jd or not state.gap_analysis:
            state.error = "CV Rewriter: Missing required state."
            return state

        prompt = PROMPT.format(
            parsed_cv=state.parsed_cv.model_dump_json(indent=2),
            parsed_jd=state.parsed_jd.model_dump_json(indent=2),
            gap_analysis=state.gap_analysis.model_dump_json(indent=2),
        )
        raw_output = call_llm(prompt, temperature=0.4, max_tokens=3000)

        cleaned = raw_output.strip()
        if "```" in cleaned:
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]

        data = json.loads(cleaned)
        state.tailored_cv = TailoredCV(**data)

    except Exception as e:
        state.error = f"CV Rewriter Error: {str(e)}"

    return state