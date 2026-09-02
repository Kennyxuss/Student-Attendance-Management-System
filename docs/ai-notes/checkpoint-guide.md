# Week 5 Checkpoint — Solo Task Guide (AI OFF, ~20 min, instructor observes)

You will get one small spec, e.g.:

> “Fix `PUT /students/:id` — add validation: name required 1-100, year_level must be number 1-5 → 422, referential id must exist → 422, success → 200 {status:200,data:{...}}. Add one test.”

## Steps (do solo, no copy-paste, no AI)

1. **Route**: Confirm `@app.route("/students/<int:id>", methods=["PUT"])` exists in `app.py`.
2. **Validation (top of handler)**: Paste guard block from `src/validation.py` pattern:
   ```python
   data=request.get_json(silent=True)
   if data is None: return validation_error("body","request body is required")
   name=str(data.get("name","")).strip()
   if not name: return validation_error("name","name is required")
   if not _is_int(data.get("year_level")): return validation_error("year_level","year_level must be a number")
   ```
3. **Controller**: Build thin `validated` dict → `update_student_controller(id, validated)` (see `src/controllers/student_controller.py:18`).
4. **Test**: Add one AAA test in `tests/test_students.py`:
   ```python
   def test_updateStudent_rejects_missing_name():
       init_db()
       with app.test_client() as c:
           login(c)
           c.post("/students", json={"student_id":"S-CP","name":"A","course":"BSIT","year_level":1})
           resp=c.put("/students/1", json={"name":"","course":"BSIT","year_level":2})
           assert resp.status_code==422
   ```
5. **Run**: `pytest tests/test_students.py -k test_updateStudent -v` → green.

## Grading
Part of individual grade for Deliverable 2. Shows you can judge AI output later (Week 6 AI ON). Treat as check-up, not trap.

## Practice now
Try building `POST /attendance` solo using `docs/validation.md` row: student_id required referential, date YYYY-MM-DD, status allowed Present/Late/Absent/Excused.
