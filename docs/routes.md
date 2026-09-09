# Routing Table — Student Attendance Management System (SAMS)

**Repo:** https://github.com/Kennyxuss/Student-Attendance-Management-System  
**Course Lab:** Week 3 — Building Your Routing Skeleton (Fundamentals Wall — AI OFF)  
**Team (5):**
- Repo Lead — Neil Herbert U. Betacura
- Board Lead — Demelyn Concepcion
- Scribe — Jamaica Ganolon
- Builder — Angelo Dairo
- Builder — Angelo Madolaria

**Week 2 Backlog source:** `docs/backlog.md` (US-04 → US-26). Every CRUD story maps to exactly one RESTful route.

---

## 1. Standard Response Shape (Team Agreement — Week 3)

> Agreed Week 3, frozen for Weeks 4–5. Every handler returns **one envelope**.

**Success:**

```json
{ "status": 200, "data": { "...record..." }, "error": null }
```

- `status` — HTTP status integer
- `data`   — object | array | null (the resource)
- `error`  — always `null` on success

**Error (Week 4 refined):**

```json
{ "status": 422, "data": null, "error": "qty out of range", "field": "qty" }
```

- `status` — error HTTP status (422 validation, 403 forbidden, 404 not found, 405 method not allowed)
- `data` — always `null` on error
- `error` — human-readable message naming the problem field
- `field` — machine field name (optional, present for validation errors)

**Rules:**
- No raw stack traces or SQL errors leak to the client.
- `Route parameters (:id)` are always echoed back in the stub / read responses.
- Status codes: `200` read / `201` created / `204` deleted / `422` bad data / `403` forbidden / `404` not found / `405` wrong method.

---

## 2. Full Routing Table (20 routes = 4 record types × 5 operations)

RESTful conventions: plural noun, GET for read, POST for create, PUT for whole update, DELETE for delete. No creating/deleting with GET.

### 2.1 Students — CRUD for student profiles (US-04, US-05, US-06, US-07)

| # | Method | Path | Handler | Story it serves | Status on success |
|---|--------|------|---------|-----------------|-------------------|
| 1 | GET | `/students` | `listStudents` | View all students (US-05) | 200 |
| 2 | GET | `/students/:id` | `showStudent` | View one student (US-05) | 200 |
| 3 | POST | `/students` | `createStudent` | Create / add a student (US-04) | 201 |
| 4 | PUT | `/students/:id` | `updateStudent` | Edit student info (US-06) | 200 |
| 5 | DELETE | `/students/:id` | `deleteStudent` | Delete/deactivate student (US-07) | 200 |

### 2.2 Instructors — CRUD for instructor accounts (US-09)

| # | Method | Path | Handler | Story it serves | Status |
|---|--------|------|---------|-----------------|--------|
| 6 | GET | `/instructors` | `listInstructors` | View all instructors | 200 |
| 7 | GET | `/instructors/:id` | `showInstructor` | View one instructor | 200 |
| 8 | POST | `/instructors` | `createInstructor` | Create instructor record | 201 |
| 9 | PUT | `/instructors/:id` | `updateInstructor` | Edit instructor info | 200 |
| 10 | DELETE | `/instructors/:id` | `deleteInstructor` | Remove / deactivate instructor | 200 |

### 2.3 Classes — CRUD for class definitions (US-10, US-12, US-13)

| # | Method | Path | Handler | Story it serves | Status |
|---|--------|------|---------|-----------------|--------|
| 11 | GET | `/classes` | `listClasses` | View all classes | 200 |
| 12 | GET | `/classes/:id` | `showClass` | View one class | 200 |
| 13 | POST | `/classes` | `createClass` | Create a class (US-13) | 201 |
| 14 | PUT | `/classes/:id` | `updateClass` | Edit class info | 200 |
| 15 | DELETE | `/classes/:id` | `deleteClass` | Delete class when authorized | 200 |

### 2.4 Attendance Records — CRUD for daily attendance (US-23, US-25)

| # | Method | Path | Handler | Story it serves | Status |
|---|--------|------|---------|-----------------|--------|
| 16 | GET | `/attendance` | `listAttendance` | View attendance (history / report) | 200 |
| 17 | GET | `/attendance/:id` | `showAttendance` | View one attendance record | 200 |
| 18 | POST | `/attendance` | `createAttendance` | Take attendance (US-23) | 201 |
| 19 | PUT | `/attendance/:id` | `updateAttendance` | Edit attendance info | 200 |
| 20 | DELETE | `/attendance/:id` | `deleteAttendance` | Controlled delete for attendance | 200 |

> ✅ Every CRUD story from Deliverable 1 has a matching route.  
> ✅ Methods are correct (no creating or deleting with GET).  
> ✅ This file lives at `/docs/routes.md`.

**Ownership on board (Task 4):**

| Route group | Owner | Branch | PR |
|-------------|-------|--------|----|
| Students (1–5) | Jamaica Ganolon (Scribe) | `feature/students-routes` | #1 |
| Instructors (6–10) | Angelo Dairo (Builder) | `feature/instructors-routes` | #2 |
| Classes (11–15) | Angelo Madolaria (Builder) | `feature/classes-routes` | #3 |
| Attendance (16–20) | Demelyn Concepcion (Board Lead) | `feature/attendance-routes` | #4 |
| Review / app wiring | Neil Herbert U. Betacura (Repo Lead) | `feature/routing-wiring` | #5 |

All branches merged via reviewed PR against `main` with branch protection. No AI used — this file and stubs were written by hand.

---

## 3. Stub Handlers (Week 3 Task 2 — no DB yet)

Each route has a working handler returning the standardized placeholder. Location in repo:

- `src/routes/students.routes.js`
- `src/routes/instructors.routes.js`
- `src/routes/classes.routes.js`
- `src/routes/attendance.routes.js`
- `src/utils/response.js` — envelope helpers `success(res, status, data)` / `fail(res, status, error, field)`
- `src/app.js` — wires `route → stub` pipeline and 405 handler.

Pseudocode (hand-written, matches actual code):

```js
function listStudents(req, res) {
  return res.status(200).json({ status: 200, data: [{ message: "listStudents stub" }], error: null });
}
function createStudent(req, res) {
  return res.status(201).json({ status: 201, data: { message: "createStudent stub" }, error: null });
}
function showStudent(req, res) {
  const id = req.params.id;
  return res.status(200).json({ status: 200, data: { message: "showStudent stub", id: id }, error: null });
}
// same shape for instructors / classes / attendance; :id always echoed
```

- ✅ Every route in the table has a working handler.
- ✅ Correct status codes (200 read/update/delete, 201 create).
- ✅ Route params `:id` are read and echoed.
- ✅ One consistent response shape.

---

## 4. Testing Every Route (Week 3 Task 3)

Method: browser for GET, `curl` / Postman / Insomnia for POST/PUT/DELETE. Server runs with `npm start` → `http://localhost:3000`.

### 4.1 Example Request + Response per route (copy-pasteable)

> All bodies are JSON. Stub responses are abbreviated — the real server returns the envelope above.

**1 — GET /students — listStudents**

```bash
curl -i http://localhost:3000/students
```
```json
// Response 200
{ "status": 200, "data": [{ "message": "listStudents stub" }], "error": null }
```

**2 — GET /students/:id — showStudent**

```bash
curl -i http://localhost:3000/students/STU-001
```
```json
// Response 200
{ "status": 200, "data": { "message": "showStudent stub", "id": "STU-001" }, "error": null }
```

**3 — POST /students — createStudent**

```bash
curl -i -X POST http://localhost:3000/students -H "Content-Type: application/json" -d "{\"name\":\"Juan Dela Cruz\",\"email\":\"juan@test.com\",\"classId\":\"CLS-01\",\"status\":\"active\"}"
```
```json
// Response 201
{ "status": 201, "data": { "message": "createStudent stub" }, "error": null }
```

**4 — PUT /students/:id — updateStudent**

```bash
curl -i -X PUT http://localhost:3000/students/STU-001 -H "Content-Type: application/json" -d "{\"name\":\"Juan D. Cruz\"}"
```
```json
// Response 200
{ "status": 200, "data": { "message": "updateStudent stub", "id": "STU-001" }, "error": null }
```

**5 — DELETE /students/:id — deleteStudent**

```bash
curl -i -X DELETE http://localhost:3000/students/STU-001
```
```json
// Response 200
{ "status": 200, "data": { "message": "deleteStudent stub", "id": "STU-001" }, "error": null }
```

**6 — GET /instructors**

```bash
curl -i http://localhost:3000/instructors
```
```json
// Response 200
{ "status": 200, "data": [{ "message": "listInstructors stub" }], "error": null }
```

**7 — GET /instructors/:id**

```bash
curl -i http://localhost:3000/instructors/INS-010
```
```json
// Response 200
{ "status": 200, "data": { "message": "showInstructor stub", "id": "INS-010" }, "error": null }
```

**8 — POST /instructors**

```bash
curl -i -X POST http://localhost:3000/instructors -H "Content-Type: application/json" -d "{\"name\":\"Maria Santos\",\"email\":\"maria@test.com\",\"status\":\"active\"}"
```
```json
// Response 201
{ "status": 201, "data": { "message": "createInstructor stub" }, "error": null }
```

**9 — PUT /instructors/:id**

```bash
curl -i -X PUT http://localhost:3000/instructors/INS-010 -H "Content-Type: application/json" -d "{\"department\":\"CS\"}"
```
```json
// Response 200
{ "status": 200, "data": { "message": "updateInstructor stub", "id": "INS-010" }, "error": null }
```

**10 — DELETE /instructors/:id**

```bash
curl -i -X DELETE http://localhost:3000/instructors/INS-010
```
```json
// Response 200
{ "status": 200, "data": { "message": "deleteInstructor stub", "id": "INS-010" }, "error": null }
```

**11 — GET /classes**

```bash
curl -i http://localhost:3000/classes
```
```json
// Response 200
{ "status": 200, "data": [{ "message": "listClasses stub" }], "error": null }
```

**12 — GET /classes/:id**

```bash
curl -i http://localhost:3000/classes/CLS-01
```
```json
// Response 200
{ "status": 200, "data": { "message": "showClass stub", "id": "CLS-01" }, "error": null }
```

**13 — POST /classes**

```bash
curl -i -X POST http://localhost:3000/classes -H "Content-Type: application/json" -d "{\"className\":\"CS 101 - Section A\",\"instructorId\":\"INS-010\",\"schedule\":\"MWF 9:00-10:00\"}"
```
```json
// Response 201
{ "status": 201, "data": { "message": "createClass stub" }, "error": null }
```

**14 — PUT /classes/:id**

```bash
curl -i -X PUT http://localhost:3000/classes/CLS-01 -H "Content-Type: application/json" -d "{\"schedule\":\"TTH 10:00-11:30\"}"
```
```json
// Response 200
{ "status": 200, "data": { "message": "updateClass stub", "id": "CLS-01" }, "error": null }
```

**15 — DELETE /classes/:id**

```bash
curl -i -X DELETE http://localhost:3000/classes/CLS-01
```
```json
// Response 200
{ "status": 200, "data": { "message": "deleteClass stub", "id": "CLS-01" }, "error": null }
```

**16 — GET /attendance**

```bash
curl -i http://localhost:3000/attendance
```
```json
// Response 200
{ "status": 200, "data": [{ "message": "listAttendance stub" }], "error": null }
```

**17 — GET /attendance/:id**

```bash
curl -i http://localhost:3000/attendance/ATT-0001
```
```json
// Response 200
{ "status": 200, "data": { "message": "showAttendance stub", "id": "ATT-0001" }, "error": null }
```

**18 — POST /attendance**

```bash
curl -i -X POST http://localhost:3000/attendance -H "Content-Type: application/json" -d "{\"studentId\":\"STU-001\",\"classId\":\"CLS-01\",\"date\":\"2026-03-10\",\"status\":\"present\"}"
```
```json
// Response 201
{ "status": 201, "data": { "message": "createAttendance stub" }, "error": null }
```

**19 — PUT /attendance/:id**

```bash
curl -i -X PUT http://localhost:3000/attendance/ATT-0001 -H "Content-Type: application/json" -d "{\"status\":\"late\"}"
```
```json
// Response 200
{ "status": 200, "data": { "message": "updateAttendance stub", "id": "ATT-0001" }, "error": null }
```

**20 — DELETE /attendance/:id**

```bash
curl -i -X DELETE http://localhost:3000/attendance/ATT-0001
```
```json
// Response 200
{ "status": 200, "data": { "message": "deleteAttendance stub", "id": "ATT-0001" }, "error": null }
```

### 4.2 Wrong-method behaviour

```bash
curl -i -X DELETE http://localhost:3000/students
# Response 405
{ "status": 405, "data": null, "error": "Method DELETE not allowed on /students. Use DELETE /students/:id", "field": null }

curl -i -X GET http://localhost:3000/students
# 200 — OK (list), not 405

curl -i -X POST http://localhost:3000/students/STU-001
# Response 405
{ "status": 405, "data": null, "error": "Method POST not allowed on /students/:id. Use POST /students", "field": null }
```

Every `405` returns the same envelope, never a stack trace.

- [x] Every route returns the expected status and stub body.
- [x] A wrong method to a path behaves sensibly (405 with envelope).
- [x] One example request + response per route is recorded above.

---

## 5. How to Run (no DB)

```bash
npm install
npm start          # http://localhost:3000
npm test           # runs Week 5 automated tests (must be green before PR merges)
```

AI was **OFF** this week. All routes/handlers were written by hand. There is no prompt log because there was nothing to log.

---

## 6. End-of-Lab Checklist (Week 3)

- [x] `/docs/routes.md` — full routing table + one example request/response per route (this file)
- [x] A working stub handler for every CRUD route, returning correct status codes (`src/routes/*.routes.js`)
- [x] Route parameters read correctly (`req.params.id` echoed)
- [x] One consistent response shape across the team (`src/utils/response.js`)
- [x] Every route owned on the board; all merges via reviewed PR
- [x] No AI used
