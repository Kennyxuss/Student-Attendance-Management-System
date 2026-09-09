/**
 * src/middleware/validation.js
 * Week 4: Validation as guard clauses — all bad cases checked at the TOP
 * Returns null if valid, or { field, error } if invalid.
 * Each create/update handler calls this FIRST and returns 422 on failure.
 * Vocabulary: presence · type · length/range · format · allowed values · referential
 */

const { studentStore, instructorStore, classStore, attendanceStore } = require("../utils/store");

// helpers
function isMissing(v) { return v === undefined || v === null || (typeof v === "string" && v.trim() === ""); }
function isEmail(s) { return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function isYYYYMMDD(s) { return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)); }
function isFutureDate(s) { return new Date(s) > new Date(); }

// ---------- Students ----------
function validateStudentCreate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (isMissing(body.name)) return { field: "name", error: "name is required" };
  if (typeof body.name !== "string") return { field: "name", error: "name must be a string" };
  if (body.name.trim().length < 1 || body.name.trim().length > 100) return { field: "name", error: "name must be 1-100 chars" };

  if (isMissing(body.email)) return { field: "email", error: "email is required" };
  if (typeof body.email !== "string" || !isEmail(body.email)) return { field: "email", error: "invalid email format" };
  if (body.email.length < 5 || body.email.length > 254) return { field: "email", error: "email must be 5-254 chars" };

  if (isMissing(body.classId)) return { field: "classId", error: "classId is required" };
  if (typeof body.classId !== "string") return { field: "classId", error: "classId must be a string" };
  if (!classStore.has(body.classId) && !classStore._map.has(body.classId)) return { field: "classId", error: "classId does not exist" };

  if (isMissing(body.status)) return { field: "status", error: "status is required" };
  if (!["active", "inactive", "pending"].includes(body.status)) return { field: "status", error: "invalid status" };

  return null;
}

function validateStudentUpdate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  const keys = Object.keys(body);
  if (keys.length === 0) return { field: "body", error: "at least one field is required" };
  if ("name" in body) {
    if (isMissing(body.name)) return { field: "name", error: "name is required" };
    if (typeof body.name !== "string") return { field: "name", error: "name must be a string" };
    if (body.name.trim().length < 1 || body.name.trim().length > 100) return { field: "name", error: "name must be 1-100 chars" };
  }
  if ("email" in body) {
    if (isMissing(body.email)) return { field: "email", error: "email is required" };
    if (typeof body.email !== "string" || !isEmail(body.email)) return { field: "email", error: "invalid email format" };
  }
  if ("classId" in body) {
    if (isMissing(body.classId)) return { field: "classId", error: "classId is required" };
    if (typeof body.classId !== "string") return { field: "classId", error: "classId must be a string" };
    if (!classStore.has(body.classId) && !classStore._map.has(body.classId)) return { field: "classId", error: "classId does not exist" };
  }
  if ("status" in body) {
    if (isMissing(body.status)) return { field: "status", error: "status is required" };
    if (!["active", "inactive", "pending"].includes(body.status)) return { field: "status", error: "invalid status" };
  }
  return null;
}

// ---------- Instructors ----------
function validateInstructorCreate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (isMissing(body.name)) return { field: "name", error: "name is required" };
  if (typeof body.name !== "string") return { field: "name", error: "name must be a string" };
  if (body.name.trim().length < 1 || body.name.trim().length > 100) return { field: "name", error: "name must be 1-100 chars" };
  if (isMissing(body.email)) return { field: "email", error: "email is required" };
  if (typeof body.email !== "string" || !isEmail(body.email)) return { field: "email", error: "invalid email format" };
  if ("department" in body && body.department !== undefined && body.department !== null) {
    if (typeof body.department !== "string") return { field: "department", error: "department must be a string" };
    if (body.department.trim().length > 0 && (body.department.trim().length < 2 || body.department.trim().length > 100)) return { field: "department", error: "department must be 2-100 chars" };
  }
  if (isMissing(body.status)) return { field: "status", error: "status is required" };
  if (!["active", "inactive"].includes(body.status)) return { field: "status", error: "invalid status" };
  return null;
}

function validateInstructorUpdate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (Object.keys(body).length === 0) return { field: "body", error: "at least one field is required" };
  if ("name" in body) {
    if (isMissing(body.name)) return { field: "name", error: "name is required" };
    if (typeof body.name !== "string" || body.name.trim().length < 1 || body.name.trim().length > 100) return { field: "name", error: "name must be 1-100 chars" };
  }
  if ("email" in body && (isMissing(body.email) || !isEmail(body.email))) return { field: "email", error: "invalid email format" };
  if ("status" in body && !["active", "inactive"].includes(body.status)) return { field: "status", error: "invalid status" };
  return null;
}

// ---------- Classes ----------
function validateClassCreate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (isMissing(body.className)) return { field: "className", error: "className is required" };
  if (typeof body.className !== "string" || body.className.trim().length < 1 || body.className.trim().length > 100) return { field: "className", error: "className must be 1-100 chars" };
  if (isMissing(body.instructorId)) return { field: "instructorId", error: "instructorId is required" };
  if (typeof body.instructorId !== "string") return { field: "instructorId", error: "instructorId must be a string" };
  // referential
  if (!instructorStore.has(body.instructorId) && !instructorStore._map.has(body.instructorId)) return { field: "instructorId", error: "instructorId does not exist" };
  if (isMissing(body.schedule)) return { field: "schedule", error: "schedule is required" };
  if (typeof body.schedule !== "string" || body.schedule.trim().length < 3 || body.schedule.trim().length > 100) return { field: "schedule", error: "schedule must be 3-100 chars" };
  if ("capacity" in body && body.capacity !== undefined && body.capacity !== null) {
    if (typeof body.capacity !== "number" || !Number.isInteger(body.capacity)) return { field: "capacity", error: "capacity must be a number" };
    if (body.capacity < 1 || body.capacity > 200) return { field: "capacity", error: "capacity out of range" };
  }
  return null;
}

function validateClassUpdate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (Object.keys(body).length === 0) return { field: "body", error: "at least one field is required" };
  if ("className" in body && (isMissing(body.className) || typeof body.className !== "string" || body.className.trim().length < 1 || body.className.trim().length > 100)) return { field: "className", error: "className must be 1-100 chars" };
  if ("instructorId" in body) {
    if (isMissing(body.instructorId)) return { field: "instructorId", error: "instructorId is required" };
    if (!instructorStore.has(body.instructorId) && !instructorStore._map.has(body.instructorId)) return { field: "instructorId", error: "instructorId does not exist" };
  }
  if ("schedule" in body && (isMissing(body.schedule) || typeof body.schedule !== "string" || body.schedule.trim().length < 3 || body.schedule.trim().length > 100)) return { field: "schedule", error: "schedule must be 3-100 chars" };
  if ("capacity" in body && body.capacity !== undefined && body.capacity !== null) {
    if (typeof body.capacity !== "number" || !Number.isInteger(body.capacity)) return { field: "capacity", error: "capacity must be a number" };
    if (body.capacity < 1 || body.capacity > 200) return { field: "capacity", error: "capacity out of range" };
  }
  return null;
}

// ---------- Attendance ----------
function validateAttendanceCreate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (isMissing(body.studentId)) return { field: "studentId", error: "studentId is required" };
  if (typeof body.studentId !== "string") return { field: "studentId", error: "studentId must be a string" };
  if (!studentStore.has(body.studentId) && !studentStore._map.has(body.studentId)) return { field: "studentId", error: "studentId does not exist" };
  if (isMissing(body.classId)) return { field: "classId", error: "classId is required" };
  if (typeof body.classId !== "string") return { field: "classId", error: "classId must be a string" };
  if (!classStore.has(body.classId) && !classStore._map.has(body.classId)) return { field: "classId", error: "classId does not exist" };
  if (isMissing(body.date)) return { field: "date", error: "date is required" };
  if (!isYYYYMMDD(body.date)) return { field: "date", error: "invalid date format, expected YYYY-MM-DD" };
  if (isFutureDate(body.date)) return { field: "date", error: "date cannot be in the future" };
  if (new Date(body.date) < new Date("2020-01-01")) return { field: "date", error: "date too far in past" };
  if (isMissing(body.status)) return { field: "status", error: "status is required" };
  if (!["present", "late", "absent"].includes(body.status)) return { field: "status", error: "invalid status" };
  return null;
}

function validateAttendanceUpdate(body) {
  if (!body || typeof body !== "object") return { field: "body", error: "invalid JSON" };
  if (Object.keys(body).length === 0) return { field: "body", error: "at least one field is required" };
  if ("studentId" in body) {
    if (isMissing(body.studentId)) return { field: "studentId", error: "studentId is required" };
    if (!studentStore.has(body.studentId) && !studentStore._map.has(body.studentId)) return { field: "studentId", error: "studentId does not exist" };
  }
  if ("classId" in body) {
    if (isMissing(body.classId)) return { field: "classId", error: "classId is required" };
    if (!classStore.has(body.classId) && !classStore._map.has(body.classId)) return { field: "classId", error: "classId does not exist" };
  }
  if ("date" in body) {
    if (!isYYYYMMDD(body.date)) return { field: "date", error: "invalid date format, expected YYYY-MM-DD" };
    if (isFutureDate(body.date)) return { field: "date", error: "date cannot be in the future" };
  }
  if ("status" in body && !["present", "late", "absent"].includes(body.status)) return { field: "status", error: "invalid status" };
  return null;
}

module.exports = {
  validateStudentCreate,
  validateStudentUpdate,
  validateInstructorCreate,
  validateInstructorUpdate,
  validateClassCreate,
  validateClassUpdate,
  validateAttendanceCreate,
  validateAttendanceUpdate,
};
