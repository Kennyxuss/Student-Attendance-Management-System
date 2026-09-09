/**
 * src/controllers/instructors.controller.js
 * Thin controllers: validated data → store → standardized response
 */

const { instructorStore } = require("../utils/store");
const { success, fail } = require("../utils/response");
const {
  validateInstructorCreate,
  validateInstructorUpdate,
} = require("../middleware/validation");

function listInstructors(req, res) {
  return success(res, 200, instructorStore.list());
}

function showInstructor(req, res) {
  const id = req.params.id;
  const found = instructorStore.get(id) || instructorStore._map.get(id);
  if (!found) return fail(res, 404, "instructor not found", "id");
  return success(res, 200, { message: "showInstructor stub", id, ...found });
}

function createInstructor(req, res) {
  const err = validateInstructorCreate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const created = instructorStore.save(req.body);
  return success(res, 201, created);
}

function updateInstructor(req, res) {
  const err = validateInstructorUpdate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const updated = instructorStore.update(req.params.id, req.body);
  if (!updated) return fail(res, 404, "instructor not found", "id");
  return success(res, 200, updated);
}

function deleteInstructor(req, res) {
  const deleted = instructorStore.delete(req.params.id);
  if (!deleted) return fail(res, 404, "instructor not found", "id");
  return success(res, 200, { message: "deleteInstructor stub", id: req.params.id, deleted });
}

module.exports = { listInstructors, showInstructor, createInstructor, updateInstructor, deleteInstructor };
