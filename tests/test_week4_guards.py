"""
Week 4 Automated Test Suite: Validating & Defending Your Routes.
Executes the Break-It Log:
  1. Missing required field -> 422
  2. Wrong type -> 422
  3. Out-of-range value -> 422
  4. Forbidden action without authorization header -> 403
  5. Referential integrity violations (non-existent foreign keys, unenrolled attendance) -> 422
  6. Standard error shape validation: {"status", "error", "field"}
"""

import unittest
from src.repository import Repository
from src.guards import (
    guard_student_create,
    guard_student_update,
    guard_course_create,
    guard_enrollment_create,
    guard_attendance_create,
    guard_admin,
    guard_instructor_or_admin
)

class TestWeek4ValidationAndDefenses(unittest.TestCase):
    def setUp(self):
        self.repo = Repository()

    def assert_standard_error(self, err_resp, expected_status, expected_field=None):
        status, body = err_resp
        self.assertEqual(status, expected_status)
        self.assertEqual(body["status"], expected_status)
        self.assertIn("error", body)
        self.assertIn("field", body)
        self.assertIsInstance(body["error"], str)
        if expected_field:
            self.assertEqual(body["field"], expected_field)

    # 1. Missing required field -> 422
    def test_missing_required_email(self):
        body = {"student_id_number": "STU-001", "first_name": "Elena", "last_name": "Reyes"}
        valid, err = guard_student_create(body, self.repo)
        self.assertFalse(valid)
        self.assert_standard_error(err, 422, "email")

    # 2. Wrong type -> 422
    def test_wrong_type_first_name_as_number(self):
        body = {"student_id_number": "STU-001", "first_name": 12345, "last_name": "Reyes", "email": "a@b.com"}
        valid, err = guard_student_create(body, self.repo)
        self.assertFalse(valid)
        self.assert_standard_error(err, 422, "first_name")

    # 3. Out-of-range value -> 422
    def test_out_of_range_student_id_number(self):
        body = {"student_id_number": "AB", "first_name": "Elena", "last_name": "Reyes", "email": "a@b.com"}
        valid, err = guard_student_create(body, self.repo)
        self.assertFalse(valid)
        self.assert_standard_error(err, 422, "student_id_number")

    # 4. Forbidden action -> 403
    def test_authorization_guard_admin_forbidden(self):
        headers = {"X-User-Role": "Student"}
        valid, err = guard_admin(headers)
        self.assertFalse(valid)
        self.assert_standard_error(err, 403, "authorization")
        self.assertIn("Forbidden", err[1]["error"])

    def test_authorization_guard_admin_permitted(self):
        headers = {"X-User-Role": "Admin"}
        valid, err = guard_admin(headers)
        self.assertTrue(valid)
        self.assertIsNone(err)

    def test_authorization_guard_instructor_permitted(self):
        headers = {"X-User-Role": "Instructor"}
        valid, err = guard_instructor_or_admin(headers)
        self.assertTrue(valid)
        self.assertIsNone(err)

    # 5. Referential integrity guard -> 422
    def test_enrollment_with_non_existent_student_returns_422(self):
        body = {"student_id": 9999, "course_id": 1}
        valid, err = guard_enrollment_create(body, self.repo)
        self.assertFalse(valid)
        self.assert_standard_error(err, 422, "student_id")

    # 6. Domain attendance guard: Unenrolled student cannot have attendance marked -> 422
    def test_attendance_student_not_enrolled_returns_422(self):
        s = self.repo.create_student({"student_id_number": "STU-001", "first_name": "A", "last_name": "B", "email": "a@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        body = {"student_id": s["id"], "course_id": c["id"], "session_date": "2026-10-01", "status": "Present"}
        valid, err = guard_attendance_create(body, self.repo)
        self.assertFalse(valid)
        self.assert_standard_error(err, 422, "student_id")
        self.assertIn("not enrolled", err[1]["error"])

    # 7. Invalid enum value -> 422
    def test_attendance_invalid_status_enum(self):
        s = self.repo.create_student({"student_id_number": "STU-001", "first_name": "A", "last_name": "B", "email": "a@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        self.repo.create_enrollment({"student_id": s["id"], "course_id": c["id"]})
        body = {"student_id": s["id"], "course_id": c["id"], "session_date": "2026-10-01", "status": "Hungry"}
        valid, err = guard_attendance_create(body, self.repo)
        self.assertFalse(valid)
        self.assert_standard_error(err, 422, "status")

if __name__ == "__main__":
    unittest.main()
