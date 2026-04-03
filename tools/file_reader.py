import fitz  # PyMuPDF
from docx import Document
from pathlib import Path


def read_pdf(file_path: str) -> str:
    """Extract text from a PDF file."""
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    doc.close()
    return text.strip()


def read_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""
    doc = Document(file_path)
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    return "\n".join(paragraphs).strip()


def read_file(file_path: str) -> str:
    """
    Auto-detects file type and extracts text.
    Supports: PDF, DOCX, TXT
    """
    path = Path(file_path)
    suffix = path.suffix.lower()

    if suffix == ".pdf":
        return read_pdf(file_path)
    elif suffix == ".docx":
        return read_docx(file_path)
    elif suffix == ".txt":
        return path.read_text(encoding="utf-8").strip()
    else:
        raise ValueError(f"Unsupported file type: {suffix}. Supported: .pdf, .docx, .txt")
