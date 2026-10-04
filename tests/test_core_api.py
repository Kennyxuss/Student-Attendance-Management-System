"""
Comprehensive Automated Test Suite for Deliverable 2.
Testing:
  1. Happy paths across full CRUD (Students, Courses, Enrollments, Attendance).
  2. Input validation failures (Missing fields, malformed email, duplicates) returning 422.
  3. Edge cases (Whitespace trimming, cascading deletes, non-existent entity links, batch roll call).
Zero third-party test dependencies required (runs via standard library unittest).
"""

import unittest
from src.repository import Repository
from src.router import Router

class SAMSCoreTestSuite(unittest.TestCase):
    def setUp(self):
        # Fresh isolated in-memory repository for each test
        self.repo = Repository()
        self.router = Router(self.repo)

    # ==================== 1. HAPPY PATH TESTS ====================
    def test_01_create_and_fetch_student_happy_path(self):
        payload = {
            "student_id_number": "STU-2026-001",
            "first_name": "Elena",
            "last_name": "Reyes",
            "email": "elena.reyes@example.edu",
            "grade_or_cohort": "CS Sophomore"
        }
        status, res = self.router.dispatch("POST", "/api/students", None, payload)
        self.assertEqual(status, 201)
        self.assertTrue(res["success"])
        self.assertEqual(res["data"]["id"], 1)
        self.assertEqual(res["data"]["first_name"], "Elena")

        # Fetch by ID
        status_get, res_get = self.router.dispatch("GET", "/api/students/1", None, None)
        self.assertEqual(status_get, 200)
        self.assertEqual(res_get["data"]["email"], "elena.reyes@example.edu")

    def test_02_create_and_fetch_course_happy_path(self):
        payload = {
            "course_code": "CS-201",
            "title": "Data Structures & Algorithms",
            "instructor_name": "Dr. Alan Turing",
            "room": "Hall B"
        }
        status, res = self.router.dispatch("POST", "/api/courses", None, payload)
        self.assertEqual(status, 201)
        self.assertTrue(res["success"])
        self.assertEqual(res["data"]["course_code"], "CS-201")

        # List all
        status_list, res_list = self.router.dispatch("GET", "/api/courses", None, None)
        self.assertEqual(status_list, 200)
        self.assertEqual(len(res_list["data"]), 1)

    def test_03_enroll_student_and_record_attendance_happy_path(self):
        # 1. Setup Student & Course
        _, s_res = self.router.dispatch("POST", "/api/students", None, {
            "student_id_number": "STU-001",
            "first_name": "Marcus",
            "last_name": "Chen",
            "email": "marcus@example.edu"
        })
        _, c_res = self.router.dispatch("POST", "/api/courses", None, {
            "course_code": "CS-201",
            "title": "Data Structures",
            "instructor_name": "Prof. Turing"
        })

        # 2. Enroll
        enroll_status, enroll_res = self.router.dispatch("POST", "/api/enrollments", None, {
            "student_id": s_res["data"]["id"],
            "course_id": c_res["data"]["id"]
        })
        self.assertEqual(enroll_status, 201)
        self.assertTrue(enroll_res["success"])

        # 3. Log Attendance
        att_status, att_res = self.router.dispatch("POST", "/api/attendance", None, {
            "student_id": s_res["data"]["id"],
            "course_id": c_res["data"]["id"],
            "session_date": "2026-10-01",
            "status": "Present",
            "remarks": "On time"
        })
        self.assertEqual(att_status, 201)
        self.assertEqual(att_res["data"]["status"], "Present")

    def test_04_batch_roll_call_happy_path(self):
        # Create 2 students and 1 course
        _, s1 = self.router.dispatch("POST", "/api/students", None, {"student_id_number": "S1", "first_name": "A", "last_name": "A", "email": "a@ex.edu"})
        _, s2 = self.router.dispatch("POST", "/api/students", None, {"student_id_number": "S2", "first_name": "B", "last_name": "B", "email": "b@ex.edu"})
        _, c1 = self.router.dispatch("POST", "/api/courses", None, {"course_code": "CS-101", "title": "Intro", "instructor_name": "Prof"})

        self.router.dispatch("POST", "/api/enrollments", None, {"student_id": s1["data"]["id"], "course_id": c1["data"]["id"]})
        self.router.dispatch("POST", "/api/enrollments", None, {"student_id": s2["data"]["id"], "course_id": c1["data"]["id"]})

        batch_payload = {
            "course_id": c1["data"]["id"],
            "session_date": "2026-10-02",
            "recorded_by": "Prof",
            "records": [
                {"student_id": s1["data"]["id"], "status": "Present"},
                {"student_id": s2["data"]["id"], "status": "Late", "remarks": "Bus delay"}
            ]
        }
        status, res = self.router.dispatch("POST", "/api/attendance/batch", None, batch_payload)
        self.assertEqual(status, 201)
        self.assertEqual(res["meta"]["batch_size"], 2)

    # ==================== 2. VALIDATION FAILURES (422) ====================
    def test_05_student_validation_missing_required_fields(self):
        # Empty body
        status, res = self.router.dispatch("POST", "/api/students", None, {})
        self.assertEqual(status, 422)
        self.assertFalse(res["success"])
        fields = [d["field"] for d in res["details"]]
        self.assertIn("student_id_number", fields)
        self.assertIn("first_name", fields)
        self.assertIn("last_name", fields)
        self.assertIn("email", fields)

    def test_06_student_validation_invalid_email_format(self):
        status, res = self.router.dispatch("POST", "/api/students", None, {
            "student_id_number": "STU-001",
            "first_name": "John",
            "last_name": "Doe",
            "email": "not-an-email"
        })
        self.assertEqual(status, 422)
        self.assertIn("Valid email address format is required", [d["message"] for d in res["details"]])

    def test_07_student_validation_duplicate_email_and_id_number(self):
        # Create initial
        self.router.dispatch("POST", "/api/students", None, {
            "student_id_number": "STU-100",
            "first_name": "John",
            "last_name": "Doe",
            "email": "unique@example.edu"
        })

        # Duplicate ID
        status_dup_id, res_id = self.router.dispatch("POST", "/api/students", None, {
            "student_id_number": "STU-100",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "other@example.edu"
        })
        self.assertEqual(status_dup_id, 422)

        # Duplicate Email
        status_dup_mail, res_mail = self.router.dispatch("POST", "/api/students", None, {
            "student_id_number": "STU-101",
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "unique@example.edu"
        })
        self.assertEqual(status_dup_mail, 422)

    def test_08_course_validation_duplicate_code(self):
        self.router.dispatch("POST", "/api/courses", None, {
            "course_code": "CS-101",
            "title": "Intro CS",
            "instructor_name": "Dr. Smith"
        })
        status, res = self.router.dispatch("POST", "/api/courses", None, {
            "course_code": "CS-101",
            "title": "Different Title",
            "instructor_name": "Dr. Jones"
        })
        self.assertEqual(status, 422)
        self.assertEqual(res["details"][0]["field"], "course_code")

    def test_09_attendance_validation_student_not_enrolled(self):
        _, s = self.router.dispatch("POST", "/api/students", None, {"student_id_number": "S1", "first_name": "A", "last_name": "A", "email": "a@ex.edu"})
        _, c = self.router.dispatch("POST", "/api/courses", None, {"course_code": "CS-101", "title": "Intro", "instructor_name": "Prof"})

        # Try to mark attendance without enrolling
        status, res = self.router.dispatch("POST", "/api/attendance", None, {
            "student_id": s["data"]["id"],
            "course_id": c["data"]["id"],
            "session_date": "2026-10-01",
            "status": "Present"
        })
        self.assertEqual(status, 422)
        self.assertIn("Student is not enrolled in this course", [d["message"] for d in res["details"]])

    def test_10_attendance_validation_invalid_status_enum(self):
        _, s = self.router.dispatch("POST", "/api/students", None, {"student_id_number": "S1", "first_name": "A", "last_name": "A", "email": "a@ex.edu"})
        _, c = self.router.dispatch("POST", "/api/courses", None, {"course_code": "CS-101", "title": "Intro", "instructor_name": "Prof"})
        self.router.dispatch("POST", "/api/enrollments", None, {"student_id": s["data"]["id"], "course_id": c["data"]["id"]})

        status, res = self.router.dispatch("POST", "/api/attendance", None, {
            "student_id": s["data"]["id"],
            "course_id": c["data"]["id"],
            "session_date": "2026-10-01",
            "status": "NotSure"  # Invalid status
        })
        self.assertEqual(status, 422)

    # ==================== 3. EDGE CASES ====================
    def test_11_cascading_delete_student_purges_attendance_and_enrollment(self):
        _, s = self.router.dispatch("POST", "/api/students", None, {"student_id_number": "S1", "first_name": "A", "last_name": "A", "email": "a@ex.edu"})
        _, c = self.router.dispatch("POST", "/api/courses", None, {"course_code": "CS-101", "title": "Intro", "instructor_name": "Prof"})
        self.router.dispatch("POST", "/api/enrollments", None, {"student_id": s["data"]["id"], "course_id": c["data"]["id"]})
        self.router.dispatch("POST", "/api/attendance", None, {"student_id": s["data"]["id"], "course_id": c["data"]["id"], "session_date": "2026-10-01", "status": "Present"})

        # Delete student
        del_status, _ = self.router.dispatch("DELETE", f"/api/students/{s['data']['id']}", None, None)
        self.assertEqual(del_status, 200)

        # Check cascading cleanup
        _, enrollments = self.router.dispatch("GET", "/api/enrollments", None, None)
        self.assertEqual(len(enrollments["data"]), 0)

        _, att_records = self.router.dispatch("GET", "/api/attendance", None, None)
        self.assertEqual(len(att_records["data"]), 0)

    def test_12_non_existent_resource_returns_404(self):
        status, res = self.router.dispatch("GET", "/api/students/9999", None, None)
        self.assertEqual(status, 404)
        self.assertFalse(res["success"])

        status_c, _ = self.router.dispatch("GET", "/api/courses/9999", None, None)
        self.assertEqual(status_c, 404)

        status_unknown, _ = self.router.dispatch("GET", "/api/nonexistent", None, None)
        self.assertEqual(status_unknown, 404)

    def test_13_whitespace_normalization(self):
        status, res = self.router.dispatch("POST", "/api/students", None, {
            "student_id_number": "  STU-TRIM-01  ",
            "first_name": "  TrimmedFirst  ",
            "last_name": "  TrimmedLast  ",
            "email": "  user@domain.com  "
        })
        self.assertEqual(status, 201)
        self.assertEqual(res["data"]["student_id_number"], "STU-TRIM-01")
        self.assertEqual(res["data"]["first_name"], "TrimmedFirst")
        self.assertEqual(res["data"]["email"], "user@domain.com")

if __name__ == "__main__":
    unittest.main()
