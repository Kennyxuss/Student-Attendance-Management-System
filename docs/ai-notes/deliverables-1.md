# Deliverable 1 — Scoping & Wireframes

## Project
**Student Attendance Management System**

---

## 1. Problem Statement

A small tutoring center currently tracks student attendance using paper sign-in sheets, making it difficult for instructors to review attendance history or for the center to identify students who are frequently absent. The **Student Attendance Management System** gives instructors a simple digital way to record daily attendance per class, and gives the center admin a way to manage students, classes, and view attendance summaries — replacing the paper process with a centralized, searchable system.

*(Replace "a small tutoring center" with the actual local business/organization your team is targeting.)*

---

## 2. Target Users

### Admin
The administrator manages the core records and reviews attendance across the center.

Main responsibilities:
- Manage students
- Manage instructors
- Manage classes
- View attendance reports across all classes

### Instructor
The instructor manages their assigned classes and records attendance.

Main responsibilities:
- View assigned classes
- Take attendance per class session
- View attendance history for their classes

> **Note:** A student self-service portal (login, self-check-in, personal dashboard) was considered but cut from this scope. It adds authentication and session-handling complexity that isn't necessary for a 12-week MVP. It can be revisited as a stretch goal in later weeks if time allows.

---

## 3. Primary Record Types

### Students
- Student ID
- Student Name
- Class(es) Enrolled
- Account Status

### Instructors
- Instructor ID
- Instructor Name
- Assigned Classes
- Account Status

### Classes
- Class ID
- Class Name
- Instructor
- Schedule

### Attendance Records
- Attendance ID
- Student
- Class
- Date
- Status (Present / Late / Absent)

---

## 4. CRUD Requirements

| Record | Create | Read | Update | Delete |
|---|---|---|---|---|
| Students | ✓ | ✓ | ✓ | ✓ |
| Instructors | ✓ | ✓ | ✓ | ✓ |
| Classes | ✓ | ✓ | ✓ | ✓ |
| Attendance | ✓ | ✓ | ✓ | Controlled |

---

## 5. Wireframe Inventory

### Authentication
- login.png

### Admin
- dashboard.png
- student-management.png
- instructor-management.png
- class-management.png
- attendance-report.png

### Instructor
- dashboard.png
- classes.png
- take-attendance.png
- attendance-history.png

### States
- empty-state.png
- error-state.png
- loading-state.png
- success-state.png
- delete-confirmation.png
