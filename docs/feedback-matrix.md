# Error Handling & Feedback Matrix

**System**: Student Attendance Management System (SAMS)
**Lab**: Week 8 (Deliverable 3 Polish)

| Action | Loading State | Success State | Error State |
|---|---|---|---|
| **Load App Data** | Data tables fade to 50% opacity, spinners appear in state containers | Data tables render, opacity returns to 100% | General "Network error: Unable to load data" toast, fallback to local state if applicable |
| **Create Student/Course** | Submit button disabled, text changes to "Saving..." with spinner | Modal closes, data refreshes, green success toast appears | **422**: Inline red text next to field. **500**: Red error toast |
| **Edit Student/Course** | Submit button disabled, text changes to "Saving..." with spinner | Modal closes, data refreshes, green success toast appears | **422**: Inline red text next to field. **500**: Red error toast |
| **Delete Record** | System confirmation dialog -> Delete button disables and shows "..." | Record disappears, green success toast appears | Red error toast "Could not remove [record]. Please try again." |
| **Submit Rollcall** | "Save Session" button disables and shows "Processing..." | Form clears, user redirected to Logs tab, green success toast | Red error toast indicating which records failed to save. |
