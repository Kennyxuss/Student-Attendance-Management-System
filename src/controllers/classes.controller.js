/**
 * src/controllers/classes.controller.js
 * Thin controllers: one function per CRUD operation
 */

const { classStore } = require("../utils/store");
const { success, fail } = require("../utils/response");
const {
  validateClassCreate,
  validateClassUpdate,
} = require("../middleware/validation");

function listClasses(req, res) {
  return success(res, 200, classStore.list());
}

function showClass(req, res) {
  const id = req.params.id;
  const found = classStore.get(id) || classStore._map.get(id);
  if (!found) return fail(res, 404, "class not found", "id");
  return success(res, 200, { message: "showClass stub", id, ...found });
}

function createClass(req, res) {
  const err = validateClassCreate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const created = classStore.save(req.body);
  return success(res, 201, created);
}

function updateClass(req, res) {
  const err = validateClassUpdate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const updated = classStore.update(req.params.id, req.body);
  if (!updated) return fail(res, 404, "class not found", "id");
  return success(res, 200, updated);
}

function deleteClass(req, res) {
  const deleted = classStore.delete(req.params.id);
  if (!deleted) return fail(res, 404, "class not found", "id");
  return success(res, 200, { message: "deleteClass stub", id: req.params.id, deleted });
}

module.exports = { listClasses, showClass, createClass, updateClass, deleteClass };
