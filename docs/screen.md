# System Screens

This document contains the list and description of the screens included in the Student Attendance Management System.

## Screen List

| # | Screen | File | Description |
|---|---|---|---|
| 1 | Login | `login.png` | Allows authorized users to securely access the system. |
| 2 | Dashboard | `dashboard.png` | Displays an overview of the attendance system and key information. |
| 3 | Students | `students.png` | Displays the list of registered students and available management actions. |
| 4 | Create Student | `create-student.png` | Allows users to add a new student. |
| 5 | Edit Student | `edit-student.png.` | Allows users to modify existing student information. |
| 6 | Delete Confirmation | `delete-confirmation.png.` | Confirms before deleting a student record. |
| 7 | Attendance | `attendance.png` | Allows users to record and manage student attendance. |
| 8 | Reports | `reports.png` | Displays attendance information and reports. |
| 9 | Empty State | `empty-state.png` | Displays when there are no records available. |
| 10 | Error State | `error-state.png` | Displays when an error occurs in the system. |

---

## 1. Login Screen

**File:** `login.png`

The Login Screen is the entry point of the system. Users must provide valid credentials before accessing the Student Attendance Management System.

### Components
- Username field
- Password field
- Login button
- System logo/branding
- Error or validation message

---

## 2. Dashboard Screen

**File:** `dashboard.png`

The Dashboard provides an overview of the system after successful login.

### Components
- Navigation menu
- Student statistics
- Attendance statistics
- Quick actions
- Recent information
- System overview

---

## 3. Students Screen

**File:** `students.png`

The Students Screen displays the registered students in the system.

### Components
- Student table
- Student ID
- Student name
- Course/Section
- Search functionality
- Add Student button
- Edit action
- Delete action

### Purpose

Allows authorized users to view and manage student records.

---

## 4. Create Student Screen

**File:** `create-student.png`

The Create Student Screen is used to register a new student.

### Components
- Student ID
- Student name
- Course/Section
- Required student information
- Save button
- Cancel button

### Purpose

Allows users to add a new student record to the system.

---

## 5. Edit Student Screen

**File:** `edit-student.png.png`

The Edit Student Screen allows users to update information belonging to an existing student.

### Components
- Existing student information
- Editable fields
- Update button
- Cancel button

### Purpose

Allows users to correct or update student information.

> **Note:** Rename `edit-student.png.png` to `edit-student.png` if the duplicated `.png` extension is accidental.

---

## 6. Delete Confirmation Screen

**File:** `delete-confirmation.png.png`

The Delete Confirmation Screen appears when a user attempts to delete a student record.

### Components
- Confirmation message
- Student information
- Delete/Confirm button
- Cancel button

### Purpose

Prevents accidental deletion of student records.

> **Note:** Rename `delete-confirmation.png.png` to `delete-confirmation.png` if the duplicated `.png` extension is accidental.

---

## 7. Attendance Screen

**File:** `attendance.png`

The Attendance Screen is used to record student attendance.

### Components
- Student list
- Attendance date
- Present status
- Absent status
- Late status
- Save Attendance button

### Purpose

Allows teachers or authorized users to record and save student attendance.

---

## 8. Reports Screen

**File:** `reports.png`

The Reports Screen provides summarized attendance information.

### Components
- Attendance records
- Student information
- Attendance statistics
- Date filtering
- Search/filter options
- Report generation

### Purpose

Allows users to review attendance performance and generate attendance reports.

---

## 9. Empty State Screen

**File:** `empty-state.png`

The Empty State Screen is displayed when there are no available records or data.

### Examples
- No students registered
- No attendance records
- No search results
- No reports available

### Purpose

Provides clear feedback instead of displaying a blank screen.

---

## 10. Error State Screen

**File:** `error-state.png`

The Error State Screen is displayed when the system encounters an unexpected problem.

### Examples
- Database connection failure
- Server error
- Failed data retrieval
- Invalid operation

### Purpose

Informs users that an error occurred and provides an appropriate action such as retrying.

---

# Screen Navigation Flow

```text
Login
  |
  v
Dashboard
  |
  +----> Students
  |         |
  |         +----> Create Student
  |         |
  |         +----> Edit Student
  |         |
  |         +----> Delete Confirmation
  |
  +----> Attendance
  |
  +----> Reports
