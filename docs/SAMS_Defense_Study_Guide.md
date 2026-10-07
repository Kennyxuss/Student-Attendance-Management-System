# SAMS Final Defense: Team Study Guide & Master Script

**Project:** Student Attendance Management System (SAMS)
**Defense Date:** This Thursday
**Rule:** UNASSISTED (No AI, individual evaluation)

---

## 📖 Part 1: System Architecture (Memorize This!)
If the professor asks "How does your system work under the hood?", this is what you need to know:

1. **The Frontend (The Client)**
   * **Tech:** HTML5, CSS3, JavaScript, Bootstrap 5.
   * **How it talks to the backend:** We use asynchronous JavaScript `fetch()` calls. This means when a user clicks "Save", the page doesn't reload. Instead, JavaScript secretly sends a JSON package to the backend, waits for the response, and updates the UI dynamically.
   
2. **The Backend (The Server)**
   * **Tech:** Python (Custom Server).
   * **How it works:** Instead of using a heavy framework like Django or Laravel, we built a custom `BaseHTTPRequestHandler` and `APIRouter`. 
   * **The Flow of a Request:** 
     1. The Router catches the URL (e.g., `POST /api/students`).
     2. It passes the data through `guards.py` (Validation).
     3. If valid, it goes to the `thin_controllers.py` (Business Logic).
     4. The controller tells the `repository.py` to save it to the database.

3. **The Database**
   * **Tech:** MySQL (with a local JSON fallback `data/seed_data.json` used for rapid prototyping).

---

## 🛡️ Part 2: Security & Error Handling (Crucial for Grade)

**1. Cross-Site Scripting (XSS) Vulnerability**
* **The Bug:** During QA (Week 10), we realized if someone typed `<script>alert('hacked')</script>` as a student's name, the browser would execute it because we were using `innerHTML`.
* **The Fix:** We wrote an `escapeHTML` function in `app.js` that converts dangerous characters (like `<` and `>`) into safe text before putting them on the screen.

**2. Where does Validation live?**
* It lives at the **boundary**. We check for empty fields and bad data in `src/guards.py` *before* the data is allowed to reach our database.

**3. HTTP Status Codes we use:**
* **200 OK / 201 Created:** Success!
* **404 Not Found:** Trying to delete or view an ID that doesn't exist.
* **422 Unprocessable Entity:** The user submitted a blank form or invalid data.
* **500 Internal Server Error:** The Python server crashed (network drop).

---

## 🎭 Part 3: Individual Roles & Scripts

### 📝 Jamaica (Scribe) - Introduction
* **Your Job:** Hook the audience and explain the problem.
* **Script:** "Good morning. Traditional attendance at tutoring centers relies on paper, which is easy to lose and hard to track. We built SAMS to digitize this process. Our system handles four main entities: Students, Instructors, Classes, and Attendance Records. As the Scribe, my role was to translate these real-world problems into our backlog and user stories so the Builders knew exactly what to create."

### 📋 Demelyn (Board Lead) - QA & Project Management
* **Your Job:** Explain how the team stayed organized and tested the app.
* **Script:** "To build this in 12 weeks, we strictly used a GitHub Project Board. Every feature was a ticket. As Board Lead, I made sure we didn't just build the 'happy path'. In Week 10, we enacted a Feature Freeze and did Adversarial Testing. We built a Test Matrix, logged bugs by severity (P0, P1), and ensured they were fixed before deployment."

### 🔧 Neil (Repository Lead) - Architecture & Deployment
* **Your Job:** Explain the backend and how code was managed.
* **Script:** "As Repo Lead, I enforced Branch Protection—no code hit the `main` branch without a peer review. Our backend uses a custom Python `APIRouter` and Thin Controllers. We chose this over a framework to deeply understand HTTP methods. We also secured our configuration using `.env` variables so no secret keys are hardcoded in our GitHub."

### 💻 Angelo Dairo (Builder) - Frontend & UI Demo
* **Your Job:** Show off the interface and explain UI States.
* **Script:** "I focused on building a seamless UI using HTML, CSS, and Bootstrap. Notice our 'Empty States' when no data exists. *(Demo: Create a Student/Class)*. When I click save, the button disables and shows a spinner to prevent duplicate submissions. We also handle network errors gracefully with our Toast notification system instead of crashing the page."

### 🔌 Angelo Madolaria (Builder) - Integration & Edge Cases
* **Your Job:** Show off the complex logic (Rollcall) and bug fixes.
* **Script:** "I focused on tying the frontend to our Python backend asynchronously. Let's look at Roll Call. *(Demo: Take attendance)*. During QA, we found a P1 bug where the system allowed submitting a rollcall for a class with zero students. I helped patch this logic so the system now properly validates roster size before sending the network request."

---

## ❓ Part 4: Mock Q&A (Flashcards for the Professor's Questions)

**Q: "Why did you use a JSON file instead of setting up MySQL immediately?"**
> **Answer:** "We used JSON as a fallback for Phase 1-6 so we could rapidly prototype the controllers and frontend without dealing with database connectivity issues. Our `Repository` pattern makes it easy to swap the JSON logic for SQL queries later without changing our controllers."

**Q: "What happens if I turn off my Wi-Fi right before clicking Save?"**
> **Answer:** "Our JavaScript `fetch` calls are wrapped in `try/catch` blocks. The app will catch the network failure and trigger a red Toast notification in the corner saying 'Network Error', and it will re-enable the save button. It will not freeze or crash."

**Q: "How do you ensure someone doesn't submit a student with a blank name?"**
> **Answer:** "We have double validation. The frontend uses HTML5 `required` tags, but the true security is on the backend in `guards.py`. It intercepts the payload and returns a `422 Unprocessable Entity` error if the name is blank."

**Q: "What was the hardest part of the project?"**
> **Answer:** "Handling Asynchronous UI states. It was challenging to make sure the Loading spinner appeared, the database updated, and the table refreshed with the new data in the exact right order without refreshing the whole web page."
