// Student Attendance Management System (SAMS) - Core Frontend & State Engine
// Supporting full CRUD across Students, Courses, Enrollments, and Attendance Records

const STORAGE_KEY = 'SAMS_DATA_STORE_V1';

const DEFAULT_STATE = {
  students: [
    { id: 1, student_id_number: 'STU-2026-001', first_name: 'Elena', last_name: 'Reyes', email: 'elena.reyes@example.edu', grade_or_cohort: 'Sophomore - Computer Science', status: 'Active' },
    { id: 2, student_id_number: 'STU-2026-002', first_name: 'Marcus', last_name: 'Chen', email: 'marcus.chen@example.edu', grade_or_cohort: 'Sophomore - Computer Science', status: 'Active' }
  ],
  courses: [
    { id: 1, course_code: 'CS-201', title: 'Data Structures & Algorithms', instructor_name: 'Dr. Alan Turing', term_semester: 'Fall 2026', schedule_time: 'Mon/Wed 10:00 AM - 11:30 AM', room: 'Hall B-102', is_active: true }
  ],
  enrollments: [
    { id: 1, student_id: 1, course_id: 1, enrollment_date: '2026-09-01', status: 'Enrolled' },
    { id: 2, student_id: 2, course_id: 1, enrollment_date: '2026-09-01', status: 'Enrolled' }
  ],
  attendance_records: [
    { id: 1, course_id: 1, student_id: 1, session_date: '2026-10-01', status: 'Present', remarks: 'On time', recorded_by: 'Dr. Alan Turing' }
  ]
};

class Store {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) return JSON.parse(serialized);
    } catch (e) {
      console.warn('Storage unavailable, using memory store');
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save to local storage');
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }

  // --- CRUD: Students ---
  getStudents() { return this.data.students; }
  getStudentById(id) { return this.data.students.find(s => s.id === Number(id)); }
  saveStudent(studentData) {
    if (studentData.id) {
      const idx = this.data.students.findIndex(s => s.id === Number(studentData.id));
      if (idx !== -1) {
        this.data.students[idx] = { ...this.data.students[idx], ...studentData, id: Number(studentData.id) };
      }
    } else {
      const nextId = this.data.students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
      this.data.students.push({ ...studentData, id: nextId });
    }
    this.save();
  }
  deleteStudent(id) {
    this.data.students = this.data.students.filter(s => s.id !== Number(id));
    this.data.enrollments = this.data.enrollments.filter(e => e.student_id !== Number(id));
    this.data.attendance_records = this.data.attendance_records.filter(a => a.student_id !== Number(id));
    this.save();
  }

  // --- CRUD: Courses ---
  getCourses() { return this.data.courses; }
  getCourseById(id) { return this.data.courses.find(c => c.id === Number(id)); }
  saveCourse(courseData) {
    if (courseData.id) {
      const idx = this.data.courses.findIndex(c => c.id === Number(courseData.id));
      if (idx !== -1) {
        this.data.courses[idx] = { ...this.data.courses[idx], ...courseData, id: Number(courseData.id) };
      }
    } else {
      const nextId = this.data.courses.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      this.data.courses.push({ ...courseData, id: nextId });
    }
    this.save();
  }
  deleteCourse(id) {
    this.data.courses = this.data.courses.filter(c => c.id !== Number(id));
    this.data.enrollments = this.data.enrollments.filter(e => e.course_id !== Number(id));
    this.data.attendance_records = this.data.attendance_records.filter(a => a.course_id !== Number(id));
    this.save();
  }

  // --- CRUD: Enrollments ---
  getEnrollments() { return this.data.enrollments; }
  getStudentsForCourse(courseId) {
    const enrolledIds = this.data.enrollments
      .filter(e => e.course_id === Number(courseId))
      .map(e => e.student_id);
    return this.data.students.filter(s => enrolledIds.includes(s.id));
  }

  // --- CRUD: Attendance Records ---
  getAttendanceRecords() { return this.data.attendance_records; }
  addAttendanceRecord(record) {
    const nextId = this.data.attendance_records.reduce((max, a) => Math.max(max, a.id), 0) + 1;
    this.data.attendance_records.push({ ...record, id: nextId });
    this.save();
  }
  deleteAttendanceRecord(id) {
    this.data.attendance_records = this.data.attendance_records.filter(a => a.id !== Number(id));
    this.save();
  }

  calculateStudentRate(studentId) {
    const logs = this.data.attendance_records.filter(a => a.student_id === Number(studentId));
    if (logs.length === 0) return 'N/A';
    const attended = logs.filter(a => a.status === 'Present' || a.status === 'Excused').length;
    return `${Math.round((attended / logs.length) * 100)}%`;
  }
}

const store = new Store();

// --- FEEDBACK & TOAST ENGINE ---
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// XSS Sanitizer (Fix for BUG-001)
const escapeHTML = str => String(str || '').replace(/[&<>'"]/g, tag => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[tag] || tag));

async function loadFromServer() {
  const tables = document.querySelectorAll('.data-table');
  tables.forEach(t => t.style.opacity = '0.5'); // global loading state

  try {
    const [studentsRes, coursesRes, enrollmentsRes, recordsRes] = await Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/courses').then(r => r.json()),
      fetch('/api/enrollments').then(r => r.json()),
      fetch('/api/attendance').then(r => r.json())
    ]);

    store.data.students = studentsRes.data || [];
    store.data.courses = coursesRes.data || [];
    store.data.enrollments = enrollmentsRes.data || [];
    store.data.attendance_records = recordsRes.data || [];
    
    // Fallbacks if data fails
    if(!store.data.students.length) store.data.students = DEFAULT_STATE.students;
    if(!store.data.courses.length) store.data.courses = DEFAULT_STATE.courses;
    
    renderAll();
  } catch (e) {
    showToast('Network error: Unable to sync with server. Using local fallback.', 'error');
    renderAll();
  } finally {
    tables.forEach(t => t.style.opacity = '1');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initModals();
  initRollcallForm();
  
  loadFromServer();

  // Set today's date in rollcall input
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('rollcall-date').value = today;

  document.getElementById('btn-reset-data').addEventListener('click', () => {
    if (confirm('Reset database back to initial seed data?')) {
      store.reset();
      renderAll();
    }
  });

  document.getElementById('btn-quick-attendance').addEventListener('click', () => {
    switchTab('rollcall');
  });

  document.getElementById('records-search').addEventListener('input', (e) => {
    renderAttendanceRecords(e.target.value.toLowerCase());
  });

  document.getElementById('student-filter').addEventListener('change', (e) => {
    renderStudentsTable(e.target.value);
  });
});

function initNavigation() {
  const buttons = document.querySelectorAll('.nav-item');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
  const activePane = document.getElementById(`tab-${tabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  const titles = {
    dashboard: ['Dashboard Overview', 'Real-time attendance summaries, roster stats, and recent activities.'],
    students: ['Student Directory', 'Manage and register students across cohorts.'],
    courses: ['Course Management', 'Configure courses, assign instructors, and update schedules.'],
    rollcall: ['Session Roll Call', 'Mark attendance for an entire classroom roster in seconds.'],
    records: ['Attendance Log Audit', 'Search, review, and adjust historical attendance records.'],
    'ui-states': ['UI States Demo', 'Testing Empty, Loading, and Error conditionals (Week 6).']
  };

  if (titles[tabId]) {
    document.getElementById('page-title').textContent = titles[tabId][0];
    document.getElementById('page-subtitle').textContent = titles[tabId][1];
  }
}

// Helper to render UI States
function renderUIState(containerId, tableId, count, entityName) {
  const container = document.getElementById(containerId);
  const table = document.getElementById(tableId);
  if (!container || !table) return;

  if (count === 0) {
    table.parentElement.classList.add('d-none');
    container.innerHTML = `
      <div class="state-container state-empty">
        <div class="state-icon">📭</div>
        <h3>No ${escapeHTML(entityName)} Found</h3>
        <p>Get started by adding some records.</p>
      </div>
    `;
  } else {
    table.parentElement.classList.remove('d-none');
    container.innerHTML = '';
  }
}

function renderAll() {
  renderDashboard();
  renderStudentsTable();
  renderCoursesTable();
  renderRollcallView();
  renderAttendanceRecords();
}

function renderDashboard() {
  const students = store.getStudents();
  const courses = store.getCourses();
  const records = store.getAttendanceRecords();

  document.getElementById('stat-total-students').textContent = students.length;
  document.getElementById('stat-total-courses').textContent = courses.length;
  document.getElementById('stat-total-records').textContent = records.length;

  if (records.length > 0) {
    const attended = records.filter(r => r.status === 'Present' || r.status === 'Excused').length;
    document.getElementById('stat-rate').textContent = `${Math.round((attended / records.length) * 100)}%`;
  } else {
    document.getElementById('stat-rate').textContent = '0%';
  }

  // Recent attendance table
  const tbodyRecent = document.querySelector('#table-recent-attendance tbody');
  tbodyRecent.innerHTML = '';
  const recent = [...records].reverse().slice(0, 5);
  recent.forEach(r => {
    const student = store.getStudentById(r.student_id);
    const course = store.getCourseById(r.course_id);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHTML(r.session_date)}</td>
      <td><strong>${escapeHTML(course ? course.course_code : 'Course #' + r.course_id)}</strong></td>
      <td>${escapeHTML(student ? `${student.first_name} ${student.last_name}` : 'Student #' + r.student_id)}</td>
      <td><span class="status-pill status-${escapeHTML(r.status)}">${escapeHTML(r.status)}</span></td>
    `;
    tbodyRecent.appendChild(tr);
  });
  renderUIState('dashboard-recent-state-container', 'table-recent-attendance', recent.length, 'Recent Logs');

  // Course overview cards
  const courseContainer = document.getElementById('course-cards-container');
  courseContainer.innerHTML = '';
  if (courses.length === 0) {
    courseContainer.innerHTML = `
      <div class="state-container state-empty" style="margin-top:0;">
        <div class="state-icon">📚</div>
        <h3>No Active Courses</h3>
      </div>
    `;
  }
  courses.forEach(c => {
    const roster = store.getStudentsForCourse(c.id);
    const div = document.createElement('div');
    div.className = 'course-item-card';
    div.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h4>${escapeHTML(c.course_code)}: ${escapeHTML(c.title)}</h4>
        <span class="badge" style="background:#475569;">${roster.length} Enrolled</span>
      </div>
      <p style="font-size:0.85rem; color:#64748b; margin-top:4px;">
        👤 ${escapeHTML(c.instructor_name)}
      </p>
    `;
    courseContainer.appendChild(div);
  });
}

function renderStudentsTable(filterStatus = 'All') {
  const tbody = document.querySelector('#table-students tbody');
  tbody.innerHTML = '';
  let students = store.getStudents();

  if (filterStatus !== 'All') {
    students = students.filter(s => s.status === filterStatus);
  }

  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${escapeHTML(s.student_id_number)}</code></td>
      <td><strong>${escapeHTML(s.first_name)} ${escapeHTML(s.last_name)}</strong></td>
      <td>${escapeHTML(s.email)}</td>
      <td>${escapeHTML(s.grade_or_cohort || '-')}</td>
      <td><span class="status-pill status-${s.status === 'Active' ? 'Present' : 'Absent'}">${escapeHTML(s.status)}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editStudent(${s.id})">Edit</button>
        <button class="btn btn-secondary btn-sm" style="color:var(--danger);" onclick="deleteStudent(${s.id}, this)">Del</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  renderUIState('students-state-container', 'table-students', students.length, 'Students');
}

function renderCoursesTable() {
  const tbody = document.querySelector('#table-courses tbody');
  tbody.innerHTML = '';
  const courses = store.getCourses();

  courses.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><code>${escapeHTML(c.course_code)}</code></td>
      <td><strong>${escapeHTML(c.title)}</strong></td>
      <td>${escapeHTML(c.instructor_name)}</td>
      <td>${escapeHTML(c.term_semester || '-')}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="editCourse(${c.id})">Edit</button>
        <button class="btn btn-secondary btn-sm" style="color:var(--danger);" onclick="deleteCourse(${c.id}, this)">Del</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  renderUIState('courses-state-container', 'table-courses', courses.length, 'Courses');
}

function renderRollcallView() {
  const select = document.getElementById('rollcall-course-select');
  select.innerHTML = '';
  const courses = store.getCourses();

  if (courses.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = 'No active courses available';
    select.appendChild(opt);
    loadRosterForRollcall(null);
    return;
  }

  courses.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.course_code} - ${c.title}`;
    select.appendChild(opt);
  });

  select.onchange = () => loadRosterForRollcall(select.value);
  loadRosterForRollcall(courses[0].id);
}

function loadRosterForRollcall(courseId) {
  const tbody = document.getElementById('tbody-rollcall');
  tbody.innerHTML = '';
  if (!courseId) {
    renderUIState('rollcall-state-container', 'table-rollcall', 0, 'Course Enrollments');
    return;
  }

  const students = store.getStudentsForCourse(courseId);
  renderUIState('rollcall-state-container', 'table-rollcall', students.length, 'Students in Roster');

  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHTML(s.first_name)} ${escapeHTML(s.last_name)}</td>
      <td>
        <select class="form-control status-select" data-student-id="${s.id}" style="width:130px;">
          <option value="Present" selected>Present</option>
          <option value="Late">Late</option>
          <option value="Excused">Excused</option>
          <option value="Absent">Absent</option>
        </select>
      </td>
      <td>
        <input type="text" class="form-control remarks-input" data-student-id="${s.id}" placeholder="Note...">
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderAttendanceRecords(filter = '') {
  const tbody = document.querySelector('#table-all-records tbody');
  tbody.innerHTML = '';
  const records = store.getAttendanceRecords();
  let matchCount = 0;

  records.slice().reverse().forEach(r => {
    const student = store.getStudentById(r.student_id);
    const course = store.getCourseById(r.course_id);

    const studentName = student ? `${student.first_name} ${student.last_name}` : 'Unknown';
    const courseName = course ? `${course.course_code}` : 'Unknown';

    if (filter && !studentName.toLowerCase().includes(filter) && !courseName.toLowerCase().includes(filter)) {
      return;
    }
    matchCount++;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHTML(r.session_date)}</td>
      <td>${escapeHTML(courseName)}</td>
      <td><strong>${escapeHTML(studentName)}</strong></td>
      <td><span class="status-pill status-${escapeHTML(r.status)}">${escapeHTML(r.status)}</span></td>
      <td>
        <button class="btn btn-secondary btn-sm" style="color:var(--danger);" onclick="deleteAttendance(${r.id}, this)">Del</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  renderUIState('records-state-container', 'table-all-records', matchCount, filter ? 'Matching Logs' : 'Logs');
}

function initRollcallForm() {
  document.getElementById('form-rollcall').addEventListener('submit', async (e) => {
    e.preventDefault();
    const courseId = Number(document.getElementById('rollcall-course-select').value);
    const date = document.getElementById('rollcall-date').value;

    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:5px;"></span> Processing...';

    const rows = document.querySelectorAll('#tbody-rollcall tr');
    let promises = [];
    
    rows.forEach(tr => {
      const statusSelect = tr.querySelector('.status-select');
      const remarksInput = tr.querySelector('.remarks-input');
      if (statusSelect) {
        promises.push(fetch('/api/attendance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            course_id: courseId,
            student_id: Number(statusSelect.dataset.studentId),
            session_date: date,
            status: statusSelect.value,
            remarks: remarksInput ? remarksInput.value : '',
            recorded_by: 'Instructor'
          })
        }).then(r => r.json()));
      }
    });

    // Fix for BUG-002: Empty Rollcall Submission
    if(promises.length === 0) {
      showToast('No students in roster to record.', 'error');
      btn.disabled = false;
      btn.textContent = originalText;
      return;
    }

    try {
      await Promise.all(promises);
      showToast(`Recorded attendance for ${promises.length} students!`, 'success');
      await loadFromServer();
      switchTab('records');
    } catch (err) {
      showToast('Network error while saving attendance.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

function initModals() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.dataset.close;
      document.getElementById(modalId).classList.remove('active');
    });
  });

  document.getElementById('btn-open-student-modal').addEventListener('click', () => {
    document.getElementById('form-student').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('modal-student-title').textContent = 'Add New Student';
    document.getElementById('modal-student').classList.add('active');
  });

  document.getElementById('btn-open-course-modal').addEventListener('click', () => {
    document.getElementById('form-course').reset();
    document.getElementById('course-id').value = '';
    document.getElementById('modal-course-title').textContent = 'Add New Course';
    document.getElementById('modal-course').classList.add('active');
  });

  document.getElementById('form-student').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:5px;"></span> Saving...';

    e.target.querySelectorAll('.error-text').forEach(el => el.remove());

    const studentId = document.getElementById('student-id').value;
    const payload = {
      student_id_number: document.getElementById('student-id-number').value,
      first_name: document.getElementById('student-first-name').value,
      last_name: document.getElementById('student-last-name').value,
      email: document.getElementById('student-email').value,
      status: document.getElementById('student-status').value
    };

    try {
      const url = studentId ? `/api/students/${studentId}` : '/api/students';
      const method = studentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 201 || response.status === 200) {
        document.getElementById('modal-student').classList.remove('active');
        showToast(`Student ${studentId ? 'updated' : 'added'} successfully.`, 'success');
        await loadFromServer();
      } else if (response.status === 422) {
        const fieldName = data.field;
        let fieldEl = null;
        if (fieldName === 'first_name') fieldEl = document.getElementById('student-first-name');
        else if (fieldName === 'last_name') fieldEl = document.getElementById('student-last-name');
        else if (fieldName === 'email') fieldEl = document.getElementById('student-email');
        else if (fieldName === 'student_id_number') fieldEl = document.getElementById('student-id-number');
        
        if (fieldEl) {
          const errSpan = document.createElement('span');
          errSpan.className = 'error-text';
          errSpan.style.color = 'var(--danger)';
          errSpan.style.fontSize = '0.8rem';
          errSpan.textContent = ` * ${data.error}`;
          fieldEl.parentNode.insertBefore(errSpan, fieldEl);
        } else {
          showToast(`Validation Error: ${data.error}`, 'error');
        }
      } else {
        showToast(`Server Error: ${data.error || 'Failed to save student'}`, 'error');
      }
    } catch (err) {
      showToast('Network error. Ensure server is running.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  document.getElementById('form-course').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;border-width:2px;display:inline-block;vertical-align:middle;margin-right:5px;"></span> Saving...';

    e.target.querySelectorAll('.error-text').forEach(el => el.remove());

    const courseId = document.getElementById('course-id').value;
    const payload = {
      course_code: document.getElementById('course-code').value,
      title: document.getElementById('course-title').value,
      instructor_name: document.getElementById('course-instructor').value
    };

    try {
      const url = courseId ? `/api/courses/${courseId}` : '/api/courses';
      const method = courseId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.status === 201 || response.status === 200) {
        document.getElementById('modal-course').classList.remove('active');
        showToast(`Course ${courseId ? 'updated' : 'added'} successfully.`, 'success');
        await loadFromServer();
      } else if (response.status === 422) {
        const fieldName = data.field;
        let fieldEl = null;
        if (fieldName === 'course_code') fieldEl = document.getElementById('course-code');
        else if (fieldName === 'title') fieldEl = document.getElementById('course-title');
        else if (fieldName === 'instructor_name') fieldEl = document.getElementById('course-instructor');
        
        if (fieldEl) {
          const errSpan = document.createElement('span');
          errSpan.className = 'error-text';
          errSpan.style.color = 'var(--danger)';
          errSpan.style.fontSize = '0.8rem';
          errSpan.textContent = ` * ${data.error}`;
          fieldEl.parentNode.insertBefore(errSpan, fieldEl);
        } else {
          showToast(`Validation Error: ${data.error}`, 'error');
        }
      } else {
        showToast(`Server Error: ${data.error || 'Failed to save course'}`, 'error');
      }
    } catch (err) {
      showToast('Network error. Ensure server is running.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

window.editStudent = (id) => {
  const s = store.getStudentById(id);
  if (!s) return;
  document.getElementById('student-id').value = s.id;
  document.getElementById('student-id-number').value = s.student_id_number;
  document.getElementById('student-first-name').value = s.first_name;
  document.getElementById('student-last-name').value = s.last_name;
  document.getElementById('student-email').value = s.email;
  document.getElementById('student-status').value = s.status || 'Active';
  document.getElementById('modal-student-title').textContent = 'Edit Student';
  document.getElementById('modal-student').classList.add('active');
};

window.deleteStudent = async (id, btn) => {
  if (!confirm('Are you sure you want to remove this student? This action cannot be undone.')) return;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '...';
  try {
    const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    showToast('Student removed successfully.', 'success');
    await loadFromServer();
  } catch(e) {
    showToast('Network error: Could not remove student. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
};

window.editCourse = (id) => {
  const c = store.getCourseById(id);
  if (!c) return;
  document.getElementById('course-id').value = c.id;
  document.getElementById('course-code').value = c.course_code;
  document.getElementById('course-title').value = c.title;
  document.getElementById('course-instructor').value = c.instructor_name;
  document.getElementById('modal-course-title').textContent = 'Edit Course';
  document.getElementById('modal-course').classList.add('active');
};

window.deleteCourse = async (id, btn) => {
  if (!confirm('Are you sure you want to remove this course? This action cannot be undone.')) return;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '...';
  try {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    showToast('Course removed successfully.', 'success');
    await loadFromServer();
  } catch(e) {
    showToast('Network error: Could not remove course. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
};

window.deleteAttendance = async (id, btn) => {
  if (!confirm('Delete this attendance log?')) return;
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '...';
  try {
    const res = await fetch(`/api/attendance/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    showToast('Log removed successfully.', 'success');
    await loadFromServer();
  } catch(e) {
    showToast('Network error: Could not remove log. Please try again.', 'error');
    btn.disabled = false;
    btn.textContent = originalText;
  }
};
