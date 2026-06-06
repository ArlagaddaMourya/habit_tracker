import os
import pathlib
import sys
import pytest

# Ensure backend root is importable during tests
ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

# Defaults for local testing if .env is not present
os.environ.setdefault("APP_NAME", "Habit Tracker API")
os.environ.setdefault("VERSION", "0.1.0")
os.environ.setdefault("API_HOST", "127.0.0.1")
os.environ.setdefault("API_PORT", "8000")

from fastapi.testclient import TestClient
from main import app


def pytest_configure():
    # Prevent pytest from treating backend as a package import issue.
    pass

@pytest.fixture(scope="module")
def client():
    return TestClient(app, raise_server_exceptions=False)
