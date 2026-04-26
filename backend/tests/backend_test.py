"""Backend tests for Akaal Integrated Solutions API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://web-app-hub-22.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- Root ---
def test_root_service_info(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data["service"] == "Akaal Integrated Solutions"
    assert data["status"] == "online"
    assert data["owner"] == "Avtar"


# --- Contact create ---
def test_contact_create_success(client):
    payload = {
        "name": "TEST_Jane Doe",
        "email": "test_jane@example.com",
        "phone": "416-555-0100",
        "project_type": "Custom Home",
        "message": "Looking for a smart home upgrade quote.",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert "id" in data and isinstance(data["id"], str) and len(data["id"]) > 0
    assert "created_at" in data
    assert data["name"] == payload["name"]
    assert data["email"] == payload["email"]
    assert data["message"] == payload["message"]
    assert "_id" not in data


def test_contact_create_invalid_email(client):
    r = client.post(f"{API}/contact", json={
        "name": "TEST_X", "email": "not-an-email", "message": "hello world"
    })
    assert r.status_code == 422


def test_contact_create_missing_required(client):
    r = client.post(f"{API}/contact", json={"email": "a@b.com"})
    assert r.status_code == 422


def test_contact_create_short_name(client):
    r = client.post(f"{API}/contact", json={
        "name": "A", "email": "a@b.com", "message": "hello there"
    })
    assert r.status_code == 422


# --- Contact list ---
def test_contact_list_returns_inquiries_without_objectid(client):
    # ensure at least one
    client.post(f"{API}/contact", json={
        "name": "TEST_Listing User",
        "email": "test_listing@example.com",
        "message": "Listing test message",
    })
    r = client.get(f"{API}/contact")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert len(items) >= 1
    for it in items:
        assert "_id" not in it
        assert "id" in it
        assert "email" in it
