/**
 * tests/attendance.test.js
 * Week 5 Task 3 — Attendance is the sensitive resource (auth tested separately)
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

function fakeRes() { const r={}; r.statusCode=null; r.body=null; r.status=(c)=>{r.statusCode=c; return r;}; r.json=(o)=>{r.body=o; return r;}; return r; }
function fakeReq({ params={}, body={}, headers={} }={}) { return { params, body, headers }; }

const { attendanceStore, studentStore, classStore } = require("../src/utils/store");
const ctrl = require("../src/controllers/attendance.controller");
const { authorizeAttendanceModify, requireRole } = require("../src/middleware/auth");

describe("Attendance controller", () => {
  beforeEach(() => {
    // ensure seeds exist
    if (!studentStore.has("STU-001") && !studentStore._map.has("STU-001")) {
      studentStore._map.set("STU-001", { id: "STU-001", name: "Juan Dela Cruz", email: "juan@test.com", classId: "CLS-01", status: "active", createdAt: new Date().toISOString() });
    }
    if (!classStore.has("CLS-01") && !classStore._map.has("CLS-01")) {
      classStore._map.set("CLS-01", { id: "CLS-01", className: "CS 101 - Section A", instructorId: "INS-010", schedule: "MWF 9:00-10:00", capacity: 40, createdAt: new Date().toISOString() });
    }
    if (!attendanceStore.has("ATT-0001") && !attendanceStore._map.has("ATT-0001")) {
      attendanceStore._map.set("ATT-0001", { id: "ATT-0001", studentId: "STU-001", classId: "CLS-01", date: "2026-03-10", status: "present", createdAt: new Date().toISOString() });
    }
  });

  it("createAttendance saves valid attendance — happy path (201)", () => {
    const req = fakeReq({ body: { studentId: "STU-001", classId: "CLS-01", date: "2026-03-10", status: "present" } });
    const res = fakeRes();
    ctrl.createAttendance(req, res);
    assert.equal(res.statusCode, 201);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.status, "present");
  });

  it("createAttendance rejects missing studentId — validation failure (422)", () => {
    const req = fakeReq({ body: { classId: "CLS-01", date: "2026-03-10", status: "present" } });
    const res = fakeRes();
    ctrl.createAttendance(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "studentId");
  });

  it("createAttendance rejects invalid status 'holiday' — allowed-values (422)", () => {
    const req = fakeReq({ body: { studentId: "STU-001", classId: "CLS-01", date: "2026-03-10", status: "holiday" } });
    const res = fakeRes();
    ctrl.createAttendance(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "status");
  });

  it("createAttendance rejects edge: future date 2099-12-31 — range (422)", () => {
    const req = fakeReq({ body: { studentId: "STU-001", classId: "CLS-01", date: "2099-12-31", status: "present" } });
    const res = fakeRes();
    ctrl.createAttendance(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "date");
  });

  it("showAttendance echoes :id (200)", () => {
    const req = fakeReq({ params: { id: "ATT-0001" } });
    const res = fakeRes();
    ctrl.showAttendance(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.id, "ATT-0001");
  });

  it("authorization guard: non-owner instructor gets 403 on PUT /attendance/:id", () => {
    // Arrange: attendance ATT-0001 belongs to class CLS-01 owned by INS-010
    // An instructor INS-999 trying to update should be forbidden
    const req = fakeReq({ params: { id: "ATT-0001" }, headers: { "x-role": "instructor", "x-user-id": "INS-999" }, body: { status: "late" } });
    const res = fakeRes();
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    authorizeAttendanceModify(req, res, next);
    assert.equal(res.statusCode, 403);
    assert.equal(nextCalled, false);
  });

  it("authorization guard: admin can pass (no 403)", () => {
    const req = fakeReq({ params: { id: "ATT-0001" }, headers: { "x-role": "admin", "x-user-id": "ADM-001" }, body: { status: "late" } });
    const res = fakeRes();
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    authorizeAttendanceModify(req, res, next);
    assert.equal(nextCalled, true);
    assert.equal(res.statusCode, null); // not set to 403
  });

  it("requireRole blocks guest from DELETE /students — 403 distinct from 422", () => {
    const middleware = requireRole("admin");
    const req = fakeReq({ headers: { "x-role": "guest" } });
    const res = fakeRes();
    let nextCalled = false;
    middleware(req, res, () => { nextCalled = true; });
    assert.equal(res.statusCode, 403);
    assert.equal(nextCalled, false);
  });
});
