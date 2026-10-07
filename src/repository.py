"""
Repository and Persistence Layer for SAMS.
Handles in-memory data store with thread-safe atomic operations and optional JSON persistence.
Isolated strictly from HTTP routes, validation, and controllers.
"""

import copy
import json
import os
import threading

class Repository:
    def __init__(self, storage_path=None, in_memory=False):
        self.lock = threading.Lock()
        self.storage_path = None if in_memory else storage_path
        self._data = {
            "students": [],
            "courses": [],
            "enrollments": [],
            "attendance_records": []
        }
        if self.storage_path and os.path.exists(self.storage_path):
            self.load()

    def load(self):
        try:
            with open(self.storage_path, 'r', encoding='utf-8') as f:
                loaded = json.load(f)
                with self.lock:
                    self._data = loaded
        except Exception:
            pass

    def save(self):
        if not self.storage_path:
            return
        with self.lock:
            try:
                os.makedirs(os.path.dirname(self.storage_path), exist_ok=True)
                with open(self.storage_path, 'w', encoding='utf-8') as f:
                    json.dump(self._data, f, indent=2)
            except Exception:
                pass

    def seed(self, seed_dict):
        with self.lock:
            self._data = copy.deepcopy(seed_dict)
        self.save()

    # --- Student Persistence ---
    def get_all_students(self):
        with self.lock:
            return copy.deepcopy(self._data["students"])

    def find_student_by_id(self, student_id):
        with self.lock:
            for s in self._data["students"]:
                if s["id"] == student_id:
                    return copy.deepcopy(s)
            return None

    def find_student_by_email(self, email):
        with self.lock:
            for s in self._data["students"]:
                if s["email"].lower() == email.lower():
                    return copy.deepcopy(s)
            return None

    def find_student_by_id_number(self, id_num):
        with self.lock:
            for s in self._data["students"]:
                if s["student_id_number"].strip().lower() == id_num.strip().lower():
                    return copy.deepcopy(s)
            return None

    def create_student(self, student_dict):
        with self.lock:
            next_id = max([s["id"] for s in self._data["students"]], default=0) + 1
            record = copy.deepcopy(student_dict)
            record["id"] = next_id
            self._data["students"].append(record)
        self.save()
        return record

    def update_student(self, student_id, student_dict):
        with self.lock:
            for i, s in enumerate(self._data["students"]):
                if s["id"] == student_id:
                    updated = copy.deepcopy(student_dict)
                    updated["id"] = student_id
                    self._data["students"][i] = updated
                    self.save()
                    return updated
            return None

    def delete_student(self, student_id):
        with self.lock:
            init_len = len(self._data["students"])
            self._data["students"] = [s for s in self._data["students"] if s["id"] != student_id]
            if len(self._data["students"]) == init_len:
                return False
            # Cascade deletions
            self._data["enrollments"] = [e for e in self._data["enrollments"] if e["student_id"] != student_id]
            self._data["attendance_records"] = [a for a in self._data["attendance_records"] if a["student_id"] != student_id]
        self.save()
        return True

    # --- Course Persistence ---
    def get_all_courses(self):
        with self.lock:
            return copy.deepcopy(self._data["courses"])

    def find_course_by_id(self, course_id):
        with self.lock:
            for c in self._data["courses"]:
                if c["id"] == course_id:
                    return copy.deepcopy(c)
            return None

    def find_course_by_code(self, code):
        with self.lock:
            for c in self._data["courses"]:
                if c["course_code"].strip().lower() == code.strip().lower():
                    return copy.deepcopy(c)
            return None

    def create_course(self, course_dict):
        with self.lock:
            next_id = max([c["id"] for c in self._data["courses"]], default=0) + 1
            record = copy.deepcopy(course_dict)
            record["id"] = next_id
            self._data["courses"].append(record)
        self.save()
        return record

    def update_course(self, course_id, course_dict):
        with self.lock:
            for i, c in enumerate(self._data["courses"]):
                if c["id"] == course_id:
                    updated = copy.deepcopy(course_dict)
                    updated["id"] = course_id
                    self._data["courses"][i] = updated
                    self.save()
                    return updated
            return None

    def delete_course(self, course_id):
        with self.lock:
            init_len = len(self._data["courses"])
            self._data["courses"] = [c for c in self._data["courses"] if c["id"] != course_id]
            if len(self._data["courses"]) == init_len:
                return False
            self._data["enrollments"] = [e for e in self._data["enrollments"] if e["course_id"] != course_id]
            self._data["attendance_records"] = [a for a in self._data["attendance_records"] if a["course_id"] != course_id]
        self.save()
        return True

    # --- Enrollment Persistence ---
    def get_all_enrollments(self):
        with self.lock:
            return copy.deepcopy(self._data["enrollments"])

    def find_enrollment_by_id(self, enrollment_id):
        with self.lock:
            for e in self._data["enrollments"]:
                if e["id"] == enrollment_id:
                    return copy.deepcopy(e)
            return None

    def find_enrollment(self, student_id, course_id):
        with self.lock:
            for e in self._data["enrollments"]:
                if e["student_id"] == student_id and e["course_id"] == course_id:
                    return copy.deepcopy(e)
            return None

    def create_enrollment(self, enrollment_dict):
        with self.lock:
            next_id = max([e["id"] for e in self._data["enrollments"]], default=0) + 1
            record = copy.deepcopy(enrollment_dict)
            record["id"] = next_id
            self._data["enrollments"].append(record)
        self.save()
        return record

    def delete_enrollment(self, enrollment_id):
        with self.lock:
            init_len = len(self._data["enrollments"])
            self._data["enrollments"] = [e for e in self._data["enrollments"] if e["id"] != enrollment_id]
            if len(self._data["enrollments"]) == init_len:
                return False
        self.save()
        return True

    # --- Attendance Record Persistence ---
    def get_all_attendance(self):
        with self.lock:
            return copy.deepcopy(self._data["attendance_records"])

    def find_attendance_by_id(self, record_id):
        with self.lock:
            for a in self._data["attendance_records"]:
                if a["id"] == record_id:
                    return copy.deepcopy(a)
            return None

    def find_attendance_record(self, course_id, student_id, session_date):
        with self.lock:
            for a in self._data["attendance_records"]:
                if a["course_id"] == course_id and a["student_id"] == student_id and a["session_date"] == session_date:
                    return copy.deepcopy(a)
            return None

    def create_attendance(self, record_dict):
        with self.lock:
            next_id = max([a["id"] for a in self._data["attendance_records"]], default=0) + 1
            record = copy.deepcopy(record_dict)
            record["id"] = next_id
            self._data["attendance_records"].append(record)
        self.save()
        return record

    def update_attendance(self, record_id, record_dict):
        with self.lock:
            for i, a in enumerate(self._data["attendance_records"]):
                if a["id"] == record_id:
                    updated = copy.deepcopy(record_dict)
                    updated["id"] = record_id
                    self._data["attendance_records"][i] = updated
                    self.save()
                    return updated
            return None

    def delete_attendance(self, record_id):
        with self.lock:
            init_len = len(self._data["attendance_records"])
            self._data["attendance_records"] = [a for a in self._data["attendance_records"] if a["id"] != record_id]
            if len(self._data["attendance_records"]) == init_len:
                return False
        self.save()
        return True
