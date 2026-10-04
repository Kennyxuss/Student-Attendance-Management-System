# Week 11 AI Note — Scaffold & Review Log

**Course Module**: Software Engineering Lab — Week 11 (Fix, Clean Up & Ship)  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  
**AI Rule**: ✅ ON (AI generates fixes, Humans review and sign-off)

---

## AI Prompt Log

### Prompt 1: Fixing the P0 XSS Vulnerability
**User:** 
> "In `app.js`, we use `tr.innerHTML` to render tables, which leaves us exposed to XSS from fields like `first_name`. Write me an `escapeHTML` javascript helper function and apply it to the user-supplied variables in `renderStudentsTable`, `renderCoursesTable`, and `renderAttendanceRecords`."

**AI Output Result & Review:**
- The AI correctly generated a RegEx-based HTML escaper `replace(/[&<>'"]/g, ...)` that converts dangerous tags into HTML entities.
- We reviewed the modifications to `app.js` and confirmed the `escapeHTML()` wrapper successfully neutered the malicious `<script>` and `<img onerror>` tags we planted during Week 10. 

### Prompt 2: Refactoring Configs (Tech Debt)
**User:**
> "Refactor `server.py` to use environment variables instead of hard-coded configurations. Add support for `APP_DEBUG` and `PORT`. Then create a `.env.example` file documenting the necessary variables."

**AI Output Result & Review:**
- The AI replaced the hardcoded configurations with `os.environ.get()` defaults.
- The `log_message` in our BaseHTTPRequestHandler was updated to dynamically suppress stdout spam when `APP_DEBUG` is false in production. 
- The configuration works seamlessly for our Render deployment!
