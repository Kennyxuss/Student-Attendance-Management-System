import unittest
import json
from src.repository import Repository
from src.router import Router

class TestWeek11Fixes(unittest.TestCase):
    def setUp(self):
        self.repo = Repository(in_memory=True)
        self.router = Router(self.repo)

    def test_rollcall_validates_status(self):
        """QA Edge Case: Rollcall must have a valid status."""
        payload = {
            "course_id": 1,
            "student_id": 1,
            "session_date": "2026-10-03",
            "status": "InvalidStatus"
        }
        status, response = self.router.dispatch("POST", "/api/attendance", {}, payload)
        self.assertEqual(status, 422)
        self.assertIn("status", str(response).lower())

if __name__ == '__main__':
    unittest.main()
