"""
Week 5 — Thin Controllers for SAMS (Phase 2 AI OFF)
Follows strict separation of concerns:
  1. Receives already-validated data (validation passed in Week 4 guards).
  2. Calls data persistence layer (Repository).
  3. Returns standardized success response:
       { "status": int, "data": { ...record... } }
Controllers are thin: NO validation or raw storage mechanics stuffed inside.
"""

def success_response(status, data):
    return status, {
        "status": status,
        "data": data
    }

# ==================== STUDENT CONTROLLER (Builder 1) ====================
class StudentController:
    def __init__(self, repo):
        self.repo = repo

    def list(self, search=None):
        students = self.repo.get_all_students()
        if search:
            q = search.lower()
            students = [
                s for s in students
                if q in s["first_name"].lower()
                or q in s["last_name"].lower()
                or q in s["student_id_number"].lower()
                or q in s["email"].lower()
            ]
        return success_response(200, students)

    def show(self, student_id):
        student = self.repo.find_student_by_id(student_id)
        if not student:
            return 404, {"status": 404, "error": "Student not found", "field": "id"}
        return success_response(200, student)

    def create(self, validated_body):
        # Thin: strictly persists clean, validated data
        created = self.repo.create_student({
            "student_id_number": validated_body["student_id_number"].strip(),
            "first_name": validated_body["first_name"].strip(),
            "last_name": validated_body["last_name"].strip(),
            "email": validated_body["email"].strip().lower(),
            "grade_or_cohort": validated_body.get("grade_or_cohort", ""),
            "status": validated_body.get("status", "Active")
        })
        return success_response(201, created)

    def update(self, student_id, validated_body):
        existing = self.repo.find_student_by_id(student_id)
        if not existing:
            return 404, {"status": 404, "error": "Student not found", "field": "id"}
        merged = {**existing, **validated_body}
        updated = self.repo.update_student(student_id, merged)
        return success_response(200, updated)

    def delete(self, student_id):
        deleted = self.repo.delete_student(student_id)
        if not deleted:
            return 404, {"status": 404, "error": "Student not found", "field": "id"}
        return success_response(200, {"message": f"Student {student_id} deleted successfully"})

# ==================== COURSE CONTROLLER (Builder 2) ====================
class CourseController:
    def __init__(self, repo):
        self.repo = repo

    def list(self):
        courses = self.repo.get_all_courses()
        return success_response(200, courses)

    def show(self, course_id):
        course = self.repo.find_course_by_id(course_id)
        if not course:
            return 404, {"status": 404, "error": "Course not found", "field": "id"}
        return success_response(200, course)

    def create(self, validated_body):
        created = self.repo.create_course({
            "course_code": validated_body["course_code"].strip().upper(),
            "title": validated_body["title"].strip(),
            "instructor_name": validated_body["instructor_name"].strip(),
            "term_semester": validated_body.get("term_semester", "Fall 2026"),
            "schedule_time": validated_body.get("schedule_time", "TBD"),
            "room": validated_body.get("room", "TBD"),
            "is_active": validated_body.get("is_active", True)
        })
        return success_response(201, created)

    def update(self, course_id, validated_body):
        existing = self.repo.find_course_by_id(course_id)
        if not existing:
            return 404, {"status": 404, "error": "Course not found", "field": "id"}
        merged = {**existing, **validated_body}
        updated = self.repo.update_course(course_id, merged)
        return success_response(200, updated)

    def delete(self, course_id):
        deleted = self.repo.delete_course(course_id)
        if not deleted:
            return 404, {"status": 404, "error": "Course not found", "field": "id"}
        return success_response(200, {"message": f"Course {course_id} deleted successfully"})

# ==================== ENROLLMENT CONTROLLER (Scribe) ====================
class EnrollmentController:
    def __init__(self, repo):
        self.repo = repo

    def list(self, course_id=None, student_id=None):
        enrollments = self.repo.get_all_enrollments()
        if course_id:
            enrollments = [e for e in enrollments if e["course_id"] == course_id]
        if student_id:
            enrollments = [e for e in enrollments if e["student_id"] == student_id]
        return success_response(200, enrollments)

    def show(self, enrollment_id):
        enrollment = self.repo.find_enrollment_by_id(enrollment_id)
        if not enrollment:
            return 404, {"status": 404, "error": "Enrollment not found", "field": "id"}
        return success_response(200, enrollment)

    def create(self, validated_body):
        created = self.repo.create_enrollment({
            "student_id": validated_body["student_id"],
            "course_id": validated_body["course_id"],
            "enrollment_date": validated_body.get("enrollment_date", "2026-09-01"),
            "status": validated_body.get("status", "Enrolled")
        })
        return success_response(201, created)

    def delete(self, enrollment_id):
        deleted = self.repo.delete_enrollment(enrollment_id)
        if not deleted:
            return 404, {"status": 404, "error": "Enrollment not found", "field": "id"}
        return success_response(200, {"message": f"Enrollment {enrollment_id} deleted successfully"})

# ==================== ATTENDANCE CONTROLLER (Board Lead) ====================
class AttendanceController:
    def __init__(self, repo):
        self.repo = repo

    def list(self, course_id=None, student_id=None, session_date=None):
        records = self.repo.get_all_attendance()
        if course_id:
            records = [r for r in records if r["course_id"] == course_id]
        if student_id:
            records = [r for r in records if r["student_id"] == student_id]
        if session_date:
            records = [r for r in records if r["session_date"] == session_date]
        return success_response(200, records)

    def show(self, record_id):
        record = self.repo.find_attendance_by_id(record_id)
        if not record:
            return 404, {"status": 404, "error": "Attendance record not found", "field": "id"}
        return success_response(200, record)

    def create(self, validated_body):
        created = self.repo.create_attendance({
            "course_id": validated_body["course_id"],
            "student_id": validated_body["student_id"],
            "session_date": validated_body["session_date"],
            "status": validated_body["status"],
            "remarks": validated_body.get("remarks", ""),
            "recorded_by": validated_body.get("recorded_by", "Instructor")
        })
        return success_response(201, created)

    def update(self, record_id, validated_body):
        existing = self.repo.find_attendance_by_id(record_id)
        if not existing:
            return 404, {"status": 404, "error": "Attendance record not found", "field": "id"}
        merged = {**existing, **validated_body}
        updated = self.repo.update_attendance(record_id, merged)
        return success_response(200, updated)

    def delete(self, record_id):
        deleted = self.repo.delete_attendance(record_id)
        if not deleted:
            return 404, {"status": 404, "error": "Attendance record not found", "field": "id"}
        return success_response(200, {"message": f"Attendance record {record_id} deleted successfully"})
