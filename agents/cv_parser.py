import json
from config import call_llm
from schemas import ParsedCV, AgentState

PROMPT = """
You are an expert CV/Resume parser. Extract structured information from the CV text below.

Return ONLY a valid JSON object with this exact structure (no markdown, no preamble):
{{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "summary": "Professional summary paragraph",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {{
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2020 - Present",
      "responsibilities": ["Did X", "Led Y", "Built Z"]
    }}
  ],
  "education": [
    {{
      "institution": "University Name",
      "degree": "BSc Computer Science",
      "year": "2019"
    }}
  ],
  "certifications": ["AWS Certified", "PMP"]
}}

CV TEXT:
{cv_text}

JSON OUTPUT:
"""


def cv_parser_agent(state: AgentState) -> AgentState:
    """
    Agent 1: Parses raw CV text into structured ParsedCV object.
    """
    try:
        prompt = PROMPT.format(cv_text=state.raw_cv_text)
        raw_output = call_llm(prompt, temperature=0.1, max_tokens=2048)

        cleaned = raw_output.strip()
        if "```" in cleaned:
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]

        data = json.loads(cleaned)
        state.parsed_cv = ParsedCV(**data)

    except Exception as e:
        state.error = f"CV Parser Error: {str(e)}"

    return state