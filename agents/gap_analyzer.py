import json
from config import call_llm
from schemas import GapAnalysis, AgentState

PROMPT = """
You are a career coach and hiring expert. Compare the candidate's CV against the job description and identify gaps.

Return ONLY a valid JSON object with this exact structure (no markdown, no preamble):
{{
  "match_score": 72,
  "matching_skills": ["Python", "REST APIs"],
  "missing_skills": ["Kubernetes", "Terraform"],
  "weak_sections": ["Professional Summary lacks role-specific keywords", "Experience bullets not quantified"],
  "keyword_gaps": ["microservices", "CI/CD", "agile"],
  "recommendations": [
    "Add Kubernetes to skills if you have any exposure",
    "Quantify your impact: 'Reduced latency by 40%' not just 'Improved performance'",
    "Mention agile/scrum methodology in experience bullets"
  ]
}}

PARSED CV:
{parsed_cv}

PARSED JOB DESCRIPTION:
{parsed_jd}

JSON OUTPUT:
"""


def gap_analyzer_agent(state: AgentState) -> AgentState:
    """
    Agent 3: Compares CV vs JD and returns gap analysis with recommendations.
    """
    try:
        if not state.parsed_cv or not state.parsed_jd:
            state.error = "Gap Analyzer: Missing parsed CV or JD."
            return state

        prompt = PROMPT.format(
            parsed_cv=state.parsed_cv.model_dump_json(indent=2),
            parsed_jd=state.parsed_jd.model_dump_json(indent=2),
        )
        raw_output = call_llm(prompt, temperature=0.2, max_tokens=1024)

        cleaned = raw_output.strip()
        if "```" in cleaned:
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]

        data = json.loads(cleaned)
        state.gap_analysis = GapAnalysis(**data)

    except Exception as e:
        state.error = f"Gap Analyzer Error: {str(e)}"

    return state