# Deliverable 1 — Scoping & Wireframes

## Project

**Student Attendance Management System**

---

# 1. Problem Statement

Traditional attendance recording may involve paper attendance sheets, manual encoding, and separate records that can be difficult to monitor and summarize.

The proposed **Student Attendance Management System** provides a centralized digital platform where administrators can manage academic records, instructors can record and review attendance, and students can view their enrolled classes and personal attendance records.

The system aims to make attendance management more organized, accessible, and efficient.

---

# 2. Target Users

## Admin

The administrator manages the overall system and academic records.

Main responsibilities:

- Student management
- Instructor management
- Course management
- Department management
- Subject management
- Class management
- Student enrollment
- User accounts
- Attendance reports
- System activity logs
- Absence notifications

---

## Instructor

The instructor manages assigned classes and attendance.

Main responsibilities:

- View assigned classes
- View class schedules
- View student lists
- Take attendance
- Review student check-ins
- View attendance history
- Generate attendance reports
- Manage profile settings

---

## Student

The student uses the system to monitor personal attendance information.

Main responsibilities:

- View dashboard
- View enrolled classes
- Perform self-attendance check-in
- View attendance history
- View attendance report
- Manage profile settings

---

# 3. Primary Record Types

## Students

Student information includes:

- Student ID
- Student Name
- Course
- Year Level
- Account Status

## Instructors

Instructor information includes:

- Instructor ID
- Instructor Name
- Department
- Assigned Subjects
- Account Status

## Classes

Class information includes:

- Class ID
- Subject
- Instructor
- Schedule
- Enrolled Students

## Attendance Records

Attendance information includes:

- Attendance ID
- Student
- Class
- Date
- Time
- Status

Attendance status:

- Present
- Late
- Absent

---

# 4. CRUD Requirements

| Record | Create | Read | Update | Delete |
|---|---|---|---|---|
| Students | ✓ | ✓ | ✓ | ✓ |
| Instructors | ✓ | ✓ | ✓ | ✓ |
| Courses | ✓ | ✓ | ✓ | ✓ |
| Departments | ✓ | ✓ | ✓ | ✓ |
| Subjects | ✓ | ✓ | ✓ | ✓ |
| Classes | ✓ | ✓ | ✓ | ✓ |
| Enrollment | ✓ | ✓ | ✓ | ✓ |
| Attendance | ✓ | ✓ | ✓ | Controlled |
| User Accounts | ✓ | ✓ | ✓ | Controlled |

---

# 5. Wireframe Inventory

## Authentication

```text
login.png