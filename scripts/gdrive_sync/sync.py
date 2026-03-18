#!/usr/bin/env python3
"""Google Drive → Portfolio sync script.

Usage:
    python -m scripts.gdrive_sync.sync [options]

    Or from project root:
    python scripts/gdrive_sync/sync.py [options]

Options:
    --scan-only     Scan & categorize files, don't download or update
    --dry-run       Download, parse, and show suggestions without writing
    --category NAME Only process a specific category
    --help          Show this help message
"""
import argparse
import json
import shutil
import sys
import tempfile
from pathlib import Path

# Ensure project root is in path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from scripts.gdrive_sync.auth import get_drive_service
from scripts.gdrive_sync.scanner import list_all_files, download_file
from scripts.gdrive_sync.classifier import classify_batch
from scripts.gdrive_sync.parser import parse_file
from scripts.gdrive_sync.updater import (
    generate_suggestions,
    print_suggestions,
    write_suggestions_json,
)
from scripts.gdrive_sync.config import (
    DRIVE_DATA_DIR,
    SUPPORTED_MIME_TYPES,
    CATEGORIES,
)


def main():
    parser = argparse.ArgumentParser(
        description="Sync Google Drive files to portfolio website data"
    )
    parser.add_argument(
        "--scan-only",
        action="store_true",
        help="Only scan and categorize files (no download)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Download and parse but don't write changes",
    )
    parser.add_argument(
        "--category",
        choices=CATEGORIES,
        help="Only process a specific category",
    )
    args = parser.parse_args()

    print()
    print("╔══════════════════════════════════════════╗")
    print("║  Google Drive → Portfolio Sync           ║")
    print("╚══════════════════════════════════════════╝")
    print()

    # 1. Authenticate
    print("[1/6] Authenticating with Google Drive...")
    service = get_drive_service()
    print("[1/6] Authenticated successfully")
    print()

    # 2. Scan Drive
    print("[2/6] Scanning Drive for files...")
    files = list_all_files(service)
    if not files:
        print("[2/6] No processable files found. Exiting.")
        return
    print()

    # 3. Initial classification (by filename/metadata only)
    print("[3/6] Classifying files...")
    categorized = classify_batch(files)
    print()

    # Save file manifest
    manifest_path = DRIVE_DATA_DIR / "index.json"
    manifest = {
        cat: [{"id": f["id"], "name": f["name"], "mimeType": f.get("mimeType", "")}
              for f in items]
        for cat, items in categorized.items()
    }
    DRIVE_DATA_DIR.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"[3/6] Manifest saved to {manifest_path}")
    print()

    if args.scan_only:
        print("--scan-only: Stopping after classification.")
        _print_file_list(categorized)
        return

    # 4. Download & parse files
    print("[4/6] Downloading and parsing files...")
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)

        for cat, items in categorized.items():
            if args.category and cat != args.category:
                continue

            if not items:
                continue

            cat_dir = DRIVE_DATA_DIR / cat
            cat_dir.mkdir(parents=True, exist_ok=True)

            print(f"\n  Processing {cat} ({len(items)} files)...")

            for f in items:
                mime = f.get("mimeType", "")
                file_type = SUPPORTED_MIME_TYPES.get(mime, "")

                if not file_type or file_type == "image":
                    # Just record images, don't parse
                    f["_parsed"] = {"text": f"[Image: {f['name']}]"}
                    continue

                # Download to temp
                local_path = download_file(service, f, tmp_path)
                if not local_path:
                    continue

                # Parse
                parsed = parse_file(local_path, file_type)
                f["_parsed"] = parsed

                # Copy to organized local folder
                dest = cat_dir / local_path.name
                shutil.copy2(local_path, dest)

                print(f"    ✓ {f['name']} → {cat}/{local_path.name}")

    print()

    # 5. Re-classify with content (improves accuracy)
    print("[5/6] Refining classification with parsed content...")
    texts = {}
    for cat, items in categorized.items():
        for f in items:
            parsed = f.get("_parsed", {})
            if parsed.get("text"):
                texts[f["id"]] = parsed["text"]

    if texts:
        categorized = classify_batch(files, texts)
    print()

    # 6. Generate suggestions
    print("[6/6] Generating update suggestions...")
    suggestions = generate_suggestions(categorized)
    print_suggestions(suggestions)

    # Save suggestions JSON
    suggestions_path = DRIVE_DATA_DIR / "suggestions.json"
    write_suggestions_json(suggestions, suggestions_path)

    if args.dry_run:
        print("--dry-run: No changes written to content.js")
        print(f"Review suggestions at: {suggestions_path}")
    else:
        print(f"Review suggestions at: {suggestions_path}")
        print("To apply changes, edit content.js manually based on the suggestions above.")
        print("(Automatic content.js writing is intentionally manual-first for safety)")

    print()
    print("Done!")


def _print_file_list(categorized: dict):
    """Print a detailed file list by category."""
    print()
    for cat, items in categorized.items():
        if not items:
            continue
        print(f"\n  [{cat.upper()}] ({len(items)} files)")
        for f in items[:15]:  # Cap display
            name = f["name"]
            mime = f.get("mimeType", "unknown")
            size = int(f.get("size", 0))
            size_str = f"{size / 1024:.0f}KB" if size > 0 else "n/a"
            print(f"    • {name}  ({mime}, {size_str})")
        if len(items) > 15:
            print(f"    ... and {len(items) - 15} more")


if __name__ == "__main__":
    main()
