"""
Week 5 Automated Test Suite: Controllers, Tests & The Checkpoint.
Uses the Arrange-Act-Assert pattern for every controller:
  1. Happy-path test (asserting 200/201 and data envelope)
  2. Validation-failure test (asserting 422 and field-level error)
  3. Edge-case test (asserting 404, cascades, or authorization 403)
Meaningful assertions throughout — zero filler expect(True).
"""

import unittest
from src.repository import Repository
from src.pipeline import AppPipeline

class TestWeek5ControllersAndPipeline(unittest.TestCase):
    def setUp(self):
        # Fresh isolated repository & pipeline
        self.repo = Repository()
        self.app = AppPipeline(self.repo)

    # ==================== 1. STUDENT CONTROLLER TESTS ====================
    def test_student_controller_happy_path(self):
        # Arrange
        body = {
            "student_id_number": "STU-501",
            "first_name": "Elena",
            "last_name": "Reyes",
            "email": "elena.reyes@example.edu",
            "grade_or_cohort": "CS Sophomore"
        }
        # Act
        status, res = self.app.handle("POST", "/api/students", body=body)
        # Assert
        self.assertEqual(status, 201)
        self.assertEqual(res["status"], 201)
        self.assertEqual(res["data"]["id"], 1)
        self.assertEqual(res["data"]["email"], "elena.reyes@example.edu")

    def test_student_controller_validation_failure(self):
        # Arrange (Missing required first_name)
        body = {
            "student_id_number": "STU-502",
            "last_name": "Reyes",
            "email": "missing.first@example.edu"
        }
        # Act
        status, res = self.app.handle("POST", "/api/students", body=body)
        # Assert
        self.assertEqual(status, 422)
        self.assertEqual(res["field"], "first_name")
        self.assertIn("first_name is required", res["error"])

    def test_student_controller_edge_case_delete_auth_and_cascade(self):
        # Arrange
        s = self.repo.create_student({"student_id_number": "S1", "first_name": "A", "last_name": "B", "email": "a@b.com"})
        
        # Act 1: Unauthorized delete (Student role)
        status_unauth, res_unauth = self.app.handle("DELETE", f"/api/students/{s['id']}", headers={"X-User-Role": "Student"})
        # Assert 1
        self.assertEqual(status_unauth, 403)
        self.assertEqual(res_unauth["field"], "authorization")

        # Act 2: Authorized delete (Admin role)
        status_auth, res_auth = self.app.handle("DELETE", f"/api/students/{s['id']}", headers={"X-User-Role": "Admin"})
        # Assert 2
        self.assertEqual(status_auth, 200)
        self.assertIn("deleted successfully", res_auth["data"]["message"])

    # ==================== 2. COURSE CONTROLLER TESTS ====================
    def test_course_controller_happy_path(self):
        # Arrange
        body = {
            "course_code": "CS-201",
            "title": "Data Structures & Algorithms",
            "instructor_name": "Dr. Alan Turing"
        }
        # Act
        status, res = self.app.handle("POST", "/api/courses", body=body)
        # Assert
        self.assertEqual(status, 201)
        self.assertEqual(res["data"]["course_code"], "CS-201")
        self.assertEqual(res["data"]["instructor_name"], "Dr. Alan Turing")

    def test_course_controller_validation_failure_duplicate_code(self):
        # Arrange
        self.repo.create_course({"course_code": "CS-201", "title": "DS", "instructor_name": "Prof"})
        dup_body = {"course_code": "CS-201", "title": "Another DS", "instructor_name": "Other"}
        # Act
        status, res = self.app.handle("POST", "/api/courses", body=dup_body)
        # Assert
        self.assertEqual(status, 422)
        self.assertEqual(res["field"], "course_code")
        self.assertIn("already exists", res["error"])

    def test_course_controller_edge_case_show_non_existent(self):
        # Arrange
        non_existent_id = 999
        # Act
        status, res = self.app.handle("GET", f"/api/courses/{non_existent_id}")
        # Assert
        self.assertEqual(status, 404)
        self.assertEqual(res["field"], "id")
        self.assertEqual(res["error"], "Course not found")

    # ==================== 3. ENROLLMENT CONTROLLER TESTS ====================
    def test_enrollment_controller_happy_path(self):
        # Arrange
        s = self.repo.create_student({"student_id_number": "S1", "first_name": "Elena", "last_name": "R", "email": "e@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        body = {"student_id": s["id"], "course_id": c["id"]}
        # Act
        status, res = self.app.handle("POST", "/api/enrollments", body=body)
        # Assert
        self.assertEqual(status, 201)
        self.assertEqual(res["data"]["student_id"], s["id"])
        self.assertEqual(res["data"]["course_id"], c["id"])

    def test_enrollment_controller_validation_failure_duplicate_enrollment(self):
        # Arrange
        s = self.repo.create_student({"student_id_number": "S1", "first_name": "Elena", "last_name": "R", "email": "e@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        self.repo.create_enrollment({"student_id": s["id"], "course_id": c["id"]})
        # Act: Enroll again
        status, res = self.app.handle("POST", "/api/enrollments", body={"student_id": s["id"], "course_id": c["id"]})
        # Assert
        self.assertEqual(status, 422)
        self.assertEqual(res["field"], "enrollment")
        self.assertIn("already enrolled", res["error"])

    def test_enrollment_controller_edge_case_delete_non_existent(self):
        # Arrange & Act
        status, res = self.app.handle("DELETE", "/api/enrollments/8888")
        # Assert
        self.assertEqual(status, 404)
        self.assertEqual(res["error"], "Enrollment not found")

    # ==================== 4. ATTENDANCE CONTROLLER TESTS ====================
    def test_attendance_controller_happy_path(self):
        # Arrange
        s = self.repo.create_student({"student_id_number": "S1", "first_name": "Elena", "last_name": "R", "email": "e@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        self.repo.create_enrollment({"student_id": s["id"], "course_id": c["id"]})
        body = {
            "course_id": c["id"],
            "student_id": s["id"],
            "session_date": "2026-10-05",
            "status": "Present",
            "remarks": "Active participation"
        }
        # Act
        status, res = self.app.handle("POST", "/api/attendance", body=body)
        # Assert
        self.assertEqual(status, 201)
        self.assertEqual(res["data"]["status"], "Present")
        self.assertEqual(res["data"]["session_date"], "2026-10-05")

    def test_attendance_controller_validation_failure_invalid_date(self):
        # Arrange
        s = self.repo.create_student({"student_id_number": "S1", "first_name": "Elena", "last_name": "R", "email": "e@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        self.repo.create_enrollment({"student_id": s["id"], "course_id": c["id"]})
        body = {
            "course_id": c["id"],
            "student_id": s["id"],
            "session_date": "not-a-date",
            "status": "Present"
        }
        # Act
        status, res = self.app.handle("POST", "/api/attendance", body=body)
        # Assert
        self.assertEqual(status, 422)
        self.assertEqual(res["field"], "session_date")
        self.assertIn("YYYY-MM-DD", res["error"])

    def test_attendance_controller_edge_case_delete_auth(self):
        # Arrange
        s = self.repo.create_student({"student_id_number": "S1", "first_name": "Elena", "last_name": "R", "email": "e@b.com"})
        c = self.repo.create_course({"course_code": "CS-101", "title": "Intro", "instructor_name": "Dr. T"})
        self.repo.create_enrollment({"student_id": s["id"], "course_id": c["id"]})
        att = self.repo.create_attendance({"course_id": c["id"], "student_id": s["id"], "session_date": "2026-10-05", "status": "Present"})

        # Act 1: Unauthorized delete
        status_unauth, _ = self.app.handle("DELETE", f"/api/attendance/{att['id']}", headers={"X-User-Role": "Student"})
        # Assert 1
        self.assertEqual(status_unauth, 403)

        # Act 2: Authorized delete (Instructor role)
        status_auth, res_auth = self.app.handle("DELETE", f"/api/attendance/{att['id']}", headers={"X-User-Role": "Instructor"})
        # Assert 2
        self.assertEqual(status_auth, 200)
        self.assertIn("deleted successfully", res_auth["data"]["message"])

if __name__ == "__main__":
    unittest.main()
