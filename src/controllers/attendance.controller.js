/**
 * src/controllers/attendance.controller.js
 * Thin controllers for attendance — the sensitive resource (Task 4 auth)
 */

const { attendanceStore } = require("../utils/store");
const { success, fail } = require("../utils/response");
const {
  validateAttendanceCreate,
  validateAttendanceUpdate,
} = require("../middleware/validation");

function listAttendance(req, res) {
  return success(res, 200, attendanceStore.list());
}

function showAttendance(req, res) {
  const id = req.params.id;
  const found = attendanceStore.get(id) || attendanceStore._map.get(id);
  if (!found) return fail(res, 404, "attendance not found", "id");
  return success(res, 200, { message: "showAttendance stub", id, ...found });
}

function createAttendance(req, res) {
  const err = validateAttendanceCreate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const created = attendanceStore.save(req.body);
  return success(res, 201, created);
}

function updateAttendance(req, res) {
  const err = validateAttendanceUpdate(req.body);
  if (err) return fail(res, 422, err.error, err.field);
  const updated = attendanceStore.update(req.params.id, req.body);
  if (!updated) return fail(res, 404, "attendance not found", "id");
  return success(res, 200, updated);
}

function deleteAttendance(req, res) {
  const deleted = attendanceStore.delete(req.params.id);
  if (!deleted) return fail(res, 404, "attendance not found", "id");
  return success(res, 200, { message: "deleteAttendance stub", id: req.params.id, deleted });
}

module.exports = { listAttendance, showAttendance, createAttendance, updateAttendance, deleteAttendance };
