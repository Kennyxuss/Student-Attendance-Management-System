"""
controllers/student_controller.py — Week 5 Task 1: Thin controllers

Takes validated data, calls data layer (models/db.py),
and returns standardized responses (Task 2).

No validation or raw SQL here beyond the data-layer calls.
"""

from src.models.db import (
    save_student,
    get_student,
    list_students,
    update_student,
    delete_student
)
from src.validation import success_response


class StudentController:

    def create(self, validated):
        nid = save_student(
            validated["student_id"],
            validated["name"],
            validated["course"],
            validated["year_level"],
            validated.get("email", ""),
            validated.get("contact", "")
        )

        record = get_student(nid)

        return success_response(record, 201)

    def list(self):
        rows = list_students()

        return success_response(rows, 200)

    def show(self, id):
        rec = get_student(id)

        if not rec:
            return None  # route will have returned 422 referential already

        return success_response(rec, 200)

    def update(self, id, validated):
        update_student(
            id,
            validated["name"],
            validated["course"],
            validated["year_level"],
            validated.get("email", ""),
            validated.get("contact", "")
        )

        return success_response(
            get_student(id),
            200
        )

    def delete(self, id):
        delete_student(id)

        return success_response(
            {"deleted": id},
            200
        )
