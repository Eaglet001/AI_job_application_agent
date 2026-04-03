from config import call_llm
from schemas import CoverLetter, AgentState

PROMPT = """
You are a world-class cover letter writer. Write a compelling, personalized cover letter for this job application.

Guidelines:
- 3-4 paragraphs, professional but warm tone
- Opening: Hook with genuine enthusiasm for the role/company
- Body paragraph 1: Highlight 2-3 most relevant experiences mapped to the JD
- Body paragraph 2: Demonstrate cultural fit and understanding of the company's needs
- Closing: Clear call to action, express eagerness to interview
- Do NOT use generic filler phrases like "I am writing to apply..."
- Incorporate keywords from the JD naturally
- Keep it under 400 words

CANDIDATE NAME: {name}
TARGET ROLE: {role_title}
COMPANY: {company}

TAILORED CV SUMMARY:
{tailored_summary}

KEY SKILLS:
{skills}

JOB REQUIREMENTS:
{jd_responsibilities}

Write the cover letter now (plain text, no JSON, no markdown):
"""


def cover_letter_agent(state: AgentState) -> AgentState:
    """
    Agent 5: Generates a personalized cover letter based on tailored CV and JD.
    """
    try:
        if not state.tailored_cv or not state.parsed_jd:
            state.error = "Cover Letter Agent: Missing tailored CV or parsed JD."
            return state

        prompt = PROMPT.format(
            name=state.tailored_cv.name,
            role_title=state.parsed_jd.role_title,
            company=state.parsed_jd.company or "the company",
            tailored_summary=state.tailored_cv.tailored_summary,
            skills=", ".join(state.tailored_cv.skills[:8]),
            jd_responsibilities="\n".join(f"- {r}" for r in state.parsed_jd.responsibilities),
        )

        cover_text = call_llm(prompt, temperature=0.6, max_tokens=1000)
        state.cover_letter = CoverLetter(content=cover_text.strip())

    except Exception as e:
        state.error = f"Cover Letter Agent Error: {str(e)}"

    return state