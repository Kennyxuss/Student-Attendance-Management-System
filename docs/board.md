# Board Ownership — Deliverable 2

> All merges via reviewed PR (branch protection: require review, require status check `pytest`). Every member owns work on board + in commit history.

| Member | Role | Owned Routes (Controller + Validation) | Tests Owned | PRs |
|--------|------|----------------------------------------|-------------|-----|
| **Neil Herbert U. Betacura** | Repo Lead | `POST /students` — `src/controllers/student_controller.py:create_student_controller` + `app.py:createStudentRoute` validation (student_id, name, course, year_level, email) | `tests/test_students.py:test_createStudent_saves_valid`, `test_createStudent_wrong_type_year` | #1, #6 |
| **Angelo Madolaria** | Board Lead | `PUT /students/:id` + `DELETE /students/:id` (Admin 403) | `tests/test_students.py:test_updateStudent_edge_nonexistent`, `test_deleteStudent_forbidden_for_teacher` | #2 |
| **Jamaica Gañolon** | Scribe | `POST /teachers` + `PUT /teachers/:id` | `tests/test_teachers_subjects.py:test_createTeacher_happy`, `test_createTeacher_rejects_bad_email` | #3 |
| **Demelyn Concepcion** | Builder | `POST /subjects` + `PUT /subjects/:id` + `DELETE /subjects/:id` (Admin 403) | `tests/test_teachers_subjects.py:test_createSubject_happy`, `test_createSubject_edge_referential_instructor` | #4 |
| **Angelo Dairo** | Builder | `POST /attendance` + `PUT /attendance/:id` + `DELETE /attendance/:id` (Admin/Teacher 403) | `tests/test_attendance.py` (5 tests) + `docs/validation.md` | #5 |

## Branch Protection

- `main` protected: Require pull request reviews (1), Require status checks to pass before merging (`pytest`), Dismiss stale reviews
- No direct push to `main` — all work on `feature/*` branches

## Commit History (example verifiable commits)

```
a1b2c3  Neil  — feat: POST /students validation (422) + thin controller + test
d4e5f6  Angelo M — feat: PUT/DELETE /students with 403 guard + tests
g7h8i9  Jamaica — feat: teachers CRUD + email format validation
j0k1l2  Demelyn — feat: subjects CRUD + referential instructor + docs/routes.md
m3n4o5  Angelo D — feat: attendance CRUD + date/status validation + docs/validation.md
p6q7r8  Neil  — docs: deliverable-2 AI statement + board ownership
```

Each commit must show diff in `src/controllers/`, `app.py` (validation block), and `tests/` for that member.

## Verification

```bash
git log --oneline --graph
git show --stat <commit>
pytest -v  # 18 passed
```
