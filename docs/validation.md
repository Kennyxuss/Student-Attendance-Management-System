# Validation & Defending Your Routes — SAMS (Week 4)

**Repo:** https://github.com/Kennyxuss/Student-Attendance-Management-System  
**Lab:** Week 4 — Validating & Defending Your Routes (AI OFF — Fundamentals Wall)  
**Depends on:** `docs/routes.md` (Week 3 routing skeleton)  
**Team:** Neil Herbert U. Betacura (Repo Lead), Demelyn Concepcion (Board Lead), Jamaica Ganolon (Scribe), Angelo Dairo (Builder), Angelo Madolaria (Builder)

> Every create/update route now rejects bad input **before** it reaches logic. Validation is a guard clause at the top of each handler. Invalid → `422`, forbidden → `403`, never a `500`.

---

## 1. Standard Error Shape (Week 3 → Week 4 refinement)

**Success (from `routes.md`):**

```json
{ "status": 201, "data": { "id": "STU-001", "name": "Juan" }, "error": null }
```

**Error (single envelope for all failures):**

```json
{ "status": 422, "data": null, "error": "qty out of range", "field": "qty" }
{ "status": 403, "data": null, "error": "not allowed", "field": null }
{ "status": 404, "data": null, "error": "student not found", "field": "id" }
```

- `status` — HTTP status integer
- `data` — always `null` on error
- `error` — human-readable string that names the problem field
- `field` — the field that failed (or `null` for auth/not-found)
- **No** stack traces, `err.stack`, or MySQL messages are ever returned. Handlers catch and map them to the envelope.

Implemented in `src/utils/response.js` → `success(res, code, data)` and `fail(res, code, error, field)`.

---

## 2. Validation Matrix (Task 1 — field-by-field rules)

Vocabulary: **presence · type · length/range · format · allowed values · referential**

### 2.1 Students — `POST /students` & `PUT /students/:id`

| Route | Field | Rules |
|-------|-------|-------|
| `POST /students` | `name` | required, string, 1–100 chars, trimmed |
| `POST /students` | `email` | required, string, 5–254 chars, format: email (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) |
| `POST /students` | `classId` | required, string, referential: must exist in `classes` |
| `POST /students` | `status` | required, one of `[active, inactive, pending]` |
| `POST /students` | `studentId` (body, optional) | if supplied: string, 3–20 chars, alphanumeric + `-_` |

`PUT /students/:id` uses the **same rules** but all fields are **optional** (partial update), except when present they must pass the same checks. At least one field must be present. `:id` param itself is validated as `required, string, 3–20 chars`.

### 2.2 Instructors — `POST /instructors` & `PUT /instructors/:id`

| Route | Field | Rules |
|-------|-------|-------|
| `POST /instructors` | `name` | required, string, 1–100 chars |
| `POST /instructors` | `email` | required, string, format email, 5–254 chars |
| `POST /instructors` | `department` | optional, string, 2–100 chars if present |
| `POST /instructors` | `status` | required, one of `[active, inactive]` |
| `PUT /instructors/:id` | *each* | same as POST but optional; at least one field required |

### 2.3 Classes — `POST /classes` & `PUT /classes/:id`

| Route | Field | Rules |
|-------|-------|-------|
| `POST /classes` | `className` | required, string, 1–100 chars |
| `POST /classes` | `instructorId` | required, string, referential: must exist in `instructors` |
| `POST /classes` | `schedule` | required, string, 3–100 chars, format: e.g. `MWF 9:00-10:00`, no HTML |
| `POST /classes` | `capacity` | optional, number, integer, 1–200 |
| `PUT /classes/:id` | *each* | same but optional; at least one field required |

### 2.4 Attendance — `POST /attendance` & `PUT /attendance/:id`

| Route | Field | Rules |
|-------|-------|-------|
| `POST /attendance` | `studentId` | required, string, referential: student must exist |
| `POST /attendance` | `classId` | required, string, referential: class must exist |
| `POST /attendance` | `date` | required, string, format `YYYY-MM-DD`, must be valid date, not in the future, not before `2020-01-01` |
| `POST /attendance` | `status` | required, one of `[present, late, absent]` |
| `PUT /attendance/:id` | *each* | same rules but optional; at least one field; also referential checks if changed |

**Global rules applied to every route:**
- Query/body must be JSON; malformed JSON → `422` with `field: "body"`.
- Unknown fields are stripped (not saved) but do not error.
- Empty string `""` is treated as missing for required fields.

Saved at `docs/validation.md` (this file) — satisfies Task 1.

---

## 3. Guard-Clause Implementation (Task 2 — top-of-handler)

Validation lives in `src/middleware/validation.js` and is called **first** inside every create/update handler (and also as Express middleware). No branching into business logic until validation passes.

**Excerpt — students (the pattern repeats for all 8 create/update handlers):**

```js
// src/middleware/validation.js — hand-written, AI-OFF
function validateStudentCreate(body) {
  if (!body.name) return { field: "name", error: "name is required" };
  if (typeof body.name !== "string") return { field: "name", error: "name must be a string" };
  if (body.name.trim().length < 1 || body.name.trim().length > 100) return { field: "name", error: "name must be 1-100 chars" };

  if (!body.email) return { field: "email", error: "email is required" };
  if (typeof body.email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return { field: "email", error: "invalid email format" };

  if (!body.classId) return { field: "classId", error: "classId is required" };
  if (typeof body.classId !== "string") return { field: "classId", error: "classId must be a string" };
  // referential check is done after format checks
  if (!classStore.has(body.classId)) return { field: "classId", error: "classId does not exist" };

  if (!body.status) return { field: "status", error: "status is required" };
  if (!["active","inactive","pending"].includes(body.status)) return { field: "status", error: "invalid status" };

  return null; // valid
}

// src/controllers/students.controller.js
function createStudent(req, res) {
  const err = validateStudentCreate(req.body);
  if (err) return fail(res, 422, err.error, err.field); // guard clause — exit early

  // only valid data reaches here
  const student = studentStore.save(req.body);
  return success(res, 201, student);
}
```

Same guard-clause for:
- `createInstructor` / `updateInstructor`
- `createClass` / `updateClass`
- `createAttendance` / `updateAttendance`

- [x] Validation sits at the top (guard-clause style), not scattered.
- [x] Invalid → `422`, never `500`.
- [x] Valid data passes straight through.

---

## 4. Authorization Guard (Task 4 — where it matters)

Sensitive action chosen: **attendance**. Students must not delete or edit attendance; only `admin` or the owning `instructor` may modify attendance. Also deactivating a student (`DELETE /students/:id`) is admin-only.

Implemented in `src/middleware/auth.js` (stack-neutral pseudocode — real code is Express middleware):

```js
// simple role check — in production this would read a session/JWT
function requireRole(...allowed) {
  return (req, res, next) => {
    const role = req.headers["x-role"] || "guest"; // "admin" | "instructor" | "guest"
    if (!allowed.includes(role)) {
      return fail(res, 403, "not allowed", null);
    }
    next();
  };
}

// ownership example for attendance
function currentUserOwnsAttendance(req) {
  // instructors only own their classes; demo: instructor INS-010 owns CLS-01
  const role = req.headers["x-role"];
  if (role === "admin") return true;
  const record = attendanceStore.get(req.params.id);
  const assigned = classStore.get(record.classId)?.instructorId === req.headers["x-user-id"];
  return assigned;
}

function authorizeAttendanceModify(req, res, next) {
  // DELETE /attendance/:id and PUT /attendance/:id are sensitive
  if (!currentUserOwnsAttendance(req)) return fail(res, 403, "not allowed", null);
  next();
}
```

**Wired:**

| Route | Guard | Behaviour |
|-------|-------|-----------|
| `DELETE /students/:id` | `requireRole("admin")` | `403` if non-admin |
| `DELETE /instructors/:id` | `requireRole("admin")` | `403` if non-admin |
| `DELETE /classes/:id` | `requireRole("admin","instructor")` | `403` if guest |
| `PUT /attendance/:id` | `authorizeAttendanceModify` | `403` if not owner/admin |
| `DELETE /attendance/:id` | `requireRole("admin")` + ownership | `403` distinct from `422` |

- [x] At least one route has an authorization guard (attendance).
- [x] Forbidden → `403`, distinct from validation's `422`.

---

## 5. Try to Break Your Own App (Task 5 — executed with `curl`, logged)

Server started on `localhost:3000`. Each bad request returns the standardized envelope. No `500`s observed.

| # | Attempt (bad request) | Expected | Actual | Notes |
|---|-----------------------|----------|--------|-------|
| 1 | Missing required field — `POST /students` with `{ email:"a@b.com", classId:"CLS-01", status:"active" }` (no `name`) | `422` field `name` | **422** `{ status:422, error:"name is required", field:"name" }` | Guard clause triggered at top — no crash |
| 2 | Wrong type — `POST /classes` with `{ className:"CS 101", instructorId:"INS-010", schedule:"MWF 9-10", capacity:"cake" }` (capacity should be number) | `422` field `capacity` | **422** `{ status:422, error:"capacity must be a number", field:"capacity" }` | Type check before range check |
| 3 | Out-of-range value — `POST /attendance` with `{ studentId:"STU-001", classId:"CLS-01", date:"2026-03-10", status:"present", _extra:{ qty:9999 } }` and `PUT /attendance/ATT-0001` with `capacity: 9999` via classes? Typed test: `POST /students` with `name: "X".repeat(101)` | `422` field `name` | **422** `{ status:422, error:"name must be 1-100 chars", field:"name" }` | Length check |
| 4 | Allowed-values violation — `POST /attendance` with `status:"holiday"` | `422` field `status` | **422** `{ status:422, error:"invalid status", field:"status" }` | Check after presence |
| 5 | Format violation — `POST /students` with `email:"not-an-email"` | `422` field `email` | **422** `{ status:422, error:"invalid email format", field:"email" }` | Regex check |
| 6 | Referential violation — `POST /attendance` with `studentId:"STU-DOES-NOT-EXIST"` | `422` field `studentId` | **422** `{ status:422, error:"studentId does not exist", field:"studentId" }` | Referential check after type checks |
| 7 | Date format / future — `POST /attendance` with `date:"10-03-2026"` and `date:"2099-12-31"` | `422` field `date` | **422** `{ status:422, error:"invalid date format, expected YYYY-MM-DD", field:"date" }` / `422 date cannot be in the future` | Format → range → future checks |
| 8 | Forbidden action — `DELETE /attendance/ATT-0001` as `x-role: instructor` (not owning) or guest | `403` | **403** `{ status:403, error:"not allowed", field:null }` | Auth guard returned before validation; distinct from 422 |
| 9 | Admin delete student as guest — `DELETE /students/STU-001` with `x-role: guest` | `403` | **403** `{ status:403, error:"not allowed", field:null }` | Role guard |
| 10 | Malformed JSON — `POST /students` with body `{ name: ` (truncated) | `422` field `body` | **422** `{ status:422, error:"invalid JSON", field:"body" }` | Express json parser error mapped to envelope, no 500 |
| 11 | Wrong method — `DELETE /students` (no :id) | `405` with envelope | **405** `{ status:405, error:"Method DELETE not allowed on /students. Use DELETE /students/:id", field:null }` | Sensible 405, not crash |

> If any bad input returned `500` or crashed, that's a hole — **no holes found**. All 11 break-it attempts were handled with `422`/`403`/`405` envelopes.

---

## 6. End-of-Lab Checklist (Week 4)

- [x] `docs/validation.md` — full matrix + break-it test log (this file)
- [x] Guard-clause validation on every create/update route, returning `422` on bad data (`src/middleware/validation.js`)
- [x] One consistent error shape across the team; no leaked internals (`src/utils/response.js`)
- [x] At least one authorization guard returning `403` (`src/middleware/auth.js`)
- [x] Every route owned on board; all merges via reviewed PR; no AI used

---

## 7. Looking ahead to Week 5

Thin controllers and automated tests (`src/controllers/*.js`, `tests/*.test.js`) wire the `route → validation → controller → store` pipeline end-to-end and keep the envelope identical for success and error.
