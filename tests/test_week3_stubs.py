"""
Automated Test Verification for Week 3 — Routing Skeleton & Stub Handlers.
Verifies:
  1. Every route in the routing table has a working stub handler returning correct status codes (200, 201).
  2. Route parameters (:id) are correctly read and echoed.
  3. Every response conforms strictly to { status, data, error }.
  4. Wrong methods behave sensibly (returning 405 Method Not Allowed).
"""

import unittest
from src.stub_router import StubRouter

class TestWeek3RoutingSkeleton(unittest.TestCase):
    def setUp(self):
        self.router = StubRouter()

    def assert_envelope(self, res, expected_status, has_data=True, has_error=False):
        self.assertIn("status", res)
        self.assertIn("data", res)
        self.assertIn("error", res)
        self.assertEqual(res["status"], expected_status)
        if has_data:
            self.assertIsNotNone(res["data"])
        if has_error:
            self.assertIsNotNone(res["error"])
        else:
            self.assertIsNone(res["error"])

    # --- Student Stubs ---
    def test_students_list_stub(self):
        status, res = self.router.dispatch("GET", "/api/students")
        self.assertEqual(status, 200)
        self.assert_envelope(res, 200)
        self.assertEqual(res["data"]["message"], "listStudents stub")

    def test_students_show_stub_echoes_param(self):
        status, res = self.router.dispatch("GET", "/api/students/42")
        self.assertEqual(status, 200)
        self.assert_envelope(res, 200)
        self.assertEqual(res["data"]["id"], 42)
        self.assertEqual(res["data"]["message"], "showStudent stub")

    def test_students_create_stub(self):
        body = {"first_name": "Elena", "last_name": "Reyes"}
        status, res = self.router.dispatch("POST", "/api/students", body=body)
        self.assertEqual(status, 201)
        self.assert_envelope(res, 201)
        self.assertEqual(res["data"]["message"], "createStudent stub")
        self.assertEqual(res["data"]["payload"]["first_name"], "Elena")

    def test_students_update_stub(self):
        body = {"email": "updated@example.edu"}
        status, res = self.router.dispatch("PUT", "/api/students/42", body=body)
        self.assertEqual(status, 200)
        self.assert_envelope(res, 200)
        self.assertEqual(res["data"]["id"], 42)
        self.assertEqual(res["data"]["payload"]["email"], "updated@example.edu")

    def test_students_delete_stub(self):
        status, res = self.router.dispatch("DELETE", "/api/students/42")
        self.assertEqual(status, 200)
        self.assert_envelope(res, 200)
        self.assertEqual(res["data"]["id"], 42)

    # --- Course Stubs ---
    def test_courses_crud_stubs(self):
        # List
        status, res = self.router.dispatch("GET", "/api/courses")
        self.assertEqual(status, 200)
        self.assert_envelope(res, 200)

        # Show
        status, res = self.router.dispatch("GET", "/api/courses/10")
        self.assertEqual(status, 200)
        self.assertEqual(res["data"]["id"], 10)

        # Create
        status, res = self.router.dispatch("POST", "/api/courses", body={"course_code": "CS-201"})
        self.assertEqual(status, 201)
        self.assertEqual(res["data"]["payload"]["course_code"], "CS-201")

        # Update
        status, res = self.router.dispatch("PUT", "/api/courses/10", body={"room": "Lab 4B"})
        self.assertEqual(status, 200)
        self.assertEqual(res["data"]["id"], 10)

        # Delete
        status, res = self.router.dispatch("DELETE", "/api/courses/10")
        self.assertEqual(status, 200)
        self.assertEqual(res["data"]["id"], 10)

    # --- Enrollment Stubs ---
    def test_enrollments_stubs(self):
        status, res = self.router.dispatch("GET", "/api/enrollments")
        self.assertEqual(status, 200)
        self.assert_envelope(res, 200)

        status, res = self.router.dispatch("POST", "/api/enrollments", body={"student_id": 1, "course_id": 2})
        self.assertEqual(status, 201)
        self.assert_envelope(res, 201)

        status, res = self.router.dispatch("DELETE", "/api/enrollments/5")
        self.assertEqual(status, 200)
        self.assertEqual(res["data"]["id"], 5)

    # --- Attendance Stubs ---
    def test_attendance_stubs(self):
        status, res = self.router.dispatch("GET", "/api/attendance")
        self.assertEqual(status, 200)

        status, res = self.router.dispatch("POST", "/api/attendance", body={"status": "Present"})
        self.assertEqual(status, 201)

        status, res = self.router.dispatch("PUT", "/api/attendance/88", body={"status": "Excused"})
        self.assertEqual(status, 200)
        self.assertEqual(res["data"]["id"], 88)

        status, res = self.router.dispatch("DELETE", "/api/attendance/88")
        self.assertEqual(status, 200)
        self.assertEqual(res["data"]["id"], 88)

    # --- Wrong Methods & Sensible Failures ---
    def test_wrong_method_delete_without_id(self):
        status, res = self.router.dispatch("DELETE", "/api/students")
        self.assertEqual(status, 405)
        self.assert_envelope(res, 405, has_data=False, has_error=True)
        self.assertIn("Did you mean /api/students/:id", res["error"])

    def test_wrong_method_post_with_id(self):
        status, res = self.router.dispatch("POST", "/api/students/10")
        self.assertEqual(status, 405)
        self.assert_envelope(res, 405, has_data=False, has_error=True)

    def test_unknown_route_returns_404(self):
        status, res = self.router.dispatch("GET", "/api/nonexistent")
        self.assertEqual(status, 404)
        self.assert_envelope(res, 404, has_data=False, has_error=True)

if __name__ == "__main__":
    unittest.main()
