"""
Week 4 — Defensive Guard Clauses & Authorization Guards
Validates incoming request data at the top of every handler.
Exits early with the standardized error response:
    { "status": 422, "error": "<msg>", "field": "<name>" }
or for authorization failures:
    { "status": 403, "error": "Forbidden: ...", "field": "authorization" }
"""

import re
from datetime import datetime

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def error_response(status, error_message, field=None):
    return status, {
        "status": status,
        "error": error_message,
        "field": field
    }

# ==================== AUTHORIZATION GUARDS ====================
def guard_admin(headers):
    role = headers.get("X-User-Role", "Student") if headers else "Student"
    if role != "Admin":
        return False, error_response(403, "Forbidden: Admin privileges required", "authorization")
    return True, None

def guard_instructor_or_admin(headers):
    role = headers.get("X-User-Role", "Student") if headers else "Student"
    if role not in ["Admin", "Instructor"]:
        return False, error_response(403, "Forbidden: Instructor or Admin privileges required", "authorization")
    return True, None

# ==================== STUDENT GUARDS ====================
def guard_student_create(body, repo):
    if not isinstance(body, dict):
        return False, error_response(422, "Request body must be a JSON object", "body")

    # 1. student_id_number
    id_num = body.get("student_id_number")
    if id_num is None:
        return False, error_response(422, "student_id_number is required", "student_id_number")
    if not isinstance(id_num, str):
        return False, error_response(422, "student_id_number must be a string", "student_id_number")
    id_num = id_num.strip()
    if len(id_num) < 3 or len(id_num) > 30:
        return False, error_response(422, "student_id_number must be between 3 and 30 characters", "student_id_number")
    if repo.find_student_by_id_number(id_num):
        return False, error_response(422, "student_id_number already exists", "student_id_number")

    # 2. first_name
    fn = body.get("first_name")
    if fn is None:
        return False, error_response(422, "first_name is required", "first_name")
    if not isinstance(fn, str):
        return False, error_response(422, "first_name must be a string", "first_name")
    if len(fn.strip()) < 1 or len(fn.strip()) > 60:
        return False, error_response(422, "first_name length must be between 1 and 60 characters", "first_name")

    # 3. last_name
    ln = body.get("last_name")
    if ln is None:
        return False, error_response(422, "last_name is required", "last_name")
    if not isinstance(ln, str):
        return False, error_response(422, "last_name must be a string", "last_name")
    if len(ln.strip()) < 1 or len(ln.strip()) > 60:
        return False, error_response(422, "last_name length must be between 1 and 60 characters", "last_name")

    # 4. email
    em = body.get("email")
    if em is None:
        return False, error_response(422, "email is required", "email")
    if not isinstance(em, str):
        return False, error_response(422, "email must be a string", "email")
    em = em.strip()
    if not EMAIL_REGEX.match(em):
        return False, error_response(422, "Invalid email address format", "email")
    if repo.find_student_by_email(em):
        return False, error_response(422, "email is already registered", "email")

    # 5. status (optional)
    if "status" in body:
        st = body.get("status")
        if st not in ["Active", "Inactive"]:
            return False, error_response(422, "status must be Active or Inactive", "status")

    return True, None

def guard_student_update(student_id, body, repo):
    if not isinstance(body, dict):
        return False, error_response(422, "Request body must be a JSON object", "body")

    existing = repo.find_student_by_id(student_id)
    if not existing:
        return False, error_response(404, "Student not found", "id")

    if "email" in body:
        em = body.get("email")
        if not isinstance(em, str) or not EMAIL_REGEX.match(em.strip()):
            return False, error_response(422, "Invalid email address format", "email")
        found = repo.find_student_by_email(em.strip())
        if found and found["id"] != student_id:
            return False, error_response(422, "email is already taken by another student", "email")

    if "status" in body:
        if body.get("status") not in ["Active", "Inactive"]:
            return False, error_response(422, "status must be Active or Inactive", "status")

    return True, None

# ==================== COURSE GUARDS ====================
def guard_course_create(body, repo):
    if not isinstance(body, dict):
        return False, error_response(422, "Request body must be a JSON object", "body")

    code = body.get("course_code")
    if not code or not isinstance(code, str):
        return False, error_response(422, "course_code is required", "course_code")
    code = code.strip()
    if len(code) < 2 or len(code) > 20:
        return False, error_response(422, "course_code must be between 2 and 20 characters", "course_code")
    if repo.find_course_by_code(code):
        return False, error_response(422, "course_code already exists", "course_code")

    title = body.get("title")
    if not title or not isinstance(title, str):
        return False, error_response(422, "title is required", "title")
    if len(title.strip()) < 3 or len(title.strip()) > 120:
        return False, error_response(422, "title must be between 3 and 120 characters", "title")

    inst = body.get("instructor_name")
    if not inst or not isinstance(inst, str):
        return False, error_response(422, "instructor_name is required", "instructor_name")

    return True, None

# ==================== ENROLLMENT GUARDS ====================
def guard_enrollment_create(body, repo):
    if not isinstance(body, dict):
        return False, error_response(422, "Request body must be a JSON object", "body")

    sid = body.get("student_id")
    if sid is None or not isinstance(sid, int):
        return False, error_response(422, "student_id must be a valid integer", "student_id")
    if not repo.find_student_by_id(sid):
        return False, error_response(422, f"student_id {sid} does not exist", "student_id")

    cid = body.get("course_id")
    if cid is None or not isinstance(cid, int):
        return False, error_response(422, "course_id must be a valid integer", "course_id")
    if not repo.find_course_by_id(cid):
        return False, error_response(422, f"course_id {cid} does not exist", "course_id")

    if repo.find_enrollment(sid, cid):
        return False, error_response(422, "Student is already enrolled in this course", "enrollment")

    return True, None

# ==================== ATTENDANCE GUARDS ====================
def guard_attendance_create(body, repo):
    if not isinstance(body, dict):
        return False, error_response(422, "Request body must be a JSON object", "body")

    cid = body.get("course_id")
    if cid is None or not isinstance(cid, int) or not repo.find_course_by_id(cid):
        return False, error_response(422, "Valid course_id is required", "course_id")

    sid = body.get("student_id")
    if sid is None or not isinstance(sid, int) or not repo.find_student_by_id(sid):
        return False, error_response(422, "Valid student_id is required", "student_id")

    # Referential enrollment check
    if not repo.find_enrollment(sid, cid):
        return False, error_response(422, "Student is not enrolled in this course", "student_id")

    sdate = body.get("session_date")
    if not sdate or not isinstance(sdate, str) or not DATE_REGEX.match(sdate):
        return False, error_response(422, "session_date must be YYYY-MM-DD", "session_date")
    try:
        datetime.strptime(sdate, "%Y-%m-%d")
    except ValueError:
        return False, error_response(422, "session_date is not a valid calendar date", "session_date")

    status = body.get("status")
    if status not in ["Present", "Absent", "Late", "Excused"]:
        return False, error_response(422, "status must be one of: Present, Absent, Late, Excused", "status")

    if repo.find_attendance_record(cid, sid, sdate):
        return False, error_response(422, "Attendance record already logged for this student and date", "session_date")

    return True, None
