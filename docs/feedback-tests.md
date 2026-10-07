# Week 8 — Feedback & Error Path Tests

This document records deliberate tests of failure paths to ensure our newly added feedback system handles errors gracefully and keeps the user informed.

## 1. Simulated Invalid Form Submission (422 Error)
- **Action**: Attempted to add a Course but left the "Course Code" blank, and used a duplicate code.
- **Expected**: Form button disables, changes to "Saving...". Request returns a `422` error. The UI catches it and displays red text directly beneath the offending input field. Form button re-enables.
- **Actual**: Pass. The inline feedback appeared dynamically.

## 2. Simulated Network/Server Outage during Load (500 Error)
- **Action**: Killed the backend python server before reloading the frontend.
- **Expected**: A general loading state (reduced opacity, spinners if applicable) followed by a global toast notification: "Network error: Unable to sync with server. Using local fallback." The UI does not freeze.
- **Actual**: Pass. The red toast appeared, and the app fell back to the local `DEFAULT_STATE` without a white-screen crash.

## 3. Deletion of a Record
- **Action**: Click the "Del" button on a student row.
- **Expected**: Browser confirmation dialog blocks the action. Upon accepting, the button text changes to "..." and disables. A `DELETE` request is sent. Upon success, a green toast says "Student removed successfully" and the row vanishes.
- **Actual**: Pass.

## 4. Failed Deletion of a Record
- **Action**: Disconnect network right after clicking "OK" on the delete confirmation dialog.
- **Expected**: Button disables and shows "...". After the request fails, a red toast says "Network error: Could not remove student. Please try again." The button re-enables.
- **Actual**: Pass.
