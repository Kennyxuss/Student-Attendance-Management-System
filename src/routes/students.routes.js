/**
 * src/routes/students.routes.js
 * Week 3: Routing skeleton — 5 RESTful routes for Students
 */

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/students.controller");
const { requireRole } = require("../middleware/auth");

router.get("/", ctrl.listStudents);
router.get("/:id", ctrl.showStudent);
router.post("/", ctrl.createStudent);
router.put("/:id", ctrl.updateStudent);
router.delete("/:id", requireRole("admin"), ctrl.deleteStudent); // admin-only (Week 4 Task 4)

module.exports = router;
