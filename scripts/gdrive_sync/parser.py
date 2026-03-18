"""Extract structured data from downloaded files."""
import csv
import io
from pathlib import Path


def parse_file(file_path: Path, file_type: str) -> dict:
    """Parse a downloaded file and extract structured content.

    Returns:
        {
            "text": str,           # Full extracted text
            "sections": list,      # Detected sections/headers
            "rows": list[dict],    # For spreadsheets: parsed rows
            "key_fields": dict,    # Any detected key-value pairs
        }
    """
    result = {
        "text": "",
        "sections": [],
        "rows": [],
        "key_fields": {},
    }

    try:
        if file_type in ("gdoc", "text"):
            result = _parse_text(file_path)
        elif file_type in ("gsheet", "csv"):
            result = _parse_csv(file_path)
        elif file_type == "pdf":
            result = _parse_pdf(file_path)
        elif file_type in ("xlsx",):
            result = _parse_csv(file_path)  # xlsx exported as csv by scanner
        elif file_type == "image":
            result["text"] = f"[Image: {file_path.name}]"
    except Exception as e:
        print(f"[parser] Error parsing {file_path.name}: {e}")
        result["text"] = ""

    return result


def _parse_text(file_path: Path) -> dict:
    """Parse plain text / exported Google Doc."""
    text = file_path.read_text(encoding="utf-8", errors="replace")

    sections = []
    key_fields = {}
    current_section = None

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue

        # Detect headers (ALL CAPS lines, or lines ending with colon)
        if stripped.isupper() and len(stripped) > 3:
            current_section = stripped
            sections.append({"title": stripped, "content": []})
        elif stripped.endswith(":") and len(stripped) < 60:
            current_section = stripped.rstrip(":")
            sections.append({"title": current_section, "content": []})
        elif sections:
            sections[-1]["content"].append(stripped)

        # Detect key: value pairs
        if ":" in stripped and not stripped.endswith(":"):
            parts = stripped.split(":", 1)
            if len(parts[0]) < 40:
                key_fields[parts[0].strip().lower()] = parts[1].strip()

    return {
        "text": text,
        "sections": sections,
        "rows": [],
        "key_fields": key_fields,
    }


def _parse_csv(file_path: Path) -> dict:
    """Parse CSV / exported Google Sheet."""
    text = file_path.read_text(encoding="utf-8", errors="replace")
    rows = []

    reader = csv.DictReader(io.StringIO(text))
    for row in reader:
        # Clean empty values
        cleaned = {k: v.strip() for k, v in row.items() if k and v and v.strip()}
        if cleaned:
            rows.append(cleaned)

    return {
        "text": text,
        "sections": [],
        "rows": rows,
        "key_fields": {},
    }


def _parse_pdf(file_path: Path) -> dict:
    """Parse PDF file using pdfplumber."""
    try:
        import pdfplumber
    except ImportError:
        print("[parser] pdfplumber not installed — skipping PDF parsing")
        return {"text": "", "sections": [], "rows": [], "key_fields": {}}

    text_parts = []
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages[:20]:  # Cap at 20 pages
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
    except Exception as e:
        print(f"[parser] PDF error for {file_path.name}: {e}")

    full_text = "\n\n".join(text_parts)

    # Reuse text parser for structure detection
    temp = Path(file_path.parent / f"_temp_{file_path.stem}.txt")
    temp.write_text(full_text, encoding="utf-8")
    result = _parse_text(temp)
    temp.unlink(missing_ok=True)

    return result
