import unittest
import json
from src.repository import Repository
from src.thin_controllers import AttendanceController
from src.pipeline import APIRouter

class TestWeek11Fixes(unittest.TestCase):
    def setUp(self):
        self.repo = Repository(in_memory=True)
        self.attendance_controller = AttendanceController(self.repo)
        self.router = APIRouter()
        self.router.register("POST", "/api/attendance", self.attendance_controller.create)

    def test_rollcall_validates_status(self):
        """QA Edge Case: Rollcall must have a valid status."""
        payload = {
            "course_id": 1,
            "student_id": 1,
            "session_date": "2026-10-03",
            "status": "InvalidStatus"
        }
        status, response = self.router.dispatch("POST", "/api/attendance", payload)
        self.assertEqual(status, 422)
        self.assertIn("status must be one of", response["error"])

if __name__ == '__main__':
    unittest.main()
