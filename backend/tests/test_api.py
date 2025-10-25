import json
import pytest

from backend.app import create_app
from backend.config import TestingConfig
from backend.extensions import db
from backend.models import Task


@pytest.fixture()
def app():
    app = create_app(TestingConfig)
    with app.app_context():
        db.create_all()
        # seed a task
        t = Task(title="Test Task", priority="medium")
        db.session.add(t)
        db.session.commit()
    yield app


@pytest.fixture()
def client(app):
    return app.test_client()


def test_get_tasks(client):
    resp = client.get("/api/tasks")
    assert resp.status_code == 200
    data = resp.get_json()
    assert "items" in data
    assert data["total"] >= 1



