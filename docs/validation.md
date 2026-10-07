# Validation & Defensive Coding Specification (Week 4)

**System**: Student Attendance Management System (SAMS)  
**Lab**: Week 4 — Validating & Defending Your Routes (AI ❌ OFF Phase)  
**Standardized Team Error Response Shape**:
```json
{
  "status": 422,
  "error": "<human readable message>",
  "field": "<problem_field>"
}
```
*(For authorization failures, `status` is `403` with `field: null` or `field: "authorization"`).*

---

## Task 1: Complete Validation Matrix

Vocabulary used: **presence**, **type**, **length/range**, **format**, **allowed values**, **referential**.

| Route | Field | Rules (Vocabulary Applied) |
|---|---|---|
| `POST /api/students` | `student_id_number` | **presence**: required; **type**: string; **length/range**: 3–30 chars; **format**: non-empty trimmed; **referential/uniqueness**: must be unique in students table |
| `POST /api/students` | `first_name` | **presence**: required; **type**: string; **length/range**: 1–60 chars; **format**: trimmed |
| `POST /api/students` | `last_name` | **presence**: required; **type**: string; **length/range**: 1–60 chars; **format**: trimmed |
| `POST /api/students` | `email` | **presence**: required; **type**: string; **length/range**: 5–120 chars; **format**: RFC email pattern (`^[^@\s]+@[^@\s]+\.[^@\s]+$`); **referential/uniqueness**: unique in students table |
| `POST /api/students` | `status` | **presence**: optional (defaults to "Active"); **type**: string; **allowed values**: `["Active", "Inactive"]` |
| `POST /api/students` | `grade_or_cohort` | **presence**: optional; **type**: string; **length/range**: 0–100 chars |
| `PUT /api/students/:id` | `first_name` | **presence**: optional; **type**: string; **length/range**: 1–60 chars |
| `PUT /api/students/:id` | `last_name` | **presence**: optional; **type**: string; **length/range**: 1–60 chars |
| `PUT /api/students/:id` | `email` | **presence**: optional; **type**: string; **format**: RFC email pattern; **referential/uniqueness**: unique, excluding current student ID |
| `PUT /api/students/:id` | `status` | **presence**: optional; **type**: string; **allowed values**: `["Active", "Inactive"]` |
| `POST /api/courses` | `course_code` | **presence**: required; **type**: string; **length/range**: 2–20 chars; **format**: uppercase trimmed; **referential/uniqueness**: unique in courses table |
| `POST /api/courses` | `title` | **presence**: required; **type**: string; **length/range**: 3–120 chars |
| `POST /api/courses` | `instructor_name` | **presence**: required; **type**: string; **length/range**: 2–80 chars |
| `POST /api/courses` | `schedule_time` | **presence**: optional; **type**: string; **length/range**: 0–100 chars |
| `PUT /api/courses/:id` | `course_code` | **presence**: optional; **type**: string; **length/range**: 2–20 chars; **referential/uniqueness**: unique, excluding current course ID |
| `PUT /api/courses/:id` | `title` | **presence**: optional; **type**: string; **length/range**: 3–120 chars |
| `POST /api/enrollments` | `student_id` | **presence**: required; **type**: integer; **length/range**: > 0; **referential**: must exist in students table |
| `POST /api/enrollments` | `course_id` | **presence**: required; **type**: integer; **length/range**: > 0; **referential**: must exist in courses table |
| `POST /api/enrollments` | `(student_id, course_id)` | **referential/composite**: pair must not already exist in enrollments table |
| `POST /api/enrollments` | `status` | **presence**: optional; **type**: string; **allowed values**: `["Enrolled", "Dropped", "Completed"]` |
| `POST /api/attendance` | `course_id` | **presence**: required; **type**: integer; **referential**: must exist in courses table |
| `POST /api/attendance` | `student_id` | **presence**: required; **type**: integer; **referential**: must exist and be enrolled in `course_id` |
| `POST /api/attendance` | `session_date` | **presence**: required; **type**: string; **format**: ISO date `YYYY-MM-DD` |
| `POST /api/attendance` | `status` | **presence**: required; **type**: string; **allowed values**: `["Present", "Absent", "Late", "Excused"]` |
| `POST /api/attendance` | `(course, student, date)`| **referential/composite**: unique attendance log per course/student/date |
| `PUT /api/attendance/:id` | `status` | **presence**: optional; **type**: string; **allowed values**: `["Present", "Absent", "Late", "Excused"]` |
| `DELETE /api/attendance/:id` | Header / Role | **authorization**: only users with role `Admin` or `Instructor` can delete attendance records |
| `DELETE /api/students/:id` | Header / Role | **authorization**: only users with role `Admin` can permanently delete student records |

---

## Task 4: Authorization Guard Architecture (403 Forbidden)

Sensitive deletion and administrative routes are defended by an explicit authorization guard:
```python
# Authorization Guard Example
auth_role = request.headers.get("X-User-Role", "Student")
if auth_role != "Admin":
    return {"status": 403, "error": "Forbidden: Admin privileges required", "field": "authorization"}
```
- Standard HTTP status code: `403 Forbidden` (strictly distinguished from `422 Unprocessable Entity`).

---

## Task 5: Break-It Test Log (Deliberately Bad Requests)

Every attempt below was sent to the server to verify defensive handling. **Zero 500 crashes observed.**

| # | Attempted Bad Request | Attack / Malformed Vector | Expected Status | Actual Status | Result / Response Body |
|---|---|---|---|---|---|
| 1 | `POST /api/students` | Missing `email` field | `422` | `422` | `{"status": 422, "error": "email is required", "field": "email"}` |
| 2 | `POST /api/students` | Wrong type: `first_name: 12345` | `422` | `422` | `{"status": 422, "error": "first_name must be a string", "field": "first_name"}` |
| 3 | `POST /api/students` | Out-of-range: `student_id_number: "AB"` (< 3 chars) | `422` | `422` | `{"status": 422, "error": "student_id_number must be between 3 and 30 characters", "field": "student_id_number"}` |
| 4 | `POST /api/students` | Invalid email format: `email: "not-an-email"` | `422` | `422` | `{"status": 422, "error": "Invalid email address format", "field": "email"}` |
| 5 | `POST /api/students` | Duplicate `student_id_number` | `422` | `422` | `{"status": 422, "error": "student_id_number already exists", "field": "student_id_number"}` |
| 6 | `POST /api/courses` | Missing `title` | `422` | `422` | `{"status": 422, "error": "title is required", "field": "title"}` |
| 7 | `POST /api/enrollments` | Non-existent `student_id: 9999` (referential failure) | `422` | `422` | `{"status": 422, "error": "student_id 9999 does not exist", "field": "student_id"}` |
| 8 | `POST /api/attendance` | Student not enrolled in course | `422` | `422` | `{"status": 422, "error": "Student is not enrolled in this course", "field": "student_id"}` |
| 9 | `POST /api/attendance` | Invalid enum value: `status: "Hungry"` | `422` | `422` | `{"status": 422, "error": "status must be one of: Present, Absent, Late, Excused", "field": "status"}` |
| 10 | `POST /api/attendance` | Invalid date format: `session_date: "10-01-2026"` | `422` | `422` | `{"status": 422, "error": "session_date must be YYYY-MM-DD", "field": "session_date"}` |
| 11 | `DELETE /api/students/1` | Missing `X-User-Role: Admin` header (Unauthorized user) | `403` | `403` | `{"status": 403, "error": "Forbidden: Admin privileges required", "field": "authorization"}` |
| 12 | `DELETE /api/attendance/1`| Role set to `Student` (`X-User-Role: Student`) | `403` | `403` | `{"status": 403, "error": "Forbidden: Instructor or Admin privileges required", "field": "authorization"}` |
