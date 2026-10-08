# Week 1 Task Board & Git Repository Setup Guide

This document captures the repository hygiene, branch protection policy, and the starting task board tickets required for the **Student Attendance Management System (SAMS)** Week 1 deliverable.

---

## 📌 Task Board (GitHub Projects / Kanban)

**Recommended Board Columns:**
`Backlog` ➔ `To Do` ➔ `In Progress` ➔ `In Review` ➔ `Done`

### Initial Week 1 Tickets (All Assigned & Completed)

| Ticket ID | Title | Owner (Role) | Status | Description |
|-----------|-------|--------------|--------|-------------|
| **SAMS-01** | Establish Team Roster & Define Initial Roles | **Scribe** | `Done` | Finalize 5 team member names, student IDs, assign Week 1 roles (Repo Lead, Board Lead, Scribe, Builders), and document in README. |
| **SAMS-02** | Brainstorm Candidate Problems & Select Local Business Case | **All Team** (Lead: Scribe) | `Done` | Run AI brainstorming prompt, evaluate 5 business cases against CRUD and 12-week constraints, choose Student Attendance Management System. |
| **SAMS-03** | Initialize Git Repository, .gitignore, and Branch Protections | **Repo Lead** | `Done` | Scaffold folder structure, configure multi-stack `.gitignore`, initialize Git, and document branch protection rules for `main`. |
| **SAMS-04** | Configure Task Board & Populate Scaffolding Tickets | **Board Lead** | `Done` | Stand up GitHub Project board with standard columns, create tickets for all Week 1 activities, assign owners, and link to repository. |
| **SAMS-05** | Scaffold System Architecture & Baseline Application Demo | **Builders 1 & 2** | `Done` | Build working foundational backend/frontend demo verifying that all 4 record types can be viewed and tested immediately. |

---

## 🔒 Branch Protection Settings (Repository Lead Checkpoint)

To ensure merge hygiene and prevent breaking changes directly on the production branch:

### Target Branch: `main`
- **Rule 1: Require a pull request before merging**: Enabled (`checked`)
- **Rule 2: Require at least 1 approving review**: Enabled (`checked`)
- **Rule 3: Dismiss stale pull request approvals when new commits are pushed**: Enabled (`checked`)
- **Rule 4: Require conversation resolution before merging**: Enabled (`checked`)
- **Rule 5: Do not allow bypassing the above settings (Block direct pushes to main)**: Enabled (`checked`)

### Testing the Protection
1. Attempt direct push:
   ```bash
   git checkout main
   git commit -m "Direct push test"
   git push origin main
   ```
2. **Expected Result**: Git hook/remote rejection:
   `remote: error: GH006: Protected branch update failed for refs/heads/main. At least 1 approving review required.`

### Team Git Collaboration Loop (Standardized for Weeks 1–12)
```
git checkout main
git pull origin main
git checkout -b feature/SAMS-XX-short-description
# Make changes
git add .
git commit -m "feat(module): descriptive message"
git push origin feature/SAMS-XX-short-description
# Open PR -> assign peer review -> address comments -> approve & merge -> delete branch
```
