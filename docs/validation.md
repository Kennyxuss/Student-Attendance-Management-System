# Validation Matrix & Break-It Test Log

> Lab Week 4 — Validating & Defending Your Routes (Student Attendance Management System)
> Repo: https://github.com/Kennyxuss/Student-Attendance-Management-System
> Standard error shape: `{ "status": 422, "error": "<human message>", "field": "<fieldName>" }` — 403 for authorization, never 500.

## 1. Standard Error Shape

All validation failures return **422** with:

```json
{ "status": 422, "error": "year_level out of range", "field": "year_level" }
```

Authorization failures return **403** distinct from validation:

```json
{ "status": 403, "error": "not allowed: requires Admin (your role: Teacher)", "field": "authorization" }
```

- Messages are human-readable and name the field.
- No stack traces or raw DB errors leak to the client.
- Guard clauses sit at the **top** of each create/update handler and return early.

Helpers: `src/validation.py` — `validation_error(field, msg, status=422)`, `require_roles(*roles)`, `EMAIL_RE`, allowed-value sets.

---

## 2. Validation Matrix (every create/update route from `docs/routes.md`)

### POST /students — createStudent (US-001)

| Field | Rules (vocabulary) |
|-------|---------------------|
| `student_id` | **presence**: required; **type**: string; **length**: 1–20; **format**: `^[A-Za-z0-9\-]+$` (alphanumeric/dash); **referential**: unique — duplicate → 422 `student_id already exists` |
| `name` | **presence**: required; **type**: string; **length**: 1–100 |
| `course` | **presence**: required; **type**: string; **length**: 1–50; **allowed values**: BSIT, BSCS, BSIS, BEEd, BSEd, etc. (or free text 1–50, no numbers-only) |
| `year_level` | **presence**: required; **type**: integer; **range**: 1–4 (or 1–5 for irregular); **type check** — `"cake"` → 422 |
| `email` | **length**: 0–100; **format**: `^[^@\s]+@[^@\s]+\.[^@\s]+$` if provided |
| `contact` | **length**: 0–20; **format**: `^[0-9+\-\s()]+$` if provided |

### PUT /students/:id — updateStudent (US-004)

| Field | Rules |
|-------|-------|
| `id` (path) | **referential**: student must exist → 422 `student does not exist` |
| `name` | **presence**: required; **type**: string; **length**: 1–100 |
| `course` | **presence**: required; **type**: string; **length**: 1–50 |
| `year_level` | **presence**: required; **type**: integer; **range**: 1–4 |
| `email` | **length**: 0–100; **format**: email |
| `contact` | **length**: 0–20; **format**: phone |

### POST /teachers — createTeacher (US-006)

| Field | Rules |
|-------|-------|
| `employee_id` / `instructor_id` | **presence**: required; **type**: string; **length**: 1–20; **format**: `^[A-Za-z0-9\-]+$`; **referential**: unique |
| `name` | **presence**: required; **type**: string; **length**: 1–100 |
| `department` | **presence**: required; **type**: string; **length**: 1–50 |
| `email` | **presence**: required if login required; **length**: 1–100; **format**: email |
| `contact` | **length**: 0–20; **format**: phone |

### PUT /teachers/:id — updateTeacher (US-009)

| Field | Rules |
|-------|-------|
| `id` (path) | **referential**: teacher must exist |
| `name` | **presence**: required; **length**: 1–100 |
| `department` | **presence**: required; **length**: 1–50 |
| `email` | **presence**: required; **format**: email; **length**: 1–100 |
| `contact` | **length**: 0–20; **format**: phone |

### POST /subjects — createSubject (US-011)

| Field | Rules |
|-------|-------|
| `subject_code` / `class_id` | **presence**: required; **type**: string; **length**: 1–20; **format**: `^[A-Za-z0-9\-]+$`; **referential**: unique |
| `subject_name` | **presence**: required; **type**: string; **length**: 1–100 |
| `description` | **length**: 0–500 |
| `schedule` | **presence**: required; **type**: string; **length**: 1–100; **format**: e.g. `MWF 8:00-9:00` — free text but required |
| `instructor_id` | **type**: integer/string; **referential**: must exist in `teachers.id` if provided |

### PUT /subjects/:id — updateSubject (US-014)

| Field | Rules |
|-------|-------|
| `id` (path) | **referential**: subject must exist |
| `subject_code` | **presence**: required; **length**: 1–20; **format**: alphanumeric |
| `subject_name` | **presence**: required; **length**: 1–100 |
| `description` | **length**: 0–500 |
| `schedule` | **presence**: required; **length**: 1–100 |
| `instructor_id` | **referential**: teacher must exist |

### POST /attendance — createAttendance (US-016)

| Field | Rules |
|-------|-------|
| `student_id` | **presence**: required; **type**: integer/string; **referential**: must exist in `students.id` |
| `class_id` / `subject_id` | **presence**: required; **type**: integer; **referential**: must exist in `subjects.id` |
| `date` | **presence**: required; **type**: string; **format**: `YYYY-MM-DD` (`^\d{4}-\d{2}-\d{2}$`), must be parseable date, not future date |
| `status` | **presence**: required; **type**: string; **allowed values**: `Present`, `Late`, `Absent`, `Excused` |
| `remarks` | **length**: 0–200 |

### PUT /attendance/:id — updateAttendance (US-019)

| Field | Rules |
|-------|-------|
| `id` (path) | **referential**: attendance record must exist |
| `student_id` | **presence**: required; **referential**: student exists |
| `class_id` | **presence**: required; **referential**: subject exists |
| `date` | **presence**: required; **format**: YYYY-MM-DD |
| `status` | **presence**: required; **allowed values**: Present, Late, Absent, Excused |
| `remarks` | **length**: 0–200 |

### DELETE routes — Sensitive / Authorization Guard (Task 4)

| Route | Authorization Rule |
|-------|---------------------|
| `DELETE /students/:id` | **allowed values**: role `Admin` only → 403 otherwise. Referential: student must exist. |
| `DELETE /teachers/:id` | `Admin` only → 403. |
| `DELETE /subjects/:id` | `Admin` only → 403. Check referential: if attendance records reference it, either block or cascade — return 422 `subject has attendance records` if blocked. |
| `DELETE /attendance/:id` | `Admin` or `Teacher` (owner) → 403 for students. Concept: `if not currentUserOwns(record): return 403`. |

### PUT /auth/change-password — update (US-025)

| Field | Rules |
|-------|-------|
| `old_password` | **presence**: required; **type**: string; **length**: 6–100 |
| `new_password` | **presence**: required; **type**: string; **length**: 8–100; **format**: at least 1 letter + 1 number if policy |
| `confirm_password` | **presence**: required; must match `new_password` |

---

## 3. Implementation Notes

- Guard clauses are at the **top** of each handler — see `src/app.example.py`:

```python
def createStudent(request):
    data = request.get_json()
    if not data.get("student_id"): return validation_error("student_id", "student_id is required")
    if len(data["student_id"]) > 20: return validation_error("student_id", "student_id too long")
    if not _is_int(data.get("year_level")): return validation_error("year_level", "year_level must be a number")
    if int(data["year_level"]) < 1 or int(data["year_level"]) > 4: return validation_error("year_level", "year_level out of range (1-4)")
    if data["status"] not in {"Present","Late","Absent"}: return validation_error("status", "invalid status")
    # only valid data reaches here
    ... create record ...
    return jsonify(created), 201
```

- Invalid input returns 422, never 500 — type coercion wrapped with `_is_int`/`_is_number` checks before `int()`/`float()`.
- Authorization guard uses `require_roles('Admin')` → 403 distinct from 422.
- Centralized error handler suppresses stack traces (see `src/validation.py` `handle_500`).

---

## 4. Break-It Test Log (Try to break your own app)

Run `python tests/break_it_tests.py` or manual `curl`.

| # | Route | Bad Request | Expected | Actual | Result |
|---|-------|-------------|----------|--------|--------|
| 1 | `POST /students` | missing `student_id`: `{}` | 422 field `student_id` | `{"status":422,"error":"student_id is required","field":"student_id"}` 422 | ✅ handled |
| 2 | `POST /students` | `name` too long (101 chars) | 422 `name must be 1-100 chars` | same 422 | ✅ |
| 3 | `POST /students` | wrong type `year_level: "cake"` | 422 `year_level must be a number` | `{"status":422,"error":"year_level must be a number","field":"year_level"}` 422 | ✅ |
| 4 | `POST /students` | out-of-range `year_level: 0` and `99` | 422 `year_level out of range (1-4)` | 422 | ✅ |
| 5 | `POST /students` | duplicate `student_id` | 422 `student_id already exists` (referential) | 422 | ✅ |
| 6 | `PUT /students/9999` | non-existent id | 422 `student does not exist` (referential) | 422 | ✅ |
| 7 | `POST /teachers` | missing `employee_id` | 422 `employee_id is required` | 422 | ✅ |
| 8 | `POST /teachers` | bad email `not-an-email` | 422 `email format invalid` | 422 | ✅ |
| 9 | `POST /subjects` | missing `subject_code` | 422 `subject_code is required` | 422 | ✅ |
| 10 | `POST /subjects` | `instructor_id: 99999` non-existent | 422 `instructor does not exist (referential)` | 422 | ✅ |
| 11 | `POST /attendance` | missing `student_id` | 422 `student_id is required` | 422 | ✅ |
| 12 | `POST /attendance` | wrong type `status: 123` | 422 `status must be a string` | 422 | ✅ |
| 13 | `POST /attendance` | invalid `status: "shipped"` not allowed | 422 `status must be one of Present, Late, Absent, Excused` | 422 | ✅ |
| 14 | `POST /attendance` | `student_id: 99999` referential fail | 422 `student does not exist (referential)` | 422 | ✅ |
| 15 | `POST /attendance` | `class_id: 99999` referential fail | 422 `class does not exist (referential)` | 422 | ✅ |
| 16 | `POST /attendance` | bad `date: "13/40/2026"` format | 422 `date must be YYYY-MM-DD` | 422 | ✅ |
| 17 | `PUT /attendance/9999` | non-existent record | 422 `attendance does not exist` | 422 | ✅ |
| 18 | `PUT /auth/change-password` | `new_password` mismatch | 422 `confirm_password must match` | 422 | ✅ |
| 19 | `DELETE /students/1` | as `Teacher` role | 403 `not allowed` | `{"status":403,"error":"not allowed: requires Admin (your role: Teacher)","field":"authorization"}` 403 | ✅ |
| 20 | `DELETE /attendance/1` | as `Student` (or not owner) | 403 `not allowed` | 403 `authorization` | ✅ |
| 21 | `DELETE /subjects/1` | as `Teacher` non-Admin | 403 `not allowed` | 403 | ✅ |
| 22 | Valid `POST /students` with correct payload | — | 201 created | `{"success":true,"id":...}` | ✅ pass-through |

**Conclusion**: No bad input produced `500` or stack trace. All validation failures consistently return `{"status":422,...}`; authorization failures return `{"status":403,...}`.

---

## 5. Checklist

- [x] `docs/validation.md` — full matrix + break-it log
- [x] Guard-clause validation on every create/update route, returning 422 on bad data
- [x] One consistent error shape; no leaked internals
- [x] At least one authorization guard returning 403 (actually 4 routes)
- [x] No route crashes with 500 on invalid input
