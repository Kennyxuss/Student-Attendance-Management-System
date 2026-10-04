"""
Week 3 — Routing Skeleton & Stub Handlers (Phase 2 AI OFF)
Implements working stub handlers for every CRUD operation.
Adheres to the team-wide standardized response shape:
  {
    "status": int,
    "data": any,
    "error": str | null
  }
No database logic is used here; route parameters (:id) are parsed and echoed back.
"""

import re

def stub_response(status, data=None, error=None):
    return status, {
        "status": status,
        "data": data,
        "error": error
    }

class StubRouter:
    def dispatch(self, method, path, body=None):
        method = method.upper()

        # ---------------- HEALTH (Repo Lead) ----------------
        if path == "/api/health":
            if method == "GET":
                return stub_response(200, data={"message": "healthCheck stub", "service": "SAMS Routing Skeleton", "week": 3})
            return stub_response(405, error=f"Method {method} not allowed on /api/health")

        # ---------------- STUDENTS (Builder 1) ----------------
        if path == "/api/students":
            if method == "GET":
                return stub_response(200, data={"message": "listStudents stub"})
            elif method == "POST":
                return stub_response(201, data={"message": "createStudent stub", "payload": body or {}})
            elif method == "DELETE":
                return stub_response(405, error="Method DELETE not allowed on /api/students. Did you mean /api/students/:id?")
            elif method == "PUT":
                return stub_response(405, error="Method PUT not allowed on /api/students. Did you mean /api/students/:id?")

        m_student = re.match(r"^/api/students/(\d+)$", path)
        if m_student:
            student_id = int(m_student.group(1))
            if method == "GET":
                return stub_response(200, data={"message": "showStudent stub", "id": student_id})
            elif method == "PUT":
                return stub_response(200, data={"message": "updateStudent stub", "id": student_id, "payload": body or {}})
            elif method == "DELETE":
                return stub_response(200, data={"message": "deleteStudent stub", "id": student_id})
            elif method == "POST":
                return stub_response(405, error="Method POST not allowed on /api/students/:id. Did you mean POST /api/students?")

        # ---------------- COURSES (Builder 2) ----------------
        if path == "/api/courses":
            if method == "GET":
                return stub_response(200, data={"message": "listCourses stub"})
            elif method == "POST":
                return stub_response(201, data={"message": "createCourse stub", "payload": body or {}})
            elif method in ["DELETE", "PUT"]:
                return stub_response(405, error=f"Method {method} not allowed on /api/courses without an ID")

        m_course = re.match(r"^/api/courses/(\d+)$", path)
        if m_course:
            course_id = int(m_course.group(1))
            if method == "GET":
                return stub_response(200, data={"message": "showCourse stub", "id": course_id})
            elif method == "PUT":
                return stub_response(200, data={"message": "updateCourse stub", "id": course_id, "payload": body or {}})
            elif method == "DELETE":
                return stub_response(200, data={"message": "deleteCourse stub", "id": course_id})
            elif method == "POST":
                return stub_response(405, error="Method POST not allowed on /api/courses/:id")

        # ---------------- ENROLLMENTS (Scribe) ----------------
        if path == "/api/enrollments":
            if method == "GET":
                return stub_response(200, data={"message": "listEnrollments stub"})
            elif method == "POST":
                return stub_response(201, data={"message": "createEnrollment stub", "payload": body or {}})
            elif method in ["DELETE", "PUT"]:
                return stub_response(405, error=f"Method {method} not allowed on /api/enrollments without an ID")

        m_enroll = re.match(r"^/api/enrollments/(\d+)$", path)
        if m_enroll:
            enroll_id = int(m_enroll.group(1))
            if method == "GET":
                return stub_response(200, data={"message": "showEnrollment stub", "id": enroll_id})
            elif method == "DELETE":
                return stub_response(200, data={"message": "deleteEnrollment stub", "id": enroll_id})
            elif method in ["POST", "PUT"]:
                return stub_response(405, error=f"Method {method} not allowed on /api/enrollments/:id")

        # ---------------- ATTENDANCE (Board Lead) ----------------
        if path == "/api/attendance":
            if method == "GET":
                return stub_response(200, data={"message": "listAttendance stub"})
            elif method == "POST":
                return stub_response(201, data={"message": "createAttendance stub", "payload": body or {}})
            elif method in ["DELETE", "PUT"]:
                return stub_response(405, error=f"Method {method} not allowed on /api/attendance without an ID")

        m_att = re.match(r"^/api/attendance/(\d+)$", path)
        if m_att:
            att_id = int(m_att.group(1))
            if method == "GET":
                return stub_response(200, data={"message": "showAttendance stub", "id": att_id})
            elif method == "PUT":
                return stub_response(200, data={"message": "updateAttendance stub", "id": att_id, "payload": body or {}})
            elif method == "DELETE":
                return stub_response(200, data={"message": "deleteAttendance stub", "id": att_id})
            elif method == "POST":
                return stub_response(405, error="Method POST not allowed on /api/attendance/:id")

        # 404 Route Not Found
        return stub_response(404, error=f"Route not found: {method} {path}")
