"""Google OAuth2 authentication and token management."""
import sys
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from .config import CREDENTIALS_PATH, TOKEN_PATH, SCOPES


def get_credentials() -> Credentials:
    """Get valid Google credentials, prompting browser auth if needed."""
    creds = None

    if TOKEN_PATH.exists():
        creds = Credentials.from_authorized_user_file(str(TOKEN_PATH), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("[auth] Refreshing expired token...")
            creds.refresh(Request())
        else:
            if not CREDENTIALS_PATH.exists():
                print(f"[auth] ERROR: credentials.json not found at {CREDENTIALS_PATH}")
                print()
                print("Setup instructions:")
                print("  1. Go to https://console.cloud.google.com/")
                print("  2. Create a project → Enable 'Google Drive API'")
                print("  3. Create OAuth2 credentials (Desktop app)")
                print("  4. Download the JSON and save as:")
                print(f"     {CREDENTIALS_PATH}")
                sys.exit(1)

            print("[auth] No valid token found — opening browser for authorization...")
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CREDENTIALS_PATH), SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Save token for next run
        TOKEN_PATH.write_text(creds.to_json())
        print(f"[auth] Token saved to {TOKEN_PATH}")

    return creds


def get_drive_service():
    """Build and return an authenticated Google Drive API service."""
    creds = get_credentials()
    return build("drive", "v3", credentials=creds)
