# SAMS Bug Tracker (Week 10)

This document serves as our triaged issue tracker for the bugs found during our manual and adversarial QA sessions. **No fixes are applied this week (Feature Freeze).**

---

## 🐛 BUG-001: XSS Vulnerability in Data Tables rendering (P0)
- **Severity**: P0 (Security Risk / Core Break)
- **Title**: Cross-Site Scripting (XSS) payload executes when viewing Student/Course lists.
- **Steps to Reproduce**:
  1. Go to "Students" tab and click "Add New Student".
  2. Enter `<img src="x" onerror="alert('Hacked')">` as the First Name.
  3. Fill out the rest of the fields normally and click "Save".
  4. Observe the UI.
- **Expected**: The table renders the literal string `<img src="x"...>` safely escaped.
- **Actual**: The browser executes the alert script because `public/app.js` uses `tr.innerHTML` to interpolate user data directly into the DOM without sanitization.

## 🐛 BUG-002: Empty Rollcall Submission (P1)
- **Severity**: P1 (Significant logic flaw, no data loss but bad state)
- **Title**: Submitting a Rollcall for a course with zero enrolled students fires successfully.
- **Steps to Reproduce**:
  1. Create a brand new Course.
  2. Do not enroll any students in it.
  3. Navigate to "Take Attendance" (Rollcall) and select the new course.
  4. The roster says "No Students in Roster".
  5. Click "Save Session Attendance".
- **Expected**: The submit button should be disabled, or a toast should appear stating "No students to record."
- **Actual**: The UI flashes "Recorded attendance for 0 students!" and acts as a success, creating an empty/null network cycle.

## 🐛 BUG-003: Uncapped Course Titles break UI Layout (P2)
- **Severity**: P2 (Minor cosmetic issue)
- **Title**: Extremely long course titles push table columns out of bounds.
- **Steps to Reproduce**:
  1. Add a new Course.
  2. Paste a 300-character string into the "Course Title" field.
  3. Submit.
- **Expected**: The backend truncates it, or the CSS uses `text-overflow: ellipsis; white-space: nowrap;` to keep the table tidy.
- **Actual**: The table expands beyond the card container, forcing horizontal scrolling on the entire page viewport.

## 🐛 BUG-004: Rapid Double-Clicking Delete bypasses loading state (P2)
- **Severity**: P2 (Minor race condition)
- **Title**: Double-clicking "Del" on a student spawns two confirm dialogs.
- **Steps to Reproduce**:
  1. Click "Del" twice very quickly.
  2. Accept the first browser confirm dialog.
- **Expected**: The second dialog shouldn't appear because the button disables.
- **Actual**: Native `window.confirm` pauses execution, allowing the second click to queue up if timed perfectly, causing a harmless 404 error on the second backend request.
