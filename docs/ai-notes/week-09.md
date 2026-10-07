# Week 9 AI Note — Scaffold & Review Log

**Course Module**: Software Engineering Lab — Week 9 (Reviewing AI Code)  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  
**AI Rule**: ✅ ON (AI generates, Humans review and sign-off)

---

## Task 1: AI-Assisted Feature (Student Status Filter)
**User Prompt:** 
> "Add a small feature to the Student Directory tab. Add a dropdown filter next to the 'Add New Student' button that lets me filter the table by 'All', 'Active', and 'Inactive'. Update `app.js` to handle this filtering."

**AI Output Result:**
- The AI updated `index.html` to include a `<select>` element.
- The AI updated `app.js` to pass a filter value to `renderStudentsTable()`.

## Task 2: Peer Review & Feedback Practice
Below is the simulated review our team performed on the AI's generated pull request.

### Review Checklist
- [x] **Correctness**: Mostly correct, but the AI missed a condition where the filter string wasn't properly checked against the exact student status.
- [x] **Readability**: Good.
- [x] **Consistency**: Used the existing `.form-control` CSS class.
- [x] **Security**: Safe (DOM manipulation used `createElement` and `.textContent` via our existing render method).
- [x] **Tests**: N/A (Frontend DOM logic, tested manually).

### Substantive Review Comments left on the PR:
1. **[blocking]** "The filter logic in `app.js` uses `.includes()`, which might accidentally match partial words if we add statuses like 'Proactive' later. Please change it to an exact match `===` check for the status."
2. **[nit]** "Consider renaming the `f` parameter in `renderStudentsTable(f)` to `filterStatus` for better readability."
3. **[positive]** "Great job placing the dropdown cleanly inside the `.section-header` flex container! The UI looks seamless."

---

## Task 5: Enforcing Merge Rules
- We have enabled **Branch Protection** on the `main` branch.
- Rule: Require at least **1 approving review** before merging.
- Rule: Require status checks to pass (our Python `unittest` suite).
- *Result*: The AI's code was fixed based on the review, re-approved, and merged successfully.
