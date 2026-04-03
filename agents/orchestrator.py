from langgraph.graph import StateGraph, END
from schemas import AgentState
from agents.cv_parser import cv_parser_agent
from agents.jd_parser import jd_parser_agent
from agents.gap_analyzer import gap_analyzer_agent
from agents.cv_rewriter import cv_rewriter_agent
from agents.cover_letter import cover_letter_agent


def has_error(state: AgentState) -> str:
    """Router: stop pipeline early if any agent raised an error."""
    if state.error:
        return "error"
    return "continue"


def build_pipeline() -> StateGraph:
    """
    Constructs the LangGraph pipeline connecting all 5 agents.

    Flow:
        cv_parser ──┐
                    ├──► gap_analyzer ──► cv_rewriter ──► cover_letter
        jd_parser ──┘
    """
    # Use dict as state (LangGraph requires TypedDict or dict for graph state)
    graph = StateGraph(dict)

    # ── Register nodes ────────────────────────────────────────────────────────
    graph.add_node("cv_parser", lambda s: cv_parser_agent(AgentState(**s)).model_dump())
    graph.add_node("jd_parser", lambda s: jd_parser_agent(AgentState(**s)).model_dump())
    graph.add_node("gap_analyzer", lambda s: gap_analyzer_agent(AgentState(**s)).model_dump())
    graph.add_node("cv_rewriter", lambda s: cv_rewriter_agent(AgentState(**s)).model_dump())
    graph.add_node("cover_letter", lambda s: cover_letter_agent(AgentState(**s)).model_dump())
    graph.add_node("error_node", lambda s: s)  # passthrough on error

    # ── Entry points ──────────────────────────────────────────────────────────
    graph.set_entry_point("cv_parser")

    # ── Edges ─────────────────────────────────────────────────────────────────
    # cv_parser → check error → jd_parser
    graph.add_conditional_edges(
        "cv_parser",
        lambda s: "error" if s.get("error") else "continue",
        {"error": "error_node", "continue": "jd_parser"},
    )

    # jd_parser → check error → gap_analyzer
    graph.add_conditional_edges(
        "jd_parser",
        lambda s: "error" if s.get("error") else "continue",
        {"error": "error_node", "continue": "gap_analyzer"},
    )

    # gap_analyzer → check error → cv_rewriter
    graph.add_conditional_edges(
        "gap_analyzer",
        lambda s: "error" if s.get("error") else "continue",
        {"error": "error_node", "continue": "cv_rewriter"},
    )

    # cv_rewriter → check error → cover_letter
    graph.add_conditional_edges(
        "cv_rewriter",
        lambda s: "error" if s.get("error") else "continue",
        {"error": "error_node", "continue": "cover_letter"},
    )

    graph.add_edge("cover_letter", END)
    graph.add_edge("error_node", END)

    return graph.compile()


# Singleton compiled pipeline
pipeline = build_pipeline()


def run_pipeline(cv_text: str, jd_text: str) -> AgentState:
    """
    Run the full job application pipeline.

    Args:
        cv_text: Raw text extracted from the candidate's CV
        jd_text: Raw job description text

    Returns:
        Final AgentState with all agent outputs populated
    """
    initial_state = AgentState(
        raw_cv_text=cv_text,
        raw_jd_text=jd_text,
    ).model_dump()

    final_state = pipeline.invoke(initial_state)
    return AgentState(**final_state)
