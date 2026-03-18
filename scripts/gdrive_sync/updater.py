"""Merge extracted data into content.js."""
import json
import re
import shutil
from datetime import datetime
from pathlib import Path

from .config import CONTENT_JS_PATH


def create_backup() -> Path:
    """Create a timestamped backup of content.js."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = CONTENT_JS_PATH.with_suffix(f".bak.{timestamp}.js")
    shutil.copy2(CONTENT_JS_PATH, backup_path)
    print(f"[updater] Backup created: {backup_path.name}")
    return backup_path


def read_content_js() -> str:
    """Read the current content.js file."""
    return CONTENT_JS_PATH.read_text(encoding="utf-8")


def extract_experiences(content: str) -> list[dict]:
    """Extract the experiences array from content.js as Python dicts."""
    return _extract_array(content, "experiences")


def extract_projects(content: str) -> list[dict]:
    """Extract the projects array from content.js as Python dicts."""
    return _extract_array(content, "projects")


def generate_suggestions(categorized_data: dict[str, list[dict]]) -> dict:
    """Generate update suggestions from parsed Drive files.

    Returns a dict with suggested additions/updates per category.
    This does NOT auto-write — it produces a report for review.
    """
    suggestions = {
        "new_experiences": [],
        "new_projects": [],
        "new_skills": [],
        "updated_fields": [],
        "raw_extracts": {},
    }

    # Process experience files
    for item in categorized_data.get("experiences", []):
        parsed = item.get("_parsed", {})
        if not parsed:
            continue

        text = parsed.get("text", "")
        key_fields = parsed.get("key_fields", {})

        suggestion = {
            "source_file": item.get("name", "unknown"),
            "extracted_fields": key_fields,
            "text_preview": text[:500] if text else "",
        }

        # Try to detect company, role, dates from key fields
        for key in key_fields:
            if any(w in key for w in ("company", "employer", "organization")):
                suggestion["company"] = key_fields[key]
            if any(w in key for w in ("role", "title", "position")):
                suggestion["role"] = key_fields[key]
            if any(w in key for w in ("date", "period", "year", "duration")):
                suggestion["date"] = key_fields[key]

        suggestions["new_experiences"].append(suggestion)

    # Process project files
    for item in categorized_data.get("projects", []):
        parsed = item.get("_parsed", {})
        if not parsed:
            continue

        text = parsed.get("text", "")
        rows = parsed.get("rows", [])

        suggestion = {
            "source_file": item.get("name", "unknown"),
            "text_preview": text[:500] if text else "",
            "spreadsheet_rows": len(rows),
        }

        if rows:
            suggestion["column_headers"] = list(rows[0].keys()) if rows else []
            suggestion["sample_rows"] = rows[:3]

        suggestions["new_projects"].append(suggestion)

    # Process education files
    for item in categorized_data.get("education", []):
        parsed = item.get("_parsed", {})
        if not parsed:
            continue
        suggestions["raw_extracts"][item.get("name", "unknown")] = {
            "category": "education",
            "text_preview": parsed.get("text", "")[:500],
            "key_fields": parsed.get("key_fields", {}),
        }

    # Process skills files
    for item in categorized_data.get("skills", []):
        parsed = item.get("_parsed", {})
        if not parsed:
            continue
        rows = parsed.get("rows", [])
        if rows:
            suggestions["new_skills"].append({
                "source_file": item.get("name", "unknown"),
                "rows": rows[:10],
            })

    return suggestions


def print_suggestions(suggestions: dict):
    """Pretty-print the suggestions report."""
    print()
    print("=" * 60)
    print("  SYNC REPORT — Suggested Updates for content.js")
    print("=" * 60)

    if suggestions["new_experiences"]:
        print(f"\n--- EXPERIENCES ({len(suggestions['new_experiences'])} files) ---")
        for s in suggestions["new_experiences"]:
            print(f"\n  Source: {s['source_file']}")
            if s.get("company"):
                print(f"  Company: {s['company']}")
            if s.get("role"):
                print(f"  Role: {s['role']}")
            if s.get("date"):
                print(f"  Date: {s['date']}")
            if s.get("extracted_fields"):
                for k, v in list(s["extracted_fields"].items())[:5]:
                    print(f"  {k}: {v}")
            if s.get("text_preview"):
                preview = s["text_preview"][:200].replace("\n", " ")
                print(f"  Preview: {preview}...")

    if suggestions["new_projects"]:
        print(f"\n--- PROJECTS ({len(suggestions['new_projects'])} files) ---")
        for s in suggestions["new_projects"]:
            print(f"\n  Source: {s['source_file']}")
            if s.get("column_headers"):
                print(f"  Columns: {', '.join(s['column_headers'])}")
            if s.get("spreadsheet_rows"):
                print(f"  Rows: {s['spreadsheet_rows']}")
            if s.get("sample_rows"):
                for row in s["sample_rows"][:2]:
                    print(f"  Sample: {dict(list(row.items())[:4])}")

    if suggestions["new_skills"]:
        print(f"\n--- SKILLS ({len(suggestions['new_skills'])} files) ---")
        for s in suggestions["new_skills"]:
            print(f"\n  Source: {s['source_file']}")
            for row in s["rows"][:3]:
                print(f"  Row: {dict(list(row.items())[:4])}")

    if suggestions["raw_extracts"]:
        print(f"\n--- OTHER FILES ({len(suggestions['raw_extracts'])}) ---")
        for name, data in suggestions["raw_extracts"].items():
            print(f"\n  {name} [{data['category']}]")
            if data["key_fields"]:
                for k, v in list(data["key_fields"].items())[:3]:
                    print(f"    {k}: {v}")

    if not any([
        suggestions["new_experiences"],
        suggestions["new_projects"],
        suggestions["new_skills"],
        suggestions["raw_extracts"],
    ]):
        print("\n  No actionable suggestions found.")

    print()
    print("=" * 60)
    print("  Run with --apply to write changes (after review)")
    print("=" * 60)


def write_suggestions_json(suggestions: dict, output_path: Path):
    """Write suggestions to a JSON file for later processing."""
    output_path.write_text(
        json.dumps(suggestions, indent=2, default=str, ensure_ascii=False),
        encoding="utf-8",
    )
    print(f"[updater] Suggestions saved to {output_path}")


def _extract_array(content: str, var_name: str) -> list[dict]:
    """Extract a JS array export as Python list (best-effort regex parsing)."""
    # Find the array block: export const varName = [ ... ];
    pattern = rf"export\s+const\s+{var_name}\s*=\s*\["
    match = re.search(pattern, content)
    if not match:
        return []

    # Find matching closing bracket
    start = match.end() - 1  # include the [
    depth = 0
    end = start
    for i in range(start, len(content)):
        if content[i] == "[":
            depth += 1
        elif content[i] == "]":
            depth -= 1
            if depth == 0:
                end = i + 1
                break

    array_str = content[start:end]

    # Very rough JS→JSON conversion (works for simple data)
    # This is intentionally conservative — won't handle complex cases
    try:
        # Replace single quotes with double, remove trailing commas
        json_str = array_str
        json_str = re.sub(r"'", '"', json_str)
        json_str = re.sub(r",\s*([}\]])", r"\1", json_str)
        # Remove JS comments
        json_str = re.sub(r"//.*$", "", json_str, flags=re.MULTILINE)
        # Handle unquoted keys
        json_str = re.sub(r"(\w+)\s*:", r'"\1":', json_str)
        return json.loads(json_str)
    except (json.JSONDecodeError, Exception):
        # Parsing failed — that's OK, the file is complex JS
        return []
