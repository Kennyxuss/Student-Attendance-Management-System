import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app import app
from src.models.db import init_db

def login(c,u="admin",p="admin123"): c.post("/auth/login", json={"username":u,"password":p})

def test_createAttendance_happy():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        c.post("/students", json={"student_id":"S-A1","name":"A","course":"BSIT","year_level":1})
        c.post("/teachers", json={"employee_id":"T-A1","name":"T","department":"CS","email":"t@t.com"})
        c.post("/subjects", json={"subject_code":"SUB-A1","subject_name":"Math","schedule":"MWF 9-10","instructor_id":1})
        resp=c.post("/attendance", json={"student_id":1,"class_id":1,"date":"2026-09-02","status":"Present"})
        assert resp.status_code==201
        j=resp.get_json()
        assert j["status"]==201
        assert j["data"]["status"]=="Present"

def test_createAttendance_rejects_invalid_status():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/attendance", json={"student_id":1,"class_id":1,"date":"2026-09-02","status":"shipped"})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="status"
        assert "must be one of" in resp.get_json()["error"]

def test_createAttendance_edge_referential_fail():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        resp=c.post("/attendance", json={"student_id":99999,"class_id":1,"date":"2026-09-02","status":"Present"})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="student_id"

def test_createAttendance_edge_bad_date_format():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        c.post("/students", json={"student_id":"S-A2","name":"A","course":"BSIT","year_level":1})
        c.post("/subjects", json={"subject_code":"SUB-A2","subject_name":"Math","schedule":"MWF 9-10"})
        resp=c.post("/attendance", json={"student_id":1,"class_id":1,"date":"02-09-2026","status":"Present"})
        assert resp.status_code==422
        assert resp.get_json()["field"]=="date"

def test_updateAttendance_happy():
    init_db(); app.config["TESTING"]=True
    with app.test_client() as c:
        login(c)
        c.post("/students", json={"student_id":"S-U","name":"U","course":"BSIT","year_level":1})
        c.post("/subjects", json={"subject_code":"SUB-U","subject_name":"U","schedule":"MWF 9-10"})
        r=c.post("/attendance", json={"student_id":1,"class_id":1,"date":"2026-09-02","status":"Present"})
        aid=r.get_json()["data"]["id"]
        resp=c.put(f"/attendance/{aid}", json={"status":"Late"})
        assert resp.status_code==200
        assert resp.get_json()["data"]["status"]=="Late"
