# Week 1 AI Note — Brainstorming & Project Scoping Log

**Course Module**: Software Engineering Lab — Week 1 Scaffolding  
**Team**: Student Attendance Management System Team  
**Date**: October 2026  

---

## 1. AI Interaction Prompt Used

```text
Act as a software engineering mentor. Our 5-person team needs to pick a real, local, small-organization problem for a 12-week software engineering project.
Criteria:
1. Involves full CRUD records (Create, Read, Update, Delete).
2. Has 3 to 4 closely related record types (relational data).
3. Easily understandable in one sentence.
4. Manageable for a team to build progressively from Week 1 to Week 12 without scope creep.
Please suggest 5 candidate problems with their core record types and pros/cons.
```

---

## 2. Candidate Ideas Produced

### Candidate 1: Barbershop / Salon Appointment Tracker
- **Records**: Customers, Services/Staff, Appointments, Invoices.
- **Pros**: Clear business flow, easily testable scheduling logic.
- **Cons**: Real-time calendar syncing can easily introduce scope creep during mid-term weeks.

### Candidate 2: Neighborhood Bakery Order & Pre-order Log
- **Records**: Baked Goods (Inventory), Customers, Pre-Orders, Order Items.
- **Pros**: Good inventory depletion logic, straightforward relational schema.
- **Cons**: Payment tracking and perishable shelf-life add unnecessary domain complexity.

### Candidate 3: Student Attendance Management System (Selected) 🏆
- **Records**: Students, Courses/Sections, Enrollments/Rosters, Attendance Records.
- **Pros**:
  - Extremely clear CRUD operations on all 4 entities.
  - Realistic and relatable domain for university/tutoring centers.
  - Natural progression: basic CRUD in Weeks 3–5, dynamic grid UI in Weeks 6–7, aggregation analytics (attendance %) in Week 8, auth/security in Week 9, tests in Week 10, deployment in Week 11.
  - Well-defined boundaries preventing runaway scope creep.
- **Cons**: Requires thoughtful UI design for bulk attendance submission (mitigated in Week 7 plan).

### Candidate 4: Community Tool / Library Lending Register
- **Records**: Members, Items/Tools, Loan Transactions, Maintenance Records.
- **Pros**: Clear check-in/check-out lifecycle.
- **Cons**: Complex condition inspections and overdue fine calculations.

### Candidate 5: Community Clinic Patient Queuing & Visit Log
- **Records**: Patients, Doctors, Appointments/Queue Tickets, Consultation Notes.
- **Pros**: High real-world utility.
- **Cons**: HIPAA/medical privacy compliance introduces sensitive domain constraints.

---

## 3. Team Decision & Rationale

Our team selected **Candidate 3: Student Attendance Management System (SAMS)** because:
1. It precisely satisfies the requirement of having 3–4 tightly related entities (`students`, `courses`, `enrollments`, `attendance_records`).
2. It provides balanced work distribution across the 5 members (backend API, database schema, roll-call interface, analytics, and repo/board management).
3. It fits smoothly into the 12-week timeline without getting bogged down by payment gateways or third-party hardware dependencies.
