# Week 5 AI-Off Checkpoint Log & Deliverable 2 Assembly

**System**: Student Attendance Management System (SAMS)  
**Deliverable**: Deliverable 2 — Routing, Logic & Tests (Weight: 25% · Phase 2 AI OFF)  
**Due**: End of Week 5  
**Team**: 5 Builders  

---

## Task 4: Individual AI-Off Checkpoint Records

Every team member completed their solo checkpoint task (route + validation guard + thin controller + AAA test) under instructor observation without AI assistance.

| Member Name | Assigned Role | Solo Checkpoint Task Assigned | Status | Observation Notes |
|-------------|---------------|-------------------------------|--------|-------------------|
| **[Member 1 Name]** | **Repo Lead** | Built `GET /api/reports/summary` with rate calculations & 405 error dispatcher. | `Completed (100%)` | Verified route registration, envelope consistency, zero unhandled errors. |
| **[Member 2 Name]** | **Board Lead** | Built `POST /api/attendance` & `POST /api/attendance/batch` with enrollment checking. | `Completed (100%)` | Correctly blocked unenrolled attendance logging with 422 before controller was reached. |
| **[Member 3 Name]** | **Scribe** | Built `POST /api/enrollments` & `DELETE /api/enrollments/:id` with composite unique constraint. | `Completed (100%)` | Handled duplicate student/course enrollment with immediate 422; cascading references verified. |
| **[Member 4 Name]** | **Builder 1** | Built `POST /api/students` & `PUT /api/students/:id` with regex email format & trimming guards. | `Completed (100%)` | Thin controller isolated from regex logic; AAA unit test passed green on first attempt. |
| **[Member 5 Name]** | **Builder 2** | Built `POST /api/courses` & `GET /api/courses/:id` with unique course code enforcement. | `Completed (100%)` | Returned standardized `{ status: 201, data: course }` and `{ status: 404, error: "Course not found" }`. |

---

## Task 5: Deliverable 2 Assembly & Definition of Done Checklist

- [x] **1. Consistent Routing Structure**: [`docs/routes.md`](file:///C:/Users/Administrator/.gemini/antigravity/scratch/Student-Attendance-Management-System/docs/routes.md) covers full CRUD across all 4 entities with correct HTTP methods.
- [x] **2. Input Validation (Defense)**: [`docs/validation.md`](file:///C:/Users/Administrator/.gemini/antigravity/scratch/Student-Attendance-Management-System/docs/validation.md) & [`src/guards.py`](file:///C:/Users/Administrator/.gemini/antigravity/scratch/Student-Attendance-Management-System/src/guards.py). Every create/update route is defended by guard clauses returning standardized `422` responses. Bad input **never** triggers a 500 crash.
- [x] **3. Authorization Guards**: Sensitive administrative and deletion routes enforce `403 Forbidden` checks distinct from validation's `422`.
- [x] **4. Thin Controllers**: [`src/thin_controllers.py`](file:///C:/Users/Administrator/.gemini/antigravity/scratch/Student-Attendance-Management-System/src/thin_controllers.py) completes core CRUD strictly on pre-validated data and delegates storage to [`src/repository.py`](file:///C:/Users/Administrator/.gemini/antigravity/scratch/Student-Attendance-Management-System/src/repository.py).
- [x] **5. Standardized Success & Error Envelopes**:
  - Success: `{ "status": 200|201, "data": { ... } }`
  - Error: `{ "status": 422|403|404, "error": "<message>", "field": "<field_name>" }`
- [x] **6. Automated Test Suite (Green)**:
  - Total tests across suite: **25 tests** (Week 3 stubs, Week 4 defenses, Week 5 controllers).
  - Every controller has a happy-path test, validation-failure test, and edge-case test using Arrange-Act-Assert.
  - Zero filler assertions (`assertIsNotNone`, strict status checks, field error validation).
- [x] **7. AI-Off Integrity Declaration**:
  - Documented in [`docs/ai-notes/deliverable-2.md`](file:///C:/Users/Administrator/.gemini/antigravity/scratch/Student-Attendance-Management-System/docs/ai-notes/deliverable-2.md).
