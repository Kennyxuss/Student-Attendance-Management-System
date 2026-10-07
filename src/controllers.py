"""
Thin Controllers for SAMS.
Executes business logic strictly on pre-validated data and returns standardized envelopes.
Zero request parsing or raw schema validation happens here.
"""

def success_envelope(data, meta=None, status_code=200):
    payload = {"success": True, "data": data}
    if meta is not None:
        payload["meta"] = meta
    return status_code, payload

def error_envelope(message, details=None, status_code=400):
    payload = {"success": False, "error": message}
    if details is not None:
        payload["details"] = details
    return status_code, payload

# ==================== STUDENT CONTROLLER ====================
class StudentController:
    def __init__(self, repo):
        self.repo = repo

    def list_students(self, search_query=None):
        students = self.repo.get_all_students()
        if search_query:
            q = search_query.lower()
            students = [
                s for s in students
                if q in s["first_name"].lower()
                or q in s["last_name"].lower()
                or q in s["student_id_number"].lower()
                or q in s["email"].lower()
            ]
        return success_envelope(students, meta={"count": len(students)})

    def get_student(self, student_id):
        student = self.repo.find_student_by_id(student_id)
        if not student:
            return error_envelope("Student not found", status_code=404)
        return success_envelope(student)

    def create_student(self, validated_data):
        created = self.repo.create_student({
            "student_id_number": validated_data["student_id_number"].strip(),
            "first_name": validated_data["first_name"].strip(),
            "last_name": validated_data["last_name"].strip(),
            "email": validated_data["email"].strip().lower(),
            "grade_or_cohort": validated_data.get("grade_or_cohort", ""),
            "status": validated_data.get("status", "Active")
        })
        return success_envelope(created, status_code=201)

    def update_student(self, student_id, validated_data):
        existing = self.repo.find_student_by_id(student_id)
        if not existing:
            return error_envelope("Student not found", status_code=404)
        merged = {**existing, **validated_data}
        updated = self.repo.update_student(student_id, merged)
        return success_envelope(updated)

    def delete_student(self, student_id):
        deleted = self.repo.delete_student(student_id)
        if not deleted:
            return error_envelope("Student not found", status_code=404)
        return success_envelope({"message": f"Student {student_id} and associated references deleted"})

# ==================== COURSE CONTROLLER ====================
class CourseController:
    def __init__(self, repo):
        self.repo = repo

    def list_courses(self):
        courses = self.repo.get_all_courses()
        return success_envelope(courses, meta={"count": len(courses)})

    def get_course(self, course_id):
        course = self.repo.find_course_by_id(course_id)
        if not course:
            return error_envelope("Course not found", status_code=404)
        return success_envelope(course)

    def create_course(self, validated_data):
        created = self.repo.create_course({
            "course_code": validated_data["course_code"].strip().upper(),
            "title": validated_data["title"].strip(),
            "instructor_name": validated_data["instructor_name"].strip(),
            "term_semester": validated_data.get("term_semester", "Fall 2026"),
            "schedule_time": validated_data.get("schedule_time", "TBD"),
            "room": validated_data.get("room", "TBD"),
            "is_active": validated_data.get("is_active", True)
        })
        return success_envelope(created, status_code=201)

    def update_course(self, course_id, validated_data):
        existing = self.repo.find_course_by_id(course_id)
        if not existing:
            return error_envelope("Course not found", status_code=404)
        merged = {**existing, **validated_data}
        updated = self.repo.update_course(course_id, merged)
        return success_envelope(updated)

    def delete_course(self, course_id):
        deleted = self.repo.delete_course(course_id)
        if not deleted:
            return error_envelope("Course not found", status_code=404)
        return success_envelope({"message": f"Course {course_id} and associated references deleted"})

# ==================== ENROLLMENT CONTROLLER ====================
class EnrollmentController:
    def __init__(self, repo):
        self.repo = repo

    def list_enrollments(self, course_id=None, student_id=None):
        enrollments = self.repo.get_all_enrollments()
        if course_id:
            enrollments = [e for e in enrollments if e["course_id"] == course_id]
        if student_id:
            enrollments = [e for e in enrollments if e["student_id"] == student_id]
        return success_envelope(enrollments, meta={"count": len(enrollments)})

    def create_enrollment(self, validated_data):
        created = self.repo.create_enrollment({
            "student_id": validated_data["student_id"],
            "course_id": validated_data["course_id"],
            "enrollment_date": validated_data.get("enrollment_date", "2026-09-01"),
            "status": validated_data.get("status", "Enrolled")
        })
        return success_envelope(created, status_code=201)

    def delete_enrollment(self, enrollment_id):
        deleted = self.repo.delete_enrollment(enrollment_id)
        if not deleted:
            return error_envelope("Enrollment not found", status_code=404)
        return success_envelope({"message": f"Enrollment {enrollment_id} deleted"})

# ==================== ATTENDANCE CONTROLLER ====================
class AttendanceController:
    def __init__(self, repo):
        self.repo = repo

    def list_attendance(self, course_id=None, student_id=None, session_date=None):
        records = self.repo.get_all_attendance()
        if course_id:
            records = [r for r in records if r["course_id"] == course_id]
        if student_id:
            records = [r for r in records if r["student_id"] == student_id]
        if session_date:
            records = [r for r in records if r["session_date"] == session_date]
        return success_envelope(records, meta={"count": len(records)})

    def record_attendance(self, validated_data):
        created = self.repo.create_attendance({
            "course_id": validated_data["course_id"],
            "student_id": validated_data["student_id"],
            "session_date": validated_data["session_date"],
            "status": validated_data["status"],
            "remarks": validated_data.get("remarks", ""),
            "recorded_by": validated_data.get("recorded_by", "Instructor")
        })
        return success_envelope(created, status_code=201)

    def batch_record_attendance(self, validated_data):
        course_id = validated_data["course_id"]
        session_date = validated_data["session_date"]
        recorded_by = validated_data.get("recorded_by", "Instructor")
        created_records = []

        for rec in validated_data["records"]:
            # If already exists for this date, update status; otherwise create
            existing = self.repo.find_attendance_record(course_id, rec["student_id"], session_date)
            entry = {
                "course_id": course_id,
                "student_id": rec["student_id"],
                "session_date": session_date,
                "status": rec["status"],
                "remarks": rec.get("remarks", ""),
                "recorded_by": recorded_by
            }
            if existing:
                res = self.repo.update_attendance(existing["id"], entry)
            else:
                res = self.repo.create_attendance(entry)
            created_records.append(res)

        return success_envelope(created_records, meta={"batch_size": len(created_records)}, status_code=201)

    def delete_attendance(self, record_id):
        deleted = self.repo.delete_attendance(record_id)
        if not deleted:
            return error_envelope("Attendance record not found", status_code=404)
        return success_envelope({"message": f"Attendance record {record_id} deleted"})
