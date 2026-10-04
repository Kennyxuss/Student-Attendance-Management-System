# Week 10 QA Test Matrix

**System**: Student Attendance Management System (SAMS)
**Phase**: Feature Freeze & Bug Hunting

| Feature / Action | Happy Path | Empty / Missing Input | Boundary / Limits | Adversarial / XSS | Network Offline |
|---|---|---|---|---|---|
| **Create Student** | ✅ Pass (201) | ✅ Pass (422 Inline Error) | ❌ Fail (Name > 255 chars accepted) | ❌ Fail (XSS executes in table) | ✅ Pass (Graceful Toast) |
| **Edit Student** | ✅ Pass (200) | ✅ Pass (422 Inline Error) | ✅ Pass | ❌ Fail (XSS executes) | ✅ Pass (Graceful Toast) |
| **Delete Student** | ✅ Pass (Row drops) | N/A | N/A | N/A | ✅ Pass (Restores button) |
| **Create Course** | ✅ Pass (201) | ✅ Pass (422 Inline Error) | ❌ Fail (Layout breaks on long title) | ❌ Fail (XSS executes) | ✅ Pass (Graceful Toast) |
| **Rollcall Submit** | ✅ Pass (Batch POST) | ❌ Fail (Submits empty batch) | ✅ Pass (100+ students works) | ✅ Pass | ✅ Pass (Graceful Toast) |
| **Load App Data** | ✅ Pass (Renders all) | ✅ Pass (Shows Empty states) | ✅ Pass | ✅ Pass | ✅ Pass (Loads Defaults) |
