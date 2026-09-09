/**
 * src/middleware/auth.js
 * Week 4 Task 4: Authorization guards — simple role + ownership checks
 * Forbidden → 403, distinct from 422 validation.
 * In real app this reads JWT/session; here we use headers x-role and x-user-id
 */

const { fail } = require("../utils/response");
const { attendanceStore, classStore } = require("../utils/store");

function requireRole(...allowed) {
  return (req, res, next) => {
    const role = (req.headers["x-role"] || "guest").toLowerCase();
    if (!allowed.includes(role)) {
      return fail(res, 403, "not allowed", null);
    }
    next();
  };
}

// Demo ownership: INS-010 owns CLS-01, so instructor INS-010 can modify attendance for CLS-01.
// Admin can always modify.
function currentUserOwnsAttendance(req) {
  const role = (req.headers["x-role"] || "guest").toLowerCase();
  if (role === "admin") return true;
  const userId = req.headers["x-user-id"];
  if (!userId) return false;
  const record = attendanceStore.get(req.params.id) || attendanceStore._map.get(req.params.id);
  if (!record) return false; // not found handled later as 404
  const cls = classStore.get(record.classId) || classStore._map.get(record.classId);
  if (!cls) return false;
  return cls.instructorId === userId;
}

function authorizeAttendanceModify(req, res, next) {
  if (!currentUserOwnsAttendance(req)) {
    return fail(res, 403, "not allowed", null);
  }
  next();
}

module.exports = { requireRole, authorizeAttendanceModify, currentUserOwnsAttendance };
