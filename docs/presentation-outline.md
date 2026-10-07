# Final Presentation & Oral Defense Guide

## Part 1: Presentation Arc & Demo Script

### Slide 1: The Problem
- Tracking attendance across cohorts on paper or spreadsheets is error-prone, hard to audit, and doesn't scale for instructors managing multiple courses.

### Slide 2: The Solution (SAMS)
- A centralized, real-time web application.
- Instructors can manage student rosters, create courses, and take batch attendance (Rollcall) in a single click.

### Slide 3: Architecture (Following a Request)
- **Frontend:** Vanilla JS using async `fetch()`.
- **The Journey:** User clicks "Save" -> JS sends JSON POST request -> Python `BaseHTTPRequestHandler` catches it -> passes to `APIRouter` -> `guards.py` validates it -> `ThinController` processes it -> `Repository` saves it.

### Slide 4 & 5: Live Demo Click-Path
1. **Happy Path:**
   - Show Dashboard stats.
   - Go to Students tab -> Create a new student ("Jane Doe").
   - Go to Rollcall tab -> Select a course -> Mark Jane as "Present" -> Submit.
   - Go to Records tab -> Show the new log.
2. **Graceful Failure Path:**
   - Go to Courses tab -> Click Add Course -> Leave "Course Code" blank -> Hit Submit.
   - *Result:* Point out the inline red 422 error and explain how the server rejected the bad payload safely.

---

## Part 2: Unassisted Oral Defense Prep (Study Guide)
*AI is OFF for this part. You will explain the code yourself. Use this to prepare.*

**Q1: Why did you choose this architectural approach (Custom Router + Thin Controllers)?**
> *Answer:* We built our own `APIRouter` instead of using Flask/Django to deeply understand how HTTP works under the hood (parsing URLs, handling headers, extracting JSON bytes). Thin controllers ensure that our business logic is separated from our HTTP transport layer, making it highly testable.

**Q2: What happens on invalid input or a missing record?**
> *Answer:* If a user submits an empty field, our `guards.py` intercepts the payload *before* the controller. It returns a `422 Unprocessable Entity` with a specific `field` identifier. If a user tries to delete an ID that doesn't exist, the Repository returns `None` or `False`, and the controller returns a `404 Not Found`.

**Q3: Where does validation live?**
> *Answer:* Validation lives at the exact boundary of the application in `src/guards.py`. It is hooked into the `APIRouter` pipeline, so bad data never infects the internal controllers.

**Q4: How did you fix the XSS vulnerability?**
> *Answer:* We realized `innerHTML` was executing arbitrary HTML/Scripts. We fixed it by creating an `escapeHTML` regex function in `app.js` that converts characters like `<` and `>` into safe HTML entities (`&lt;`, `&gt;`) before rendering them into the table.

**Q5: What would you improve next?**
> *Answer:* I would migrate the in-memory JSON `Repository` to an actual SQLite or PostgreSQL database. I would also add user authentication so students and instructors have different permissions.
