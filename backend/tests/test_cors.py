from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_cors_allows_tauri_origin():
    response = client.get(
        "/health",
        headers={"Origin": "http://localhost:1420"}
    )

    assert (
        response.headers["access-control-allow-origin"]
        == "http://localhost:1420"
    )

def test_cors_rejects_unknown_origin():
    response = client.get(
        "/health",
        headers={"Origin": "http://evil.com"}
    )

    assert "access-control-allow-origin" not in response.headers
