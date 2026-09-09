/**
 * src/app.js
 * Student Attendance Management System — Deliverable 2 Entry Point
 * Wires: route → validation (inside controller guard clause) → controller (thin) → store
 * Standardized envelope for success & error; 405 for wrong method; JSON error mapping.
 */

const express = require("express");
const { fail, success } = require("./utils/response");

const studentsRoutes = require("./routes/students.routes");
const instructorsRoutes = require("./routes/instructors.routes");
const classesRoutes = require("./routes/classes.routes");
const attendanceRoutes = require("./routes/attendance.routes");

const app = express();
app.use(express.json());

// JSON parse error → 422 envelope (not 500)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return fail(res, 422, "invalid JSON", "body");
  }
  next(err);
});

// Health check
app.get("/", (req, res) => success(res, 200, { message: "SAMS API running", docs: "/docs/routes.md" }));

// ---- MOUNT ROUTES (Week 3 skeleton) ----
app.use("/students", studentsRoutes);
app.use("/instructors", instructorsRoutes);
app.use("/classes", classesRoutes);
app.use("/attendance", attendanceRoutes);

// ---- 405 — Wrong method to a path behaves sensibly ----
// e.g., DELETE /students (no :id) or POST /students/:id
app.use((req, res) => {
  // Check if path matches a known prefix but wrong method pattern
  const path = req.path;
  const method = req.method;
  // Generic 405
  if (path === "/students" && method === "DELETE") {
    return fail(res, 405, "Method DELETE not allowed on /students. Use DELETE /students/:id", null);
  }
  if (path.match(/^\/students\/.+/) && method === "POST") {
    return fail(res, 405, "Method POST not allowed on /students/:id. Use POST /students", null);
  }
  // fallback 404
  return fail(res, 404, "not found", null);
});

// Global error handler — never leak stack
app.use((err, req, res, next) => {
  console.error(err);
  return fail(res, 500, "internal error", null);
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`SAMS running on http://localhost:${PORT}`));
}

module.exports = app;
