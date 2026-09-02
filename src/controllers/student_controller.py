"""
controllers/student_controller.py — Week 5 Task 1: Thin controllers
Takes validated data, calls data layer (models/db.py), returns standardized response (Task 2).
No validation or raw SQL here beyond the data call.
"""
from src.models.db import save_student, get_student, list_students, update_student, delete_student
from src.validation import success_response

# Called only after route's guard clauses passed (request.validatedBody)
def create_student_controller(validated):
    nid = save_student(
        validated["student_id"],
        validated["name"],
        validated["course"],
        validated["year_level"],
        validated.get("email",""),
        validated.get("contact","")
    )
    record = get_student(nid)
    return success_response(record, 201)

def list_students_controller():
    rows = list_students()
    return success_response(rows, 200)

def show_student_controller(id):
    rec = get_student(id)
    if not rec:
        return None  # route will have returned 422 referential already
    return success_response(rec, 200)

def update_student_controller(id, validated):
    update_student(id, validated["name"], validated["course"], validated["year_level"], validated.get("email",""), validated.get("contact",""))
    return success_response(get_student(id), 200)

def delete_student_controller(id):
    delete_student(id)
    return success_response({"deleted": id}, 200)
