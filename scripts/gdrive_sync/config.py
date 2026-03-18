"""Configuration for Google Drive sync."""
from pathlib import Path

# Paths (relative to project root)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
SCRIPTS_DIR = PROJECT_ROOT / "scripts"
DRIVE_DATA_DIR = PROJECT_ROOT / "drive_data"
CONTENT_JS_PATH = PROJECT_ROOT / "src" / "data" / "content.js"

CREDENTIALS_PATH = SCRIPTS_DIR / "credentials.json"
TOKEN_PATH = SCRIPTS_DIR / "token.json"

# Google API
SCOPES = ["https://www.googleapis.com/auth/drive.readonly"]
MAX_FILE_SIZE_MB = 50

# Categories and their local folders
CATEGORIES = [
    "experiences",
    "projects",
    "education",
    "skills",
    "personal",
    "uncategorized",
]

# Keyword rules for classification (lowercase)
# Each category maps to a list of keyword groups — matching ANY group triggers the category
CATEGORY_KEYWORDS = {
    "experiences": [
        "resume", "cv", "curriculum", "job", "intern", "internship", "work",
        "contract", "employment", "position", "role",
        # Known companies
        "fendi", "lvmh", "havas", "dlabs", "smode", "paralympic", "paname",
        "y-sarl", "ysarl",
    ],
    "projects": [
        "project", "portfolio", "capstone", "hackathon", "app", "tool",
        "engine", "platform", "dashboard", "prototype", "demo",
        "tiktok", "influencer", "analytics", "taxonomy", "fendidi",
        "general commander", "s&p", "forecasting",
    ],
    "education": [
        "diploma", "degree", "transcript", "certificate", "certification",
        "ucla", "epitech", "hattemer", "grade", "gpa", "distinction",
        "course", "syllabus", "academic", "school", "university",
    ],
    "skills": [
        "skill", "competence", "training", "tutorial", "badge",
        "python", "javascript", "java", "react", "docker",
        "machine learning", "data science", "cybersecurity",
    ],
    "personal": [
        "hobby", "personal", "sailing", "drone", "fpv", "robot", "inmoov",
        "guitar", "woodwork", "3d print", "arduino", "electronic",
        "mining", "crypto", "gaming", "pc build",
    ],
}

# MIME types we can process
SUPPORTED_MIME_TYPES = {
    # Google Workspace (export)
    "application/vnd.google-apps.document": "gdoc",
    "application/vnd.google-apps.spreadsheet": "gsheet",
    "application/vnd.google-apps.presentation": "gslides",
    # Standard files (download)
    "application/pdf": "pdf",
    "text/plain": "text",
    "text/csv": "csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "image/jpeg": "image",
    "image/png": "image",
}

# MIME types to skip entirely
SKIP_MIME_PREFIXES = [
    "video/",
    "audio/",
    "application/vnd.google-apps.folder",
    "application/vnd.google-apps.form",
    "application/vnd.google-apps.map",
    "application/vnd.google-apps.site",
]

# Export formats for Google Workspace files
EXPORT_MIME_MAP = {
    "application/vnd.google-apps.document": "text/plain",
    "application/vnd.google-apps.spreadsheet": "text/csv",
    "application/vnd.google-apps.presentation": "text/plain",
}
