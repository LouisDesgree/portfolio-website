"""Smart file categorization based on name, type, and content."""
from .config import CATEGORY_KEYWORDS, SUPPORTED_MIME_TYPES


def classify_file(file_meta: dict, extracted_text: str = "") -> str:
    """Classify a file into a category based on its metadata and content.

    Returns one of: experiences, projects, education, skills, personal, uncategorized
    """
    name = file_meta.get("name", "").lower()
    mime = file_meta.get("mimeType", "")
    searchable = f"{name} {extracted_text}".lower()

    # Score each category
    scores = {}
    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for kw in keywords:
            if kw in searchable:
                # Name matches are worth more than content matches
                if kw in name:
                    score += 3
                else:
                    score += 1
        scores[category] = score

    # Pick highest scoring category (min score 1 to avoid false positives)
    best = max(scores, key=scores.get)
    if scores[best] >= 1:
        return best

    # Fallback: classify by MIME type heuristic
    file_type = SUPPORTED_MIME_TYPES.get(mime, "")
    if file_type in ("gsheet", "csv", "xlsx"):
        return "projects"  # Spreadsheets are likely project trackers
    if file_type == "pdf":
        return "education"  # PDFs are often certificates/diplomas
    if file_type == "image":
        return "personal"  # Photos default to personal

    return "uncategorized"


def classify_batch(files: list[dict], texts: dict[str, str] = None) -> dict[str, list[dict]]:
    """Classify a batch of files. Returns {category: [file_metas]}.

    Args:
        files: List of Drive file metadata dicts
        texts: Optional mapping of file_id -> extracted text for better classification
    """
    texts = texts or {}
    categorized = {
        "experiences": [],
        "projects": [],
        "education": [],
        "skills": [],
        "personal": [],
        "uncategorized": [],
    }

    for f in files:
        text = texts.get(f["id"], "")
        category = classify_file(f, text)
        f["_category"] = category
        categorized[category].append(f)

    # Print summary
    print("[classifier] Categorization results:")
    for cat, items in categorized.items():
        if items:
            print(f"  {cat}: {len(items)} files")

    return categorized
