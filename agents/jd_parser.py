import json
from config import call_llm
from schemas import ParsedJD, AgentState

PROMPT = """
You are an expert job description analyst. Extract structured requirements from the job description below.

Return ONLY a valid JSON object with this exact structure (no markdown, no preamble):
{{
  "role_title": "Job Title",
  "company": "Company Name",
  "required_skills": ["Python", "FastAPI", "Docker"],
  "nice_to_have": ["Kubernetes", "Terraform"],
  "responsibilities": ["Design APIs", "Lead architecture decisions"],
  "keywords": ["microservices", "REST", "CI/CD", "agile"],
  "experience_level": "3-5 years",
  "education_requirement": "Bachelor's degree in Computer Science or related field"
}}

JOB DESCRIPTION:
{jd_text}

JSON OUTPUT:
"""


def jd_parser_agent(state: AgentState) -> AgentState:
    """
    Agent 2: Parses raw job description into structured ParsedJD object.
    """
    try:
        prompt = PROMPT.format(jd_text=state.raw_jd_text)
        raw_output = call_llm(prompt, temperature=0.1, max_tokens=1024)

        cleaned = raw_output.strip()
        if "```" in cleaned:
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]

        data = json.loads(cleaned)
        state.parsed_jd = ParsedJD(**data)

    except Exception as e:
        state.error = f"JD Parser Error: {str(e)}"

    return state