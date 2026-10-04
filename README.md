# Student-Attendance-Management-System

A web-based Student Attendance Management System developed to help tutoring centers and academic institutions manage students, instructors, classes, and attendance efficiently.

## Project Description
The Student Attendance Management System is a web-based application designed to help businesses efficiently manage their attendance operations. It provides tools for managing students, instructors, classes, and attendance records. The system also generates attendance summaries, tracks daily session logs, and monitors class rosters to improve accuracy, reduce manual work, and support better administrative decision-making.

## Problem Statement
Tutoring centers that manage attendance manually may experience difficulties in monitoring students, instructors, and class participation. Manual recording on paper sign-in sheets can make it difficult to maintain accurate attendance information and monitor student absences efficiently. The Student Attendance Management System aims to provide a centralized web-based system for managing student records, instructor information, class schedules, and daily attendance transactions, helping improve attendance accuracy and reduce manual record-keeping.

## Primary Record Types
* **Students** — Records the students enrolled and managed by the center.
* **Instructors** — Records instructor information associated with classes.
* **Classes** — Records the courses and schedules assigned to instructors.
* **Attendance Records** — Records student presence (Present, Late, Absent, Excused) per session.

## 👥 Team Members
| Name | Role | Responsibilities |
|---|---|---|
| **Neil Herbert U. Betacura** | Repository Lead | Managed the GitHub repository, reviewed and merged pull requests, coordinated team collaboration. |
| **Demelyn Concepcion** | Board Lead | Managed the GitHub Project Board, created and organized issues, and tracked task progress. |
| **Jamaica Ganolon** | Scribe | Prepared project documentation, user stories, backlog, and meeting notes. |
| **Angelo Dairo** | Builder | Developed project features, implemented assigned tasks, and contributed code. |
| **Angelo Madolaria** | Builder | Developed project features, implemented assigned tasks, and contributed code. |

## 🎯 Objectives
Simplify attendance management. Reduce manual record keeping. Monitor student absences in real time. Improve reporting accuracy. Generate summaries for administrative decisions.

## ✨ Features

### 🎓 Student Management
* Add new students
* View student list
* Update student information
* Delete students
* Filter students by status

### 👨‍🏫 Instructor Management
* Add instructors
* Update instructor information
* Delete instructors
* View instructor records

### 📚 Class Management
* Manage active courses
* Assign instructors to classes
* Track class enrollments

### 📝 Attendance Management
* Roll Call (Batch take attendance)
* View attendance history logs
* Update individual attendance records
* Delete erroneous records

### 📊 Reports & Analytics
* Real-time dashboard summaries
* Overall attendance rate tracking
* Recent activity logs

### ⚙️ System UI & Settings
* Global loading indicators
* Interactive feedback (Toasts)
* Graceful error handling (404/422/500)

## 📷 System Screenshots
| Dashboard | Students Directory |
|---|---|
| *(See `docs/wireframes/admin/dashboard.png`)* | *(See `docs/wireframes/admin/student-management.png`)* |
| **Course Management** | **Instructor Management** |
| *(See `docs/wireframes/admin/class-management.png`)* | *(See `docs/wireframes/admin/instructor-management.png`)* |
| **Roll Call (Take Attendance)** | **Attendance Records (Logs)** |
| *(See `docs/wireframes/instructor/take-attendance.png`)* | *(See `docs/wireframes/instructor/attendance-history.png`)* |

## 🚀 Future Improvements
Student Self-Service Portal • QR Code Check-ins • Email Notifications to Parents • Automated Absence Alerts • Multi-Branch Center Support • Mobile Responsive Design

---

## Testing

### How to Run Automated Tests
Open the project directory in Command Prompt or terminal.
Make sure Python 3 is installed.
Run the automated test suite using the `unittest` command:
```bash
python -m unittest discover -s tests -p "test_*.py"
```
This command runs all automated tests in the project to verify that the application's features work correctly and that changes have not introduced errors.

## Local Run Instructions

Deliverable 3 & 4 uses a custom Python HTTP server as the backend for the bound catalog features.

**1. Configure the environment (Optional)**
Create or update `.env` (or copy `.env.example`) with your local settings.

**2. Start the Server**
Run the unified Python server:
```bash
python server.py
```

**3. Open the Application**
Open your browser and navigate to: http://localhost:8000

**4. Deliverable 3 & 4 verification**
With the server running, verify Student, Course, and Attendance create/update/delete flows where applicable. Also check loading feedback, validation errors, not-found handling, server/network feedback, and confirmation behavior. See `docs/feedback-tests.md` and `docs/deployment.md`.
