# Week 8 AI Note — Scaffold & Review Log

**Course Module**: Software Engineering Lab — Week 8 (Error Handling & Feedback)  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  
**AI Rule**: ✅ ON (Disclosure and review required)

---

## AI Prompt Log

### Prompt 1: Building a Shared Toast Feedback System
**User:** 
> "Generate a simple, reusable CSS and JavaScript 'Toast' notification system. It should not rely on external libraries. It needs a container in the bottom right, and support 'success', 'error', and 'info' states. Give me the CSS and a function `showToast(message, type)`."

**AI Output Result & Review:**
- The AI created a clean CSS animation (translating from `Y(10px)` to `0`) and a JavaScript helper that safely appends elements and manages `setTimeout` for removal.
- **Modifications made by team**: Adjusted the CSS color variables to match our existing `style.css` palette (`--success`, `--danger`, `--primary`). Added a `fade-out` class to manually control the exit animation timing.

### Prompt 2: Refactoring Delete Actions for Async Lifecycles
**User:**
> "Rewrite the `deleteStudent(id)` function so that it accepts a reference to the clicked button (`btn`). First it should confirm the deletion. Then it should disable the button and change its text to '...'. Then it should await a `fetch` DELETE call. If it succeeds, use `showToast` and reload the data. If it fails, show an error toast and restore the button state."

**AI Output Result & Review:**
- The AI provided a robust `try/catch` block handling the asynchronous deletion perfectly.
- **Modifications made by team**: Expanded this logic manually to `deleteCourse` and `deleteAttendance`. We also added a global loading state (opacity fade) to the tables during data hydration to prevent flickering.

---

## Component Origin Declaration

In compliance with the Phase 3 academic integrity policy, the origins of the logic bindings are declared as follows:

- **Toast System (CSS/JS)**: AI-generated, Hand-modified (colors, timing).
- **Global Table Opacity Loading State**: Hand-written.
- **Async Delete Function refactors**: AI-generated.
- **Feedback Matrix**: Hand-written.
