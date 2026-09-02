import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app import app
from src.models.db import init_db
def login(c,u="admin",p="admin123"): c.post("/auth/login", json={"username":u,"password":p})

def test_createTeacher_happy():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/teachers", json={"employee_id":"T-HAPPY","name":"Happy Teacher","department":"CS","email":"happy@t.com"})
        assert resp.status_code==201
        assert resp.get_json()["data"]["employee_id"]=="T-HAPPY"

def test_createTeacher_rejects_bad_email():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/teachers", json={"employee_id":"T-FAIL","name":"F","department":"CS","email":"not-an-email"})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="email"

def test_createTeacher_edge_duplicate():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        c.post("/teachers", json={"employee_id":"T-DUP","name":"A","department":"CS","email":"a@t.com"})
        resp=c.post("/teachers", json={"employee_id":"T-DUP","name":"B","department":"CS","email":"b@t.com"})
        assert resp.status_code==422
        assert "already exists" in resp.get_json()["error"]

def test_createSubject_happy():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        c.post("/teachers", json={"employee_id":"T-SUB","name":"T","department":"CS","email":"t2@t.com"})
        resp=c.post("/subjects", json={"subject_code":"CS101","subject_name":"Intro CS","description":"Basics","schedule":"MWF 8-9","instructor_id":1})
        assert resp.status_code==201
        assert resp.get_json()["status"]==201

def test_createSubject_rejects_missing_code():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/subjects", json={"subject_name":"NoCode","schedule":"MWF 8-9"})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="subject_code"

def test_createSubject_edge_referential_instructor():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/subjects", json={"subject_code":"CS999","subject_name":"X","schedule":"MWF 8-9","instructor_id":99999})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="instructor_id"

def test_deleteSubject_forbidden():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as admin:
        login(admin,"admin","admin123")
        admin.post("/subjects", json={"subject_code":"DEL-SUB","subject_name":"Del","schedule":"MWF 8-9"})
    with app.test_client() as teacher:
        login(teacher,"teacher1","teacher123")
        resp=teacher.delete("/subjects/1")
        assert resp.status_code==403
