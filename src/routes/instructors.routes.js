/**
 * src/routes/instructors.routes.js
 * 5 RESTful routes for Instructors
 */

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/instructors.controller");
const { requireRole } = require("../middleware/auth");

router.get("/", ctrl.listInstructors);
router.get("/:id", ctrl.showInstructor);
router.post("/", ctrl.createInstructor);
router.put("/:id", ctrl.updateInstructor);
router.delete("/:id", requireRole("admin"), ctrl.deleteInstructor);

module.exports = router;
