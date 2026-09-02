"""
tests/test_students.py — Week 5 Task 3: Arrange-Act-Assert
Each controller: 1 happy path, 1 validation failure, 1 edge case
Run: pytest -v  or  python -m pytest tests/
"""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app import app
from src.models.db import init_db

def login(c, user="admin", pw="admin123"):
    c.post("/auth/login", json={"username":user,"password":pw})

def test_createStudent_saves_valid():
    # Arrange: valid payload
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        payload={"student_id":"S-HAPPY-01","name":"Happy Student","course":"BSIT","year_level":2,"email":"happy@test.com"}
        # Act
        resp=c.post("/students", json=payload)
        # Assert: success envelope
        assert resp.status_code==201
        data=resp.get_json()
        assert data["status"]==201
        assert "data" in data
        assert data["data"]["student_id"]=="S-HAPPY-01"
        assert data["data"]["name"]=="Happy Student"

def test_createStudent_rejects_negative_year():
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        payload={"student_id":"S-FAIL-01","name":"Fail","course":"BSIT","year_level":-1}
        resp=c.post("/students", json=payload)
        assert resp.status_code==422
        j=resp.get_json()
        assert j["status"]==422
        assert j["field"]=="year_level"
        assert "out of range" in j["error"]

def test_createStudent_edge_duplicate_id():
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        payload={"student_id":"S-DUP","name":"A","course":"BSIT","year_level":1}
        r1=c.post("/students", json=payload)
        assert r1.status_code==201
        r2=c.post("/students", json=payload)  # same ID again
        assert r2.status_code==422
        assert r2.get_json()["field"]=="student_id"
        assert "already exists" in r2.get_json()["error"]

def test_createStudent_wrong_type_year():
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/students", json={"student_id":"S-TYPE","name":"X","course":"BSIT","year_level":"cake"})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="year_level"
        assert "must be a number" in resp.get_json()["error"]

def test_updateStudent_edge_nonexistent():
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.put("/students/99999", json={"name":"New","course":"BSIT","year_level":3})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="id"

def test_deleteStudent_forbidden_for_teacher():
    init_db()
    app.config["TESTING"]=True
    with app.test_client() as admin:
        login(admin,"admin","admin123")
        admin.post("/students", json={"student_id":"S-DEL","name":"Del","course":"BSIT","year_level":1})
    with app.test_client() as teacher:
        login(teacher,"teacher1","teacher123")
        resp=teacher.delete("/students/1")
        assert resp.status_code==403
        j=resp.get_json()
        assert j["status"]==403
        assert j["field"]=="authorization"
