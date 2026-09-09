/**
 * tests/classes.test.js
 * Week 5 Task 3 — Arrange–Act–Assert
 */

const { describe, it, beforeEach } = require("node:test");
const assert = require("node:assert/strict");

function fakeRes() { const r={}; r.statusCode=null; r.body=null; r.status=(c)=>{r.statusCode=c; return r;}; r.json=(o)=>{r.body=o; return r;}; return r; }
function fakeReq({ params={}, body={}, headers={} }={}) { return { params, body, headers }; }

const { classStore, instructorStore } = require("../src/utils/store");
const ctrl = require("../src/controllers/classes.controller");

describe("Classes controller", () => {
  beforeEach(() => {
    if (!instructorStore.has("INS-010") && !instructorStore._map.has("INS-010")) {
      instructorStore._map.set("INS-010", { id: "INS-010", name: "Maria Santos", email: "maria@test.com", status: "active", department: "CS", createdAt: new Date().toISOString() });
    }
  });

  it("createClass saves a valid class — happy path (201)", () => {
    const req = fakeReq({ body: { className: "Math 202 - B", instructorId: "INS-010", schedule: "TTH 10:00-11:30", capacity: 35 } });
    const res = fakeRes();
    ctrl.createClass(req, res);
    assert.equal(res.statusCode, 201);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.className, "Math 202 - B");
  });

  it("createClass rejects wrong type: capacity 'cake' — validation failure (422)", () => {
    const req = fakeReq({ body: { className: "Bad", instructorId: "INS-010", schedule: "MWF 9-10", capacity: "cake" } });
    const res = fakeRes();
    ctrl.createClass(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "capacity");
  });

  it("createClass rejects edge: capacity 999 out of range (422)", () => {
    const req = fakeReq({ body: { className: "Edge", instructorId: "INS-010", schedule: "MWF 9-10", capacity: 999 } });
    const res = fakeRes();
    ctrl.createClass(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "capacity");
    assert.match(res.body.error, /out of range/i);
  });

  it("createClass rejects referential: instructorId does not exist (422)", () => {
    const req = fakeReq({ body: { className: "Ref Test", instructorId: "INS-DOES-NOT-EXIST", schedule: "MWF 9-10" } });
    const res = fakeRes();
    ctrl.createClass(req, res);
    assert.equal(res.statusCode, 422);
    assert.equal(res.body.field, "instructorId");
  });

  it("showClass echoes :id (200)", () => {
    const req = fakeReq({ params: { id: "CLS-01" } });
    const res = fakeRes();
    ctrl.showClass(req, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.data.id, "CLS-01");
  });
});
