# UI Components & Screen Mapping (Week 6)

**System**: Student Attendance Management System (SAMS)
**Lab**: Week 6 — Building Your Views (AI ✅ ON Phase)

---

## 🧩 Reusable Components

| Component Name | Description | Authoring Origin |
|---|---|---|
| **Sidebar Navigation** | Vertical menu with branding and links to modules. | Hand-written (Week 1) + AI-modified |
| **Topbar Header** | Page title, subtitle, and primary action buttons. | Hand-written (Week 1) |
| **Data Table** | Responsive table structure with headers (`<thead>`) and body (`<tbody>`). | AI-generated |
| **List Row** | Standardized table row (`<tr>`) containing data cells (`<td>`) and action buttons. | AI-generated |
| **Status Badge** | Small pill-shaped indicator (`<span>`) for statuses like Active, Present, Absent. | AI-generated |
| **Modal Dialog** | Overlay container for Create/Edit forms with header, body, and footer actions. | AI-modified |
| **Form Row** | Grouped input fields with labels and standard spacing. | AI-generated |
| **Stat Card** | Dashboard widget showing a label, prominent numeric value, and subtitle. | AI-generated |
| **State Placeholder** | Reusable block for Empty, Loading, or Error states (icon + text). | AI-generated (Week 6) |

---

## 📱 Screen Mapping

### 1. Dashboard (`/`)
- **Components Used**: Sidebar Navigation, Topbar Header, Stat Card (x4), Data Table (Recent Logs), List Row, Course Summary Cards.

### 2. Student Directory (`/students`)
- **Components Used**: Sidebar Navigation, Topbar Header, Data Table, List Row (Student specific), Status Badge, Modal Dialog (for Add/Edit), Form Row, State Placeholder (Empty/Loading/Error).

### 3. Course Catalog (`/courses`)
- **Components Used**: Sidebar Navigation, Topbar Header, Data Table, List Row (Course specific), Modal Dialog (for Add/Edit), Form Row, State Placeholder (Empty/Loading/Error).

### 4. Roll Call Interface (`/rollcall`)
- **Components Used**: Sidebar Navigation, Topbar Header, Form Row (Filters), Data Table (Roster), List Row (with interactive status select), State Placeholder (Empty roster).

### 5. Attendance Logs (`/records`)
- **Components Used**: Sidebar Navigation, Topbar Header, Form Row (Search), Data Table, List Row, Status Badge, State Placeholder (Empty/Loading/Error).
