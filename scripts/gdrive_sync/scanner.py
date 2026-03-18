"""Google Drive file discovery and download."""
import io
import tempfile
from pathlib import Path

from googleapiclient.http import MediaIoBaseDownload

from .config import (
    MAX_FILE_SIZE_MB,
    SUPPORTED_MIME_TYPES,
    SKIP_MIME_PREFIXES,
    EXPORT_MIME_MAP,
)


def list_all_files(service) -> list[dict]:
    """List all files in Google Drive with metadata."""
    print("[scanner] Scanning Google Drive...")
    all_files = []
    page_token = None

    while True:
        response = (
            service.files()
            .list(
                q="trashed = false",
                spaces="drive",
                fields="nextPageToken, files(id, name, mimeType, modifiedTime, size, parents)",
                pageSize=1000,
                pageToken=page_token,
            )
            .execute()
        )

        files = response.get("files", [])
        all_files.extend(files)
        page_token = response.get("nextPageToken")

        if not page_token:
            break

    print(f"[scanner] Found {len(all_files)} total files")

    # Filter out unsupported types and large files
    filtered = []
    skipped = {"too_large": 0, "unsupported_type": 0}

    for f in all_files:
        mime = f.get("mimeType", "")

        # Skip folders, forms, videos, audio, etc.
        if any(mime.startswith(prefix) for prefix in SKIP_MIME_PREFIXES):
            skipped["unsupported_type"] += 1
            continue

        # Skip large files
        size_mb = int(f.get("size", 0)) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            skipped["too_large"] += 1
            continue

        # Check if we can process this type
        if mime in SUPPORTED_MIME_TYPES or mime.startswith("text/"):
            filtered.append(f)
        else:
            skipped["unsupported_type"] += 1

    print(f"[scanner] {len(filtered)} processable files "
          f"(skipped: {skipped['too_large']} too large, "
          f"{skipped['unsupported_type']} unsupported type)")

    return filtered


def download_file(service, file_meta: dict, dest_dir: Path) -> Path | None:
    """Download a single file from Drive. Returns local path or None."""
    file_id = file_meta["id"]
    name = file_meta["name"]
    mime = file_meta.get("mimeType", "")

    try:
        if mime in EXPORT_MIME_MAP:
            # Google Workspace file — export
            export_mime = EXPORT_MIME_MAP[mime]
            ext = ".txt" if "text/plain" in export_mime else ".csv"
            request = service.files().export_media(fileId=file_id, mimeType=export_mime)
            safe_name = _safe_filename(name) + ext
        else:
            # Regular file — download
            request = service.files().get_media(fileId=file_id)
            safe_name = _safe_filename(name)

        dest_path = dest_dir / safe_name
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)

        done = False
        while not done:
            _, done = downloader.next_chunk()

        dest_path.write_bytes(fh.getvalue())
        return dest_path

    except Exception as e:
        print(f"[scanner] Failed to download '{name}': {e}")
        return None


def _safe_filename(name: str) -> str:
    """Sanitize a filename for local storage."""
    # Replace problematic chars
    for ch in ['/', '\\', ':', '*', '?', '"', '<', '>', '|']:
        name = name.replace(ch, '_')
    return name.strip()
