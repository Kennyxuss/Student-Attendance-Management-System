## STUDENT-ATTENDANCE-MANAGEMENT-SYSTEM ##

## Project Description

Traditional attendance recording at small tutoring centers often relies on paper sign-in sheets, making it difficult for instructors to review attendance history or for the center to identify students who are frequently absent. The **Student Attendance Management System** is a web-based application that gives instructors a simple digital way to record daily attendance per class, and gives the center admin a way to manage students, classes, and view attendance summaries — replacing the paper process with a centralized, searchable system.

*(Replace "small tutoring center" above with the team's actual target organization.)*

The system has two main user roles:

- **Admin** – manages students, instructors, classes, and views attendance reports across the center.
- **Instructor** – manages assigned classes, takes attendance per session, and reviews attendance history for their classes.

> **Note:** A student self-service portal (login, self-check-in, personal dashboard) was considered but cut from the current scope to keep the project achievable within 12 weeks. It may be revisited as a stretch goal in later weeks if time allows.

---

## Team Members

- **Repo Lead** — Neil Herbert U. Betacura
- **Board Lead** — Demelyn Concepcion
- **Scribe** — Jamaica Ganolon
- **Builder** — Angelo Dairo
- **Builder** — Angelo Madolaria

---

## CRUD Operations

- **Create** — Add students, instructors, classes, and attendance records.
- **Read** — View student information, instructor information, classes, schedules, and attendance history.
- **Update** — Edit student, instructor, class, and attendance information.
- **Delete** — Remove or deactivate outdated or incorrect records when authorized (controlled delete for attendance records).

---

## Related Record Types

1. **Students**
   - Student ID
   - Student Name
   - Class(es) Enrolled
   - Account Status

2. **Instructors**
   - Instructor ID
   - Instructor Name
   - Assigned Classes
   - Account Status

3. **Classes**
   - Class ID
   - Class Name
   - Instructor
   - Schedule

4. **Attendance Records**
   - Attendance ID
   - Student
   - Class
   - Date
   - Status (Present / Late / Absent)

---

## CRUD Requirements

| Record | Create | Read | Update | Delete |
|---|---|---|---|---|
| Students | ✓ | ✓ | ✓ | ✓ |
| Instructors | ✓ | ✓ | ✓ | ✓ |
| Classes | ✓ | ✓ | ✓ | ✓ |
| Attendance | ✓ | ✓ | ✓ | Controlled |

---

## Main Features

### Admin

- Admin Dashboard
- Student Management
- Instructor Management
- Class Management
- Attendance Reports

### Instructor

- Instructor Dashboard
- My Classes
- Take Attendance
- Attendance History
- Profile Settings

---

## Repository Structure

```text
Student-Attendance-Management-System/
│
├── README.md
├── .gitignore
│
├── docs/
   │
   ├── backlog.md
   │
   ├── ai-notes/
   │   └── deliverables-1.md
   │
   └── wireframes/
       │
       ├── login.png
       │
       ├── admin/
       │   ├── dashboard.png
       │   ├── student-management.png
       │   ├── instructor-management.png
       │   ├── class-management.png
       │   └── attendance-report.png
       │
       ├── instructor/
       │   ├── dashboard.png
       │   ├── classes.png
       │   ├── take-attendance.png
       │   ├── attendance-history.png
       │   └── profile-settings.png
       │
       └── states/
           ├── empty-state.png
           ├── error-state.png
           ├── loading-state.png
           ├── success-state.png
           └── delete-confirmation.png
```

## Technology Stack
- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend:** Python
- **Database:** MySQL
- **Version Control:** Git & GitHub
- **Code Editor:** Visual Studio Code
