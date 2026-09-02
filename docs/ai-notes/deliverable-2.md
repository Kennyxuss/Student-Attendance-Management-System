# Deliverable 2 — Routing, Logic & Tests (25%)
## Definition of Done (Week 5 Task 5)

- [x] Consistent routing structure `/docs/routes.md` — Week 3 (Method, Path, Handler, User Story for Students/Teachers/Subjects/Attendance/Reports/Auth)
- [x] Validation on every create/update route `/docs/validation.md` — Week 4 (presence, type, length/range, format, allowed values, referential; standardized {"status":422,"error":...,"field":...}; auth 403)
- [x] Thin controllers completing core CRUD, wired end-to-end (route → validation → controller → db) — `src/controllers/*.py` + `app.py`
- [x] Passing automated test suite (happy path + failures + edges) — `tests/` green
- [x] Every member owns controllers/tests on board; all merges via reviewed PR
- [x] Each member's checkpoint completed (solo route + validation + controller + test)

## Evidence

- `pytest -v` → 18 passed (see `tests/`)
- `docs/validation.md` §4 break-it log → 12/12 handled, no 500
- `src/controllers/student_controller.py:1` thin example, `app.py:40` standardized envelopes
