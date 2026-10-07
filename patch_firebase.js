const fs = require('fs');

let appJs = fs.readFileSync('public/app.js', 'utf8');

// 1. Add Firebase Initialization at the top of app.js
const firebaseInit = `
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

`;

appJs = firebaseInit + appJs;

// 2. Change DOMContentLoaded to async
appJs = appJs.replace(`document.addEventListener('DOMContentLoaded', () => {`, `document.addEventListener('DOMContentLoaded', async () => {`);

// 3. Update loadStoredUsers
appJs = appJs.replace(
  /function loadStoredUsers\(\) \{[\s\S]*?\}\s*catch \(e\) \{\}\n\}/m,
  `async function loadStoredUsers() {
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
    console.error("Firebase error loadStoredUsers:", e);
  }
}`
);

// 4. Update persistUsersData
appJs = appJs.replace(
  /function persistUsersData\(\) \{[\s\S]*?\n\}/m,
  `function persistUsersData() {
  try {
    localStorage.setItem('sams_users_data', JSON.stringify(USERS_DATA));
    db.collection('sams_db').doc('users').set({ data: USERS_DATA });
  } catch (e) {}
}`
);

// 5. Update loadStoredStudents
appJs = appJs.replace(
  /function loadStoredStudents\(\) \{[\s\S]*?\n\}/m,
  `async function loadStoredStudents() {
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
  } catch (e) { console.error(e); }
}`
);

// 6. Update persistStudentsData
appJs = appJs.replace(
  /function persistStudentsData\(\) \{[\s\S]*?\n\}/m,
  `function persistStudentsData() {
  try {
    localStorage.setItem('sams_students_data', JSON.stringify(STUDENTS_DATA));
    db.collection('sams_db').doc('students').set({ data: STUDENTS_DATA });
  } catch (e) {}
}`
);

// 7. Update loadStoredClasses
appJs = appJs.replace(
  /function loadStoredClasses\(\) \{[\s\S]*?\n\}/m,
  `async function loadStoredClasses() {
  try {
    const doc = await db.collection('sams_db').doc('classes').get();
    if (doc.exists) {
      CLASSES_DATA = doc.data().data;
    } else {
      const stored = localStorage.getItem('sams_classes_data');
      if (stored) { CLASSES_DATA = JSON.parse(stored); persistClassesData(); }
    }
  } catch (e) {}
}`
);

// 8. Update persistClassesData
appJs = appJs.replace(
  /function persistClassesData\(\) \{[\s\S]*?\n\}/m,
  `function persistClassesData() {
  try {
    localStorage.setItem('sams_classes_data', JSON.stringify(CLASSES_DATA));
    db.collection('sams_db').doc('classes').set({ data: CLASSES_DATA });
  } catch (e) {}
}`
);

// 9. Update loadStoredCalendarEvents
appJs = appJs.replace(
  /function loadStoredCalendarEvents\(\) \{[\s\S]*?\n\}/m,
  `async function loadStoredCalendarEvents() {
  try {
    const doc = await db.collection('sams_db').doc('calendar').get();
    if (doc.exists) {
      CALENDAR_EVENTS = doc.data().data;
    } else {
      const stored = localStorage.getItem('sams_calendar_events');
      if (stored) { CALENDAR_EVENTS = JSON.parse(stored); persistCalendarEvents(); }
    }
  } catch (e) {}
}`
);

// 10. Update persistCalendarEvents
appJs = appJs.replace(
  /function persistCalendarEvents\(\) \{[\s\S]*?\n\}/m,
  `function persistCalendarEvents() {
  try {
    localStorage.setItem('sams_calendar_events', JSON.stringify(CALENDAR_EVENTS));
    db.collection('sams_db').doc('calendar').set({ data: CALENDAR_EVENTS });
  } catch (e) {}
}`
);

// 11. Update loadStoredAttendance
appJs = appJs.replace(
  /function loadStoredAttendance\(\) \{[\s\S]*?\}\s*catch \(e\) \{\}\n\}/m,
  `async function loadStoredAttendance() {
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
  } catch (e) {}
}`
);

// 12. Update persistAttendanceData
appJs = appJs.replace(
  /function persistAttendanceData\(\) \{[\s\S]*?\n\}/m,
  `function persistAttendanceData() {
  try {
    localStorage.setItem('sams_attendance_history', JSON.stringify(ATTENDANCE_HISTORY));
    localStorage.setItem('sams_attendance_map', JSON.stringify(ATTENDANCE_MAP));
    localStorage.setItem('sams_daily_attendance', JSON.stringify(DAILY_ATTENDANCE));
    db.collection('sams_db').doc('attendance').set({
      history: ATTENDANCE_HISTORY,
      map: ATTENDANCE_MAP,
      daily: DAILY_ATTENDANCE
    });
  } catch (e) {}
}`
);

// 13. Update loadSystemSettings
appJs = appJs.replace(
  /function loadSystemSettings\(\) \{[\s\S]*?\n\}/m,
  `async function loadSystemSettings() {
  try {
    const doc = await db.collection('sams_db').doc('settings').get();
    if (doc.exists) {
      SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, doc.data().data);
    } else {
      const saved = localStorage.getItem('sams_system_settings');
      if (saved) { SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, JSON.parse(saved)); }
    }
  } catch (err) {}
}`
);

// 14. Update persistSystemSettings
// Note: Settings persistence is spread out, so let's rewrite the places where it's saved.
appJs = appJs.replace(
  /localStorage\.setItem\('sams_system_settings', JSON\.stringify\(SYSTEM_SETTINGS\)\);/g,
  `localStorage.setItem('sams_system_settings', JSON.stringify(SYSTEM_SETTINGS)); db.collection('sams_db').doc('settings').set({ data: SYSTEM_SETTINGS });`
);


// 15. Wait for async loads in DOMContentLoaded
appJs = appJs.replace(
  /  loadStoredUsers\(\);\n  loadStoredStudents\(\);\n  loadStoredClasses\(\);\n  loadStoredCalendarEvents\(\);\n  loadStoredAttendance\(\);/g,
  `  await loadStoredUsers();\n  await loadStoredStudents();\n  await loadStoredClasses();\n  await loadStoredCalendarEvents();\n  await loadStoredAttendance();`
);

appJs = appJs.replace(
  /  loadSystemSettings\(\);/g,
  `  await loadSystemSettings();`
);


fs.writeFileSync('public/app.js', appJs);
console.log('Firebase integration patched successfully!');
