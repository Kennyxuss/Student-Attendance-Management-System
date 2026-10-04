"""
Week 5 Unified Pipeline: Route -> Guard Validation -> Thin Controller.
Wires every endpoint strictly through early-exit validation before reaching thin controllers.
"""

from src.guards import (
    guard_student_create,
    guard_student_update,
    guard_course_create,
    guard_enrollment_create,
    guard_attendance_create,
    guard_admin,
    guard_instructor_or_admin
)
from src.thin_controllers import (
    StudentController,
    CourseController,
    EnrollmentController,
    AttendanceController
)
import re

class AppPipeline:
    def __init__(self, repo):
        self.repo = repo
        self.students = StudentController(repo)
        self.courses = CourseController(repo)
        self.enrollments = EnrollmentController(repo)
        self.attendance = AttendanceController(repo)

    def handle(self, method, path, headers=None, body=None):
        method = method.upper()
        headers = headers or {}
        body = body or {}

        # ---------------- STUDENTS ----------------
        if path == "/api/students":
            if method == "GET":
                return self.students.list()
            elif method == "POST":
                # 1. Validation Guard
                valid, err = guard_student_create(body, self.repo)
                if not valid:
                    return err
                # 2. Thin Controller
                return self.students.create(body)

        m_stud = re.match(r"^/api/students/(\d+)$", path)
        if m_stud:
            sid = int(m_stud.group(1))
            if method == "GET":
                return self.students.show(sid)
            elif method == "PUT":
                valid, err = guard_student_update(sid, body, self.repo)
                if not valid:
                    return err
                return self.students.update(sid, body)
            elif method == "DELETE":
                # Auth Guard
                auth_ok, auth_err = guard_admin(headers)
                if not auth_ok:
                    return auth_err
                return self.students.delete(sid)

        # ---------------- COURSES ----------------
        if path == "/api/courses":
            if method == "GET":
                return self.courses.list()
            elif method == "POST":
                valid, err = guard_course_create(body, self.repo)
                if not valid:
                    return err
                return self.courses.create(body)

        m_course = re.match(r"^/api/courses/(\d+)$", path)
        if m_course:
            cid = int(m_course.group(1))
            if method == "GET":
                return self.courses.show(cid)
            elif method == "DELETE":
                auth_ok, auth_err = guard_admin(headers)
                if not auth_ok:
                    return auth_err
                return self.courses.delete(cid)

        # ---------------- ENROLLMENTS ----------------
        if path == "/api/enrollments":
            if method == "GET":
                return self.enrollments.list()
            elif method == "POST":
                valid, err = guard_enrollment_create(body, self.repo)
                if not valid:
                    return err
                return self.enrollments.create(body)

        m_enr = re.match(r"^/api/enrollments/(\d+)$", path)
        if m_enr:
            eid = int(m_enr.group(1))
            if method == "GET":
                return self.enrollments.show(eid)
            elif method == "DELETE":
                return self.enrollments.delete(eid)

        # ---------------- ATTENDANCE ----------------
        if path == "/api/attendance":
            if method == "GET":
                return self.attendance.list()
            elif method == "POST":
                valid, err = guard_attendance_create(body, self.repo)
                if not valid:
                    return err
                return self.attendance.create(body)

        m_att = re.match(r"^/api/attendance/(\d+)$", path)
        if m_att:
            aid = int(m_att.group(1))
            if method == "GET":
                return self.attendance.show(aid)
            elif method == "DELETE":
                auth_ok, auth_err = guard_instructor_or_admin(headers)
                if not auth_ok:
                    return auth_err
                return self.attendance.delete(aid)

        return 404, {"status": 404, "error": f"Route not found: {method} {path}", "field": None}
