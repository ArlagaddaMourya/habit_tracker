def test_validation_error_returns_json(client):
    response = client.post(
        "/goals",
        json={
            "title": 123
        }
    )

    assert response.status_code == 422

    body = response.json()

    assert body["success"] is False
    assert body["error"]["message"] == "Validation Error"


def test_generic_exception_handler(client):
    response = client.get("/crash")

    assert response.status_code == 500

    body = response.json()

    assert body["success"] is False
    assert body["error"]["type"] == "InternalServerError"


def test_swagger_ui_available(client):
    response = client.get("/docs")
    assert response.status_code == 200
