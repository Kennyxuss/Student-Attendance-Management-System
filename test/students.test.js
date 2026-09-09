/**
 * tests/students.test.js
 * Week 5 Task 3 — Automated tests (Arrange–Act–Assert)
 * Each controller: ≥1 happy-path, ≥1 validation-failure, ≥1 edge case
 * Suite must be GREEN — no expect(true) filler.
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

// helpers to fake Express req/res
function fakeRes() {
  const res = {};
  res.statusCode = null;
  res.body = null;
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { res.body = obj; return res; };
  return res;
}
function fakeReq({ params = {}, body = {}, headers = {} } = {}) {
  return { params, body, headers };
}

const { studentStore, classStore } = require("../src/utils/store");
const ctrl = require("../src/controllers/students.controller");

describe("Students controller", () => {
  beforeEach(() => {
    // ensure referential seed exists
    if (!classStore.has("CLS-01") && !classStore._map.has("CLS-01")) {
      classStore._map.set("CLS-01", { id: "CLS-01", className: "CS 101 - Section A", instructorId: "INS-010", schedule: "MWF 9:00-10:00", capacity: 40, createdAt: new Date().toISOString() });
    }
  });

  it("createStudent saves a valid student — happy path (201, envelope)", () => {
    // Arrange
    const req = fakeReq({ body: { name: "Ana Rivera", email: "ana@test.com", classId: "CLS-01", status: "active" } });
    const res = fakeRes();
    // Act
    ctrl.createStudent(req, res);
    // Assert
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.status, 201);
    assert.equal(res.body.error, null);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.name, "Ana Rivera");
    // store actually saved
    assert.ok(studentStore.get(res.body.data.id) || studentStore._map.get(res.body.data.id));
  });

  it("createStudent rejects missing name — validation failure (422)", () => {
    // Arrange — missing required field
    const req = fakeReq({ body: { email: "a@b.com", classId: "CLS-01", status: "active" } });
    const res = fakeRes();
    // Act
    ctrl.createStudent(req, res);
    // Assert
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.status, 422);
    assert.equal(res.body.field, "name");
    assert.match(res.body.error, /required/i);
    assert.equal(res.body.data, null);
  });

  it("createStudent rejects invalid email format — validation failure (422)", () => {
    const req = fakeReq({ body: { name: "Bob", email: "not-an-email", classId: "CLS-01", status: "active" } });
    const res = fakeRes();
    ctrl.createStudent(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "email");
  });

  it("createStudent rejects edge: name 101 chars — out-of-range (422)", () => {
    const longName = "A".repeat(101);
    const req = fakeReq({ body: { name: longName, email: "edge@test.com", classId: "CLS-01", status: "active" } });
    const res = fakeRes();
    ctrl.createStudent(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "name");
  });

  it("showStudent echoes :id param — route param read correctly (200)", () => {
    const req = fakeReq({ params: { id: "STU-001" } });
    const res = fakeRes();
    ctrl.showStudent(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.id, "STU-001");
  });

  it("showStudent returns 404 for unknown id — not leak, envelope", () => {
    const req = fakeReq({ params: { id: "STU-UNKNOWN-999" } });
    const res = fakeRes();
    ctrl.showStudent(req, res);
    assert.equal(res.statusCode, 404);
    assert.equal(res.body.error, "student not found");
  });

  it("listStudents returns envelope with array (200)", () => {
    const req = fakeReq({});
    const res = fakeRes();
    ctrl.listStudents(req, res);
    assert.equal(res.statusCode, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.error, null);
  });
});
