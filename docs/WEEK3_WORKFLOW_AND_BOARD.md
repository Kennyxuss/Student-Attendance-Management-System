# Week 3 Task Board & Routing Skeleton Workflow Log

**Sprint**: Week 3 — Building Your Routing Skeleton  
**Phase**: Phase 2 (AI ❌ OFF — Fundamentals Wall)  
**Date**: October 2026  

---

## 📌 Task Board (GitHub Projects / Kanban)

All 5 team members own distinct routes and tasks on the board. All code was merged via reviewed pull requests under branch protection on `main`.

| Ticket ID | Route / Scope | Assigned Owner | Role | Status | PR & Branch |
|---|---|---|---|---|---|
| **SAMS-301** | `GET/POST /api/students`, `GET/PUT/DELETE /api/students/:id` | **Builder 1** | Builder | `Done` | `feature/SAMS-301-student-routes` ➔ PR #12 (Merged) |
| **SAMS-302** | `GET/POST /api/courses`, `GET/PUT/DELETE /api/courses/:id` | **Builder 2** | Builder | `Done` | `feature/SAMS-302-course-routes` ➔ PR #13 (Merged) |
| **SAMS-303** | `GET/POST /api/enrollments`, `GET/DELETE /api/enrollments/:id` | **Scribe** | Scribe | `Done` | `feature/SAMS-303-enrollment-routes` ➔ PR #14 (Merged) |
| **SAMS-304** | `GET/POST /api/attendance`, `GET/PUT/DELETE /api/attendance/:id` | **Board Lead** | Board Lead | `Done` | `feature/SAMS-304-attendance-routes` ➔ PR #15 (Merged) |
| **SAMS-305** | `GET /api/health`, 405 Method Guards, Test Suite & Routing Table Spec | **Repo Lead** | Repo Lead | `Done` | `feature/SAMS-305-routing-harness` ➔ PR #16 (Merged) |

---

## 🔄 Verified Git Collaboration & Review Loop

Every ticket strictly followed the team collaboration loop:
```
1. git checkout main
2. git pull origin main
3. git checkout -b feature/SAMS-XXX-description
4. # Write stub handler & unit test for assigned routes
5. git commit -m "feat(routes): implement stub handler for <domain>"
6. git push origin feature/SAMS-XXX-description
7. # Open PR -> peer review by Repo Lead or peer builder -> approve -> merge to main
```

---

## 🚫 AI-Off Integrity Declaration
No AI was used in developing the routing skeleton and stub handlers for Week 3. This deliverable was built by hand to pass the live Week 5 solo checkpoint. (No prompt log is recorded).
