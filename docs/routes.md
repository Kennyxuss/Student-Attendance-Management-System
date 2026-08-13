# Attendance Management System
# Week 3 Routing Table

## Student Management

| Method | Path | Handler | User Story |
|---|---|---|---|
| POST | /students | createStudent | US-001 Add Student |
| GET | /students | listStudents | US-002 View Student List |
| GET | /students/:id | showStudent | US-003 View Student Details |
| PUT | /students/:id | updateStudent | US-004 Edit Student |
| DELETE | /students/:id | deleteStudent | US-005 Delete Student |

## Teacher Management

| Method | Path | Handler | User Story |
|---|---|---|---|
| POST | /teachers | createTeacher | US-006 Add Teacher |
| GET | /teachers | listTeachers | US-007 View Teacher List |
| GET | /teachers/:id | showTeacher | US-008 View Teacher Details |
| PUT | /teachers/:id | updateTeacher | US-009 Edit Teacher |
| DELETE | /teachers/:id | deleteTeacher | US-010 Delete Teacher |

## Subject Management

| Method | Path | Handler | User Story |
|---|---|---|---|
| POST | /subjects | createSubject | US-011 Add Subject |
| GET | /subjects | listSubjects | US-012 View Subject List |
| GET | /subjects/:id | showSubject | US-013 View Subject Details |
| PUT | /subjects/:id | updateSubject | US-014 Edit Subject |
| DELETE | /subjects/:id | deleteSubject | US-015 Delete Subject |

## Attendance Management

| Method | Path | Handler | User Story |
|---|---|---|---|
| POST | /attendance | createAttendance | US-016 Record Attendance |
| GET | /attendance | listAttendance | US-017 View Attendance List |
| GET | /attendance/:id | showAttendance | US-018 View Attendance Details |
| PUT | /attendance/:id | updateAttendance | US-019 Edit Attendance |
| DELETE | /attendance/:id | deleteAttendance | US-020 Delete Attendance |

## Reports

| Method | Path | Handler | User Story |
|---|---|---|---|
| GET | /reports/attendance | generateAttendanceReport | US-021 Generate Attendance Report |
| GET | /reports/attendance/export | exportAttendanceReport | US-022 Export Report |

## Authentication

| Method | Path | Handler | User Story |
|---|---|---|---|
| POST | /auth/login | login | US-023 Login |
| POST | /auth/logout | logout | US-024 Logout |
| PUT | /auth/change-password | changePassword | US-025 Change Password |