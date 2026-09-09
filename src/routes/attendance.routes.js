/**
 * src/routes/attendance.routes.js
 * 5 RESTful routes for Attendance — includes auth guards (Week 4 Task 4)
 */

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/attendance.controller");
const { requireRole, authorizeAttendanceModify } = require("../middleware/auth");

router.get("/", ctrl.listAttendance);
router.get("/:id", ctrl.showAttendance);
router.post("/", ctrl.createAttendance);
router.put("/:id", authorizeAttendanceModify, ctrl.updateAttendance); // ownership check → 403 if not owner
router.delete("/:id", requireRole("admin"), authorizeAttendanceModify, ctrl.deleteAttendance); // admin + ownership

module.exports = router;
