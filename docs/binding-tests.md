# Week 7 — End-to-End Binding Tests

This document records the manual tests performed after binding the UI forms (Students, Courses) to the Phase 2 backend REST API (`POST` and `PUT` endpoints).

## 1. Create a Student (Happy Path)
- **Action**: Click "+ Add New Student", fill valid data, and click "Save".
- **Expected**: Button shows spinner, then modal closes. Student appears in the table. Server responds with `201 Created`.
- **Actual**: Pass. The UI updates seamlessly.

## 2. Edit a Course (Happy Path)
- **Action**: Click "Edit" on a course in the table. Change the "Course Title" and click "Save".
- **Expected**: Modal opens pre-filled. After saving, UI updates with the new title. Server responds with `200 OK`.
- **Actual**: Pass. Changes are persisted and immediately visible.

## 3. Create a Course with Invalid Data (Error 422 Handling)
- **Action**: Attempt to save a Course with a missing "Course Code" or duplicate code.
- **Expected**: The backend validation returns a `422 Unprocessable Entity`. The UI form catches this, and a red inline error message (`* <error detail>`) is dynamically injected beneath/above the corresponding field without crashing the UI.
- **Actual**: Pass. The error renders perfectly, and the button becomes clickable again.

## 4. General Network Error Handling (Error 500/Network)
- **Action**: Simulate a server crash (shut down the Python server) and attempt to save a Student.
- **Expected**: UI catches the `fetch` rejection, and an alert shows a network/server error message, restoring the submit button.
- **Actual**: Pass.
