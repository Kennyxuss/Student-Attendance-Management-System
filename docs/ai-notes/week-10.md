# Week 10 AI Note — QA Scaffolding

**Course Module**: Software Engineering Lab — Week 10 (Manual QA & Bug Hunting)  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  
**AI Rule**: ✅ ON for test scaffolding (but humans drive the QA matrix).

---

## AI Prompt Log

### Prompt 1: Scaffolding the QA Edge Case Tests
**User:** 
> "Write a Python `unittest` suite called `test_week10_qa.py`. Scaffold tests targeting the 'unhappy paths' for `StudentController` and `CourseController` based on our Week 5 thin controllers. Specifically test that deleting/updating non-existent IDs yields a 404, and that string cleaning (like stripping whitespace or lowercasing emails) actually works as intended."

**AI Output Result & Review:**
- The AI correctly mocked the in-memory repository and targeted the 404 logic in the controllers.
- The tests accurately reflect our edge cases in the QA Matrix.
- **Modifications**: None required. The tests passed on the first run, solidifying our confidence in the backend boundary handling.
