import unittest
from src.repository import Repository
from src.thin_controllers import StudentController, CourseController

class TestQAEdgeCases(unittest.TestCase):
    def setUp(self):
        self.repo = Repository(in_memory=True)
        self.student_controller = StudentController(self.repo)
        self.course_controller = CourseController(self.repo)

    def test_delete_nonexistent_student_returns_404(self):
        """QA Edge Case: Deleting a record that doesn't exist should cleanly return a 404."""
        status, response = self.student_controller.delete(9999)
        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "Student not found")

    def test_update_nonexistent_course_returns_404(self):
        """QA Edge Case: Updating a deleted/non-existent course should return 404."""
        status, response = self.course_controller.update(9999, {"title": "Ghost Course"})
        self.assertEqual(status, 404)
        self.assertEqual(response["error"], "Course not found")

    def test_course_controller_strips_whitespace_and_uppercases_code(self):
        """QA Boundary: Ensure dirty inputs are cleaned before persistence."""
        payload = {
            "course_code": "  cs-101  ",
            "title": "  Intro to CS  ",
            "instructor_name": "Turing"
        }
        status, response = self.course_controller.create(payload)
        self.assertEqual(status, 201)
        # Should be uppercased and stripped
        self.assertEqual(response["data"]["course_code"], "CS-101")
        # Should be stripped
        self.assertEqual(response["data"]["title"], "Intro to CS")

    def test_student_controller_forces_lowercase_email(self):
        """QA Boundary: Emails must always be forced lowercase."""
        payload = {
            "student_id_number": "001",
            "first_name": "Alan",
            "last_name": "Turing",
            "email": "ALAN.TURING@EXAMPLE.COM"
        }
        status, response = self.student_controller.create(payload)
        self.assertEqual(status, 201)
        self.assertEqual(response["data"]["email"], "alan.turing@example.com")

if __name__ == '__main__':
    unittest.main()
