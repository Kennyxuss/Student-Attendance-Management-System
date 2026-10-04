"""
Validation Layer for SAMS.
Enforces strict guard clauses for all payload boundaries.
Returns (is_valid, errors_list) where each error is { "field": str, "message": str }.
Standardizes 422 Unprocessable Entity outcomes.
"""

import re
from datetime import datetime

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")

def validate_student_create(payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    student_id_num = payload.get("student_id_number")
    if not student_id_num or not isinstance(student_id_num, str) or not student_id_num.strip():
        errors.append({"field": "student_id_number", "message": "Student ID number is required"})
    else:
        student_id_num = student_id_num.strip()
        if len(student_id_num) < 3 or len(student_id_num) > 30:
            errors.append({"field": "student_id_number", "message": "Student ID number must be between 3 and 30 characters"})
        elif repo.find_student_by_id_number(student_id_num):
            errors.append({"field": "student_id_number", "message": "Student ID number must be unique"})

    first_name = payload.get("first_name")
    if not first_name or not isinstance(first_name, str) or not first_name.strip():
        errors.append({"field": "first_name", "message": "First name is required"})
    elif len(first_name.strip()) > 60:
        errors.append({"field": "first_name", "message": "First name must not exceed 60 characters"})

    last_name = payload.get("last_name")
    if not last_name or not isinstance(last_name, str) or not last_name.strip():
        errors.append({"field": "last_name", "message": "Last name is required"})
    elif len(last_name.strip()) > 60:
        errors.append({"field": "last_name", "message": "Last name must not exceed 60 characters"})

    email = payload.get("email")
    if not email or not isinstance(email, str) or not email.strip():
        errors.append({"field": "email", "message": "Email address is required"})
    else:
        email = email.strip()
        if not EMAIL_REGEX.match(email):
            errors.append({"field": "email", "message": "Valid email address format is required"})
        elif repo.find_student_by_email(email):
            errors.append({"field": "email", "message": "Email address is already registered"})

    status = payload.get("status", "Active")
    if status not in ["Active", "Inactive"]:
        errors.append({"field": "status", "message": "Status must be either 'Active' or 'Inactive'"})

    return len(errors) == 0, errors

def validate_student_update(student_id, payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    existing = repo.find_student_by_id(student_id)
    if not existing:
        return False, [{"field": "id", "message": "Student not found"}]

    if "student_id_number" in payload:
        student_id_num = payload.get("student_id_number")
        if not student_id_num or not isinstance(student_id_num, str) or not student_id_num.strip():
            errors.append({"field": "student_id_number", "message": "Student ID number cannot be empty"})
        else:
            student_id_num = student_id_num.strip()
            found = repo.find_student_by_id_number(student_id_num)
            if found and found["id"] != student_id:
                errors.append({"field": "student_id_number", "message": "Student ID number is already taken"})

    if "first_name" in payload:
        first_name = payload.get("first_name")
        if not first_name or not isinstance(first_name, str) or not first_name.strip():
            errors.append({"field": "first_name", "message": "First name cannot be empty"})

    if "last_name" in payload:
        last_name = payload.get("last_name")
        if not last_name or not isinstance(last_name, str) or not last_name.strip():
            errors.append({"field": "last_name", "message": "Last name cannot be empty"})

    if "email" in payload:
        email = payload.get("email")
        if not email or not isinstance(email, str) or not email.strip():
            errors.append({"field": "email", "message": "Email cannot be empty"})
        else:
            email = email.strip()
            if not EMAIL_REGEX.match(email):
                errors.append({"field": "email", "message": "Valid email address format is required"})
            else:
                found = repo.find_student_by_email(email)
                if found and found["id"] != student_id:
                    errors.append({"field": "email", "message": "Email address is already in use by another student"})

    if "status" in payload:
        if payload.get("status") not in ["Active", "Inactive"]:
            errors.append({"field": "status", "message": "Status must be either 'Active' or 'Inactive'"})

    return len(errors) == 0, errors

def validate_course_create(payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    code = payload.get("course_code")
    if not code or not isinstance(code, str) or not code.strip():
        errors.append({"field": "course_code", "message": "Course code is required"})
    else:
        code = code.strip()
        if len(code) < 2 or len(code) > 20:
            errors.append({"field": "course_code", "message": "Course code must be between 2 and 20 characters"})
        elif repo.find_course_by_code(code):
            errors.append({"field": "course_code", "message": "Course code already exists"})

    title = payload.get("title")
    if not title or not isinstance(title, str) or not title.strip():
        errors.append({"field": "title", "message": "Course title is required"})
    elif len(title.strip()) < 3 or len(title.strip()) > 120:
        errors.append({"field": "title", "message": "Course title must be between 3 and 120 characters"})

    instructor = payload.get("instructor_name")
    if not instructor or not isinstance(instructor, str) or not instructor.strip():
        errors.append({"field": "instructor_name", "message": "Instructor name is required"})

    return len(errors) == 0, errors

def validate_course_update(course_id, payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    existing = repo.find_course_by_id(course_id)
    if not existing:
        return False, [{"field": "id", "message": "Course not found"}]

    if "course_code" in payload:
        code = payload.get("course_code")
        if not code or not isinstance(code, str) or not code.strip():
            errors.append({"field": "course_code", "message": "Course code cannot be empty"})
        else:
            found = repo.find_course_by_code(code.strip())
            if found and found["id"] != course_id:
                errors.append({"field": "course_code", "message": "Course code is already in use by another course"})

    if "title" in payload:
        title = payload.get("title")
        if not title or not isinstance(title, str) or not title.strip():
            errors.append({"field": "title", "message": "Title cannot be empty"})

    return len(errors) == 0, errors

def validate_enrollment_create(payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    student_id = payload.get("student_id")
    if not isinstance(student_id, int):
        errors.append({"field": "student_id", "message": "Valid integer student_id is required"})
    elif not repo.find_student_by_id(student_id):
        errors.append({"field": "student_id", "message": f"Student with ID {student_id} does not exist"})

    course_id = payload.get("course_id")
    if not isinstance(course_id, int):
        errors.append({"field": "course_id", "message": "Valid integer course_id is required"})
    elif not repo.find_course_by_id(course_id):
        errors.append({"field": "course_id", "message": f"Course with ID {course_id} does not exist"})

    if len(errors) == 0:
        if repo.find_enrollment(student_id, course_id):
            errors.append({"field": "enrollment", "message": "Student is already enrolled in this course"})

    status = payload.get("status", "Enrolled")
    if status not in ["Enrolled", "Dropped", "Completed"]:
        errors.append({"field": "status", "message": "Status must be 'Enrolled', 'Dropped', or 'Completed'"})

    return len(errors) == 0, errors

def validate_attendance_create(payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    student_id = payload.get("student_id")
    if not isinstance(student_id, int):
        errors.append({"field": "student_id", "message": "Valid integer student_id is required"})
    elif not repo.find_student_by_id(student_id):
        errors.append({"field": "student_id", "message": f"Student with ID {student_id} does not exist"})

    course_id = payload.get("course_id")
    if not isinstance(course_id, int):
        errors.append({"field": "course_id", "message": "Valid integer course_id is required"})
    elif not repo.find_course_by_id(course_id):
        errors.append({"field": "course_id", "message": f"Course with ID {course_id} does not exist"})

    if isinstance(student_id, int) and isinstance(course_id, int):
        if not repo.find_enrollment(student_id, course_id):
            errors.append({"field": "student_id", "message": "Student is not enrolled in this course"})

    session_date = payload.get("session_date")
    if not session_date or not isinstance(session_date, str) or not DATE_REGEX.match(session_date):
        errors.append({"field": "session_date", "message": "Valid session_date in YYYY-MM-DD format is required"})
    else:
        try:
            datetime.strptime(session_date, "%Y-%m-%d")
        except ValueError:
            errors.append({"field": "session_date", "message": "Invalid calendar date"})

    status = payload.get("status")
    allowed_statuses = ["Present", "Absent", "Late", "Excused"]
    if not status or status not in allowed_statuses:
        errors.append({"field": "status", "message": f"Status must be one of: {', '.join(allowed_statuses)}"})

    if len(errors) == 0:
        if repo.find_attendance_record(course_id, student_id, session_date):
            errors.append({"field": "session_date", "message": "Attendance record already logged for this student and date"})

    return len(errors) == 0, errors

def validate_attendance_batch(payload, repo):
    errors = []
    if not isinstance(payload, dict):
        return False, [{"field": "body", "message": "Request body must be a JSON object"}]

    course_id = payload.get("course_id")
    if not isinstance(course_id, int) or not repo.find_course_by_id(course_id):
        errors.append({"field": "course_id", "message": "Valid existing course_id is required"})

    session_date = payload.get("session_date")
    if not session_date or not isinstance(session_date, str) or not DATE_REGEX.match(session_date):
        errors.append({"field": "session_date", "message": "Valid session_date in YYYY-MM-DD format is required"})

    records = payload.get("records")
    if not isinstance(records, list) or len(records) == 0:
        errors.append({"field": "records", "message": "Non-empty list of attendance records is required"})
    else:
        for idx, rec in enumerate(records):
            s_id = rec.get("student_id")
            if not isinstance(s_id, int) or not repo.find_student_by_id(s_id):
                errors.append({"field": f"records[{idx}].student_id", "message": f"Invalid student ID: {s_id}"})
            elif isinstance(course_id, int) and not repo.find_enrollment(s_id, course_id):
                errors.append({"field": f"records[{idx}].student_id", "message": f"Student {s_id} is not enrolled in course {course_id}"})
            status = rec.get("status")
            if status not in ["Present", "Absent", "Late", "Excused"]:
                errors.append({"field": f"records[{idx}].status", "message": "Status must be Present, Absent, Late, or Excused"})

    return len(errors) == 0, errors
