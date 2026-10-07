# Find the Flaw (Week 9)

During our lab session, we reviewed several AI-generated snippets to practice catching subtle bugs, edge cases, and security vulnerabilities. Below are our documented findings.

## Snippet 1: The Unsafe Lookup
**AI Generated Code:**
```python
def get_student_profile(student_id):
    student = repo.find_student_by_id(student_id)
    return {"status": 200, "name": student["first_name"] + " " + student["last_name"]}
```

**The Flaw:**
- **What's wrong:** If the `student_id` doesn't exist in the database, `repo.find_student_by_id` returns `None`. 
- **Why it matters:** Attempting to access `student["first_name"]` on `None` throws a `TypeError`, causing a `500 Internal Server Error` instead of a graceful `404 Not Found`.
- **The Fix:**
```python
def get_student_profile(student_id):
    student = repo.find_student_by_id(student_id)
    if not student:
        return {"status": 404, "error": "Student not found"}
    return {"status": 200, "name": f"{student['first_name']} {student['last_name']}"}
```

## Snippet 2: The Naive Validator
**AI Generated Code:**
```python
def create_course(payload):
    if not payload["course_code"]:
        return {"status": 422, "error": "Course code is required"}
    repo.save(payload)
    return {"status": 201}
```

**The Flaw:**
- **What's wrong:** The code assumes the key `"course_code"` will always be present in the JSON payload.
- **Why it matters:** If a malicious or buggy client sends an empty JSON object `{}`, accessing `payload["course_code"]` raises a `KeyError`, crashing the server (500) instead of rejecting the bad input (422).
- **The Fix:**
```python
def create_course(payload):
    if not payload.get("course_code"):
        return {"status": 422, "error": "Course code is required", "field": "course_code"}
    repo.save(payload)
    return {"status": 201}
```

## Snippet 3: The XSS Vulnerability
**AI Generated Code:**
```javascript
async function searchLogs(query) {
    const res = await fetch(`/api/search?q=${query}`);
    const data = await res.json();
    document.getElementById('results-header').innerHTML = `Results for: ${query}`;
}
```

**The Flaw:**
- **What's wrong:** The user-provided `query` is directly interpolated into the DOM using `.innerHTML`.
- **Why it matters:** This is a textbook Cross-Site Scripting (XSS) vulnerability. If a user searches for `<script>alert('hacked')</script>`, the browser will execute it.
- **The Fix:**
```javascript
async function searchLogs(query) {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    document.getElementById('results-header').textContent = `Results for: ${query}`;
}
```
