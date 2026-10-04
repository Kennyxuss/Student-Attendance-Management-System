# Week 6 AI Note — Scaffold & Review Log

**Course Module**: Software Engineering Lab — Week 6 (Building Your Views)  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  
**AI Rule**: ✅ ON (Disclosure and review required)

---

## AI Prompt Log

### Prompt 1: Scaffolding the Empty, Loading, and Error States
**User:** 
> "Generate semantic HTML and CSS for three reusable UI states: Loading, Empty, and Error. The Loading state should have a spinner. The Empty state should have a placeholder icon and a message. The Error state should look like a red alert banner. Use the CSS variables already present in our project (`--primary`, `--danger`, `--text-muted`)."

**AI Output Result & Review:**
- The AI produced clean, semantic HTML (`<div class="state-container">`, etc.) and CSS keyframes for a spinner.
- **Modifications made by team**: Adjusted the padding and font sizes to match the existing SAMS typography scale. Replaced the AI's SVG icon with an emoji to match our current iconography style (e.g., 📭 for empty, ⚠️ for error, ⏳ for loading).

### Prompt 2: Refining the Modal Form Component
**User:**
> "Refactor this existing modal HTML to ensure better accessibility and semantic structure for screen readers."

**AI Output Result & Review:**
- The AI suggested adding `aria-labelledby`, `aria-modal="true"`, and `role="dialog"` to the modal container.
- **Modifications made by team**: Kept all accessibility attributes. Integrated them into the existing `index.html` file manually to avoid overwriting custom class names.

---

## Component Origin Declaration

In compliance with the Phase 3 academic integrity policy, the origins of the views are declared as follows:

- **Sidebar & Topbar**: Hand-written (Week 1)
- **Data Table & List Rows**: AI-generated (scaffolded), Hand-modified
- **Status Badges**: AI-generated
- **Modal Dialogs**: AI-modified (accessibility attributes added)
- **State Placeholders (Empty/Loading/Error)**: AI-generated, Hand-modified (Week 6)
