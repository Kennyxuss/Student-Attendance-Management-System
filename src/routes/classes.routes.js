/**
 * src/routes/classes.routes.js
 * 5 RESTful routes for Classes
 */

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/classes.controller");
const { requireRole } = require("../middleware/auth");

router.get("/", ctrl.listClasses);
router.get("/:id", ctrl.showClass);
router.post("/", ctrl.createClass);
router.put("/:id", ctrl.updateClass);
router.delete("/:id", requireRole("admin", "instructor"), ctrl.deleteClass);

module.exports = router;
