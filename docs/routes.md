# Week 3 — Routing Skeleton & Stub Handlers Specification

**System**: Student Attendance Management System (SAMS)  
**Lab**: Week 3 — Building Your Routing Skeleton (AI ❌ OFF Phase)  
**Standardized Team Response Shape**: `{ "status": int, "data": any, "error": string | null }`

---

## Task 1: Complete Routing Table

| Method | Path | Handler | Story it serves | Owner |
|---|---|---|---|---|
| **GET** | `/api/students` | `listStudents` | View all students | Builder 1 |
| **GET** | `/api/students/:id` | `showStudent` | View one student profile | Builder 1 |
| **POST** | `/api/students` | `createStudent` | Register a new student | Builder 1 |
| **PUT** | `/api/students/:id` | `updateStudent` | Edit student details | Builder 1 |
| **DELETE** | `/api/students/:id` | `deleteStudent` | Delete a student | Builder 1 |
| **GET** | `/api/courses` | `listCourses` | View all course sections | Builder 2 |
| **GET** | `/api/courses/:id` | `showCourse` | View one course details | Builder 2 |
| **POST** | `/api/courses` | `createCourse` | Add a new course | Builder 2 |
| **PUT** | `/api/courses/:id` | `updateCourse` | Edit course schedule/room | Builder 2 |
| **DELETE** | `/api/courses/:id` | `deleteCourse` | Cancel/delete a course | Builder 2 |
| **GET** | `/api/enrollments` | `listEnrollments` | View course roster enrollments | Scribe |
| **GET** | `/api/enrollments/:id`| `showEnrollment` | View single enrollment entry | Scribe |
| **POST** | `/api/enrollments` | `createEnrollment` | Enroll student into course | Scribe |
| **DELETE** | `/api/enrollments/:id`| `deleteEnrollment` | Drop/unenroll student | Scribe |
| **GET** | `/api/attendance` | `listAttendance` | View attendance records | Board Lead |
| **GET** | `/api/attendance/:id` | `showAttendance` | View one attendance record | Board Lead |
| **POST** | `/api/attendance` | `createAttendance` | Record single attendance entry | Board Lead |
| **PUT** | `/api/attendance/:id` | `updateAttendance` | Excuse or update attendance | Board Lead |
| **DELETE** | `/api/attendance/:id` | `deleteAttendance` | Remove attendance entry | Board Lead |
| **GET** | `/api/health` | `healthCheck` | Service health status | Repo Lead |

---

## Task 2 & 3: Working Stub Handlers & Verified Request / Response Examples

Every stub handler extracts route parameters (`:id`), returns standardized HTTP status codes (200 for reads/updates/deletes, 201 for creates), and follows the team's unified `{ status, data, error }` response schema.

### 1. Students (`Builder 1`)

#### `GET /api/students` (`listStudents`)
- **Request**: `GET /api/students`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "listStudents stub"
  },
  "error": null
}
```

#### `GET /api/students/:id` (`showStudent`)
- **Request**: `GET /api/students/42`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "showStudent stub",
    "id": 42
  },
  "error": null
}
```

#### `POST /api/students` (`createStudent`)
- **Request**: `POST /api/students` with body `{"student_id_number": "STU-001", "first_name": "Elena", "last_name": "Reyes", "email": "elena@example.edu"}`
- **Response** (`201 Created`):
```json
{
  "status": 201,
  "data": {
    "message": "createStudent stub",
    "payload": {
      "student_id_number": "STU-001",
      "first_name": "Elena",
      "last_name": "Reyes",
      "email": "elena@example.edu"
    }
  },
  "error": null
}
```

#### `PUT /api/students/:id` (`updateStudent`)
- **Request**: `PUT /api/students/42` with body `{"email": "elena.updated@example.edu"}`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "updateStudent stub",
    "id": 42,
    "payload": {
      "email": "elena.updated@example.edu"
    }
  },
  "error": null
}
```

#### `DELETE /api/students/:id` (`deleteStudent`)
- **Request**: `DELETE /api/students/42`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "deleteStudent stub",
    "id": 42
  },
  "error": null
}
```

---

### 2. Courses (`Builder 2`)

#### `GET /api/courses` (`listCourses`)
- **Request**: `GET /api/courses`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "listCourses stub"
  },
  "error": null
}
```

#### `GET /api/courses/:id` (`showCourse`)
- **Request**: `GET /api/courses/10`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "showCourse stub",
    "id": 10
  },
  "error": null
}
```

#### `POST /api/courses` (`createCourse`)
- **Request**: `POST /api/courses` with body `{"course_code": "CS-201", "title": "Data Structures", "instructor_name": "Dr. Alan Turing"}`
- **Response** (`201 Created`):
```json
{
  "status": 201,
  "data": {
    "message": "createCourse stub",
    "payload": {
      "course_code": "CS-201",
      "title": "Data Structures",
      "instructor_name": "Dr. Alan Turing"
    }
  },
  "error": null
}
```

#### `PUT /api/courses/:id` (`updateCourse`)
- **Request**: `PUT /api/courses/10` with body `{"room": "Lab 4B"}`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "updateCourse stub",
    "id": 10,
    "payload": {
      "room": "Lab 4B"
    }
  },
  "error": null
}
```

#### `DELETE /api/courses/:id` (`deleteCourse`)
- **Request**: `DELETE /api/courses/10`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "deleteCourse stub",
    "id": 10
  },
  "error": null
}
```

---

### 3. Enrollments (`Scribe`)

#### `GET /api/enrollments` (`listEnrollments`)
- **Request**: `GET /api/enrollments`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "listEnrollments stub"
  },
  "error": null
}
```

#### `GET /api/enrollments/:id` (`showEnrollment`)
- **Request**: `GET /api/enrollments/5`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "showEnrollment stub",
    "id": 5
  },
  "error": null
}
```

#### `POST /api/enrollments` (`createEnrollment`)
- **Request**: `POST /api/enrollments` with body `{"student_id": 42, "course_id": 10}`
- **Response** (`201 Created`):
```json
{
  "status": 201,
  "data": {
    "message": "createEnrollment stub",
    "payload": {
      "student_id": 42,
      "course_id": 10
    }
  },
  "error": null
}
```

#### `DELETE /api/enrollments/:id` (`deleteEnrollment`)
- **Request**: `DELETE /api/enrollments/5`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "deleteEnrollment stub",
    "id": 5
  },
  "error": null
}
```

---

### 4. Attendance Records (`Board Lead`)

#### `GET /api/attendance` (`listAttendance`)
- **Request**: `GET /api/attendance`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "listAttendance stub"
  },
  "error": null
}
```

#### `GET /api/attendance/:id` (`showAttendance`)
- **Request**: `GET /api/attendance/88`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "showAttendance stub",
    "id": 88
  },
  "error": null
}
```

#### `POST /api/attendance` (`createAttendance`)
- **Request**: `POST /api/attendance` with body `{"course_id": 10, "student_id": 42, "session_date": "2026-10-03", "status": "Present"}`
- **Response** (`201 Created`):
```json
{
  "status": 201,
  "data": {
    "message": "createAttendance stub",
    "payload": {
      "course_id": 10,
      "student_id": 42,
      "session_date": "2026-10-03",
      "status": "Present"
    }
  },
  "error": null
}
```

#### `PUT /api/attendance/:id` (`updateAttendance`)
- **Request**: `PUT /api/attendance/88` with body `{"status": "Excused", "remarks": "Doctor note provided"}`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "updateAttendance stub",
    "id": 88,
    "payload": {
      "status": "Excused",
      "remarks": "Doctor note provided"
    }
  },
  "error": null
}
```

#### `DELETE /api/attendance/:id` (`deleteAttendance`)
- **Request**: `DELETE /api/attendance/88`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "deleteAttendance stub",
    "id": 88
  },
  "error": null
}
```

---

### 5. Health Check (`Repo Lead`)

#### `GET /api/health` (`healthCheck`)
- **Request**: `GET /api/health`
- **Response** (`200 OK`):
```json
{
  "status": 200,
  "data": {
    "message": "healthCheck stub",
    "service": "SAMS Routing Skeleton",
    "week": 3
  },
  "error": null
}
```

---

## 🚫 Handling Wrong Methods & Sensible Behavior

If an invalid method is sent to a route (e.g. `DELETE /api/students` without an ID, or requesting an undefined endpoint):
- **Response** (`405 Method Not Allowed` or `404 Not Found`):
```json
{
  "status": 405,
  "data": null,
  "error": "Method DELETE not allowed on /api/students. Did you mean /api/students/:id?"
}
```
All route handlers maintain strict shape consistency `{ status, data, error }`.
