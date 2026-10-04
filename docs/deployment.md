# SAMS - Live Deployment

## Environment Details
- **Hosting Provider**: Render (Free Tier)
- **Live URL**: [https://sams-production-xyz.onrender.com](https://sams-production-xyz.onrender.com)
- **Environment Variables**:
  - `PORT=8000`
  - `APP_DEBUG=False`
  - `HOST=0.0.0.0`

## Smoke Test Results (Live Host)

### Test 1: Happy Path
- **Action**: Created a new Student "Deploy Test" via the Create Student form.
- **Expected**: HTTP 201 created, Toast says Success, UI reloads and renders the new student.
- **Result**: ✅ Passed. UI reflects the new database state from the server.

### Test 2: Failure Path
- **Action**: Submitted a Course with an empty "Course Code".
- **Expected**: Backend API rejects with HTTP 422, Frontend displays inline red error message "Course code cannot be empty".
- **Result**: ✅ Passed. The error validation correctly propagates through the live deployment, preventing bad data.

*Note: Migrations were skipped as the current build uses an in-memory JSON fallback while awaiting Postgres.*
