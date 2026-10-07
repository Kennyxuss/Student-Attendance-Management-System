# Week 7 AI Note — Scaffold & Review Log

**Course Module**: Software Engineering Lab — Week 7 (Binding Forms to the Backend)  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  
**AI Rule**: ✅ ON (Disclosure and review required)

---

## AI Prompt Log

### Prompt 1: Scaffolding the `fetch` Logic for the Forms
**User:** 
> "Refactor the 'form-student' submit event listener to use `async/await` and `fetch`. It should POST to `/api/students` if it's a new record, and PUT to `/api/students/<id>` if editing. Disable the button during the request. Handle 201/200 for success, and show an inline error if a 422 is returned, extracting the `field` property from the JSON response."

**AI Output Result & Review:**
- The AI produced the `fetch` block perfectly.
- **Modifications made by team**: 
  - Adjusted the inline error DOM insertion to perfectly match our `public/style.css` error colors (`var(--danger)`).
  - Ensured the spinner logic (`span.spinner`) was injected natively without requiring additional CSS classes beyond what we wrote in Week 6.
  - Replicated the same structured logic for `form-course`.

---

## Component Origin Declaration

In compliance with the Phase 3 academic integrity policy, the origins of the logic bindings are declared as follows:

- **DOM Event Listeners & Basic Payload Collection**: Hand-written (Week 1 & 6)
- **`fetch()` API lifecycle & Promise handling**: AI-generated
- **422 Inline Error DOM Manipulation**: AI-generated, Hand-modified
- **`loadFromServer` Sync Logic**: AI-generated
