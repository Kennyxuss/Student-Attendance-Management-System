"""
HTTP Router and Request Dispatcher for SAMS.
Maps method and path to:
  1. Route Guard & Validator (Returning 422 immediately upon bad input)
  2. Controller (Executing logic strictly on clean, validated data)
Ensures full separation of concerns. Bad input NEVER reaches controllers or triggers 500s.
"""

import re
from src.validation import (
    validate_student_create,
    validate_student_update,
    validate_course_create,
    validate_course_update,
    validate_enrollment_create,
    validate_attendance_create,
    validate_attendance_batch
)
from src.controllers import (
    StudentController,
    CourseController,
    EnrollmentController,
    AttendanceController,
    error_envelope,
    success_envelope
)

class Router:
    def __init__(self, repo):
        self.repo = repo
        self.student_ctrl = StudentController(repo)
        self.course_ctrl = CourseController(repo)
        self.enrollment_ctrl = EnrollmentController(repo)
        self.attendance_ctrl = AttendanceController(repo)

    def dispatch(self, method, path, query_params, body):
        method = method.upper()

        # ---------------- HEALTH ----------------
        if path == "/api/health" and method == "GET":
            return success_envelope({"status": "healthy", "service": "SAMS Core API", "phase": 2})

        # ---------------- SUMMARY REPORT ----------------
        if path == "/api/reports/summary" and method == "GET":
            students = self.repo.get_all_students()
            courses = self.repo.get_all_courses()
            records = self.repo.get_all_attendance()
            rate = 0.0
            if records:
                present = [r for r in records if r.get("status") in ["Present", "Excused"]]
                rate = round((len(present) / len(records)) * 100, 1)
            return success_envelope({
                "total_students": len(students),
                "total_courses": len(courses),
                "total_attendance_logs": len(records),
                "overall_attendance_rate": f"{rate}%"
            })

        # ---------------- STUDENTS CRUD ----------------
        if path == "/api/students":
            if method == "GET":
                search = query_params.get("search", [None])[0] if query_params else None
                return self.student_ctrl.list_students(search)
            elif method == "POST":
                is_valid, errors = validate_student_create(body, self.repo)
                if not is_valid:
                    return error_envelope("Validation failed", details=errors, status_code=422)
                return self.student_ctrl.create_student(body)

        student_match = re.match(r"^/api/students/(\d+)$", path)
        if student_match:
            student_id = int(student_match.group(1))
            if method == "GET":
                return self.student_ctrl.get_student(student_id)
            elif method == "PUT":
                is_valid, errors = validate_student_update(student_id, body, self.repo)
                if not is_valid:
                    status_code = 404 if any(e.get("field") == "id" for e in errors) else 422
                    return error_envelope("Validation failed" if status_code == 422 else "Student not found", details=errors, status_code=status_code)
                return self.student_ctrl.update_student(student_id, body)
            elif method == "DELETE":
                return self.student_ctrl.delete_student(student_id)

        # ---------------- COURSES CRUD ----------------
        if path == "/api/courses":
            if method == "GET":
                return self.course_ctrl.list_courses()
            elif method == "POST":
                is_valid, errors = validate_course_create(body, self.repo)
                if not is_valid:
                    return error_envelope("Validation failed", details=errors, status_code=422)
                return self.course_ctrl.create_course(body)

        course_match = re.match(r"^/api/courses/(\d+)$", path)
        if course_match:
            course_id = int(course_match.group(1))
            if method == "GET":
                return self.course_ctrl.get_course(course_id)
            elif method == "PUT":
                is_valid, errors = validate_course_update(course_id, body, self.repo)
                if not is_valid:
                    status_code = 404 if any(e.get("field") == "id" for e in errors) else 422
                    return error_envelope("Validation failed" if status_code == 422 else "Course not found", details=errors, status_code=status_code)
                return self.course_ctrl.update_course(course_id, body)
            elif method == "DELETE":
                return self.course_ctrl.delete_course(course_id)

        # ---------------- ENROLLMENTS CRUD ----------------
        if path == "/api/enrollments":
            if method == "GET":
                cid = int(query_params.get("course_id", [0])[0]) if query_params and "course_id" in query_params else None
                sid = int(query_params.get("student_id", [0])[0]) if query_params and "student_id" in query_params else None
                return self.enrollment_ctrl.list_enrollments(course_id=cid, student_id=sid)
            elif method == "POST":
                is_valid, errors = validate_enrollment_create(body, self.repo)
                if not is_valid:
                    return error_envelope("Validation failed", details=errors, status_code=422)
                return self.enrollment_ctrl.create_enrollment(body)

        enrollment_match = re.match(r"^/api/enrollments/(\d+)$", path)
        if enrollment_match:
            enrollment_id = int(enrollment_match.group(1))
            if method == "DELETE":
                return self.enrollment_ctrl.delete_enrollment(enrollment_id)

        # ---------------- ATTENDANCE CRUD ----------------
        if path == "/api/attendance":
            if method == "GET":
                cid = int(query_params.get("course_id", [0])[0]) if query_params and "course_id" in query_params else None
                sid = int(query_params.get("student_id", [0])[0]) if query_params and "student_id" in query_params else None
                date = query_params.get("session_date", [None])[0] if query_params and "session_date" in query_params else None
                return self.attendance_ctrl.list_attendance(course_id=cid, student_id=sid, session_date=date)
            elif method == "POST":
                is_valid, errors = validate_attendance_create(body, self.repo)
                if not is_valid:
                    return error_envelope("Validation failed", details=errors, status_code=422)
                return self.attendance_ctrl.record_attendance(body)

        if path == "/api/attendance/batch" and method == "POST":
            is_valid, errors = validate_attendance_batch(body, self.repo)
            if not is_valid:
                return error_envelope("Validation failed", details=errors, status_code=422)
            return self.attendance_ctrl.batch_record_attendance(body)

        attendance_match = re.match(r"^/api/attendance/(\d+)$", path)
        if attendance_match:
            record_id = int(attendance_match.group(1))
            if method == "DELETE":
                return self.attendance_ctrl.delete_attendance(record_id)

        # 404 Route Not Found
        return error_envelope(f"Endpoint '{method} {path}' not found", status_code=404)
