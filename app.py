"""
app.py — Student Attendance System
Wire: route -> validation (422) -> thin controller (201/200) -> standardized envelope
Week 4 + Week 5 Deliverable 2 (Routing, Logic & Tests, 25%)
Drag-and-drop to repo root. Run: pip install -r requirements.txt && python app.py
"""
import re
from flask import Flask, request, jsonify, session
from functools import wraps
from src.validation import validation_error, success_response, require_roles, _is_int, EMAIL_RE, ALLOWED_STATUSES, is_valid_date_ymd
from src.models.db import init_db, get_db
from src.controllers.student_controller import create_student_controller, list_students_controller, update_student_controller, delete_student_controller, show_student_controller
from src.controllers.teacher_controller import create_teacher_controller, list_teachers_controller, update_teacher_controller, delete_teacher_controller
from src.controllers.subject_controller import create_subject_controller, list_subjects_controller, update_subject_controller, delete_subject_controller
from src.controllers.attendance_controller import create_attendance_controller, list_attendance_controller, update_attendance_controller, delete_attendance_controller

app = Flask(__name__)
app.secret_key = "attendance_secret_2026"

def login_required(f):
    @wraps(f)
    def w(*a,**kw):
        if "user_id" not in session:
            return jsonify({"status":401,"error":"login required","field":"auth"}),401
        return f(*a,**kw)
    return w

# ---------- Auth ----------
@app.route("/auth/login", methods=["POST"])
def login():
    data=request.get_json(silent=True) or {}
    username=str(data.get("username","")).strip()
    password=str(data.get("password","")).strip()
    if not username: return validation_error("username","username is required")
    if not password: return validation_error("password","password is required")
    conn=get_db(); user=conn.execute("SELECT * FROM users WHERE username=? AND password=?",(username,password)).fetchone(); conn.close()
    if not user: return jsonify({"status":401,"error":"invalid credentials","field":"auth"}),401
    session["user_id"]=user["id"]; session["role"]=user["role"]; session["username"]=user["username"]
    return success_response({"role":user["role"]},200)

@app.route("/auth/logout", methods=["POST"])
def logout():
    session.clear()
    return success_response({"ok":True})

@app.route("/auth/change-password", methods=["PUT"])
@login_required
def changePassword():
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    old=str(data.get("old_password","")); new=str(data.get("new_password","")); confirm=str(data.get("confirm_password",""))
    if not old: return validation_error("old_password","old_password is required")
    if not new: return validation_error("new_password","new_password is required")
    if len(new)<8 or len(new)>100: return validation_error("new_password","new_password must be 8-100 chars")
    if not confirm: return validation_error("confirm_password","confirm_password is required")
    if new!=confirm: return validation_error("confirm_password","confirm_password must match new_password")
    return success_response({"changed":True},200)

# ---------- Students ----------
@app.route("/students", methods=["POST"])
@login_required
def createStudentRoute():
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required and must be JSON")
    sid=str(data.get("student_id","")).strip()
    if not sid: return validation_error("student_id","student_id is required")
    if len(sid)<1 or len(sid)>20: return validation_error("student_id","student_id must be 1-20 chars")
    if not re.match(r"^[A-Za-z0-9\-]+$", sid): return validation_error("student_id","student_id format invalid")
    name=str(data.get("name","")).strip()
    if not name: return validation_error("name","name is required")
    if len(name)>100: return validation_error("name","name must be 1-100 chars")
    course=str(data.get("course","")).strip()
    if not course: return validation_error("course","course is required")
    if len(course)>50: return validation_error("course","course too long (max 50)")
    yl=data.get("year_level")
    if yl is None or str(yl).strip()=="": return validation_error("year_level","year_level is required")
    if not _is_int(yl): return validation_error("year_level","year_level must be a number")
    if int(yl)<1 or int(yl)>5: return validation_error("year_level","year_level out of range (1-5)")
    email=str(data.get("email","")).strip()
    if email:
        if len(email)>100: return validation_error("email","email too long")
        if not EMAIL_RE.match(email): return validation_error("email","email format invalid")
    contact=str(data.get("contact","")).strip()
    if contact:
        if len(contact)>20: return validation_error("contact","contact too long")
        if not re.match(r"^[0-9+\-\s()]+$", contact): return validation_error("contact","contact format invalid")
    conn=get_db()
    if conn.execute("SELECT id FROM students WHERE student_id=?",(sid,)).fetchone():
        conn.close(); return validation_error("student_id","student_id already exists")
    conn.close()
    validated={"student_id":sid,"name":name,"course":course,"year_level":int(yl),"email":email,"contact":contact}
    return create_student_controller(validated)

@app.route("/students", methods=["GET"])
@login_required
def listStudentsRoute():
    return list_students_controller()

@app.route("/students/<int:id>", methods=["GET"])
@login_required
def showStudentRoute(id):
    conn=get_db()
    if not conn.execute("SELECT id FROM students WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","student does not exist")
    conn.close()
    return show_student_controller(id)

@app.route("/students/<int:id>", methods=["PUT"])
@login_required
def updateStudentRoute(id):
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    conn=get_db()
    if not conn.execute("SELECT id FROM students WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","student does not exist")
    conn.close()
    name=str(data.get("name","")).strip()
    if not name: return validation_error("name","name is required")
    if len(name)>100: return validation_error("name","name must be 1-100 chars")
    course=str(data.get("course","")).strip()
    if not course: return validation_error("course","course is required")
    yl=data.get("year_level")
    if yl is None or str(yl).strip()=="": return validation_error("year_level","year_level is required")
    if not _is_int(yl): return validation_error("year_level","year_level must be a number")
    if int(yl)<1 or int(yl)>5: return validation_error("year_level","year_level out of range (1-5)")
    email=str(data.get("email","")).strip()
    if email and not EMAIL_RE.match(email): return validation_error("email","email format invalid")
    validated={"name":name,"course":course,"year_level":int(yl),"email":email,"contact":data.get("contact","")}
    return update_student_controller(id, validated)

@app.route("/students/<int:id>", methods=["DELETE"])
@login_required
def deleteStudentRoute(id):
    auth=require_roles("Admin")
    if auth: return auth
    conn=get_db()
    if not conn.execute("SELECT id FROM students WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","student does not exist")
    conn.close()
    return delete_student_controller(id)

# ---------- Teachers ----------
@app.route("/teachers", methods=["POST"])
@login_required
def createTeacherRoute():
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    eid=str(data.get("employee_id","")).strip() or str(data.get("instructor_id","")).strip()
    if not eid: return validation_error("employee_id","employee_id is required")
    if len(eid)>20: return validation_error("employee_id","employee_id must be 1-20 chars")
    if not re.match(r"^[A-Za-z0-9\-]+$", eid): return validation_error("employee_id","employee_id format invalid")
    name=str(data.get("name","")).strip()
    if not name: return validation_error("name","name is required")
    if len(name)>100: return validation_error("name","name must be 1-100 chars")
    dept=str(data.get("department","")).strip()
    if not dept: return validation_error("department","department is required")
    email=str(data.get("email","")).strip()
    if not email: return validation_error("email","email is required")
    if not EMAIL_RE.match(email): return validation_error("email","email format invalid")
    conn=get_db()
    if conn.execute("SELECT id FROM teachers WHERE employee_id=?",(eid,)).fetchone():
        conn.close(); return validation_error("employee_id","employee_id already exists")
    conn.close()
    validated={"employee_id":eid,"name":name,"department":dept,"email":email,"contact":data.get("contact","")}
    return create_teacher_controller(validated)

@app.route("/teachers", methods=["GET"])
@login_required
def listTeachersRoute(): return list_teachers_controller()

@app.route("/teachers/<int:id>", methods=["PUT"])
@login_required
def updateTeacherRoute(id):
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    conn=get_db()
    if not conn.execute("SELECT id FROM teachers WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","teacher does not exist")
    conn.close()
    name=str(data.get("name","")).strip()
    if not name: return validation_error("name","name is required")
    dept=str(data.get("department","")).strip()
    if not dept: return validation_error("department","department is required")
    email=str(data.get("email","")).strip()
    if not email or not EMAIL_RE.match(email): return validation_error("email","email format invalid")
    validated={"name":name,"department":dept,"email":email,"contact":data.get("contact","")}
    return update_teacher_controller(id, validated)

@app.route("/teachers/<int:id>", methods=["DELETE"])
@login_required
def deleteTeacherRoute(id):
    auth=require_roles("Admin")
    if auth: return auth
    conn=get_db()
    if not conn.execute("SELECT id FROM teachers WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","teacher does not exist")
    conn.close()
    return delete_teacher_controller(id)

# ---------- Subjects ----------
@app.route("/subjects", methods=["POST"])
@login_required
def createSubjectRoute():
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    code=str(data.get("subject_code","")).strip()
    if not code: return validation_error("subject_code","subject_code is required")
    if len(code)>20: return validation_error("subject_code","subject_code must be 1-20 chars")
    if not re.match(r"^[A-Za-z0-9\-]+$", code): return validation_error("subject_code","subject_code format invalid")
    sname=str(data.get("subject_name","")).strip()
    if not sname: return validation_error("subject_name","subject_name is required")
    if len(sname)>100: return validation_error("subject_name","subject_name must be 1-100 chars")
    desc=str(data.get("description",""))
    if len(desc)>500: return validation_error("description","description too long (max 500)")
    sched=str(data.get("schedule","")).strip()
    if not sched: return validation_error("schedule","schedule is required")
    instr=data.get("instructor_id")
    if instr is not None and str(instr).strip()!="":
        if not _is_int(instr): return validation_error("instructor_id","instructor_id must be an integer")
        conn=get_db()
        if not conn.execute("SELECT id FROM teachers WHERE id=?",(int(instr),)).fetchone():
            conn.close(); return validation_error("instructor_id","instructor does not exist (referential)")
        conn.close()
    conn=get_db()
    if conn.execute("SELECT id FROM subjects WHERE subject_code=?",(code,)).fetchone():
        conn.close(); return validation_error("subject_code","subject_code already exists")
    conn.close()
    validated={"subject_code":code,"subject_name":sname,"description":desc,"schedule":sched,"instructor_id":int(instr) if instr else None}
    return create_subject_controller(validated)

@app.route("/subjects", methods=["GET"])
@login_required
def listSubjectsRoute(): return list_subjects_controller()

@app.route("/subjects/<int:id>", methods=["PUT"])
@login_required
def updateSubjectRoute(id):
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    conn=get_db()
    if not conn.execute("SELECT id FROM subjects WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","subject does not exist")
    conn.close()
    code=str(data.get("subject_code","")).strip()
    if not code: return validation_error("subject_code","subject_code is required")
    sname=str(data.get("subject_name","")).strip()
    if not sname: return validation_error("subject_name","subject_name is required")
    sched=str(data.get("schedule","")).strip()
    if not sched: return validation_error("schedule","schedule is required")
    validated={"subject_code":code,"subject_name":sname,"description":data.get("description",""),"schedule":sched,"instructor_id":data.get("instructor_id")}
    return update_subject_controller(id, validated)

@app.route("/subjects/<int:id>", methods=["DELETE"])
@login_required
def deleteSubjectRoute(id):
    auth=require_roles("Admin")
    if auth: return auth
    conn=get_db()
    if not conn.execute("SELECT id FROM subjects WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","subject does not exist")
    if conn.execute("SELECT id FROM attendance WHERE class_id=? LIMIT 1",(id,)).fetchone():
        conn.close(); return validation_error("id","subject has attendance records (referential)")
    conn.close()
    return delete_subject_controller(id)

# ---------- Attendance ----------
@app.route("/attendance", methods=["POST"])
@login_required
def createAttendanceRoute():
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    sid=data.get("student_id")
    if sid is None or str(sid).strip()=="": return validation_error("student_id","student_id is required")
    cid=data.get("class_id") or data.get("subject_id")
    if cid is None or str(cid).strip()=="": return validation_error("class_id","class_id is required")
    if not _is_int(cid): return validation_error("class_id","class_id must be an integer")
    date=str(data.get("date","")).strip()
    if not date: return validation_error("date","date is required")
    if not is_valid_date_ymd(date): return validation_error("date","date must be YYYY-MM-DD format")
    status=data.get("status")
    if not status or str(status).strip()=="": return validation_error("status","status is required")
    if status not in ALLOWED_STATUSES: return validation_error("status",f"status must be one of {', '.join(sorted(ALLOWED_STATUSES))}")
    remarks=str(data.get("remarks",""))
    if len(remarks)>200: return validation_error("remarks","remarks too long (max 200)")
    conn=get_db()
    if not conn.execute("SELECT id FROM students WHERE id=?",(sid,)).fetchone():
        conn.close(); return validation_error("student_id","student does not exist (referential)")
    if not conn.execute("SELECT id FROM subjects WHERE id=?",(int(cid),)).fetchone():
        conn.close(); return validation_error("class_id","class does not exist (referential)")
    conn.close()
    validated={"student_id":sid,"class_id":int(cid),"date":date,"status":status,"remarks":remarks}
    return create_attendance_controller(validated)

@app.route("/attendance", methods=["GET"])
@login_required
def listAttendanceRoute(): return list_attendance_controller()

@app.route("/attendance/<int:id>", methods=["PUT"])
@login_required
def updateAttendanceRoute(id):
    data=request.get_json(silent=True)
    if data is None: return validation_error("body","request body is required")
    status=data.get("status")
    if not status or str(status).strip()=="": return validation_error("status","status is required")
    if not isinstance(status,str): return validation_error("status","status must be a string")
    if status not in ALLOWED_STATUSES: return validation_error("status",f"status must be one of {', '.join(sorted(ALLOWED_STATUSES))}")
    conn=get_db()
    if not conn.execute("SELECT id FROM attendance WHERE id=?",(id,)).fetchone():
        conn.close(); return validation_error("id","attendance does not exist")
    conn.close()
    validated={"status":status,"remarks":data.get("remarks","")}
    return update_attendance_controller(id, validated)

@app.route("/attendance/<int:id>", methods=["DELETE"])
@login_required
def deleteAttendanceRoute(id):
    conn=get_db()
    row=conn.execute("SELECT * FROM attendance WHERE id=?",(id,)).fetchone()
    if not row:
        conn.close(); return validation_error("id","attendance does not exist")
    conn.close()
    if session.get("role") not in ("Admin","Teacher"):
        return jsonify({"status":403,"error":"not allowed: requires Admin/Teacher","field":"authorization"}),403
    return delete_attendance_controller(id)

# ---------- Error handlers ----------
@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith(("/api","/students","/teachers","/subjects","/attendance","/auth")):
        return jsonify({"status":404,"error":"not found","field":"url"}),404
    return "Not found",404

@app.errorhandler(500)
def handle_500(e):
    return jsonify({"status":500,"error":"internal server error","field":"server"}),500

if __name__=="__main__":
    init_db()
    app.run(debug=True, port=5000)
