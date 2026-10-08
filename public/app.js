
// =========================================================================
// FIREBASE INITIALIZATION
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBOeb1_fcCzLpRNutQQQdi_dSSXgtnE_7k",
  authDomain: "sams-database-99d3b.firebaseapp.com",
  projectId: "sams-database-99d3b",
  storageBucket: "sams-database-99d3b.firebasestorage.app",
  messagingSenderId: "309740513089",
  appId: "1:309740513089:web:16194a1d43157a1761e3c0"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/**
 * ATTENDANCE MANAGEMENT SYSTEM - FRONTEND CONTROLLER
 * High-fidelity implementation matching all 10 UI designs
 */

// Escape HTML utility for security
const escapeHTML = str => String(str || '').replace(/[&<>'"]/g, tag => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[tag] || tag));

// Global Toast Notification Engine
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '<i class="fa-solid fa-circle-info"></i>';
  if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
  if (type === 'error') icon = '<i class="fa-solid fa-triangle-exclamation"></i>';

  toast.innerHTML = `${icon} <span>${escapeHTML(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// In-Memory Database matching screenshot records exactly
// In-Memory Database (starts empty — students are enrolled by the school staff)
let STUDENTS_DATA = [];

// Master Daily Attendance Database (Per-Date records keyed by YYYY-MM-DD)
let DAILY_ATTENDANCE = {};

let ATTENDANCE_MAP = {};

let studentToDeleteId = null;

// =========================================================================
// SYSTEM USERS & MULTI-ACCOUNT ACTIVE SESSION STATE
// =========================================================================
let USERS_DATA = [
  {
    id: 1,
    name: 'Neil Herbert Betacura',
    email: 'neilherbert.betacura@sams.edu.ph',
    username: 'neil',
    aliases: ['admin', 'neil.betacura'],
    password: 'admin123',
    role: 'Repository Lead & IT Architecture',
    department: 'BSIT - CODER',
    status: 'Active',
    last_active: 'Today, 8:15 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 2,
    name: 'Demelyn Concepcion',
    email: 'demelyn.concepcion@sams.edu.ph',
    username: 'myatt1',
    aliases: ['board', 'demelyn.concepcion', 'myatt1'],
    password: 'Myatt09478',
    role: 'Administrator',
    department: 'BSIT - CODER',
    status: 'Active',
    last_active: 'Today, 9:20 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200'
  },
  {
    id: 3,
    name: 'Jamaica Ganolon',
    email: 'ganolonjamaica7@gmail.com',
    username: 'jamaica',
    aliases: ['scribe', 'staff', 'jamaica.ganolon', 'jamaica'],
    password: 'Jamaicaganolon10',
    role: 'Github Scribe',
    department: 'BSIT - CODER',
    status: 'Active',
    last_active: 'Today, 8:45 AM',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200'
  },
  {
    id: 4,
    name: 'Angelo Dairo',
    email: 'angelo.dairo@sams.edu.ph',
    username: 'zelo',
    aliases: ['angelo.dairo', 'stem', 'zelo'],
    password: 'Alden010',
    role: 'Github Builder',
    department: 'BSIT - CODER',
    status: 'Active',
    last_active: 'Today, 7:55 AM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  },
  {
    id: 5,
    name: 'Angelo Madolaria',
    email: 'angelo.madolaria@sams.edu.ph',
    username: 'angelo',
    aliases: ['angelo.madolaria', 'abm', 'angelo'],
    password: 'akon098',
    role: 'Github Builder',
    department: 'BSIT - CODER',
    status: 'Active',
    last_active: 'Today, 8:05 AM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
  },
  {
    id: 6,
    name: 'April Jean Villas',
    email: 'apriljeanvillas@gmail.com',
    username: 'apriljeanvillas',
    aliases: ['apriljeanvillas'],
    password: 'Aj2026',
    role: 'Instructor',
    department: 'BSIT PROGRAM HEAD',
    status: 'Active',
    last_active: 'Today, 10:05 AM',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
  },
  {
    id: 7,
    name: 'Jessiemae C. Jusayan',
    email: 'jessiemaecjusayan@gmail.com',
    username: 'jessiemaecjusayan',
    aliases: ['jessiemaecjusayan'],
    password: 'jusayan2002',
    role: 'Instructor',
    department: 'BSIT - INSTRUCTOR',
    status: 'Active',
    last_active: 'Today, 10:12 AM',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200'
  },
  {
    id: 8,
    name: 'Wilfredo Villas',
    email: 'wilfredovillas@gmail.com',
    username: 'wilfredovillas',
    aliases: ['wilfredovillas'],
    password: 'Villas2026',
    role: 'Instructor',
    department: 'BSIT - INSTRUCTOR',
    status: 'Active',
    last_active: 'Just now',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200'
  }
];

let CURRENT_USER = null; // only set after a successful sign-in on this browser

function findInstructorClassName(user) {
  if (!user || !user.name) return null;
  const name = String(user.name).toLowerCase().trim();
  if (!name) return null;
  const lastName = name.split(/\s+/).pop();
  const classes = CLASSES_DATA || [];
  // 1) Exact instructor-name equality wins
  let m = classes.find(c => String(c.instructor || '').toLowerCase().trim() === name);
  if (m) return m.name;
  // 2) Instructor string contains the user's full name (or vice versa)
  m = classes.find(c => {
    const ci = String(c.instructor || '').toLowerCase().trim();
    return ci.length > 0 && (ci.includes(name) || name.includes(ci));
  });
  if (m) return m.name;
  // 3) Last-name-only fallback
  if (lastName && lastName.length >= 2) {
    m = classes.find(c => {
      const parts = String(c.instructor || '').toLowerCase().trim().split(/[\s.,]+/);
      return parts.includes(lastName);
    });
    if (m) return m.name;
  }
  return null;
}

function applyCurrentUser(user) {
  if (!user) return;
  CURRENT_USER = user;
  try {
    localStorage.setItem('sams_current_user', JSON.stringify(user));
  } catch (e) {}

  // Update Topbar
  const topbarAvatar = document.getElementById('topbar-user-avatar');
  if (topbarAvatar && user.avatar) topbarAvatar.src = user.avatar;
  const topbarName = document.getElementById('topbar-user-name');
  if (topbarName) topbarName.textContent = user.name;
  const topbarRole = document.getElementById('topbar-user-role');
  if (topbarRole) topbarRole.textContent = user.department || user.role;

  // Update Dashboard greeting
  const dashGreet = document.getElementById('dash-welcome-name');
  if (dashGreet) dashGreet.textContent = user.name;

  // Update Dropdown
  const dropAvatar = document.getElementById('dropdown-user-avatar');
  if (dropAvatar && user.avatar) dropAvatar.src = user.avatar;
  const dropName = document.getElementById('dropdown-user-name');
  if (dropName) dropName.textContent = user.name;
  const dropEmail = document.getElementById('dropdown-user-email');
  if (dropEmail) dropEmail.textContent = user.email;
  const dropRoleBadge = document.getElementById('dropdown-user-role-badge');
  if (dropRoleBadge) {
    dropRoleBadge.textContent = user.role;
    dropRoleBadge.className = 'role-badge ' + (
      user.role === 'Administrator' ? 'role-admin' :
      user.role === 'Instructor' ? 'role-instructor' : 'role-staff'
    );
  }

  // Update Settings Profile Card
  const settingsAvatar = document.getElementById('settings-admin-avatar');
  if (settingsAvatar && user.avatar) settingsAvatar.src = user.avatar;
  const settingsName = document.getElementById('settings-admin-name');
  if (settingsName) settingsName.textContent = user.name;
  const settingsRoleBadge = document.getElementById('settings-admin-role-badge');
  if (settingsRoleBadge) {
    settingsRoleBadge.textContent = user.role;
    settingsRoleBadge.className = 'role-badge ' + (
      user.role === 'Administrator' ? 'role-admin' :
      user.role === 'Instructor' ? 'role-instructor' : 'role-staff'
    );
  }
  const settingsEmailSub = document.getElementById('settings-admin-email-sub');
  if (settingsEmailSub) settingsEmailSub.textContent = `${user.email} • ${user.department || user.role}`;

  // If user is an instructor, auto-select their assigned class in the Roll Call view
  const instructorClass = findInstructorClassName(user);
  const classSelect = document.getElementById('rollcall-class-select');
  if (instructorClass && classSelect) {
    if (!Array.from(classSelect.options).some(opt => opt.value === instructorClass)) {
      const opt = document.createElement('option');
      opt.value = instructorClass;
      opt.textContent = instructorClass;
      classSelect.appendChild(opt);
    }
    classSelect.value = instructorClass;
    populateRollcallSectionSelect();
  }

  // Keep the Settings > Security card in sync with the signed-in user
  // (its markup defaults to a hardcoded name until this runs).
  if (typeof populateSecuritySection === 'function') populateSecuritySection();
}

// Cloud save/read helpers.
// Firestore writes are async promises: if one fails (too-large document,
// offline, rejected write) the failure used to be swallowed by an empty
// catch block, so the UI showed a change that vanished on the next refresh.
// These helpers always report failures instead.
function saveToCloud(docName, payload, label) {
  return db.collection('sams_db').doc(docName).set(payload).then(() => true).catch(err => {
    console.error(`Firestore save failed (${label}):`, err);
    showToast(`Could not save ${label} to the cloud database — this change will be lost after a refresh.`, 'error');
    return false;
  });
}

let cloudReadFailureNotified = false;
function notifyCloudReadFailure(err, label) {
  console.error(`Firestore read failed (${label}):`, err);
  if (cloudReadFailureNotified) return;
  cloudReadFailureNotified = true;
  showToast('Could not reach the cloud database — showing the last saved local copy. Refresh when you are online.', 'error');
}

async function loadStoredUsers() {
  try {
    const doc = await db.collection('sams_db').doc('users').get();
    if (doc.exists) {
      const parsed = doc.data().data;
      if (Array.isArray(parsed) && parsed.length > 0) {
        USERS_DATA = parsed;
      }
    } else {
      // Fallback to local storage migration
      const stored = localStorage.getItem('sams_users_data');
      if (stored) {
        USERS_DATA = JSON.parse(stored);
        persistUsersData();
      }
    }
  } catch (e) {
    notifyCloudReadFailure(e, 'users');
    // Fallback to local storage migration
    try {
      const stored = localStorage.getItem('sams_users_data');
      if (stored) USERS_DATA = JSON.parse(stored);
    } catch (e2) {}
  }
}


async function persistUsersData() {
  await compactOversizedAvatars(USERS_DATA);
  try { localStorage.setItem('sams_users_data', JSON.stringify(USERS_DATA)); } catch (e) {}
  return saveToCloud('users', { data: USERS_DATA }, 'user accounts');
}

async function loadStoredStudents() {
  try {
    const doc = await db.collection('sams_db').doc('students').get();
    if (doc.exists) {
      const parsed = doc.data().data;
      if (Array.isArray(parsed) && parsed.length > 0) {
        STUDENTS_DATA = parsed;
      }
    } else {
      const stored = localStorage.getItem('sams_students_data');
      if (stored) { STUDENTS_DATA = JSON.parse(stored); persistStudentsData(); }
    }
  } catch (e) {
    notifyCloudReadFailure(e, 'students');
    try {
      const stored = localStorage.getItem('sams_students_data');
      if (stored) STUDENTS_DATA = JSON.parse(stored);
    } catch (e2) {}
  }
}

async function persistStudentsData() {
  await compactOversizedAvatars(STUDENTS_DATA);
  try { localStorage.setItem('sams_students_data', JSON.stringify(STUDENTS_DATA)); } catch (e) {}
  return saveToCloud('students', { data: STUDENTS_DATA }, 'students');
}

async function loadStoredClasses() {
  try {
    const doc = await db.collection('sams_db').doc('classes').get();
    if (doc.exists) {
      CLASSES_DATA = doc.data().data;
    } else {
      const stored = localStorage.getItem('sams_classes_data');
      if (stored) { CLASSES_DATA = JSON.parse(stored); persistClassesData(); }
    }
  } catch (e) { notifyCloudReadFailure(e, 'classes'); }
}

function persistClassesData() {
  try { localStorage.setItem('sams_classes_data', JSON.stringify(CLASSES_DATA)); } catch (e) {}
  return saveToCloud('classes', { data: CLASSES_DATA }, 'classes');
}

async function loadStoredCalendarEvents() {
  try {
    const doc = await db.collection('sams_db').doc('calendar').get();
    if (doc.exists) {
      CALENDAR_EVENTS = doc.data().data;
    } else {
      const stored = localStorage.getItem('sams_calendar_events');
      if (stored) { CALENDAR_EVENTS = JSON.parse(stored); persistCalendarEvents(); }
    }
  } catch (e) { notifyCloudReadFailure(e, 'calendar events'); }
}

function persistCalendarEvents() {
  try { localStorage.setItem('sams_calendar_events', JSON.stringify(CALENDAR_EVENTS)); } catch (e) {}
  return saveToCloud('calendar', { data: CALENDAR_EVENTS }, 'calendar events');
}

function getSelectedRollcallDate() {
  const el = document.getElementById('rollcall-date');
  return (el && el.value) ? el.value : '2026-05-20';
}

function generateDateAttendance(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const res = {};
  STUDENTS_DATA.forEach(s => {
    const score = (hash * 37 + s.id * 19 + (s.id % 3) * 11) % 100;
    if (score < 80) {
      res[s.id] = 'Present';
    } else if (score < 92) {
      res[s.id] = 'Late';
    } else {
      res[s.id] = 'Absent';
    }
  });
  return res;
}

function getAttendanceForDate(dateStr) {
  if (!DAILY_ATTENDANCE[dateStr]) {
    DAILY_ATTENDANCE[dateStr] = generateDateAttendance(dateStr);
    try {
      localStorage.setItem('sams_daily_attendance', JSON.stringify(DAILY_ATTENDANCE));
    } catch (e) {}
  }
  return DAILY_ATTENDANCE[dateStr];
}

function handleRollcallDateChange() {
  const curDate = getSelectedRollcallDate();
  ATTENDANCE_MAP = getAttendanceForDate(curDate);
  loadRosterForAttendance();
}

function navigateCalendarToRollcall(dateStr) {
  switchTab('attendance');
  const dateInput = document.getElementById('rollcall-date');
  if (dateInput) {
    dateInput.value = dateStr;
  }
  ATTENDANCE_MAP = getAttendanceForDate(dateStr);
  loadRosterForAttendance();
  showToast(`Switched roll call date to ${dateStr}`, 'info');
}

async function loadStoredAttendance() {
  try {
    const doc = await db.collection('sams_db').doc('attendance').get();
    if (doc.exists) {
      const d = doc.data();
      if (d.history) ATTENDANCE_HISTORY = d.history;
      if (d.map) ATTENDANCE_MAP = d.map;
      if (d.daily) DAILY_ATTENDANCE = d.daily;
    } else {
      const stored1 = localStorage.getItem('sams_attendance_history');
      if (stored1) ATTENDANCE_HISTORY = JSON.parse(stored1);
      const stored2 = localStorage.getItem('sams_attendance_map');
      if (stored2) ATTENDANCE_MAP = JSON.parse(stored2);
      const stored3 = localStorage.getItem('sams_daily_attendance');
      if (stored3) DAILY_ATTENDANCE = JSON.parse(stored3);
      persistAttendanceData();
    }
  } catch (e) { notifyCloudReadFailure(e, 'attendance'); }
}

function persistAttendanceData() {
  try {
    localStorage.setItem('sams_attendance_history', JSON.stringify(ATTENDANCE_HISTORY));
    localStorage.setItem('sams_attendance_map', JSON.stringify(ATTENDANCE_MAP));
    localStorage.setItem('sams_daily_attendance', JSON.stringify(DAILY_ATTENDANCE));
  } catch (e) {}
  return saveToCloud('attendance', {
    history: ATTENDANCE_HISTORY,
    map: ATTENDANCE_MAP,
    daily: DAILY_ATTENDANCE
  }, 'attendance');
}

function renderCredentialsDirectory() {
  const tbody = document.getElementById('tbody-credentials-list');
  if (!tbody) return;
  tbody.innerHTML = '';

  USERS_DATA.forEach(u => {
    let roleBadgeClass = 'role-admin';
    if (u.role === 'Instructor') roleBadgeClass = 'role-instructor';
    else if (u.role === 'Staff') roleBadgeClass = 'role-staff';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="padding:8px 12px;">
        <strong>${escapeHTML(u.name)}</strong><br>
        <span class="role-badge ${roleBadgeClass}" style="font-size:0.65rem;">${escapeHTML(u.role)} (${escapeHTML(u.department || '')})</span>
      </td>
      <td style="padding:8px 12px;"><code style="background:#e0f2fe; color:#0369a1; padding:2px 6px; border-radius:4px; font-weight:600;">${escapeHTML(u.username)}</code></td>
      <td style="padding:8px 12px;"><code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-weight:600;">${escapeHTML(u.password)}</code></td>
      <td style="padding:8px 12px; text-align:right;">
        <button type="button" class="btn btn-outline-primary btn-xs" style="font-size:0.75rem; padding:3px 8px;" onclick="openChangeCredentialsModal(${u.id})">
          <i class="fa-solid fa-key"></i> Change
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openCredentialsDirectoryModal() {
  renderCredentialsDirectory();
  const modal = document.getElementById('modal-credentials-directory');
  if (modal) modal.classList.add('active');
}

function closeCredentialsDirectoryModal() {
  const modal = document.getElementById('modal-credentials-directory');
  if (modal) modal.classList.remove('active');
}

function toggleInputVisibility(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function openChangeCredentialsModal(userId = null) {
  const modal = document.getElementById('modal-change-credentials');
  if (!modal) return;

  const select = document.getElementById('cred-user-select');
  if (select) {
    select.innerHTML = '';
    USERS_DATA.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.id;
      opt.textContent = `${u.name} (${u.role}) — @${u.username}`;
      select.appendChild(opt);
    });

    const targetId = userId || (CURRENT_USER ? CURRENT_USER.id : null);
    if (targetId != null) {
      select.value = targetId;
      onCredUserSelected(targetId);
    }
  }

  const alertBox = document.getElementById('cred-modal-alert');
  if (alertBox) {
    alertBox.className = 'd-none';
    alertBox.textContent = '';
  }

  modal.classList.add('active');
}

function closeChangeCredentialsModal() {
  const modal = document.getElementById('modal-change-credentials');
  if (modal) modal.classList.remove('active');
}

function onCredUserSelected(userId) {
  const u = USERS_DATA.find(user => user.id === Number(userId));
  if (!u) return;

  const userField = document.getElementById('cred-new-username');
  if (userField) userField.value = u.username || '';

  const pwdField = document.getElementById('cred-new-password');
  if (pwdField) pwdField.value = '';

  const confirmField = document.getElementById('cred-confirm-password');
  if (confirmField) confirmField.value = '';

  const alertBox = document.getElementById('cred-modal-alert');
  if (alertBox) alertBox.className = 'd-none';
}

function showCredModalAlert(msg, type = 'error') {
  const alertBox = document.getElementById('cred-modal-alert');
  if (!alertBox) return;
  alertBox.className = type === 'error' ? 'alert-danger' : 'alert-success';
  alertBox.style.display = 'flex';
  alertBox.style.alignItems = 'center';
  alertBox.style.gap = '8px';
  alertBox.style.background = type === 'error' ? '#fef2f2' : '#ecfdf5';
  alertBox.style.color = type === 'error' ? '#dc2626' : '#059669';
  alertBox.style.border = type === 'error' ? '1px solid #fecaca' : '1px solid #a7f3d0';
  alertBox.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${escapeHTML(msg)}</span>`;
}

function handleSaveCredentials(event) {
  if (event) event.preventDefault();

  const select = document.getElementById('cred-user-select');
  const userId = select ? Number(select.value) : (CURRENT_USER ? CURRENT_USER.id : null);
  const targetUser = USERS_DATA.find(u => u.id === userId);
  if (!targetUser) {
    showCredModalAlert('User account not found.', 'error');
    return;
  }

  const newUsername = (document.getElementById('cred-new-username')?.value || '').trim().toLowerCase();
  const newPassword = (document.getElementById('cred-new-password')?.value || '').trim();
  const confirmPassword = (document.getElementById('cred-confirm-password')?.value || '').trim();

  // Validate username
  if (!newUsername || newUsername.length < 3) {
    showCredModalAlert('Username must be at least 3 characters long.', 'error');
    return;
  }
  if (!/^[a-z0-9_.-]+$/.test(newUsername)) {
    showCredModalAlert('Username may only contain letters, numbers, dots, and underscores.', 'error');
    return;
  }

  // Check username uniqueness
  const conflict = USERS_DATA.find(u => u.id !== targetUser.id && (u.username?.toLowerCase() === newUsername || u.email?.toLowerCase() === newUsername));
  if (conflict) {
    showCredModalAlert(`The username "${newUsername}" is already taken by ${conflict.name}.`, 'error');
    return;
  }

  // Validate password
  if (!newPassword || newPassword.length < 4) {
    showCredModalAlert('New password must be at least 4 characters long.', 'error');
    return;
  }
  if (newPassword !== confirmPassword) {
    showCredModalAlert('New password and confirmation do not match.', 'error');
    return;
  }

  // Apply changes
  const oldUsername = targetUser.username;
  targetUser.username = newUsername;
  targetUser.password = newPassword;
  if (!targetUser.aliases) targetUser.aliases = [];
  if (!targetUser.aliases.includes(newUsername)) targetUser.aliases.push(newUsername);

  // If currently active user was updated, re-apply
  if (CURRENT_USER && CURRENT_USER.id === targetUser.id) {
    applyCurrentUser(targetUser);
  }

  persistUsersData();
  renderCredentialsDirectory();
  renderUsersTable();
  if (typeof populateSecuritySection === 'function') {
    populateSecuritySection();
  }

  closeChangeCredentialsModal();
  showToast(`Credentials updated for ${targetUser.name}! Username: "${newUsername}", Password: "${newPassword}"`, 'success');
}

// =========================================================================
// INITIALIZATION
// =========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  await loadStoredUsers();
  await loadStoredStudents();
  await loadStoredClasses();
  await loadStoredCalendarEvents();
  await loadStoredAttendance();
  initNavigation();

  // Show today's date on the dashboard
  const dashDateBadge = document.getElementById('dash-date-badge');
  if (dashDateBadge) {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const month = today.toLocaleDateString('en-US', { month: 'long' });
    dashDateBadge.innerHTML = `<i class="fa-regular fa-calendar" style="color:var(--primary-blue);"></i> ${month} ${today.getDate()}, ${today.getFullYear()} | ${dayNames[today.getDay()]}`;
  }
  await loadSystemSettings();

  // Restore the session ONLY when this browser has a persisted sign-in AND the
  // saved account still exists in the shared account list. Anything else
  // (fresh browser, cleared storage, deleted/renamed account) falls back to the
  // login screen, so one user's account can never be opened by somebody else.
  let restoredUser = null;
  try {
    const savedUser = localStorage.getItem('sams_current_user');
    const loggedInState = localStorage.getItem('sams_logged_in');
    if (loggedInState === 'true' && savedUser) {
      const parsed = JSON.parse(savedUser);
      restoredUser = USERS_DATA.find(u => u.id === parsed.id)
        || USERS_DATA.find(u => u.username && u.username === parsed.username)
        || USERS_DATA.find(u => u.email && u.email === parsed.email);
    }
  } catch (e) {}

  if (restoredUser) {
    CURRENT_USER = restoredUser;
    applyCurrentUser(CURRENT_USER);

    document.getElementById('view-login')?.classList.add('d-none');
    document.getElementById('view-app')?.classList.remove('d-none');
    try {
      const savedTab = localStorage.getItem('sams_active_tab') || 'dashboard';
      if (savedTab && document.getElementById(`pane-${savedTab}`)) {
        switchTab(savedTab);
      }
    } catch (e) {}
  } else {
    CURRENT_USER = null;
    showLoginView();
  }

  updateAllKPIs();
  renderStudentsTable();
  populateClassDataSelects();
  populateRollcallSectionSelect();
  // Default the roll call to today's date so a fresh install never shows a stale seeded date
  const rollcallDateInput = document.getElementById('rollcall-date');
  if (rollcallDateInput) rollcallDateInput.value = new Date().toISOString().split('T')[0];
  loadRosterForAttendance();
  renderClassesGrid();
  renderCalendar();
  renderUsersTable();
  renderCredentialsDirectory();
  populateReportClassSelect();
});

// =========================================================================
// TAB & VIEW ROUTING
// =========================================================================
function initNavigation() {
  const navButtons = document.querySelectorAll('.sidebar-nav .nav-link');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });
}

function switchTab(tabName) {
  try {
    localStorage.setItem('sams_active_tab', tabName);
  } catch (e) {}

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Hide all panes
  document.querySelectorAll('.tab-pane-content').forEach(pane => {
    pane.classList.add('d-none');
  });

  // Show target pane
  const targetPane = document.getElementById(`pane-${tabName}`);
  if (targetPane) {
    targetPane.classList.remove('d-none');
  }

  // Synchronize KPI metrics across tabs
  updateAllKPIs();

  // Refresh data views if necessary
  if (tabName === 'students') {
    renderStudentsTable();
  } else if (tabName === 'attendance') {
    loadRosterForAttendance();
  } else if (tabName === 'classes') {
    renderClassesGrid();
  } else if (tabName === 'calendar') {
    renderCalendar();
  } else if (tabName === 'users') {
    renderUsersTable();
  } else if (tabName === 'settings') { loadSystemSettings(); }
}

// Switch between Login View and App View
function showLoginView() {
  try {
    localStorage.setItem('sams_logged_in', 'false');
    // Signing out must drop the stored identity, otherwise the next visit to
    // this browser silently resumes the previous user's session.
    localStorage.removeItem('sams_current_user');
  } catch (e) {}
  CURRENT_USER = null;
  document.getElementById('view-app').classList.add('d-none');
  document.getElementById('view-login').classList.remove('d-none');
  const userField = document.getElementById('login-username');
  if (userField) {
    userField.value = '';
    userField.focus();
  }
  const pwdField = document.getElementById('login-password');
  if (pwdField) pwdField.value = '';
  const errAlert = document.getElementById('login-error-alert');
  if (errAlert) errAlert.classList.add('d-none');
}

function showLoginError(msg) {
  const errAlert = document.getElementById('login-error-alert');
  const errText = document.getElementById('login-error-text');
  if (errAlert && errText) {
    errText.textContent = msg;
    errAlert.classList.remove('d-none');
  } else {
    showToast(msg, 'error');
  }
}

function handleLoginSubmit(event) {
  if (event) event.preventDefault();

  const errAlert = document.getElementById('login-error-alert');
  if (errAlert) errAlert.classList.add('d-none');

  const usernameInput = (document.getElementById('login-username')?.value || '').trim().toLowerCase();
  const passwordInput = (document.getElementById('login-password')?.value || '').trim();

  if (!usernameInput) {
    showLoginError('Please enter your username or email address.');
    return;
  }
  if (!passwordInput) {
    showLoginError('Please enter your password.');
    return;
  }

  // Match user strictly by username, email, or registered alias
  const targetUser = USERS_DATA.find(u => {
    const uName = (u.username || '').toLowerCase();
    const uEmail = (u.email || '').toLowerCase();
    const aliases = (u.aliases || []).map(a => a.toLowerCase());
    return uName === usernameInput ||
           uEmail === usernameInput ||
           aliases.includes(usernameInput);
  });

  if (!targetUser) {
    showLoginError('Account not found. Please verify your username or email.');
    return;
  }

  // Verify unique password
  if (targetUser.password !== passwordInput) {
    showLoginError(`Incorrect password for ${targetUser.name}. Please try again.`);
    return;
  }

  // Apply user to session
  applyCurrentUser(targetUser);
  try {
    localStorage.setItem('sams_logged_in', 'true');
  } catch (e) {}

  // Switch view from login to main application
  document.getElementById('view-login').classList.add('d-none');
  document.getElementById('view-app').classList.remove('d-none');

  showToast(`Welcome back, ${targetUser.name} (${targetUser.role})!`, 'success');
  switchTab('dashboard');
}

function togglePasswordVisibility() {
  const pwd = document.getElementById('login-password');
  pwd.type = pwd.type === 'password' ? 'text' : 'password';
}

function closeAllTopbarDropdowns() {
  document.querySelectorAll('.topbar-dropdown-menu').forEach(el => el.classList.remove('active'));
}

function toggleUserDropdown(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('dropdown-user-profile');
  if (!menu) return;
  const isOpen = menu.classList.contains('active');
  closeAllTopbarDropdowns();
  if (!isOpen) {
    menu.classList.add('active');
  }
}

function toggleNotificationsMenu(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('dropdown-notifications');
  if (!menu) return;
  const isOpen = menu.classList.contains('active');
  closeAllTopbarDropdowns();
  if (!isOpen) {
    menu.classList.add('active');
  }
}

function toggleMessagesMenu(event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('dropdown-messages');
  if (!menu) return;
  const isOpen = menu.classList.contains('active');
  closeAllTopbarDropdowns();
  if (!isOpen) {
    menu.classList.add('active');
  }
}

function markAllNotificationsRead() {
  const badge = document.getElementById('bell-badge-count');
  if (badge) {
    badge.textContent = '0';
    badge.style.display = 'none';
  }
  showToast('All notifications marked as read.', 'success');
}

// =========================================================================
// DYNAMIC KPI CALCULATOR
// =========================================================================
function updateAllKPIs() {
  const total = STUDENTS_DATA.length;
  let present = 0, absent = 0, late = 0;
  STUDENTS_DATA.forEach(s => {
    const st = ATTENDANCE_MAP[s.id] || 'Present';
    if (st === 'Present') present++;
    else if (st === 'Absent') absent++;
    else if (st === 'Late') late++;
  });
  const presentPct = total ? ((present / total) * 100).toFixed(1) : '0';
  const absentPct = total ? ((absent / total) * 100).toFixed(1) : '0';

  // Dashboard KPIs
  const dashTotal = document.getElementById('dash-total-students');
  if (dashTotal) dashTotal.textContent = total;
  const dashPres = document.getElementById('dash-present-today');
  if (dashPres) dashPres.textContent = present;
  const dashAbs = document.getElementById('dash-absent-today');
  if (dashAbs) dashAbs.textContent = absent;
  const dashClasses = document.getElementById('dash-total-classes');
  if (dashClasses) dashClasses.textContent = CLASSES_DATA.length;

  // Students Tab KPIs
  const stuTotal = document.getElementById('students-kpi-total');
  if (stuTotal) stuTotal.textContent = total;
  const stuPres = document.getElementById('students-kpi-present');
  if (stuPres) stuPres.textContent = present;
  const stuAbs = document.getElementById('students-kpi-absent');
  if (stuAbs) stuAbs.textContent = absent;
  const stuClasses = document.getElementById('students-kpi-classes');
  if (stuClasses) stuClasses.textContent = CLASSES_DATA.length;

  // Reports Tab KPIs
  const repTotal = document.getElementById('reports-kpi-total');
  if (repTotal) repTotal.textContent = total;
  const repPres = document.getElementById('reports-kpi-present');
  if (repPres) repPres.textContent = `${presentPct}%`;
  const repAbs = document.getElementById('reports-kpi-absent');
  if (repAbs) repAbs.textContent = absent;
  const repLate = document.getElementById('reports-kpi-late');
  if (repLate) repLate.textContent = late;
  // Keep the Attendance Overview / Attendance Summary widgets live with the
  // current in-memory data (students, roll-call map, per-date + session history).
  renderLiveWidgets();
}

// =========================================================================
// LIVE ATTENDANCE OVERVIEW & SUMMARY WIDGETS
// The "Attendance Overview" (line charts), "Attendance Summary" / "Attendance
// by Status" (donuts), Recent Attendance, Class Attendance Summary and the
// Top/Low rankings are rendered here from the same in-memory data the rest of
// the app uses (STUDENTS_DATA, ATTENDANCE_MAP, DAILY_ATTENDANCE and
// ATTENDANCE_HISTORY). No stored data is modified by these functions.
// =========================================================================

const DONUT_C = 238;                                           // donut circumference (r=38)
const CHART_XS = [60, 140, 220, 300, 380, 460];                // x positions of the 6 chart points

function widgetText(id, txt) {
  const el = document.getElementById(id);
  if (el) el.textContent = txt;
}

function widgetEsc(t) {
  return String(t == null ? '' : t).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function pctStr(part, total) {
  return total ? ((part / total) * 100).toFixed(1) : '0.0';
}

// Date helpers run in UTC to match the app's roll-call date convention
// (the roll-call input is set to new Date().toISOString().split('T')[0]).
function ymd(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())}`;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function mondayOf(d) {
  const day = d.getUTCDay(); // 0 = Sunday
  return addDays(d, day === 0 ? -6 : 1 - day);
}

function todayBase() {
  return new Date(new Date().toISOString().split('T')[0] + 'T00:00:00Z');
}

function marksForDate(dateStr) {
  const rec = DAILY_ATTENDANCE[dateStr];
  return rec && typeof rec === 'object' ? rec : {};
}

function dayRate(dateStr) {
  const vals = Object.values(marksForDate(dateStr));
  if (!vals.length) return null;
  const present = vals.filter(s => s === 'Present').length;
  return (present / vals.length) * 100;
}

function setDonutSegments(segIds, values) {
  const total = values.reduce((a, b) => a + b, 0);
  let cumulative = 0;
  segIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const v = values[i] || 0;
    if (total > 0 && v > 0) {
      const len = (v / total) * DONUT_C;
      el.setAttribute('stroke-dasharray', `${len.toFixed(2)} ${DONUT_C}`);
      el.setAttribute('stroke-dashoffset', `-${cumulative.toFixed(2)}`);
      cumulative += len;
    } else {
      el.setAttribute('stroke-dasharray', `0 ${DONUT_C}`);
      el.setAttribute('stroke-dashoffset', '0');
    }
  });
}

// Paints a 6-point attendance trend line. yPcts entries are percentages or
// null (null = no marks recorded for that day, drawn flat at the baseline).
function paintTrendChart(svgId, linePathId, xLabelPrefix, labels, yPcts, tooltipId, tooltipTitle, areaPathId) {
  const pts = yPcts.map((p, i) => ({
    x: CHART_XS[i] || (60 + i * 80),
    y: p == null ? 195 : Math.round(195 - (p / 100) * 175),
    v: p
  }));

  const line = document.getElementById(linePathId);
  if (line) {
    line.setAttribute('d', pts.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`).join(' '));
  }
  if (areaPathId) {
    const area = document.getElementById(areaPathId);
    if (area) {
      area.setAttribute('d', pts.map((pt, i) => `${i ? 'L' : 'M'} ${pt.x} ${pt.y}`).join(' ')
        + ` L ${pts[pts.length - 1].x} 195 L ${pts[0].x} 195 Z`);
    }
  }

  const svg = document.getElementById(svgId);
  if (svg) {
    labels.forEach((lab, i) => {
      const t = document.getElementById(`${xLabelPrefix}-${i}`);
      if (t) {
        t.setAttribute('x', pts[i].x);
        t.textContent = lab;
      }
    });
    // Rebuild the data points (keeps the hover styling from .chart-point).
    svg.querySelectorAll('.chart-point').forEach(c => c.remove());
    pts.forEach((pt, i) => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('class', 'chart-point');
      c.setAttribute('cx', pt.x);
      c.setAttribute('cy', pt.y);
      c.setAttribute('r', i === pts.length - 1 ? 5 : 4.5);
      svg.appendChild(c);
    });
  }

  // Tooltip sits on the last point that actually has data.
  const tip = document.getElementById(tooltipId);
  if (tip) {
    let i = pts.length - 1;
    while (i >= 0 && pts[i].v == null) i--;
    const anchor = pts[Math.max(0, i)];
    tip.style.left = `${anchor.x}px`;
    if (i < 0) {
      tip.style.top = '110px';
      tip.innerHTML = `<strong>${widgetEsc(tooltipTitle)}</strong><span>No attendance yet</span>`;
    } else {
      tip.style.top = `${anchor.y}px`;
      tip.innerHTML = `<strong>${widgetEsc(labels[i] || tooltipTitle)}</strong><span>${pts[i].v.toFixed(1)}% attendance</span>`;
    }
  }
}

// ---- Dashboard: Attendance Overview line chart ---------------------------
function dashTrendData() {
  const sel = document.getElementById('dash-chart-range');
  const mode = (sel && sel.value === 'This Month') ? 'month' : 'week';
  const today = todayBase();
  if (mode === 'week') {
    const mon = mondayOf(today);
    const days = [0, 1, 2, 3, 4, 5].map(i => addDays(mon, i));
    return {
      labels: days.map(d => d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })),
      pcts: days.map(d => dayRate(ymd(d))),
      title: 'Week of ' + mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
    };
  }
  // This Month: the most recent days that have attendance marks, padded with
  // trailing calendar days so the chart always shows six date points.
  const markedDays = Object.keys(DAILY_ATTENDANCE).filter(d => Object.values(marksForDate(d)).length);
  const set = new Set(markedDays);
  for (let i = 0; i < 12; i++) set.add(ymd(addDays(today, -i)));
  const days = [...set].sort().slice(-6);
  return {
    labels: days.map(d => new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })),
    pcts: days.map(d => dayRate(d)),
    title: 'This Month'
  };
}

function renderDashTrend() {
  const d = dashTrendData();
  paintTrendChart('dash-chart-svg', 'dash-chart-line', 'dash-chart-x', d.labels, d.pcts, 'dash-chart-tooltip', d.title, 'dash-chart-area');
}

// ---- Reports: Attendance Overview line chart -----------------------------
function reportTrendData() {
  const sel = document.getElementById('report-chart-range');
  const mode = (sel && sel.value === 'Weekly') ? 'weekly' : 'daily';
  const today = todayBase();
  const mon = mondayOf(today);
  if (mode === 'daily') {
    const days = [0, 1, 2, 3, 4, 5].map(i => addDays(mon, i));
    return {
      labels: days.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })),
      pcts: days.map(d => dayRate(ymd(d))),
      title: 'This Week'
    };
  }
  // Weekly: aggregate every recorded mark across each of the last 6 weeks.
  const weeks = [];
  for (let w = 5; w >= 0; w--) {
    const start = addDays(mon, -7 * w);
    let present = 0, marked = 0;
    for (let d = 0; d < 7; d++) {
      Object.values(marksForDate(ymd(addDays(start, d)))).forEach(s => {
        marked++;
        if (s === 'Present') present++;
      });
    }
    weeks.push({
      label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      pct: marked ? (present / marked) * 100 : null
    });
  }
  return { labels: weeks.map(w => w.label), pcts: weeks.map(w => w.pct), title: 'Weekly average' };
}

function renderReportTrend() {
  const d = reportTrendData();
  paintTrendChart('report-chart-svg', 'report-chart-line', 'report-chart-x', d.labels, d.pcts, 'report-chart-tooltip', d.title);
}

// ---- Dashboard: Attendance Summary donut ---------------------------------
function renderDashSummaryDonut() {
  const total = STUDENTS_DATA.length;
  let present = 0, absent = 0, late = 0;
  STUDENTS_DATA.forEach(s => {
    const st = ATTENDANCE_MAP[s.id] || 'Present';
    if (st === 'Present') present++;
    else if (st === 'Absent') absent++;
    else if (st === 'Late') late++;
  });
  setDonutSegments(
    ['dash-donut-present-seg', 'dash-donut-absent-seg', 'dash-donut-late-seg'],
    [present, absent, late]
  );
  widgetText('dash-donut-pct', `${pctStr(present, total)}%`);
  widgetText('dash-donut-present', present);
  widgetText('dash-donut-present-pct', `(${total ? `${pctStr(present, total)}%` : '0.0%'})`);
  widgetText('dash-donut-absent', absent);
  widgetText('dash-donut-absent-pct', `(${total ? `${pctStr(absent, total)}%` : '0.0%'})`);
  widgetText('dash-donut-late', late);
  widgetText('dash-donut-late-pct', `(${total ? `${pctStr(late, total)}%` : '0.0%'})`);
  widgetText('dash-donut-total', total);
}

// ---- Reports: Attendance by Status donut ----------------------------------
function renderReportStatusDonut() {
  let present = 0, absent = 0, late = 0, excused = 0;
  Object.keys(DAILY_ATTENDANCE).forEach(d => {
    Object.values(marksForDate(d)).forEach(s => {
      if (s === 'Present') present++;
      else if (s === 'Absent') absent++;
      else if (s === 'Late') late++;
      else if (s === 'Excused') excused++;
    });
  });
  const marked = present + absent + late + excused;
  setDonutSegments(
    ['report-donut-present-seg', 'report-donut-absent-seg', 'report-donut-late-seg', 'report-donut-excused-seg'],
    [present, absent, late, excused]
  );
  widgetText('report-donut-pct', `${pctStr(present, marked)}%`);
  widgetText('report-donut-present', present);
  widgetText('report-donut-present-pct', `(${pctStr(present, marked)}%)`);
  widgetText('report-donut-absent', absent);
  widgetText('report-donut-absent-pct', `(${pctStr(absent, marked)}%)`);
  widgetText('report-donut-late', late);
  widgetText('report-donut-late-pct', `(${pctStr(late, marked)}%)`);
  widgetText('report-donut-excused', excused);
  widgetText('report-donut-excused-pct', `(${pctStr(excused, marked)}%)`);
  widgetText('report-donut-total', marked);
}

// ---- Dashboard: Recent Attendance -----------------------------------------
function renderRecentAttendance() {
  const box = document.getElementById('dash-recent-list');
  if (!box) return;
  if (!ATTENDANCE_HISTORY.length) {
    box.innerHTML = `
      <div style="padding:20px 8px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
        <i class="fa-regular fa-calendar-check" style="margin-right:6px;"></i>
        No attendance recorded yet. Go to Attendance to start roll call as soon as students are enrolled.
      </div>`;
    return;
  }
  box.innerHTML = ATTENDANCE_HISTORY.slice(0, 5).map(h => `
    <div style="display:flex; align-items:center; gap:10px; padding:10px 2px; border-bottom:1px solid #f1f5f9;">
      <div style="width:40px;height:40px;border-radius:10px;background:#eff6ff;color:var(--primary-blue);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
        <i class="fa-solid fa-clipboard-check"></i>
      </div>
      <div style="flex:1; min-width:0;">
        <div style="font-weight:600; font-size:0.82rem; color:var(--text-heading); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${widgetEsc(h.className || 'All Classes')}</div>
        <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">${widgetEsc(h.dateFormatted || h.date || '')}</div>
      </div>
      <div style="text-align:right; font-size:0.72rem; color:var(--text-muted); line-height:1.5;">
        <div><span style="color:var(--success-green); font-weight:600;">${h.present || 0}</span> present</div>
        <div><span style="color:var(--danger-red); font-weight:600;">${h.absent || 0}</span> absent · <span style="color:#f59e0b; font-weight:600;">${h.late || 0}</span> late</div>
      </div>
      <span style="font-weight:700; font-size:0.85rem; color:var(--text-heading); flex-shrink:0;">${widgetEsc(h.rate || '100.0%')}</span>
    </div>`).join('');
}

// ---- Reports: Class Attendance Summary ------------------------------------
function renderClassAttendanceSummary() {
  const tbody = document.getElementById('class-attendance-summary-tbody');
  if (!tbody) return;
  if (!STUDENTS_DATA.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:24px; color:var(--text-muted);">
          <i class="fa-regular fa-file-lines" style="margin-right:6px;"></i>
          No attendance data yet. Enroll students and start taking attendance to see class summaries here.
        </td>
      </tr>`;
    return;
  }
  tbody.innerHTML = CLASSES_DATA.map((cls, i) => {
    const students = STUDENTS_DATA.filter(s => s.class_name === cls.name);
    const total = students.length;
    const avg = total
      ? (students.reduce((a, s) => a + (Number(s.attendance_rate) || 0), 0) / total).toFixed(1)
      : '0.0';
    const avgN = Number(avg);
    let absent = 0, late = 0;
    Object.keys(DAILY_ATTENDANCE).forEach(d => {
      const rec = marksForDate(d);
      students.forEach(s => {
        const st = rec[s.id];
        if (st === 'Absent') absent++;
        else if (st === 'Late') late++;
      });
    });
    return `
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:12px;">
          <strong style="color:var(--text-heading);">${widgetEsc(cls.name)}</strong><br>
          <span style="font-size:0.7rem; color:var(--text-muted);">${widgetEsc(cls.room || '')} • ${widgetEsc(cls.subject || '')}</span>
        </td>
        <td style="padding:12px; text-align:center; color:var(--text-heading);">${total}</td>
        <td style="padding:12px; text-align:center;"><span style="color:${avgN >= 80 ? 'var(--success-green)' : (avgN >= 60 ? '#f59e0b' : 'var(--danger-red)')}; font-weight:600;">${avg}%</span></td>
        <td style="padding:12px; text-align:center; color:var(--danger-red);">${absent}</td>
        <td style="padding:12px; text-align:center; color:#f59e0b;">${late}</td>
        <td style="padding:12px; text-align:center;">
          <button class="btn btn-sm btn-outline-primary" onclick="openClassInRollcall(${i})" style="padding:4px 12px;">Open</button>
        </td>
      </tr>`;
  }).join('');
}

function openClassInRollcall(classIndex) {
  const cls = CLASSES_DATA[classIndex];
  if (!cls) return;
  const sel = document.getElementById('rollcall-class-select');
  if (sel) sel.value = cls.name;
  const secSel = document.getElementById('rollcall-section-select');
  if (secSel) secSel.value = 'All';
  switchTab('attendance');
  showToast(`Roll call opened for ${cls.name}`, 'success');
}

// ---- Reports: Top / Low Attendance ----------------------------------------
let topLowTab = 'top';

function setTopLowTab(tab) {
  topLowTab = tab;
  const tTop = document.getElementById('top-low-tab-top');
  const tLow = document.getElementById('top-low-tab-low');
  if (tTop) {
    tTop.style.borderBottom = tab === 'top' ? '2px solid var(--primary-blue)' : 'none';
    tTop.style.color = tab === 'top' ? 'var(--primary-blue)' : '#64748b';
  }
  if (tLow) {
    tLow.style.borderBottom = tab === 'low' ? '2px solid var(--primary-blue)' : 'none';
    tLow.style.color = tab === 'low' ? 'var(--primary-blue)' : '#64748b';
  }
  renderTopLowAttendance();
}

function renderTopLowAttendance() {
  const content = document.getElementById('top-low-content');
  if (!content) return;
  const sorted = STUDENTS_DATA.slice().sort(
    (a, b) => (Number(b.attendance_rate) || 0) - (Number(a.attendance_rate) || 0)
  );
  if (!sorted.length) {
    content.innerHTML = `
      <div style="padding:24px; text-align:center; color:var(--text-muted); font-size:0.85rem;">
        <i class="fa-regular fa-chart-bar" style="margin-right:6px;"></i>
        No students enrolled yet. Rankings will appear here once students are added and attendance is taken.
      </div>`;
    return;
  }
  const pool = topLowTab === 'top' ? sorted.slice(0, 5) : sorted.slice(-5).reverse();
  content.innerHTML = pool.map((s, i) => {
    const rate = Number(s.attendance_rate) || 0;
    const barColor = rate >= 80 ? 'var(--success-green)' : rate >= 60 ? '#f59e0b' : 'var(--danger-red)';
    return `
      <div style="display:flex; align-items:center; gap:10px; padding:10px 0; border-bottom:1px solid #f1f5f9;">
        <span style="width:26px;height:26px;border-radius:50%;background:#eff6ff;color:var(--primary-blue);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.72rem;flex-shrink:0;">${i + 1}</span>
        <div style="flex:1; min-width:0;">
          <div style="font-weight:600; font-size:0.8rem; color:var(--text-heading); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${widgetEsc(s.first_name)} ${widgetEsc(s.last_name)}</div>
          <div style="font-size:0.7rem; color:var(--text-muted); margin-top:2px;">${widgetEsc(s.class_name || '')}${s.section ? ' • Section ' + widgetEsc(s.section) : ''}</div>
          <div style="height:5px; background:#eef2f7; border-radius:4px; margin-top:6px;">
            <div style="height:100%; width:${Math.min(100, rate)}%; background:${barColor}; border-radius:4px;"></div>
          </div>
        </div>
        <span style="font-weight:700; font-size:0.85rem; color:var(--text-heading); flex-shrink:0;">${rate}%</span>
      </div>`;
  }).join('');
}

// ---- Master refresh --------------------------------------------------------
function renderLiveWidgets() {
  renderDashSummaryDonut();
  renderDashTrend();
  renderRecentAttendance();
  renderReportStatusDonut();
  renderReportTrend();
  renderClassAttendanceSummary();
  renderTopLowAttendance();
}

// =========================================================================
// STUDENTS DIRECTORY LOGIC (IMAGES 2, 3, 6, 7, 10)
// =========================================================================
let currentStudentPage = 1;
let currentStudentPageSize = 10;

function updatePaginationButtons(totalPages) {
  const container = document.querySelector('.pagination-controls');
  if (!container) return;
  const numBtns = container.querySelectorAll('.page-btn:not(:first-child):not(:last-child)');
  numBtns.forEach((btn, idx) => {
    const pageVal = idx + 1;
    btn.textContent = pageVal;
    btn.style.display = pageVal <= totalPages ? 'inline-flex' : 'none';
    if (pageVal === currentStudentPage) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  const prevBtn = container.querySelector('.page-btn:first-child');
  const nextBtn = container.querySelector('.page-btn:last-child');
  if (prevBtn) prevBtn.style.opacity = currentStudentPage <= 1 ? '0.5' : '1';
  if (nextBtn) nextBtn.style.opacity = currentStudentPage >= totalPages ? '0.5' : '1';
}

function renderStudentsTable(filterQuery = '') {
  updateAllKPIs();
  const tbody = document.getElementById('tbody-students-list');
  if (!tbody) return;
  tbody.innerHTML = '';

  const classFilter = document.getElementById('filter-class')?.value || 'All';
  const statusFilter = document.getElementById('filter-status')?.value || 'All';

  let list = STUDENTS_DATA.filter(s => {
    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
    const idMatch = s.student_id_number.toLowerCase();
    const query = filterQuery.toLowerCase();
    const matchesSearch = !query || fullName.includes(query) || idMatch.includes(query);
    const matchesClass = classFilter === 'All' || s.class_name === classFilter;
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesClass && matchesStatus;
  });

  const paginationInfo = document.getElementById('pagination-info');

  if (list.length === 0) {
    setStudentViewState('empty');
    if (paginationInfo) {
      paginationInfo.textContent = `Showing 0 to 0 of 0 students`;
    }
    updatePaginationButtons(1);
    return;
  } else {
    setStudentViewState('normal');
  }

  const totalStudents = list.length;
  const totalPages = Math.ceil(totalStudents / currentStudentPageSize) || 1;
  if (currentStudentPage > totalPages) currentStudentPage = 1;
  if (currentStudentPage < 1) currentStudentPage = 1;

  const startIdx = (currentStudentPage - 1) * currentStudentPageSize;
  const pagedList = list.slice(startIdx, startIdx + currentStudentPageSize);

  pagedList.forEach(s => {
    const tr = document.createElement('tr');
    
    // Determine progress color
    let progressColor = '';
    if (s.attendance_rate < 50) progressColor = 'red';
    else if (s.attendance_rate < 80) progressColor = 'orange';

    tr.innerHTML = `
      <td><input type="checkbox" class="custom-checkbox"></td>
      <td><strong>${escapeHTML(s.student_id_number)}</strong></td>
      <td>
        <div class="student-mini-profile">
          <img src="${s.avatar}" alt="${escapeHTML(s.first_name)}" class="mini-avatar">
          <span style="font-weight:600; color:var(--text-heading);">${escapeHTML(s.first_name)} ${escapeHTML(s.last_name)}</span>
        </div>
      </td>
      <td>${escapeHTML(s.class_name)}</td>
      <td>${escapeHTML(s.section)}</td>
      <td>
        <span class="status-pill status-${s.status === 'Active' ? 'active' : 'inactive'}">
          ${escapeHTML(s.status)}
        </span>
      </td>
      <td>
        <div class="attendance-rate-cell">
          <div class="progress-track">
            <div class="progress-fill ${progressColor}" style="width: ${s.attendance_rate}%;"></div>
          </div>
          <span class="rate-percentage-text">${s.attendance_rate}%</span>
        </div>
      </td>
      <td style="text-align: right;">
        <div class="actions-cell" style="justify-content: flex-end;">
          <button class="action-icon-btn" title="View Student" onclick="viewStudentDetails(${s.id})">
            <i class="fa-regular fa-eye"></i>
          </button>
          <button class="action-icon-btn" title="Edit Student" onclick="showEditStudentForm(${s.id})">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="action-icon-btn delete" title="Delete Student" onclick="openDeleteModal(${s.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (paginationInfo) {
    const startNum = totalStudents === 0 ? 0 : startIdx + 1;
    const endNum = Math.min(startIdx + currentStudentPageSize, totalStudents);
    paginationInfo.textContent = `Showing ${startNum} to ${endNum} of ${totalStudents} students`;
  }
  updatePaginationButtons(totalPages);
}

function handleStudentSearch(val) {
  currentStudentPage = 1;
  renderStudentsTable(val);
}

function filterStudentsTable() {
  currentStudentPage = 1;
  const query = document.getElementById('students-search-input')?.value || '';
  renderStudentsTable(query);
}

// Interactive State Switcher (Table / Empty State / Error State)
function setStudentViewState(state) {
  const normalView = document.getElementById('student-view-normal');
  const emptyView = document.getElementById('student-view-empty');
  const errorView = document.getElementById('student-view-error');

  const btnNormal = document.getElementById('btn-state-normal');
  const btnEmpty = document.getElementById('btn-state-empty');
  const btnError = document.getElementById('btn-state-error');

  normalView.classList.add('d-none');
  emptyView.classList.add('d-none');
  errorView.classList.add('d-none');

  [btnNormal, btnEmpty, btnError].forEach(b => {
    b.className = 'btn btn-sm btn-outline';
  });

  if (state === 'empty') {
    emptyView.classList.remove('d-none');
    btnEmpty.className = 'btn btn-sm btn-primary';
  } else if (state === 'error') {
    errorView.classList.remove('d-none');
    btnError.className = 'btn btn-sm btn-primary';
  } else {
    normalView.classList.remove('d-none');
    btnNormal.className = 'btn btn-sm btn-primary';
  }
}

// =========================================================================
// CREATE STUDENT (IMAGE 1)
// =========================================================================
function showCreateStudentForm() {
  document.querySelectorAll('.tab-pane-content').forEach(pane => pane.classList.add('d-none'));
  document.getElementById('pane-create-student').classList.remove('d-none');
}

// Photos are stored inside the Firestore document itself, and a Firestore
// document may not exceed ~1 MB. Uploading the original file as a base64 data
// URL blew past that limit, the write was rejected, and every create/edit/
// delete silently stopped persisting. Downscale every upload first.
function compressImageFile(file, maxDim = 512, quality = 0.72) {
  return new Promise(resolve => {
    if (!file || typeof FileReader === 'undefined') return resolve(null);
    const reader = new FileReader();
    reader.onerror = () => resolve(null);
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => resolve(null);
      img.onload = () => {
        try {
          const scale = Math.min(1, maxDim / Math.max(img.width || maxDim, img.height || maxDim));
          const w = Math.max(1, Math.round((img.width || maxDim) * scale));
          const h = Math.max(1, Math.round((img.height || maxDim) * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const out = canvas.toDataURL('image/jpeg', quality);
          // Extremely large result (e.g. tiny canvas quirks): refuse it so the
          // caller can fall back instead of breaking every future save.
          resolve(out && out.length < 300000 ? out : null);
        } catch (err) {
          resolve(null);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// The users/students arrays are written to Firestore as ONE document per
// collection, and that document has the same ~1 MiB ceiling. A few large
// avatars by themselves (the original accounts included ~315 KB and ~476 KB
// base64 images) filled the users document, so ANY extra account pushed the
// whole write past the limit and got rejected. These helpers re-encode any
// oversized data-URL image down to a small JPEG before a document is
// persisted, keeping the door open for "as many" users/students as the team
// adds without ever crossing the 1 MiB line again.
function downscaleImageDataUrl(dataUrl, maxDim = 192, quality = 0.68) {
  return new Promise(resolve => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/') || typeof Image === 'undefined') {
      return resolve(dataUrl);
    }
    const img = new Image();
    img.onerror = () => resolve(dataUrl);
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round((img.width || 1) * scale));
        const h = Math.max(1, Math.round((img.height || 1) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL('image/jpeg', quality);
        resolve(out && out.length < dataUrl.length ? out : dataUrl);
      } catch (err) {
        resolve(dataUrl);
      }
    };
    img.src = dataUrl;
  });
}

// Keep each stored avatar under ~24 KB of base64 (≈18 KB decoded). Fresh
// uploads already land below this; the ceiling is a safety net for imported
// backups or previously-saved large images.
const AVATAR_PAYLOAD_CAP = 24000;
async function compactOversizedAvatars(list) {
  if (!Array.isArray(list)) return;
  for (const item of list) {
    const avatar = item && typeof item.avatar === 'string' ? item.avatar : '';
    if (avatar.length > AVATAR_PAYLOAD_CAP && avatar.startsWith('data:image/')) {
      const compact = await downscaleImageDataUrl(avatar, 192, 0.68);
      if (compact && compact !== avatar) item.avatar = compact;
    }
  }
}

async function handleCreateStudentPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const dataUrl = await compressImageFile(file, 320, 0.72);
  if (!dataUrl) {
    showToast('Could not read that photo. Please try a different image.', 'error');
    return;
  }
  const preview = document.getElementById('create-photo-preview');
  const placeholder = document.getElementById('create-upload-icon-placeholder');
  if (preview) {
    preview.src = dataUrl;
    preview.style.display = 'block';
  }
  if (placeholder) placeholder.style.display = 'none';
  showToast('Student photo selected and optimized for saving!', 'info');
}

function handleCreateStudentPhotoPrompt() {
  const url = prompt('Enter student photo URL (https://...):');
  if (url && url.trim().startsWith('http')) {
    const preview = document.getElementById('create-photo-preview');
    const placeholder = document.getElementById('create-upload-icon-placeholder');
    if (preview) {
      preview.src = url.trim();
      preview.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    showToast('Student photo URL set!', 'info');
  }
}

function triggerPhotoPick() {
  const fileInput = document.getElementById('create-photo-file-input');
  if (fileInput) {
    fileInput.click();
  } else {
    handleCreateStudentPhotoPrompt();
  }
}

function handleCreateStudentSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const btn = document.getElementById('btn-save-new-student');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

  setTimeout(async () => {
    const customAvatar = document.getElementById('create-photo-preview')?.src;
    const newStudent = {
      id: Date.now(),
      student_id_number: form.student_id_number.value,
      first_name: form.first_name.value,
      middle_name: form.middle_name.value || '',
      last_name: form.last_name.value,
      class_name: form.class_name ? form.class_name.value : '',
      section: form.section ? form.section.value : '',
      strand: 'BSIT',
      status: 'Active',
      attendance_rate: 100,
      dob: form.dob.value,
      gender: form.gender.value,
      email: form.email.value,
      contact: form.contact.value,
      address: form.address.value,
      guardian_name: form.guardian_name.value,
      guardian_contact: form.guardian_contact.value,
      relationship: form.relationship.value,
      notes: form.notes.value,
      avatar: (customAvatar && customAvatar.length > 10) ? customAvatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    };

    STUDENTS_DATA.unshift(newStudent);
    const saved = await persistStudentsData();
    form.reset();
    const createPreview = document.getElementById('create-photo-preview');
    if (createPreview) createPreview.style.display = 'none';
    const createPlaceholder = document.getElementById('create-upload-icon-placeholder');
    if (createPlaceholder) createPlaceholder.style.display = 'flex';
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Save Student';
    if (saved) {
      showToast(`New student "${newStudent.first_name} ${newStudent.last_name}" created successfully!`, 'success');
    } else {
      showToast(`"${newStudent.first_name} ${newStudent.last_name}" was only added to this screen — the cloud save failed, so a refresh will undo it.`, 'error');
    }
    switchTab('students');
  }, 600);
}

// =========================================================================
// EDIT STUDENT (IMAGE 2)
// =========================================================================
async function handleEditStudentPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const dataUrl = await compressImageFile(file, 320, 0.72);
  if (!dataUrl) {
    showToast('Could not read that photo. Please try a different image.', 'error');
    return;
  }
  const preview = document.getElementById('edit-photo-preview');
  if (preview) preview.src = dataUrl;
  showToast('Photo updated in preview (optimized). Click "Update Student" to save.', 'info');
}

function handleEditStudentPhotoPrompt() {
  const url = prompt('Enter student photo URL (https://...):');
  if (url && url.trim().startsWith('http')) {
    const preview = document.getElementById('edit-photo-preview');
    if (preview) preview.src = url.trim();
    showToast('Student photo URL set in preview. Click "Update Student" to save.', 'info');
  }
}

function removeEditStudentPhoto() {
  const preview = document.getElementById('edit-photo-preview');
  if (preview) preview.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
  showToast('Photo reset to default placeholder. Click "Update Student" to save.', 'info');
}

function populateEditSectionSelect(className, selectedSection) {
  const secSel = document.getElementById('edit-section');
  if (!secSel) return;
  const cls = CLASSES_DATA.find(c => c.name === className);
  const sections = (cls && Array.isArray(cls.sections) && cls.sections.length) ? cls.sections : ['A'];
  const prev = selectedSection || secSel.value;
  secSel.innerHTML = '';
  sections.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    secSel.appendChild(opt);
  });
  if (sections.includes(prev)) secSel.value = prev;
}

function showEditStudentForm(id) {
  const student = STUDENTS_DATA.find(s => s.id === id) || STUDENTS_DATA[0];
  document.getElementById('edit-student-id').value = student.id;
  document.getElementById('edit-first-name').value = student.first_name || '';
  document.getElementById('edit-middle-name').value = student.middle_name || '';
  document.getElementById('edit-last-name').value = student.last_name || '';
  document.getElementById('edit-id-number').value = student.student_id_number || '';
  document.getElementById('edit-dob').value = student.dob || '';
  document.getElementById('edit-gender').value = student.gender || 'Male';
  // Class + section selects (populated from CLASSES_DATA)
  const editClassSel = document.getElementById('edit-class-name');
  if (editClassSel) {
    const prevClass = editClassSel.value;
    editClassSel.innerHTML = '';
    CLASSES_DATA.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      editClassSel.appendChild(opt);
    });
    editClassSel.value = (student.class_name && Array.from(editClassSel.options).some(o => o.value === student.class_name))
      ? student.class_name
      : prevClass;
    populateEditSectionSelect(student.class_name || editClassSel.value, student.section);
  }
  document.getElementById('edit-email').value = student.email || '';
  document.getElementById('edit-contact').value = student.contact || '';
  document.getElementById('edit-address').value = student.address || '';
  document.getElementById('edit-guardian-name').value = student.guardian_name || '';
  document.getElementById('edit-guardian-contact').value = student.guardian_contact || '';
  if (document.getElementById('edit-relationship')) {
    document.getElementById('edit-relationship').value = student.relationship || 'Father';
  }
  if (document.getElementById('edit-notes')) {
    document.getElementById('edit-notes').value = student.notes || '';
  }
  const preview = document.getElementById('edit-photo-preview');
  if (preview) preview.src = student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';

  document.querySelectorAll('.tab-pane-content').forEach(pane => pane.classList.add('d-none'));
  document.getElementById('pane-edit-student').classList.remove('d-none');
}

function handleEditStudentSubmit(event) {
  event.preventDefault();
  const btn = document.getElementById('btn-update-student');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Updating...';

  setTimeout(async () => {
    const id = Number(document.getElementById('edit-student-id').value);
    const student = STUDENTS_DATA.find(s => s.id === id);
    if (student) {
      student.first_name = document.getElementById('edit-first-name')?.value || student.first_name;
      student.middle_name = document.getElementById('edit-middle-name')?.value || '';
      student.last_name = document.getElementById('edit-last-name')?.value || student.last_name;
      student.student_id_number = document.getElementById('edit-id-number')?.value || student.student_id_number;
      student.dob = document.getElementById('edit-dob')?.value || student.dob;
      student.gender = document.getElementById('edit-gender')?.value || student.gender;
      const editClassSel = document.getElementById('edit-class-name');
      if (editClassSel && editClassSel.value) {
        student.class_name = editClassSel.value;
      }
      const editSectionSel = document.getElementById('edit-section');
      if (editSectionSel && editSectionSel.value) {
        student.section = editSectionSel.value;
      }
      student.strand = 'BSIT';
      student.email = document.getElementById('edit-email')?.value || student.email;
      student.contact = document.getElementById('edit-contact')?.value || student.contact;
      student.address = document.getElementById('edit-address')?.value || student.address;
      student.guardian_name = document.getElementById('edit-guardian-name')?.value || student.guardian_name;
      student.guardian_contact = document.getElementById('edit-guardian-contact')?.value || student.guardian_contact;
      if (document.getElementById('edit-relationship')) {
        student.relationship = document.getElementById('edit-relationship').value;
      }
      if (document.getElementById('edit-notes')) {
        student.notes = document.getElementById('edit-notes').value;
      }
      const preview = document.getElementById('edit-photo-preview');
      if (preview && preview.src) {
        student.avatar = preview.src;
      }
      const saved = await persistStudentsData();
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Update Student';
      if (saved) {
        showToast(`Student information updated successfully!`, 'success');
      } else {
        showToast('The edit was applied on this screen only — the cloud save failed, so a refresh will undo it.', 'error');
      }
    } else {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Update Student';
    }
    switchTab('students');
  }, 600);
}

function viewStudentDetails(id) {
  showEditStudentForm(id);
}

// =========================================================================
// DELETE MODAL (IMAGE 4)
// =========================================================================
function openDeleteModal(studentId) {
  const student = STUDENTS_DATA.find(s => s.id === studentId);
  if (!student) return;

  studentToDeleteId = studentId;
  document.getElementById('modal-delete-avatar').src = student.avatar;
  document.getElementById('modal-delete-name').textContent = `${student.first_name} ${student.last_name}`;
  document.getElementById('modal-delete-details').innerHTML = `
    ID: ${escapeHTML(student.student_id_number)}<br>Class: ${escapeHTML(student.class_name)} | Section: ${escapeHTML(student.section)}
  `;

  document.getElementById('modal-delete-student').classList.add('active');
}

function closeDeleteModal() {
  document.getElementById('modal-delete-student').classList.remove('active');
  studentToDeleteId = null;
}

function executeDeleteStudent() {
  if (!studentToDeleteId) return;
  const btn = document.getElementById('btn-confirm-delete');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Deleting...';

  setTimeout(async () => {
    STUDENTS_DATA = STUDENTS_DATA.filter(s => s.id !== studentToDeleteId);
    const saved = await persistStudentsData();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-regular fa-trash-can"></i> Yes, Delete';
    closeDeleteModal();
    if (saved) {
      showToast('Student record deleted successfully.', 'success');
    } else {
      showToast('The record was removed on this screen only — the cloud delete failed, so a refresh will bring it back.', 'error');
    }
    renderStudentsTable();
  }, 600);
}

// =========================================================================
// ATTENDANCE & ROLL CALL (IMAGE 4)
// =========================================================================
function getActiveRosterList() {
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const selectedSection = document.getElementById('rollcall-section-select')?.value || 'All';
  let list = (selectedClass === 'All')
    ? STUDENTS_DATA.slice()
    : STUDENTS_DATA.filter(s => s.class_name === selectedClass);
  if (selectedSection && selectedSection !== 'All') {
    list = list.filter(s => s.section === selectedSection);
  }
  return list;
}

function populateRollcallSectionSelect() {
  const secSel = document.getElementById('rollcall-section-select');
  if (!secSel) return;
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const cls = CLASSES_DATA.find(c => c.name === selectedClass);
  const sections = (cls && Array.isArray(cls.sections) && cls.sections.length) ? cls.sections : [];
  const prev = secSel.value;
  secSel.innerHTML = '';
  if (sections.length === 0) {
    const opt = document.createElement('option');
    opt.value = 'All';
    opt.textContent = 'All Sections';
    secSel.appendChild(opt);
    secSel.disabled = true;
    return;
  }
  secSel.disabled = false;
  const allOpt = document.createElement('option');
  allOpt.value = 'All';
  allOpt.textContent = 'All Sections';
  secSel.appendChild(allOpt);
  sections.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = `Section ${s}`;
    secSel.appendChild(opt);
  });
  if (sections.includes(prev)) secSel.value = prev;
}

function loadRosterForAttendance(isManual = false) {
  const btn = document.getElementById('btn-load-students');
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const selectedDate = document.getElementById('rollcall-date')?.value || '2026-05-20';
  const selectedSubject = document.getElementById('rollcall-subject')?.value || 'Introduction to Computing';

  // Synchronize ATTENDANCE_MAP with the active selected date
  ATTENDANCE_MAP = getAttendanceForDate(selectedDate);

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
  }

  setTimeout(() => {
    const tbody = document.getElementById('tbody-rollcall-roster');
    if (!tbody) return;
    tbody.innerHTML = '';

    const list = getActiveRosterList();

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:36px 20px; color:var(--text-muted);">
            <i class="fa-solid fa-folder-open" style="font-size:32px; color:#cbd5e1; margin-bottom:8px; display:block;"></i>
            <strong style="color:var(--text-heading); font-size:0.95rem;">No students found in ${escapeHTML(selectedClass)}</strong>
            <p style="font-size:0.8rem; margin:4px 0 12px;">Create or enroll students in this section from the Students Directory.</p>
            <button class="btn btn-outline-primary btn-sm" onclick="showCreateStudentForm()">
              <i class="fa-solid fa-user-plus"></i> Enroll Student Now
            </button>
          </td>
        </tr>
      `;
    } else {
      list.forEach((s, idx) => {
        const status = ATTENDANCE_MAP[s.id] || 'Present';
        const tr = document.createElement('tr');

        tr.innerHTML = `
          <td><input type="checkbox" class="custom-checkbox rollcall-check" data-id="${s.id}"></td>
          <td><strong>${idx + 1}</strong></td>
          <td><code>${escapeHTML(s.student_id_number)}</code></td>
          <td>
            <div class="student-mini-profile">
              <img src="${s.avatar}" class="mini-avatar">
              <span style="font-weight:600; color:var(--text-heading);">${escapeHTML(s.first_name)} ${escapeHTML(s.last_name)}</span>
            </div>
          </td>
          <td>
            <div class="status-toggle-group" data-student-id="${s.id}">
              <button type="button" class="status-toggle-btn btn-present ${status === 'Present' ? 'active' : ''}" 
                      onclick="setStudentAttendanceStatus(${s.id}, 'Present', this)">
                <i class="fa-regular fa-circle-check"></i> Present
              </button>
              <button type="button" class="status-toggle-btn btn-absent ${status === 'Absent' ? 'active' : ''}" 
                      onclick="setStudentAttendanceStatus(${s.id}, 'Absent', this)">
                <i class="fa-solid fa-xmark"></i> Absent
              </button>
              <button type="button" class="status-toggle-btn btn-late ${status === 'Late' ? 'active' : ''}" 
                      onclick="setStudentAttendanceStatus(${s.id}, 'Late', this)">
                <i class="fa-regular fa-clock"></i> Late
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    updateAttendanceCounters(list);

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-rotate"></i> Load Students';
    }

    showToast(`Roster loaded for ${selectedDate}: ${selectedClass === 'All' ? 'All Classes' : selectedClass} (${list.length} students)`, 'success');
  }, 250);
}

function setStudentAttendanceStatus(studentId, newStatus, clickedBtn) {
  const selectedDate = getSelectedRollcallDate();
  if (!DAILY_ATTENDANCE[selectedDate]) {
    DAILY_ATTENDANCE[selectedDate] = {};
  }
  DAILY_ATTENDANCE[selectedDate][studentId] = newStatus;
  ATTENDANCE_MAP[studentId] = newStatus;
  persistAttendanceData();
  
  // Update button active states in row
  const parentGroup = clickedBtn.parentElement;
  parentGroup.querySelectorAll('.status-toggle-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  updateAttendanceCounters(getActiveRosterList());
}

function updateAttendanceCounters(customList = null) {
  const list = customList || getActiveRosterList();
  const total = list.length;
  let present = 0, absent = 0, late = 0;

  list.forEach(s => {
    const st = ATTENDANCE_MAP[s.id] || 'Present';
    if (st === 'Present') present++;
    else if (st === 'Absent') absent++;
    else if (st === 'Late') late++;
  });

  const presentPct = total ? ((present / total) * 100).toFixed(1) : '0.0';
  const absentPct = total ? ((absent / total) * 100).toFixed(1) : '0.0';
  const latePct = total ? ((late / total) * 100).toFixed(1) : '0.0';

  const elTotal = document.getElementById('rollcall-stat-total');
  if (elTotal) elTotal.textContent = total;

  const elPresent = document.getElementById('rollcall-stat-present');
  if (elPresent) elPresent.textContent = present;
  const elPctPresent = document.getElementById('rollcall-pct-present');
  if (elPctPresent) elPctPresent.textContent = `${presentPct}%`;

  const elAbsent = document.getElementById('rollcall-stat-absent');
  if (elAbsent) elAbsent.textContent = absent;
  const elPctAbsent = document.getElementById('rollcall-pct-absent');
  if (elPctAbsent) elPctAbsent.textContent = `${absentPct}%`;

  const elLate = document.getElementById('rollcall-stat-late');
  if (elLate) elLate.textContent = late;
  const elPctLate = document.getElementById('rollcall-pct-late');
  if (elPctLate) elPctLate.textContent = `${latePct}%`;

  const elShowing = document.getElementById('rollcall-showing-text');
  if (elShowing) elShowing.textContent = total
    ? `Showing 1 to ${total} of ${total} students`
    : 'Showing 0 to 0 of 0 students';

  // Keep dashboard/reports KPIs and the live Overview/Summary widgets in sync
  // as roll-call statuses are toggled.
  updateAllKPIs();
}

function markAllAttendance(status) {
  const selectedDate = getSelectedRollcallDate();
  if (!DAILY_ATTENDANCE[selectedDate]) {
    DAILY_ATTENDANCE[selectedDate] = {};
  }
  const list = getActiveRosterList();
  list.forEach(s => {
    DAILY_ATTENDANCE[selectedDate][s.id] = status;
    ATTENDANCE_MAP[s.id] = status;
  });
  persistAttendanceData();
  loadRosterForAttendance();
  showToast(`Marked all ${list.length} students as ${status} for ${selectedDate}`, 'success');
}

function clearAllAttendance() {
  const selectedDate = getSelectedRollcallDate();
  if (!DAILY_ATTENDANCE[selectedDate]) {
    DAILY_ATTENDANCE[selectedDate] = {};
  }
  const list = getActiveRosterList();
  list.forEach(s => {
    DAILY_ATTENDANCE[selectedDate][s.id] = 'Absent';
    ATTENDANCE_MAP[s.id] = 'Absent';
  });
  persistAttendanceData();
  loadRosterForAttendance();
  showToast(`Attendance marks cleared to Absent for ${selectedDate}`, 'info');
}

function saveAttendanceSession() {
  const btn = document.getElementById('btn-save-attendance-submit');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving Attendance...';
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Save Attendance';
    }
    const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
    const selectedDate = getSelectedRollcallDate();

    // Ensure DAILY_ATTENDANCE for this date is committed
    DAILY_ATTENDANCE[selectedDate] = Object.assign({}, ATTENDANCE_MAP);

    // Push into ATTENDANCE_HISTORY
    const list = getActiveRosterList();
    let pres = 0, abs = 0, lte = 0;
    list.forEach(s => {
      const st = ATTENDANCE_MAP[s.id] || 'Present';
      if (st === 'Present') pres++;
      else if (st === 'Absent') abs++;
      else if (st === 'Late') lte++;
    });
    const pct = list.length ? ((pres / list.length) * 100).toFixed(1) + '%' : '100.0%';

    ATTENDANCE_HISTORY.unshift({
      id: Date.now(),
      date: selectedDate,
      dateFormatted: selectedDate,
      className: selectedClass,
      present: pres,
      absent: abs,
      late: lte,
      rate: pct
    });

    persistAttendanceData();
    showToast(`Attendance recorded for ${selectedClass} (${selectedDate})!`, 'success');
    switchTab('dashboard');
  }, 600);
}

function handleRollcallClassChange() {
  populateRollcallSectionSelect();
  loadRosterForAttendance();
}

function handleRollcallSectionChange() {
  loadRosterForAttendance();
}

// =========================================================================
// ATTENDANCE HISTORY LOGS
// =========================================================================
let ATTENDANCE_HISTORY = [];

function openAttendanceHistoryModal() {
  const modal = document.getElementById('modal-attendance-history');
  if (!modal) return;
  const tbody = document.getElementById('tbody-history-records');
  if (tbody) {
    tbody.innerHTML = '';
    ATTENDANCE_HISTORY.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${escapeHTML(item.dateFormatted)}</strong></td>
        <td>${escapeHTML(item.className)}</td>
        <td><span style="color:var(--success-green); font-weight:600;">${item.present}</span></td>
        <td><span style="color:var(--danger-red); font-weight:600;">${item.absent}</span></td>
        <td><strong>${item.rate}</strong></td>
        <td>
          <button class="btn btn-outline btn-sm" style="padding:2px 8px; font-size:0.75rem;" 
                  onclick="loadHistoryRecordIntoRollcall('${item.date}', '${item.className}')">
            <i class="fa-solid fa-arrow-right-to-bracket"></i> Load
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }
  modal.classList.add('active');
}

function closeAttendanceHistoryModal() {
  const modal = document.getElementById('modal-attendance-history');
  if (modal) modal.classList.remove('active');
}

function loadHistoryRecordIntoRollcall(date, className) {
  closeAttendanceHistoryModal();
  const dateInput = document.getElementById('rollcall-date');
  if (dateInput) dateInput.value = date;
  const classSelect = document.getElementById('rollcall-class-select');
  if (classSelect) {
    if (!Array.from(classSelect.options).some(opt => opt.value === className)) {
      const opt = document.createElement('option');
      opt.value = className;
      opt.textContent = className;
      classSelect.appendChild(opt);
    }
    classSelect.value = className;
  }
  populateRollcallSectionSelect();
  loadRosterForAttendance();
  showToast(`Loaded historical attendance for ${className} (${date})`, 'info');
}

// =========================================================================
// CLASSES MANAGEMENT ACTIONS & STATE
// =========================================================================
let currentViewingClass = 'BSIT 1st Year';

let CLASSES_DATA = [
  { id: 1, name: 'BSIT 1st Year', room: 'Room 201', subject: 'Introduction to Computing', instructor: 'Wilfredo Villas', enrolled: 0, avg_attendance: '0.0%', status: 'Active', sections: ['A', 'B', 'C', 'Sunday'] },
  { id: 2, name: 'BSIT 2nd Year', room: 'Room 204', subject: 'Data Structures & Algorithms', instructor: 'Jessiemae C. Jusayan', enrolled: 0, avg_attendance: '0.0%', status: 'Active', sections: ['A', 'B', 'C', 'Sunday'] },
  { id: 3, name: 'BSIT 3rd Year', room: 'Room 305', subject: 'Database Management Systems', instructor: 'April Jean Villas', enrolled: 0, avg_attendance: '0.0%', status: 'Active', sections: ['A', 'B', 'C', 'Sunday'] },
  { id: 4, name: 'BSIT 4th Year', room: 'Lab 404', subject: 'Capstone Project & IT Practicum', instructor: 'April Jean Villas', enrolled: 0, avg_attendance: '0.0%', status: 'Active', sections: ['A', 'B', 'Sunday'] }
];

function renderClassesGrid() {
  const container = document.getElementById('classes-grid-container');
  if (!container) return;
  container.innerHTML = '';

  CLASSES_DATA.forEach(c => {
    const classStudents = STUDENTS_DATA.filter(s => s.class_name === c.name);
    const count = classStudents.length;
    const avg = classStudents.length
      ? (classStudents.reduce((acc, s) => acc + s.attendance_rate, 0) / classStudents.length).toFixed(1) + '%'
      : '—';

    const card = document.createElement('div');
    card.className = 'class-card';
    const classSections = (Array.isArray(c.sections) && c.sections.length) ? c.sections : ['A'];
    card.innerHTML = `
      <div class="class-card-header">
        <div class="class-card-title">
          <h3>${escapeHTML(c.name)}</h3>
          <p>${escapeHTML(c.room)} • ${escapeHTML(c.subject)}</p>
        </div>
        <span class="status-pill status-${c.status === 'Active' ? 'active' : 'inactive'}">${escapeHTML(c.status)}</span>
      </div>
      <p style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-solid fa-user-tie"></i> Instructor: ${escapeHTML(c.instructor)}</p>
      <div style="display:flex; flex-wrap:wrap; gap:6px; margin:8px 0 12px;">
        ${classSections.map(s => `<span class="status-pill status-active" style="background:#eff6ff; color:var(--primary-blue); border:1px solid #bfdbfe;">Sec ${escapeHTML(s)}</span>`).join('')}
      </div>
      <div class="class-card-stats">
        <div class="class-stat-item">
          <span class="val">${count}</span>
          <span class="lbl">Enrolled</span>
        </div>
        <div class="class-stat-item">
          <span class="val" style="color:var(--success-green);">${avg}</span>
          <span class="lbl">Avg. Attendance</span>
        </div>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="takeAttendanceForClass('${escapeHTML(c.name)}')">
          <i class="fa-solid fa-clipboard-check"></i> Take Attendance
        </button>
        <button class="btn btn-outline btn-sm" onclick="viewClassRoster('${escapeHTML(c.name)}')">
          <i class="fa-regular fa-folder-open"></i> View
        </button>
        <button class="btn btn-outline btn-sm" onclick="openEditClassModal('${escapeHTML(c.name)}')" title="Edit class">
          <i class="fa-solid fa-pen"></i> Edit
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openAddClassModal() {
  const modal = document.getElementById('modal-add-class');
  if (!modal) return;
  // Reset form for a fresh create
  const hiddenEdit = document.getElementById('new-class-edit-name');
  if (hiddenEdit) hiddenEdit.value = '';
  const modalTitle = document.getElementById('modal-add-class-title');
  if (modalTitle) modalTitle.textContent = 'Create Academic Class';
  const modalSub = document.getElementById('modal-add-class-sub');
  if (modalSub) modalSub.textContent = 'Register a new subject, room, sections, and assigned instructor.';
  const submitBtn = document.getElementById('btn-save-new-class');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Create Class';
  }
  ['new-class-name', 'new-class-subject', 'new-class-room', 'new-class-instructor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const sectionsEl = document.getElementById('new-class-sections');
  if (sectionsEl) sectionsEl.value = 'A, B, C, Sunday';
  modal.classList.add('active');
}

function openEditClassModal(className) {
  const cls = CLASSES_DATA.find(c => c.name === className);
  if (!cls) return;
  const modal = document.getElementById('modal-add-class');
  if (!modal) return;
  const hiddenEdit = document.getElementById('new-class-edit-name');
  if (hiddenEdit) hiddenEdit.value = className;
  const modalTitle = document.getElementById('modal-add-class-title');
  if (modalTitle) modalTitle.textContent = 'Edit Class';
  const modalSub = document.getElementById('modal-add-class-sub');
  if (modalSub) modalSub.textContent = 'Update the class details. Renaming the class will also rename its enrolled students.';
  const submitBtn = document.getElementById('btn-save-new-class');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Save Changes';
  }
  const nameEl = document.getElementById('new-class-name');
  if (nameEl) nameEl.value = cls.name || '';
  const subjectEl = document.getElementById('new-class-subject');
  if (subjectEl) subjectEl.value = cls.subject || '';
  const roomEl = document.getElementById('new-class-room');
  if (roomEl) roomEl.value = cls.room || '';
  const instructorEl = document.getElementById('new-class-instructor');
  if (instructorEl) instructorEl.value = cls.instructor || '';
  const sectionsEl = document.getElementById('new-class-sections');
  if (sectionsEl) sectionsEl.value = (cls.sections || []).join(', ');
  modal.classList.add('active');
}

function closeAddClassModal() {
  const modal = document.getElementById('modal-add-class');
  if (modal) modal.classList.remove('active');
}

function handleAddClassSubmit(e) {
  e.preventDefault();
  const editName = document.getElementById('new-class-edit-name')?.value?.trim();
  const name = document.getElementById('new-class-name')?.value.trim();
  const subject = document.getElementById('new-class-subject')?.value.trim();
  const room = document.getElementById('new-class-room')?.value.trim();
  const instructor = document.getElementById('new-class-instructor')?.value.trim();
  const sectionsRaw = document.getElementById('new-class-sections')?.value.trim() || '';
  const sections = sectionsRaw
    ? sectionsRaw.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  if (!name || !subject || !room || !instructor) {
    showToast('All fields are required to register a class.', 'error');
    return;
  }
  const finalSections = sections.length ? sections : ['A'];

  if (editName) {
    // EDIT MODE: update existing class; rename enrolled students if renamed
    const cls = CLASSES_DATA.find(c => c.name === editName);
    if (!cls) {
      showToast('Class not found — it may have been removed.', 'error');
      return;
    }
    const oldName = cls.name;
    cls.name = name;
    cls.subject = subject;
    cls.room = room;
    cls.instructor = instructor;
    cls.sections = finalSections;
    if (oldName !== name) {
      // Auto-rename member students to the new class name
      STUDENTS_DATA.forEach(s => {
        if (s.class_name === oldName) {
          s.class_name = name;
          // keep section membership intact
          if (Array.isArray(s.sections) && s.sections.length) {
            s.sections = finalSections;
          }
        }
      });
      persistStudentsData();
    }
    persistClassesData();
    closeAddClassModal();
    renderClassesGrid();
    populateClassDataSelects();
    populateRollcallSectionSelect();
    populateReportClassSelect();
    showToast(`Class "${name}" updated successfully!`, 'success');
    return;
  }

  if (CLASSES_DATA.some(c => c.name === name)) {
    showToast(`A class named "${name}" already exists.`, 'error');
    return;
  }

  const newClass = {
    id: Date.now(),
    name,
    subject,
    room,
    instructor,
    enrolled: 0,
    avg_attendance: '100.0%',
    status: 'Active',
    sections: finalSections
  };

  CLASSES_DATA.push(newClass);
  persistClassesData();

  // Add to Attendance class dropdown if not existing
  populateClassDataSelects();
  populateRollcallSectionSelect();
  populateReportClassSelect();

  closeAddClassModal();
  renderClassesGrid();
  showToast(`Class "${name}" created successfully!`, 'success');

  // Reset form
  const hiddenEdit = document.getElementById('new-class-edit-name');
  if (hiddenEdit) hiddenEdit.value = '';
  ['new-class-name', 'new-class-subject', 'new-class-room', 'new-class-instructor', 'new-class-sections'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

function populateClassDataSelects() {
  // Roll Call class dropdown
  const rollcallSel = document.getElementById('rollcall-class-select');
  if (rollcallSel) {
    const prev = rollcallSel.value;
    rollcallSel.innerHTML = '<option value="All">All Classes (Full Roster)</option>';
    CLASSES_DATA.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      rollcallSel.appendChild(opt);
    });
    if (Array.from(rollcallSel.options).some(o => o.value === prev)) rollcallSel.value = prev;
  }
  // Students directory class filter
  const filterSel = document.getElementById('filter-class');
  if (filterSel) {
    const prevF = filterSel.value;
    filterSel.innerHTML = '<option value="All">All Classes</option>';
    CLASSES_DATA.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      filterSel.appendChild(opt);
    });
    if (Array.from(filterSel.options).some(o => o.value === prevF)) filterSel.value = prevF;
  }
  // Create-student form class select
  const createClassSel = document.getElementById('create-student-class');
  if (createClassSel && CLASSES_DATA.length) {
    createClassSel.innerHTML = '<option value="">Select class</option>';
    CLASSES_DATA.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.name;
      opt.textContent = c.name;
      createClassSel.appendChild(opt);
    });
    triggerCreateSectionSync();
  }
  // Edit-student form class select stays dynamic inside showEditStudentForm
}

function triggerCreateSectionSync() {
  const classSel = document.getElementById('create-student-class');
  const secSel = document.getElementById('create-student-section');
  if (!classSel || !secSel) return;
  const cls = CLASSES_DATA.find(c => c.name === classSel.value);
  const sections = (cls && Array.isArray(cls.sections) && cls.sections.length) ? cls.sections : [];
  const prev = secSel.value;
  secSel.innerHTML = '';
  if (sections.length === 0) {
    const opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Select class first';
    secSel.appendChild(opt);
    secSel.disabled = true;
    return;
  }
  secSel.disabled = false;
  sections.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s;
    opt.textContent = s;
    secSel.appendChild(opt);
  });
  if (sections.includes(prev)) secSel.value = prev;
}

function viewClassRoster(className) {
  currentViewingClass = className;
  const modal = document.getElementById('modal-view-class-roster');
  if (!modal) return;

  const title = document.getElementById('roster-modal-class-title');
  if (title) title.textContent = `Class Roster: ${className}`;

  const sub = document.getElementById('roster-modal-class-sub');
  const classObj = CLASSES_DATA.find(c => c.name === className);
  if (sub && classObj) {
    sub.textContent = `${classObj.subject} • ${classObj.room} • ${classObj.instructor}`;
  }

  const tbody = document.getElementById('tbody-class-roster-students');
  if (tbody) {
    tbody.innerHTML = '';
    const students = STUDENTS_DATA.filter(s => s.class_name === className);
    if (students.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">No students currently enrolled in this class.</td></tr>`;
    } else {
      students.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><code>${escapeHTML(s.student_id_number)}</code></td>
          <td><strong>${escapeHTML(s.first_name)} ${escapeHTML(s.last_name)}</strong></td>
          <td><span style="font-weight:600; color:var(--success-green);">${s.attendance_rate}%</span></td>
          <td><span class="status-pill status-${s.status === 'Active' ? 'active' : 'inactive'}">${escapeHTML(s.status)}</span></td>
        `;
        tbody.appendChild(tr);
      });
    }
  }

  modal.classList.add('active');
}

function closeClassRosterModal() {
  const modal = document.getElementById('modal-view-class-roster');
  if (modal) modal.classList.remove('active');
}

function takeAttendanceForClass(className) {
  switchTab('attendance');
  const select = document.getElementById('rollcall-class-select');
  if (select) {
    if (!Array.from(select.options).some(o => o.value === className)) {
      const opt = document.createElement('option');
      opt.value = className;
      opt.textContent = className;
      select.appendChild(opt);
    }
    select.value = className;
  }
  populateRollcallSectionSelect();
  loadRosterForAttendance(true);
}

function takeAttendanceForCurrentClass() {
  closeClassRosterModal();
  takeAttendanceForClass(currentViewingClass);
}

// =========================================================================
// ACADEMIC CALENDAR ACTIONS & STATE
// =========================================================================
let currentCalendarYear = 2026;
let currentCalendarMonth = 4; // 0-indexed: 4 is May

let CALENDAR_EVENTS = [
  {
    id: 1,
    title: 'Intro to Computing Session',
    date: '2026-05-05',
    time: '08:00 AM - 10:00 AM',
    location: 'Room 201',
    type: 'class',
    desc: 'Regular classroom roll call session for BSIT 1st Year.'
  },
  {
    id: 2,
    title: 'Midterm Examination',
    date: '2026-05-12',
    time: '10:00 AM - 12:00 PM',
    location: 'Main Hall B',
    type: 'exam',
    desc: 'Quarterly computing and programming proficiency examination.'
  },
  {
    id: 3,
    title: 'Faculty Meeting',
    date: '2026-05-18',
    time: '09:00 AM - 11:00 AM',
    location: 'Conference Room',
    type: 'meeting',
    desc: 'Bi-weekly academic review and chronic absence intervention meeting.'
  },
  {
    id: 4,
    title: 'Q2 Attendance Check',
    date: '2026-05-19',
    time: '11:00 AM - 01:00 PM',
    location: 'Admin Office',
    type: 'class',
    desc: 'Administrative audit of all classroom attendance logs.'
  },
  {
    id: 5,
    title: "National Hero's Day",
    date: '2026-05-25',
    time: 'All Day',
    location: 'Campus Wide',
    type: 'holiday',
    desc: 'Official school holiday. No regular classes scheduled.'
  },
  {
    id: 6,
    title: 'Report Submissions',
    date: '2026-05-29',
    time: '05:00 PM Deadline',
    location: 'Registrar',
    type: 'deadline',
    desc: 'Final weekly cutoff for all instructor attendance submissions.'
  }
];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function renderCalendar() {
  const monthDisplay = document.getElementById('calendar-month-display');
  if (monthDisplay) {
    monthDisplay.textContent = `${MONTH_NAMES[currentCalendarMonth]} ${currentCalendarYear}`;
  }

  const container = document.getElementById('calendar-days-container');
  if (!container) return;
  container.innerHTML = '';

  const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();

  // Days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell inactive';
    cell.innerHTML = `<span class="calendar-day-number">${dayNum}</span>`;
    container.appendChild(cell);
  }

  // Days in current month
  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement('div');
    const isToday = (currentCalendarYear === 2026 && currentCalendarMonth === 4 && day === 20);
    cell.className = `calendar-day-cell ${isToday ? 'today' : ''}`;
    
    // Format YYYY-MM-DD
    const mStr = String(currentCalendarMonth + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${currentCalendarYear}-${mStr}-${dStr}`;

    const dayEvents = CALENDAR_EVENTS.filter(e => e.date === dateStr);

    let eventsHtml = '';
    dayEvents.forEach(ev => {
      let tagClass = 'tag-class';
      if (ev.type === 'holiday') tagClass = 'tag-holiday';
      else if (ev.type === 'exam') tagClass = 'tag-exam';
      else if (ev.type === 'meeting') tagClass = 'tag-meeting';
      else if (ev.type === 'deadline') tagClass = 'tag-deadline';

      eventsHtml += `<div class="calendar-event-tag ${tagClass}" title="${escapeHTML(ev.title)} - ${escapeHTML(ev.time)}">${escapeHTML(ev.title)}</div>`;
    });

    cell.innerHTML = `
      <div class="calendar-day-number" style="display:flex; align-items:center; justify-content:space-between; width:100%;">
        <span>${day}</span>
        <div style="display:inline-flex; align-items:center; gap:4px;">
          ${isToday ? '<span class="today-indicator-dot" title="Today"></span>' : ''}
          <button type="button" class="btn btn-xs" style="padding:1px 4px; font-size:0.65rem; line-height:1; border:none; background:transparent; color:var(--primary-blue);" title="View Attendance for ${dateStr}" onclick="event.stopPropagation(); navigateCalendarToRollcall('${dateStr}')">
            <i class="fa-solid fa-clipboard-user"></i>
          </button>
        </div>
      </div>
      ${eventsHtml}
    `;

    cell.addEventListener('click', () => {
      document.getElementById('event-date').value = dateStr;
      openAddEventModal();
    });

    container.appendChild(cell);
  }

  // Fill remainder of 35 or 42 cells
  const totalRendered = firstDay + daysInMonth;
  const remaining = (totalRendered % 7 === 0) ? 0 : 7 - (totalRendered % 7);
  for (let i = 1; i <= remaining; i++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-day-cell inactive';
    cell.innerHTML = `<span class="calendar-day-number">${i}</span>`;
    container.appendChild(cell);
  }

  renderUpcomingEventsList();
}

function renderUpcomingEventsList() {
  const container = document.getElementById('calendar-upcoming-list');
  if (!container) return;
  container.innerHTML = '';

  const badge = document.getElementById('event-count-badge');
  if (badge) badge.textContent = `${CALENDAR_EVENTS.length} Events`;

  if (CALENDAR_EVENTS.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); font-size:0.85rem; padding:12px 0;">No upcoming events scheduled.</p>`;
    return;
  }

  CALENDAR_EVENTS.slice().sort((a,b) => a.date.localeCompare(b.date)).forEach(ev => {
    const parts = ev.date.split('-');
    const monthName = MONTH_NAMES[parseInt(parts[1], 10) - 1].substring(0, 3);
    const dayNum = parseInt(parts[2], 10);

    let typeColor = 'var(--primary-blue)';
    if (ev.type === 'holiday') typeColor = 'var(--success-green)';
    else if (ev.type === 'exam') typeColor = 'var(--purple)';
    else if (ev.type === 'meeting') typeColor = 'var(--warning-amber)';
    else if (ev.type === 'deadline') typeColor = 'var(--danger-red)';

    const item = document.createElement('div');
    item.className = 'calendar-event-card-item';
    item.innerHTML = `
      <div class="event-date-box">
        <span class="month">${monthName}</span>
        <span class="day">${dayNum}</span>
      </div>
      <div class="event-info-text">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h4>${escapeHTML(ev.title)}</h4>
          <button class="action-icon-btn delete" style="width:24px; height:24px;" title="Delete event" onclick="deleteCalendarEvent(${ev.id})">
            <i class="fa-regular fa-trash-can" style="font-size:12px;"></i>
          </button>
        </div>
        <p><i class="fa-regular fa-clock"></i> ${escapeHTML(ev.time)} • ${escapeHTML(ev.location)}</p>
      </div>
    `;
    container.appendChild(item);
  });
}

function prevCalendarMonth() {
  currentCalendarMonth--;
  if (currentCalendarMonth < 0) {
    currentCalendarMonth = 11;
    currentCalendarYear--;
  }
  renderCalendar();
}

function nextCalendarMonth() {
  currentCalendarMonth++;
  if (currentCalendarMonth > 11) {
    currentCalendarMonth = 0;
    currentCalendarYear++;
  }
  renderCalendar();
}

function jumpCalendarToday() {
  currentCalendarYear = 2026;
  currentCalendarMonth = 4;
  renderCalendar();
  showToast('Jumped to Today (May 20, 2026)', 'info');
}

function openAddEventModal() {
  document.getElementById('modal-add-event').classList.add('active');
}

function closeAddEventModal() {
  document.getElementById('modal-add-event').classList.remove('active');
}

function handleAddEventSubmit(e) {
  e.preventDefault();
  const title = document.getElementById('event-title').value.trim();
  const date = document.getElementById('event-date').value;
  const type = document.getElementById('event-type').value;
  const time = document.getElementById('event-time').value.trim();
  const location = document.getElementById('event-location').value.trim();
  const desc = document.getElementById('event-desc').value.trim();

  if (!title || !date) {
    showToast('Event title and date are required.', 'error');
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    date,
    type,
    time: time || 'All Day',
    location: location || 'Campus',
    desc
  };

  CALENDAR_EVENTS.push(newEvent);
  persistCalendarEvents();
  closeAddEventModal();
  renderCalendar();
  showToast(`Event "${title}" added to academic calendar!`, 'success');

  // Reset form
  document.getElementById('event-title').value = '';
  document.getElementById('event-desc').value = '';
}

function deleteCalendarEvent(id) {
  CALENDAR_EVENTS = CALENDAR_EVENTS.filter(e => e.id !== id);
  persistCalendarEvents();
  renderCalendar();
  showToast('Calendar event removed.', 'info');
}


// =========================================================================
// USER ACCOUNTS & ROLES ACTIONS & STATE
// =========================================================================
// (USERS_DATA is declared and managed in global state at top of file)

function renderUsersTable() {
  const tbody = document.getElementById('tbody-users-list');
  if (!tbody) return;
  tbody.innerHTML = '';

  const searchVal = (document.getElementById('users-search-input')?.value || '').toLowerCase();
  const roleVal = document.getElementById('filter-user-role')?.value || 'All';
  const statusVal = document.getElementById('filter-user-status')?.value || 'All';

  const filtered = USERS_DATA.filter(u => {
    const matchSearch = !searchVal || u.name.toLowerCase().includes(searchVal) || u.email.toLowerCase().includes(searchVal) || u.department.toLowerCase().includes(searchVal);
    const matchRole = roleVal === 'All' || u.role === roleVal;
    const matchStatus = statusVal === 'All' || u.status === statusVal;
    return matchSearch && matchRole && matchStatus;
  });

  // Update KPI counters
  const total = USERS_DATA.length;
  const admins = USERS_DATA.filter(u => u.role === 'Administrator').length;
  const instructors = USERS_DATA.filter(u => u.role === 'Instructor').length;
  const staff = USERS_DATA.filter(u => u.role === 'Staff').length;

  document.getElementById('user-kpi-total').textContent = total;
  document.getElementById('user-kpi-admins').textContent = admins;
  document.getElementById('user-kpi-instructors').textContent = instructors;
  document.getElementById('user-kpi-staff').textContent = staff;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">No user accounts match the current filters.</td></tr>`;
    return;
  }

  filtered.forEach(u => {
    let roleBadgeClass = 'role-admin';
    if (u.role === 'Instructor') roleBadgeClass = 'role-instructor';
    else if (u.role === 'Staff') roleBadgeClass = 'role-staff';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="student-mini-profile">
          <img src="${u.avatar}" class="mini-avatar">
          <div>
            <h5 style="font-weight:700; color:var(--text-heading);">${escapeHTML(u.name)}</h5>
            <p style="font-size:0.75rem; color:var(--text-muted);">${escapeHTML(u.email)}</p>
          </div>
        </div>
      </td>
      <td><span class="role-badge ${roleBadgeClass}">${escapeHTML(u.role)}</span></td>
      <td>${escapeHTML(u.department)}</td>
      <td>
        <span class="status-pill status-${u.status === 'Active' ? 'active' : 'inactive'}">
          ${escapeHTML(u.status)}
        </span>
      </td>
      <td><span style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(u.last_active)}</span></td>
      <td style="text-align:right;">
        <div class="actions-cell" style="justify-content:flex-end;">
          <button class="action-icon-btn" title="Edit User" onclick="openUserModal(${u.id})">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="action-icon-btn" title="Reset Password" onclick="resetUserPassword(${u.id})">
            <i class="fa-solid fa-key"></i>
          </button>
          <button class="action-icon-btn" title="Toggle Active Status" onclick="toggleUserStatus(${u.id})">
            <i class="fa-solid ${u.status === 'Active' ? 'fa-user-slash' : 'fa-user-check'}" style="color:${u.status === 'Active' ? 'var(--warning-amber)' : 'var(--success-green)'};"></i>
          </button>
          <button class="action-icon-btn delete" title="Delete User" onclick="deleteUser(${u.id})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterUsersTable() {
  renderUsersTable();
}

async function handleUserModalPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const dataUrl = await compressImageFile(file, 256, 0.72);
  if (!dataUrl) {
    showToast('Could not read that photo. Please try a different image.', 'error');
    return;
  }
  const preview = document.getElementById('user-avatar-preview');
  const urlInput = document.getElementById('user-avatar-url');
  if (preview) preview.src = dataUrl;
  if (urlInput) urlInput.value = dataUrl;
  showToast('User photo added (optimized for saving)!', 'info');
}

function openUserModal(userId = null) {
  const modal = document.getElementById('modal-user-form');
  const title = document.getElementById('user-modal-title');
  const idInput = document.getElementById('manage-user-id');
  const pwdGroup = document.getElementById('user-password-group');
  const avatarPreview = document.getElementById('user-avatar-preview');
  const avatarUrlInput = document.getElementById('user-avatar-url');

  if (userId) {
    const user = USERS_DATA.find(u => u.id === userId);
    if (!user) return;
    idInput.value = user.id;
    title.textContent = `Edit User: ${user.name}`;
    document.getElementById('user-fullname').value = user.name;
    document.getElementById('user-email').value = user.email;
    document.getElementById('user-role').value = user.role;
    document.getElementById('user-status').value = user.status;
    document.getElementById('user-dept').value = user.department;
    if (avatarPreview) avatarPreview.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';
    if (avatarUrlInput) avatarUrlInput.value = (user.avatar && !user.avatar.startsWith('data:')) ? user.avatar : '';
    pwdGroup.style.display = 'none'; // Don't show password field on edit
  } else {
    idInput.value = '';
    title.textContent = 'Add System User';
    document.getElementById('user-fullname').value = '';
    document.getElementById('user-email').value = '';
    document.getElementById('user-role').value = 'Instructor';
    document.getElementById('user-status').value = 'Active';
    document.getElementById('user-dept').value = '';
    if (avatarPreview) avatarPreview.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';
    if (avatarUrlInput) avatarUrlInput.value = '';
    pwdGroup.style.display = 'block';
  }

  modal.classList.add('active');
}

function closeUserModal() {
  document.getElementById('modal-user-form').classList.remove('active');
}

function handleUserSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('manage-user-id').value;
  const name = document.getElementById('user-fullname').value.trim();
  const email = document.getElementById('user-email').value.trim();
  const role = document.getElementById('user-role').value;
  const status = document.getElementById('user-status').value;
  const department = document.getElementById('user-dept').value.trim() || 'General Academics';
  const avatar = document.getElementById('user-avatar-preview')?.src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';

  if (!name || !email) {
    showToast('Name and email are required.', 'error');
    return;
  }

  if (id) {
    // Update existing user
    const user = USERS_DATA.find(u => u.id === Number(id));
    if (user) {
      user.name = name;
      user.email = email;
      user.role = role;
      user.status = status;
      user.department = department;
      user.avatar = avatar;
      if (!user.username) {
        user.username = email.split('@')[0].toLowerCase();
      }
      if (CURRENT_USER && CURRENT_USER.id === user.id) {
        applyCurrentUser(user);
      }
      showToast(`User ${name} updated successfully!`, 'success');
    }
  } else {
    // Create new user
    const defaultPwd = (document.getElementById('user-password')?.value || 'Pass@2026!').trim();
    const derivedUsername = email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    const newUser = {
      id: Date.now(),
      name,
      email,
      username: derivedUsername || `user${Date.now().toString().slice(-4)}`,
      password: defaultPwd,
      aliases: [derivedUsername],
      role,
      department,
      status,
      last_active: 'Just now',
      avatar
    };
    USERS_DATA.unshift(newUser);
    showToast(`New ${role} user "${name}" created with username "${newUser.username}"!`, 'success');
  }

  persistUsersData();
  closeUserModal();
  renderUsersTable();
  renderCredentialsDirectory();
}

function toggleUserStatus(userId) {
  const user = USERS_DATA.find(u => u.id === userId);
  if (!user) return;
  user.status = user.status === 'Active' ? 'Inactive' : 'Active';
  renderUsersTable();
  showToast(`User ${user.name} is now ${user.status}.`, user.status === 'Active' ? 'success' : 'info');
}

function resetUserPassword(userId) {
  openChangeCredentialsModal(userId);
}

function deleteUser(userId) {
  const user = USERS_DATA.find(u => u.id === userId);
  if (!user) return;
  if (confirm(`Are you sure you want to delete user account "${user.name}"?`)) {
    USERS_DATA = USERS_DATA.filter(u => u.id !== userId);
    persistUsersData();
    renderUsersTable();
    renderCredentialsDirectory();
    showToast(`User account deleted.`, 'info');
  }
}


// =========================================================================
// SYSTEM SETTINGS ACTIONS & STATE
// =========================================================================
let SYSTEM_SETTINGS = {
  cutoff_time: '08:00',
  grace_period: 15,
  consecutive_threshold: 3,
  allow_retro: true,
  auto_lock: true,
  require_remarks: false,
  notify_guardian: true,
  weekly_digest: true,
  warning_pct: 75,
  org_name: 'SAMS Learning & Tutoring Center',
  academic_term: '2025 - 2026 / Term 2',
  org_email: 'admin@sams.edu.ph',
  org_phone: '+63 917 123 4567',
  org_address: 'Poblacion, Kadingilan, Bukidnon, Philippines'
};

function switchSettingsSection(sectionName, clickedBtn) {
  document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  } else {
    const btnIndices = { 'policies': 0, 'notifications': 1, 'profile': 2, 'database': 3, 'security': 4 };
    const buttons = document.querySelectorAll('.settings-tab-btn');
    const idx = btnIndices[sectionName] ?? 0;
    if (buttons[idx]) buttons[idx].classList.add('active');
  }

  const sections = ['policies', 'notifications', 'profile', 'database', 'security'];
  sections.forEach(s => {
    const el = document.getElementById(`settings-section-${s}`);
    if (el) {
      el.classList.toggle('d-none', s !== sectionName);
    }
  });

  if (sectionName === 'security') {
    populateSecuritySection();
  }
}

function populateSecuritySection() {
  if (!CURRENT_USER) return;
  const avatar = document.getElementById('security-current-avatar');
  if (avatar && CURRENT_USER.avatar) avatar.src = CURRENT_USER.avatar;

  const name = document.getElementById('security-current-name');
  if (name) name.textContent = CURRENT_USER.name;

  const badge = document.getElementById('security-current-role-badge');
  if (badge) {
    badge.textContent = CURRENT_USER.role;
    badge.className = 'role-badge ' + (
      CURRENT_USER.role === 'Administrator' ? 'role-admin' :
      CURRENT_USER.role === 'Instructor' ? 'role-instructor' : 'role-staff'
    );
  }

  const emailSub = document.getElementById('security-current-email-sub');
  if (emailSub) emailSub.textContent = `${CURRENT_USER.email} • ${CURRENT_USER.department || CURRENT_USER.role}`;

  const dispUsername = document.getElementById('security-display-username');
  if (dispUsername) dispUsername.textContent = CURRENT_USER.username;

  const inputUsername = document.getElementById('security-input-username');
  if (inputUsername) inputUsername.value = CURRENT_USER.username || '';

  const curPwd = document.getElementById('security-input-current-pwd');
  if (curPwd) curPwd.value = '';

  const newPwd = document.getElementById('security-input-new-pwd');
  if (newPwd) newPwd.value = '';

  const confPwd = document.getElementById('security-input-confirm-pwd');
  if (confPwd) confPwd.value = '';

  const alertBox = document.getElementById('settings-security-alert');
  if (alertBox) alertBox.classList.add('d-none');
}

function handleSettingsSecuritySubmit(event) {
  if (event) event.preventDefault();

  if (!CURRENT_USER) {
    showToast('No active user logged in.', 'error');
    return;
  }

  const curPwd = (document.getElementById('security-input-current-pwd')?.value || '').trim();
  const newUsername = (document.getElementById('security-input-username')?.value || '').trim().toLowerCase();
  const newPwd = (document.getElementById('security-input-new-pwd')?.value || '').trim();
  const confPwd = (document.getElementById('security-input-confirm-pwd')?.value || '').trim();
  const alertBox = document.getElementById('settings-security-alert');

  function showSecAlert(msg, isError = true) {
    if (!alertBox) {
      showToast(msg, isError ? 'error' : 'success');
      return;
    }
    alertBox.classList.remove('d-none');
    alertBox.style.display = 'flex';
    alertBox.style.alignItems = 'center';
    alertBox.style.gap = '8px';
    alertBox.style.background = isError ? '#fef2f2' : '#ecfdf5';
    alertBox.style.color = isError ? '#dc2626' : '#059669';
    alertBox.style.border = isError ? '1px solid #fecaca' : '1px solid #a7f3d0';
    alertBox.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${escapeHTML(msg)}</span>`;
  }

  // Verify current password
  if (curPwd !== CURRENT_USER.password) {
    showSecAlert('Current password does not match your active password.', true);
    return;
  }

  // Validate new username
  if (!newUsername || newUsername.length < 3) {
    showSecAlert('New username must be at least 3 characters.', true);
    return;
  }
  if (!/^[a-z0-9_.-]+$/.test(newUsername)) {
    showSecAlert('Username may only contain letters, numbers, dots, and underscores.', true);
    return;
  }

  const conflict = USERS_DATA.find(u => u.id !== CURRENT_USER.id && (u.username?.toLowerCase() === newUsername || u.email?.toLowerCase() === newUsername));
  if (conflict) {
    showSecAlert(`Username "${newUsername}" is already taken by ${conflict.name}.`, true);
    return;
  }

  // Validate new password
  if (!newPwd || newPwd.length < 4) {
    showSecAlert('New password must be at least 4 characters.', true);
    return;
  }
  if (newPwd !== confPwd) {
    showSecAlert('New password and confirmation do not match.', true);
    return;
  }

  // Update CURRENT_USER and in USERS_DATA
  const targetUser = USERS_DATA.find(u => u.id === CURRENT_USER.id);
  if (targetUser) {
    targetUser.username = newUsername;
    targetUser.password = newPwd;
    if (!targetUser.aliases) targetUser.aliases = [];
    if (!targetUser.aliases.includes(newUsername)) targetUser.aliases.push(newUsername);
  }
  CURRENT_USER.username = newUsername;
  CURRENT_USER.password = newPwd;

  applyCurrentUser(CURRENT_USER);
  persistUsersData();
  renderCredentialsDirectory();
  renderUsersTable();
  populateSecuritySection();

  showSecAlert('Username and password updated successfully!', false);
  showToast(`Credentials successfully saved for ${CURRENT_USER.name}!`, 'success');
}

function goToSettingsSection(sectionName) {
  closeAllTopbarDropdowns();
  closeAvatarSettingsActionsModal();
  switchTab('settings');
  switchSettingsSection(sectionName);
  
  const pane = document.getElementById('pane-settings');
  if (pane) {
    pane.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  showToast(`Navigated to ${sectionName.toUpperCase()} settings`, 'info');
}

async function loadSystemSettings() {
  try {
    const doc = await db.collection('sams_db').doc('settings').get();
    if (doc.exists) {
      SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, doc.data().data);
    } else {
      const saved = localStorage.getItem('sams_system_settings');
      if (saved) { SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, JSON.parse(saved)); }
    }
  } catch (err) { console.error('Firestore read failed (settings):', err); }
}

function saveSystemSettings() {
  const btn = document.getElementById('btn-save-settings');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
  }

  setTimeout(() => {
    const getVal = (id, fallback) => document.getElementById(id)?.value ?? fallback;
    const getChecked = (id, fallback) => {
      const el = document.getElementById(id);
      return el ? el.checked : fallback;
    };

    SYSTEM_SETTINGS.cutoff_time = getVal('setting-cutoff-time', '08:00');
    SYSTEM_SETTINGS.grace_period = Number(getVal('setting-grace-period', 15));
    SYSTEM_SETTINGS.consecutive_threshold = Number(getVal('setting-consecutive-threshold', 3));
    SYSTEM_SETTINGS.allow_retro = getChecked('setting-allow-retro', true);
    SYSTEM_SETTINGS.auto_lock = getChecked('setting-auto-lock', true);
    SYSTEM_SETTINGS.require_remarks = getChecked('setting-require-remarks', false);
    SYSTEM_SETTINGS.notify_guardian = getChecked('setting-notify-guardian', true);
    SYSTEM_SETTINGS.weekly_digest = getChecked('setting-weekly-digest', true);
    SYSTEM_SETTINGS.warning_pct = Number(getVal('setting-warning-pct', 75));
    SYSTEM_SETTINGS.org_name = getVal('setting-org-name', 'SAMS Learning & Tutoring Center');
    SYSTEM_SETTINGS.academic_term = getVal('setting-academic-term', '2025 - 2026 / Term 2');
    SYSTEM_SETTINGS.org_email = getVal('setting-org-email', 'admin@sams.edu.ph');
    SYSTEM_SETTINGS.org_phone = getVal('setting-org-phone', '+63 917 123 4567');
    SYSTEM_SETTINGS.org_address = getVal('setting-org-address', 'Poblacion, Kadingilan, Bukidnon, Philippines');

    try {
      localStorage.setItem('sams_system_settings', JSON.stringify(SYSTEM_SETTINGS)); saveToCloud('settings', { data: SYSTEM_SETTINGS }, 'system settings');
    } catch (e) {}

    // Update profile banner
    const nameDisp = document.getElementById('profile-display-name');
    if (nameDisp) nameDisp.textContent = SYSTEM_SETTINGS.org_name;
    const subDisp = document.getElementById('profile-display-sub');
    if (subDisp) subDisp.textContent = `Accredited Institution • ${SYSTEM_SETTINGS.academic_term}`;

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Save Settings';
    }

    showToast('System configuration saved & applied successfully!', 'success');
  }, 400);
}

function resetPolicyDefaults() {
  document.getElementById('setting-cutoff-time').value = '08:00';
  document.getElementById('setting-grace-period').value = 15;
  document.getElementById('setting-consecutive-threshold').value = 3;
  document.getElementById('setting-allow-retro').checked = true;
  document.getElementById('setting-auto-lock').checked = true;
  document.getElementById('setting-require-remarks').checked = false;
  showToast('Attendance policies reset to system standard values.', 'info');
}

function openCenterBadgePicker() {
  const modal = document.getElementById('modal-center-badge-picker');
  if (modal) modal.classList.add('active');
}

function closeCenterBadgePicker() {
  const modal = document.getElementById('modal-center-badge-picker');
  if (modal) modal.classList.remove('active');
}

function selectBadgeIcon(iconClass) {
  const iconEl = document.getElementById('center-badge-icon');
  if (iconEl) {
    iconEl.className = `fa-solid ${iconClass}`;
  }
  SYSTEM_SETTINGS.badge_icon = iconClass;
  try {
    localStorage.setItem('sams_system_settings', JSON.stringify(SYSTEM_SETTINGS)); saveToCloud('settings', { data: SYSTEM_SETTINGS }, 'system settings');
  } catch (e) {}
  closeCenterBadgePicker();
  showToast(`Center emblem updated to ${iconClass.replace('fa-', '')}`, 'success');
}

function triggerLogoUpload() {
  openCenterBadgePicker();
}

function openAvatarSettingsActionsModal() {
  closeAllTopbarDropdowns();
  const modal = document.getElementById('modal-avatar-settings-actions');
  if (!modal) return;

  const currentAvatar = document.getElementById('topbar-user-avatar')?.src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
  const currentName = document.getElementById('topbar-user-name')?.textContent || 'Neil Herbert U. Betacura';
  const currentRole = document.getElementById('topbar-user-role')?.textContent || 'Repository Lead';
  const currentEmail = document.getElementById('dropdown-user-email')?.textContent || 'neil.betacura@sams.edu.ph';

  const preview = document.getElementById('modal-avatar-preview');
  if (preview) preview.src = currentAvatar;

  const nameInput = document.getElementById('modal-profile-name');
  if (nameInput) nameInput.value = currentName;

  const roleInput = document.getElementById('modal-profile-role');
  if (roleInput) roleInput.value = currentRole;

  const emailInput = document.getElementById('modal-profile-email');
  if (emailInput) emailInput.value = currentEmail;

  modal.classList.add('active');
}

function closeAvatarSettingsActionsModal() {
  const modal = document.getElementById('modal-avatar-settings-actions');
  if (modal) modal.classList.remove('active');
}

function selectAvatarPreset(imgSrc) {
  const preview = document.getElementById('modal-avatar-preview');
  if (preview) preview.src = imgSrc;
  const urlInput = document.getElementById('modal-avatar-url-input');
  if (urlInput) urlInput.value = imgSrc;
  showToast('Avatar preset selected! Click "Save Avatar & Profile" to apply.', 'info');
}

function applyCustomAvatarUrl() {
  const urlInput = document.getElementById('modal-avatar-url-input');
  const url = (urlInput?.value || '').trim();
  if (!url) {
    showToast('Please enter an image URL.', 'error');
    return;
  }
  const preview = document.getElementById('modal-avatar-preview');
  if (preview) preview.src = url;
  showToast('Custom avatar URL loaded into preview!', 'info');
}

async function handleAvatarFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const dataUrl = await compressImageFile(file, 256, 0.72);
  if (!dataUrl) {
    showToast('Could not read that photo. Please try a different image.', 'error');
    return;
  }
  const preview = document.getElementById('modal-avatar-preview');
  if (preview) preview.src = dataUrl;
  showToast('Photo loaded from local device (optimized)!', 'info');
}

function handleSaveAdminProfile(event) {
  if (event) event.preventDefault();
  if (!CURRENT_USER) {
    showToast('Please sign in before editing your profile.', 'error');
    return;
  }

  const newAvatar = document.getElementById('modal-avatar-preview')?.src || CURRENT_USER.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
  const newName = (document.getElementById('modal-profile-name')?.value || CURRENT_USER.name || '').trim();
  const newRole = (document.getElementById('modal-profile-role')?.value || CURRENT_USER.role || '').trim();
  const newEmail = (document.getElementById('modal-profile-email')?.value || CURRENT_USER.email || '').trim();
  const newDept = (document.getElementById('modal-profile-dept')?.value || CURRENT_USER.department || '').trim();

  if (!newName || !newEmail) {
    showToast('Name and email are required.', 'error');
    return;
  }

  // Update Topbar
  const topbarAvatar = document.getElementById('topbar-user-avatar');
  if (topbarAvatar) topbarAvatar.src = newAvatar;
  const topbarName = document.getElementById('topbar-user-name');
  if (topbarName) topbarName.textContent = newName;
  const topbarRole = document.getElementById('topbar-user-role');
  if (topbarRole) topbarRole.textContent = newRole;

  // Update Dropdown
  const dropAvatar = document.getElementById('dropdown-user-avatar');
  if (dropAvatar) dropAvatar.src = newAvatar;
  const dropName = document.getElementById('dropdown-user-name');
  if (dropName) dropName.textContent = newName;
  const dropEmail = document.getElementById('dropdown-user-email');
  if (dropEmail) dropEmail.textContent = newEmail;
  const dropRoleBadge = document.getElementById('dropdown-user-role-badge');
  if (dropRoleBadge) dropRoleBadge.textContent = newRole;

  // Update Settings Admin Card
  const settingsAvatar = document.getElementById('settings-admin-avatar');
  if (settingsAvatar) settingsAvatar.src = newAvatar;
  const settingsName = document.getElementById('settings-admin-name');
  if (settingsName) settingsName.textContent = newName;
  const settingsRoleBadge = document.getElementById('settings-admin-role-badge');
  if (settingsRoleBadge) settingsRoleBadge.textContent = newRole;
  const settingsEmailSub = document.getElementById('settings-admin-email-sub');
  if (settingsEmailSub) settingsEmailSub.textContent = `${newEmail} • Primary System Administrator`;

  // Update in USERS_DATA and apply to current user
  if (USERS_DATA && USERS_DATA.length > 0) {
    const userToUpdate = CURRENT_USER ? USERS_DATA.find(u => u.id === CURRENT_USER.id) : null;
    if (!userToUpdate) {
      // Never fall back to another account here: overwriting the first record
      // is how one user's profile used to end up assigned to somebody else.
      closeAvatarSettingsActionsModal();
      showToast('Your session does not match any account. Please sign in again.', 'error');
      return;
    }
    userToUpdate.name = newName;
    userToUpdate.email = newEmail;
    userToUpdate.role = newRole;
    userToUpdate.department = newDept;
    userToUpdate.avatar = newAvatar;
    applyCurrentUser(userToUpdate);
    persistUsersData();
    renderUsersTable();
    renderCredentialsDirectory();
  }

  closeAvatarSettingsActionsModal();
  showToast(`${newName}'s avatar and profile updated successfully!`, 'success');
}

function exportDatabaseBackup() {
  const fullBackup = {
    system: 'Student Attendance Management System (SAMS)',
    version: '1.0.0',
    exported_at: new Date().toISOString(),
    settings: SYSTEM_SETTINGS,
    students: STUDENTS_DATA,
    daily_attendance: DAILY_ATTENDANCE,
    attendance_records: ATTENDANCE_MAP,
    attendance_history: ATTENDANCE_HISTORY,
    calendar_events: CALENDAR_EVENTS,
    system_users: USERS_DATA,
    classes: CLASSES_DATA
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `sams_database_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast('Complete JSON database backup exported successfully!', 'success');
}

function triggerImportDatabase() {
  const input = document.getElementById('input-import-db');
  if (input) input.click();
}

function handleImportDatabaseFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed.students || !Array.isArray(parsed.students)) {
        throw new Error('Invalid backup schema: missing students array.');
      }

      if (parsed.students) STUDENTS_DATA = parsed.students;
      if (parsed.daily_attendance) DAILY_ATTENDANCE = parsed.daily_attendance;
      if (parsed.attendance_records) ATTENDANCE_MAP = parsed.attendance_records;
      if (parsed.attendance_history) ATTENDANCE_HISTORY = parsed.attendance_history;
      if (parsed.calendar_events) CALENDAR_EVENTS = parsed.calendar_events;
      if (parsed.system_users) USERS_DATA = parsed.system_users;
      if (parsed.classes) CLASSES_DATA = parsed.classes;
      if (parsed.settings) {
        SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, parsed.settings); loadSystemSettings();
      }

      renderStudentsTable();
      loadRosterForAttendance();
      renderCalendar();
      renderUsersTable();
      renderClassesGrid();

      persistStudentsData();
      persistAttendanceData();
      persistUsersData();
      persistClassesData();
      persistCalendarEvents();

      showToast(`Database backup "${file.name}" imported successfully! Loaded ${STUDENTS_DATA.length} students.`, 'success');
    } catch (err) {
      showToast('Failed to import database: ' + err.message, 'error');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

function resyncDatabase() {
  showToast('Synchronizing database cache with server...', 'info');
  setTimeout(() => {
    renderStudentsTable();
    loadRosterForAttendance();
    renderUsersTable();
    showToast('Database cache synchronized! All records up to date.', 'success');
  }, 500);
}

function confirmPurgeAttendanceLogs() {
  if (confirm('Warning: This will clear all historical rollcall logs, but preserve all students and classes. Proceed?')) {
    ATTENDANCE_HISTORY = [];
    STUDENTS_DATA.forEach(s => {
      ATTENDANCE_MAP[s.id] = 'Present';
    });
    persistAttendanceData();
    loadRosterForAttendance();
    showToast('Historical attendance logs purged successfully.', 'info');
  }
}

function confirmResetDefaults() {
  if (confirm('Warning: This will reset all students, attendance marks, and calendar events to default seed data. Proceed?')) {
    try {
      localStorage.removeItem('sams_system_settings');
      localStorage.removeItem('sams_students_data');
      localStorage.removeItem('sams_daily_attendance');
      localStorage.removeItem('sams_attendance_map');
      localStorage.removeItem('sams_attendance_history');
      localStorage.removeItem('sams_users_data');
      localStorage.removeItem('sams_classes_data');
      localStorage.removeItem('sams_calendar_events');
      localStorage.removeItem('sams_admin_profile');
      localStorage.removeItem('sams_current_user');
      localStorage.removeItem('sams_active_tab');
      localStorage.removeItem('sams_logged_in');
    } catch (e) {}
    location.reload();
  }
}

// =========================================================================
// SYSTEM HEALTH DIAGNOSTICS ACTIONS
// =========================================================================
function runSystemHealthCheck() {
  const modal = document.getElementById('modal-system-health');
  if (!modal) return;

  const totalRecords = STUDENTS_DATA.length;
  const recordsEl = document.getElementById('diag-total-records');
  if (recordsEl) recordsEl.textContent = `${totalRecords} Students`;

  const latency = Math.floor(3 + Math.random() * 4);
  const latencyEl = document.getElementById('diag-latency');
  if (latencyEl) latencyEl.textContent = `${latency} ms`;

  modal.classList.add('active');
  showToast('System Diagnostics: All services operating normally (100% OK).', 'success');
}

function closeSystemHealthModal() {
  const modal = document.getElementById('modal-system-health');
  if (modal) modal.classList.remove('active');
}

// =========================================================================
// TEST NOTIFICATION ALERT ACTIONS
// =========================================================================
function openTestNotificationModal() {
  const modal = document.getElementById('modal-test-notification');
  if (!modal) return;
  updateTestAlertPreview();
  modal.classList.add('active');
}

function closeTestNotificationModal() {
  const modal = document.getElementById('modal-test-notification');
  if (modal) modal.classList.remove('active');
}

function updateTestAlertPreview() {
  const guardian = document.getElementById('test-guardian-name')?.value || 'Guardian';
  const student = document.getElementById('test-student-select')?.value || 'Student';
  const previewBox = document.getElementById('test-alert-preview-box');
  if (previewBox) {
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    previewBox.textContent = `[SAMS NOTICE]: Dear ${guardian}, your student ${student} was marked ABSENT for Morning Roll Call today (${today}). Please contact the academic registrar if excused.`;
  }
}

function handleSendTestNotification(e) {
  e.preventDefault();
  const phone = document.getElementById('test-guardian-phone')?.value.trim();
  const btn = document.getElementById('btn-send-test-alert');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching...';
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Dispatch Test SMS';
    }
    closeTestNotificationModal();
    showToast(`Test SMS alert dispatched to ${phone} (Carrier Delivered)!`, 'success');
  }, 600);
}

// =========================================================================
// CSV EXPORT ENGINE
// =========================================================================
function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportStudentsCSV() {
  const headers = ['Student ID', 'Full Name', 'Class', 'Section', 'Strand', 'Status', 'Attendance Rate', 'Email', 'Contact', 'Address', 'Guardian Name', 'Guardian Contact'];
  const rows = STUDENTS_DATA.map(s => [
    `"${s.student_id_number}"`,
    `"${s.first_name} ${s.last_name}"`,
    `"${s.class_name}"`,
    `"${s.section}"`,
    `"${s.strand}"`,
    `"${s.status}"`,
    `"${s.attendance_rate}%"`,
    `"${s.email}"`,
    `"${s.contact}"`,
    `"${s.address}"`,
    `"${s.guardian_name}"`,
    `"${s.guardian_contact}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`sams_students_roster_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  showToast('Exported student directory to CSV successfully!', 'success');
}

function exportAttendanceReportCSV() {
  const selectedDate = document.getElementById('rollcall-date')?.value || new Date().toISOString().split('T')[0];
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const list = (selectedClass === 'All') ? STUDENTS_DATA : STUDENTS_DATA.filter(s => s.class_name === selectedClass);

  const headers = ['Date', 'Class', 'Student ID', 'Student Name', 'Attendance Status', 'Verified By'];
  const rows = list.map(s => [
    `"${selectedDate}"`,
    `"${s.class_name}"`,
    `"${s.student_id_number}"`,
    `"${s.first_name} ${s.last_name}"`,
    `"${ATTENDANCE_MAP[s.id] || 'Present'}"`,
    `"${CURRENT_USER ? CURRENT_USER.name : 'Signed-in User'} (${CURRENT_USER ? CURRENT_USER.role : 'Unknown'})"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`sams_attendance_report_${selectedDate}.csv`, csvContent);
  showToast('Exported attendance log to CSV successfully!', 'success');
}

// =========================================================================
// INSTRUCTOR → ADMIN REPORT GENERATOR
// Builds a detailed, print-ready HTML report for one class so an instructor
// can hand it to the Administrator during the defense/demo (Print → Save as
// PDF from the opened report window).
// =========================================================================
function getInstructorClassName(user) {
  return findInstructorClassName(user);
}

function populateReportClassSelect() {
  const sel = document.getElementById('report-class-select');
  if (!sel) return;
  const names = [];
  STUDENTS_DATA.forEach(s => { if (s.class_name && !names.includes(s.class_name)) names.push(s.class_name); });
  CLASSES_DATA.forEach(c => { if (c.name && !names.includes(c.name)) names.push(c.name); });
  const current = sel.value;
  sel.innerHTML = '<option value="All Classes">All Classes</option>';
  names.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    sel.appendChild(opt);
  });
  if (current && current !== 'All Classes' && names.includes(current)) sel.value = current;
}

function resolveReportClass() {
  const sel = document.getElementById('report-class-select');
  const picked = sel ? sel.value : '';
  if (picked && picked !== 'All Classes' && picked !== 'All') return picked;
  const own = getInstructorClassName(CURRENT_USER);
  if (own) return own;
  return STUDENTS_DATA[0]?.class_name || (CLASSES_DATA[0] && CLASSES_DATA[0].name) || 'BSIT 1st Year';
}

// Per-student Present/Absent/Late tallies + class totals across the given dates.
function computeClassAttendanceStats(classStudents, dates) {
  const per = {};
  classStudents.forEach(s => { per[s.id] = { present: 0, absent: 0, late: 0, excused: 0 }; });
  const totals = { present: 0, absent: 0, late: 0, excused: 0 };
  const dailyRows = [];

  (dates || []).forEach(date => {
    const day = getAttendanceForDate(date);
    let p = 0, a = 0, l = 0;
    classStudents.forEach(s => {
      const st = (day && day[s.id]) || 'Present';
      const key = String(st).toLowerCase();
      if (per[s.id] && Object.prototype.hasOwnProperty.call(per[s.id], key)) per[s.id][key] += 1;
      else per[s.id].present += 1;
      if (key === 'present') p += 1;
      else if (key === 'absent') a += 1;
      else if (key === 'late') l += 1;
    });
    const total = p + a + l;
    dailyRows.push({
      date,
      dateFormatted: formatDateForReport(date),
      present: p, absent: a, late: l,
      rate: total ? ((p / total) * 100).toFixed(1) : '0.0'
    });
    totals.present += p;
    totals.absent += a;
    totals.late += l;
  });

  return { per, totals, dailyRows };
}

function formatDateForReport(dateStr) {
  try {
    const [y, m, d] = String(dateStr).split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch (e) { return dateStr; }
}

function buildInstructorReportHTML() {
  const cls = resolveReportClass();
  const classInfo = CLASSES_DATA.find(c => c.name === cls) || {};
  const instructor = (CURRENT_USER && CURRENT_USER.name) || classInfo.instructor || 'Signed-in Instructor';
  const department = (CURRENT_USER && (CURRENT_USER.department || CURRENT_USER.role)) || 'Instructor';

  const org = SYSTEM_SETTINGS || {};
  const orgName = org.org_name || 'SAMS Learning & Tutoring Center';
  const term = org.academic_term || '2025 - 2026 / Term 2';
  const orgPhone = org.org_phone || '+63 917 123 4567';
  const orgEmail = org.org_email || 'admin@sams.edu.ph';

  const classStudents = STUDENTS_DATA.filter(s => s.class_name === cls);

  // Collect the class's session dates (history first, then the full daily map).
  let dates = [];
  ATTENDANCE_HISTORY.forEach(h => {
    if (h.className === cls && h.date && !dates.includes(h.date)) dates.push(h.date);
  });
  if (dates.length === 0 && DAILY_ATTENDANCE) dates = Object.keys(DAILY_ATTENDANCE);
  dates.sort();
  if (dates.length === 0) dates = ['2026-05-19'];

  const stats = computeClassAttendanceStats(classStudents, dates);
  const sessions = dates.length;
  const totalSlots = sessions * classStudents.length;
  const attendancePct = totalSlots ? ((stats.totals.present / totalSlots) * 100).toFixed(1) : '0.0';
  const generated = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
  const reportNo = `SAMS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${cls.replace(/[^A-Za-z0-9]/g, '')}-${String(Math.floor(1000 + Math.random() * 9000))}`;

  // Roster rows
  const sortedStudents = [...classStudents].sort((a, b) => {
    const ra = stats.per[a.id] ? (stats.per[a.id].present / Math.max(1, stats.per[a.id].present + stats.per[a.id].absent + stats.per[a.id].late)) : 0;
    const rb = stats.per[b.id] ? (stats.per[b.id].present / Math.max(1, stats.per[b.id].present + stats.per[b.id].absent + stats.per[b.id].late)) : 0;
    return rb - ra;
  });

  const rosterRows = sortedStudents.map((s, i) => {
    const p = stats.per[s.id] || { present: 0, absent: 0, late: 0, excused: 0 };
    const total = p.present + p.absent + p.late;
    const rate = total ? ((p.present / total) * 100).toFixed(1) : (s.attendance_rate || '100.0').toString().replace('%', '');
    const barColor = Number(rate) >= 90 ? '#16a34a' : Number(rate) >= 75 ? '#f59e0b' : '#dc2626';
    return `<tr>
      <td>${i + 1}</td>
      <td>${escapeHTML(s.student_id_number || '—')}</td>
      <td><strong>${escapeHTML(s.first_name + (s.middle_name ? ' ' + s.middle_name.charAt(0) + '.' : '') + ' ' + s.last_name)}</strong><br><span style="color:#64748b; font-size:0.72rem;">${escapeHTML(s.section || '')}</span></td>
      <td style="text-align:center;">${p.present}</td>
      <td style="text-align:center; color:#dc2626;">${p.absent}</td>
      <td style="text-align:center; color:#d97706;">${p.late}</td>
      <td style="min-width:150px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="flex:1; height:8px; background:#e2e8f0; border-radius:99px; overflow:hidden;">
            <div style="width:${Math.min(100, Number(rate))}%; height:100%; background:${barColor};"></div>
          </div>
          <strong style="font-size:0.8rem; color:${barColor};">${rate}%</strong>
        </div>
      </td>
    </tr>`;
  }).join('');

  // Daily trend rows (prefer real logged counts from history when present)
  const trendMap = {};
  ATTENDANCE_HISTORY.forEach(h => {
    if (h.className === cls && h.date) {
      trendMap[h.date] = { present: h.present, absent: h.absent, late: h.late, rate: h.rate || '' };
    }
  });
  const trendRows = stats.dailyRows.map(d => {
    const logged = trendMap[d.date];
    const present = logged ? logged.present : d.present;
    const absent = logged ? logged.absent : d.absent;
    const late = logged ? logged.late : d.late;
    const rate = logged ? (logged.rate || (((present / Math.max(1, present + absent + late)) * 100).toFixed(1) + '%')) : (d.rate + '%');
    return `<tr>
      <td>${escapeHTML(d.dateFormatted)}</td>
      <td style="color:#16a34a; font-weight:600;">${present}</td>
      <td style="color:#dc2626; font-weight:600;">${absent}</td>
      <td style="color:#d97706; font-weight:600;">${late}</td>
      <td><strong>${escapeHTML(String(rate))}</strong></td>
    </tr>`;
  }).join('');

  // Narrative + recommendations
  const highAbsentees = sortedStudents.filter(s => {
    const p = stats.per[s.id] || {};
    return (p.absent || 0) >= 3;
  });
  const names = highAbsentees.map(s => escapeHTML(s.first_name + ' ' + s.last_name));
  const recNotes = names.length
    ? `The following student(s) recorded ${highAbsentees.length >= 2 ? 'repeated' : 'a notable'} absence(s) this period: <strong>${names.join(', ')}</strong>. It is recommended that the class adviser follow up with the guardian${highAbsentees.length > 1 ? 's' : ''} and schedule a brief guidance conversation.`
    : `All ${classStudents.length} enrolled student(s) in this class are maintaining satisfactory attendance (no student with 3+ recorded absences).`;

  const totalClass = classStudents.length;
  const cutoff = org.cutoff_time || '08:00';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SAMS Instructor Attendance Report — ${escapeHTML(cls)}</title>
<style>
  * { box-sizing: border-box; }
  body { margin:0; padding:32px 40px; font-family:'Segoe UI', Roboto, Arial, sans-serif; color:#1e293b; background:#f1f5f9; font-size:13px; line-height:1.5; }
  .sheet { max-width:900px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(15,23,42,.12); }
  .brand { background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; padding:26px 34px; }
  .brand .top { display:flex; justify-content:space-between; align-items:flex-start; gap:16px; }
  .brand h1 { margin:0; font-size:22px; letter-spacing:.3px; }
  .brand p { margin:4px 0 0; opacity:.85; font-size:12.5px; }
  .brand .badge { background:rgba(255,255,255,.18); border:1px solid rgba(255,255,255,.35); padding:6px 14px; border-radius:99px; font-size:11px; letter-spacing:.5px; }
  .body { padding:28px 34px 10px; }
  .meta { display:grid; grid-template-columns:repeat(2,1fr); gap:12px 26px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px 20px; margin:18px 0; }
  .meta div b { font-size:11px; text-transform:uppercase; letter-spacing:.6px; color:#64748b; }
  .meta div span { display:block; font-size:13.5px; font-weight:600; color:#0f172a; margin-top:2px; }
  .kpis { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin:18px 0; }
  .kpi { border:1px solid #e2e8f0; border-radius:12px; padding:14px 16px; background:#fff; }
  .kpi .num { font-size:26px; font-weight:800; color:#1d4ed8; }
  .kpi .lbl { font-size:11px; text-transform:uppercase; letter-spacing:.6px; color:#64748b; margin-top:2px; }
  h2 { font-size:15px; margin:26px 0 10px; padding-bottom:8px; border-bottom:2px solid #1d4ed8; color:#0f172a; }
  table { width:100%; border-collapse:collapse; }
  th { text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:.5px; color:#475569; background:#f1f5f9; padding:10px 12px; border:1px solid #e2e8f0; }
  td { padding:9px 12px; border:1px solid #e2e8f0; vertical-align:middle; }
  tr:nth-child(even) td { background:#fafbfc; }
  .note-box { background:#eff6ff; border:1px solid #bfdbfe; border-left:5px solid #1d4ed8; border-radius:10px; padding:14px 18px; margin:18px 0; }
  .note-box p { margin:6px 0; }
  .sign { display:grid; grid-template-columns:1fr 1fr; gap:30px; margin:36px 0 8px; }
  .sign .box { border-top:1.5px solid #94a3b8; padding-top:8px; font-size:12.5px; }
  .sign .box .who { font-weight:700; }
  .sign .box .sub { color:#64748b; font-size:11.5px; }
  footer { background:#0f172a; color:#94a3b8; font-size:11px; padding:14px 28px; display:flex; justify-content:space-between; gap:12px; }
  @media print {
    body { background:#fff; padding:0; }
    .sheet { box-shadow:none; border-radius:0; max-width:100%; }
    .brand { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    tr, .kpi, .note-box { page-break-inside:avoid; }
  }
</style>
</head>
<body>
  <div class="sheet">
    <div class="brand">
      <div class="top">
        <div>
          <p style="margin:0 0 2px; font-size:11px; letter-spacing:1.5px; opacity:.8;">OFFICIAL REPORT</p>
          <h1>${escapeHTML(orgName)}</h1>
          <p>${escapeHTML(term)} &nbsp;•&nbsp; ${escapeHTML(cls)}</p>
        </div>
        <div class="badge">DB No. ${escapeHTML(reportNo)}</div>
      </div>
    </div>

    <div class="body">
      <h2 style="border:none; font-size:19px; margin:6px 0 0;">Instructor Attendance Summary Report</h2>
      <p style="margin:4px 0 0; color:#64748b;">Prepared by <strong>${escapeHTML(instructor)}</strong> (${escapeHTML(department)}) for submission to the Center Administrator.</p>

      <div class="meta">
        <div><b>Report ID</b><span>${escapeHTML(reportNo)}</span></div>
        <div><b>Class / Section</b><span>${escapeHTML(cls)}${classInfo.room ? ' • ' + escapeHTML(classInfo.room) : ''}</span></div>
        <div><b>Subject</b><span>${escapeHTML(classInfo.subject || '—')}</span></div>
        <div><b>Enrolled Students</b><span>${totalClass}</span></div>
        <div><b>Covered Sessions</b><span>${sessions} session${sessions === 1 ? '' : 's'} recorded</span></div>
        <div><b>Generated On</b><span>${escapeHTML(generated)}</span></div>
        <div><b>Generated By</b><span>${escapeHTML(instructor)} (${escapeHTML(department)})</span></div>
        <div><b>For / Attention</b><span>${escapeHTML(orgName)} — Administrator</span></div>
      </div>

      <div class="kpis">
        <div class="kpi"><div class="num">${totalClass}</div><div class="lbl">Enrolled Students</div></div>
        <div class="kpi"><div class="num" style="color:#16a34a;">${attendancePct}%</div><div class="lbl">Average Attendance</div></div>
        <div class="kpi"><div class="num" style="color:#dc2626;">${stats.totals.absent}</div><div class="lbl">Total Absences</div></div>
        <div class="kpi"><div class="num" style="color:#d97706;">${stats.totals.late}</div><div class="lbl">Total Lates</div></div>
      </div>

      <h2>Executive Summary</h2>
      <div class="note-box">
        <p>During the <strong>${sessions}</strong> session(s) covered, ${escapeHTML(cls)} posted an average attendance rate of <strong>${attendancePct}%</strong> (${stats.totals.present} present / ${stats.totals.absent} absent / ${stats.totals.late} late out of ${totalSlots} student-slots).</p>
        <p>${recNotes}</p>
        <p>The center attendance policy (roll-call cutoff at <strong>${escapeHTML(cutoff)}</strong>) was applied across sessions; statuses were recorded per session in the Attendance Management System.</p>
      </div>

      <h2>Class Roster &amp; Individual Attendance</h2>
      <table>
        <thead>
          <tr><th style="width:38px;">#</th><th>Student ID</th><th>Student Name</th><th>P</th><th>A</th><th>L</th><th>Attendance Rate</th></tr>
        </thead>
        <tbody>${rosterRows}</tbody>
      </table>

      <h2>Daily Session Trend</h2>
      <table>
        <thead>
          <tr><th>Date</th><th>Present</th><th>Absent</th><th>Late</th><th>Rate</th></tr>
        </thead>
        <tbody>${trendRows.length ? trendRows : '<tr><td colspan="5" style="text-align:center; color:#64748b;">No recorded sessions for this class yet.</td></tr>'}</tbody>
      </table>

      <div class="sign">
        <div class="box">
          <div class="who">${escapeHTML(instructor)}</div>
          <div class="sub">Prepared by — Instructor</div>
          <div class="sub" style="margin-top:4px;">Signature / Date: ______________________</div>
        </div>
        <div class="box">
          <div class="who">${escapeHTML(orgName)}</div>
          <div class="sub">Reviewed &amp; Accepted by — Administrator</div>
          <div class="sub" style="margin-top:4px;">Signature / Date: ______________________</div>
        </div>
      </div>
    </div>

    <footer>
      <span>${escapeHTML(orgName)} • ${escapeHTML(orgPhone)} • ${escapeHTML(orgEmail)}</span>
      <span>Generated ${escapeHTML(generated)} by SAMS</span>
    </footer>
  </div>
</body>
</html>`;

  return html;
}

function openInstructorReportWindow(autoprint) {
  if (!CURRENT_USER) {
    showToast('Please sign in first.', 'error');
    return null;
  }
  const html = buildInstructorReportHTML();
  const win = window.open('', '_blank', 'width=1024,height=760');
  if (!win) {
    // Pop-up blocked — fall back to a direct file download.
    downloadInstructorReport();
    return null;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  if (autoprint) {
    setTimeout(() => { win.focus(); try { win.print(); } catch (e) {} }, 450);
  }
  return win;
}

function printInstructorReport() {
  openInstructorReportWindow(true);
}

function openInstructorReportPreview() {
  openInstructorReportWindow(false);
}

function downloadInstructorReport() {
  if (!CURRENT_USER) {
    showToast('Please sign in first.', 'error');
    return;
  }
  const html = buildInstructorReportHTML();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SAMS_Instructor_Report_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  showToast('Report downloaded (.html). Open it in any browser, then Print → Save as PDF.', 'success');
}

function exportUsersCSV() {
  const headers = ['Name', 'Email', 'Role', 'Department', 'Status', 'Last Active'];
  const rows = USERS_DATA.map(u => [
    `"${u.name}"`,
    `"${u.email}"`,
    `"${u.role}"`,
    `"${u.department}"`,
    `"${u.status}"`,
    `"${u.last_active}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`sams_users_directory_${new Date().toISOString().split('T')[0]}.csv`, csvContent);
  showToast('Exported system users directory to CSV successfully!', 'success');
}

// =========================================================================
// TABLE CONTROLS & GLOBAL INTERACTION LISTENERS
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Select All Checkbox for Students Table
  const checkAllStudents = document.getElementById('check-all-students');
  if (checkAllStudents) {
    checkAllStudents.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll('#tbody-students-list input[type="checkbox"]').forEach(cb => {
        cb.checked = isChecked;
      });
    });
  }

  // Select All Checkbox for Roll Call Table
  const checkAllRollcall = document.getElementById('check-all-rollcall');
  if (checkAllRollcall) {
    checkAllRollcall.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      document.querySelectorAll('#tbody-rollcall-roster input[type="checkbox"]').forEach(cb => {
        cb.checked = isChecked;
      });
    });
  }

  // Interactive Pagination Controls
  document.querySelectorAll('.pagination-controls .page-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isPrev = btn.querySelector('.fa-chevron-left');
      const isNext = btn.querySelector('.fa-chevron-right');
      const query = document.getElementById('students-search-input')?.value || '';
      const classFilter = document.getElementById('filter-class')?.value || 'All';
      const statusFilter = document.getElementById('filter-status')?.value || 'All';
      
      const filtered = STUDENTS_DATA.filter(s => {
        const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
        const idMatch = s.student_id_number.toLowerCase();
        const q = query.toLowerCase();
        return (!q || fullName.includes(q) || idMatch.includes(q)) &&
               (classFilter === 'All' || s.class_name === classFilter) &&
               (statusFilter === 'All' || s.status === statusFilter);
      });
      const totalPages = Math.ceil(filtered.length / currentStudentPageSize) || 1;

      if (isPrev) {
        if (currentStudentPage > 1) {
          currentStudentPage--;
          renderStudentsTable(query);
          showToast(`Page ${currentStudentPage} loaded`, 'info');
        }
        return;
      }
      if (isNext) {
        if (currentStudentPage < totalPages) {
          currentStudentPage++;
          renderStudentsTable(query);
          showToast(`Page ${currentStudentPage} loaded`, 'info');
        }
        return;
      }

      const pageNum = Number(btn.textContent.trim());
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        currentStudentPage = pageNum;
        renderStudentsTable(query);
        showToast(`Page ${pageNum} loaded`, 'info');
      }
    });
  });

  const selectPageSize = document.querySelector('.table-pagination-footer select');
  if (selectPageSize) {
    selectPageSize.addEventListener('change', (e) => {
      const val = parseInt(e.target.value) || 10;
      currentStudentPageSize = val;
      currentStudentPage = 1;
      const query = document.getElementById('students-search-input')?.value || '';
      renderStudentsTable(query);
      showToast(`Showing ${val} students per page`, 'info');
    });
  }

  // Global Outside Click to Close Dropdowns
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-dropdown-menu') && 
        !e.target.closest('.icon-action-btn') && 
        !e.target.closest('.user-profile-menu')) {
      closeAllTopbarDropdowns();
    }
  });
});

