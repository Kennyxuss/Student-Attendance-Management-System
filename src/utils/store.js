/**
 * src/utils/store.js
 * Week 5: Tiny in-memory data layer for thin controllers.
 * Controllers stay thin: they only call store.save/get/update/delete.
 * No validation or raw persistence inside controllers.
 * Pre-seeded with one of each record so referential checks pass.
 */

function createStore(prefix) {
  const map = new Map();
  let seq = 1;
  return {
    // used by tests to reset
    _reset() { map.clear(); seq = 1; },
    _map: map,
    save(data) {
      const id = data.id || `${prefix}-${String(seq++).padStart(4, "0")}`;
      const record = { id, ...data, id, createdAt: new Date().toISOString() };
      map.set(id, record);
      return record;
    },
    get(id) { return map.get(id) || null; },
    list() { return Array.from(map.values()); },
    update(id, patch) {
      if (!map.has(id)) return null;
      const updated = { ...map.get(id), ...patch, id, updatedAt: new Date().toISOString() };
      map.set(id, updated);
      return updated;
    },
    delete(id) {
      if (!map.has(id)) return null;
      const v = map.get(id);
      map.delete(id);
      return v;
    },
    has(id) { return map.has(id); },
  };
}

const studentStore = createStore("STU");
const instructorStore = createStore("INS");
const classStore = createStore("CLS");
const attendanceStore = createStore("ATT");

// Seed so validation passes out of the box
const seedInstructor = instructorStore.save({ name: "Maria Santos", email: "maria@test.com", status: "active", department: "CS" });
const seedInstructorId = seedInstructor.id; // e.g., INS-0001
// Also create deterministic alias INS-010 for docs examples
instructorStore._map.set("INS-010", { id: "INS-010", name: "Maria Santos", email: "maria@test.com", status: "active", department: "CS", createdAt: new Date().toISOString() });

const seedClass = classStore.save({ className: "CS 101 - Section A", instructorId: "INS-010", schedule: "MWF 9:00-10:00", capacity: 40 });
classStore._map.set("CLS-01", { id: "CLS-01", className: "CS 101 - Section A", instructorId: "INS-010", schedule: "MWF 9:00-10:00", capacity: 40, createdAt: new Date().toISOString() });

const seedStudent = studentStore.save({ name: "Juan Dela Cruz", email: "juan@test.com", classId: "CLS-01", status: "active" });
studentStore._map.set("STU-001", { id: "STU-001", name: "Juan Dela Cruz", email: "juan@test.com", classId: "CLS-01", status: "active", createdAt: new Date().toISOString() });

attendanceStore._map.set("ATT-0001", { id: "ATT-0001", studentId: "STU-001", classId: "CLS-01", date: "2026-03-10", status: "present", createdAt: new Date().toISOString() });

module.exports = { studentStore, instructorStore, classStore, attendanceStore, createStore };
