/**
 * src/controllers/students.controller.js
 * Week 3: stub handlers → Week 5: thin controllers
 * Thin = validation already passed at top, then call store, then standardized envelope.
 * No raw DB / SQL / validation scattered inside.
 */

const { studentStore } = require("../utils/store");
const { success, fail } = require("../utils/response");
const {
  validateStudentCreate,
  validateStudentUpdate,
} = require("../middleware/validation");

// GET /students
function listStudents(req, res) {
  const data = studentStore.list();
  return success(res, 200, data);
}

// GET /students/:id
function showStudent(req, res) {
  const id = req.params.id;
  const found = studentStore.get(id) || studentStore._map.get(id);
  if (!found) return fail(res, 404, "student not found", "id");
  return success(res, 200, { message: "showStudent stub", id, ...found });
}

// POST /students — guard clause at TOP
function createStudent(req, res) {
  const err = validateStudentCreate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  // only valid data reaches here
  const created = studentStore.save(req.body);
  return success(res, 201, created);
}

// PUT /students/:id
function updateStudent(req, res) {
  const err = validateStudentUpdate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const updated = studentStore.update(req.params.id, req.body);
  if (!updated) return fail(res, 404, "student not found", "id");
  return success(res, 200, updated);
}

// DELETE /students/:id — Week 4 auth guard is applied at route level (admin only)
function deleteStudent(req, res) {
  const deleted = studentStore.delete(req.params.id);
  if (!deleted) return fail(res, 404, "student not found", "id");
  return success(res, 200, { message: "deleteStudent stub", id: req.params.id, deleted });
}

module.exports = { listStudents, showStudent, createStudent, updateStudent, deleteStudent };
