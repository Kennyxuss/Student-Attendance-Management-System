/**
 * tests/instructors.test.js
 * Week 5 Task 3 — Arrange–Act–Assert
 */

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

function fakeRes() { const r={}; r.statusCode=null; r.body=null; r.status=(c)=>{r.statusCode=c; return r;}; r.json=(o)=>{r.body=o; return r;}; return r; }
function fakeReq({ params={}, body={}, headers={} }={}) { return { params, body, headers }; }

const { instructorStore } = require("../src/utils/store");
const ctrl = require("../src/controllers/instructors.controller");

describe("Instructors controller", () => {
  it("createInstructor saves a valid instructor — happy path (201)", () => {
    const req = fakeReq({ body: { name: "Liam Torres", email: "liam@test.com", status: "active" } });
    const res = fakeRes();
    ctrl.createInstructor(req, res);
    assert.equal(res.statusCode, 201);
    assert.equal(res.body.status, 201);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.name, "Liam Torres");
  });

  it("createInstructor rejects invalid status — validation failure (422)", () => {
    const req = fakeReq({ body: { name: "Kim", email: "kim@test.com", status: "superadmin" } });
    const res = fakeRes();
    ctrl.createInstructor(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "status");
  });

  it("updateInstructor edge: empty body — at least one field required (422)", () => {
    // Arrange — need an existing instructor id
    const created = instructorStore.save({ name: "Temp", email: "temp@test.com", status: "active" });
    const req = fakeReq({ params: { id: created.id }, body: {} });
    const res = fakeRes();
    ctrl.updateInstructor(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "body");
  });

  it("showInstructor echoes :id (200)", () => {
    const req = fakeReq({ params: { id: "INS-010" } });
    const res = fakeRes();
    ctrl.showInstructor(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.id, "INS-010");
  });

  it("deleteInstructor removes and returns envelope (200)", () => {
    const created = instructorStore.save({ name: "ToDelete", email: "del@test.com", status: "active" });
    const req = fakeReq({ params: { id: created.id } });
    const res = fakeRes();
    ctrl.deleteInstructor(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.id, created.id);
  });
});
