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
// In-Memory Database matching screenshot records exactly (10-10-10 per cohort = 30 students)
let STUDENTS_DATA = [
  // =========================================================================
  // COHORT 1: Grade 11 - STEM (10 Students)
  // =========================================================================
  {
    id: 1,
    student_id_number: 'S2026-001',
    first_name: 'Juan Miguel',
    middle_name: 'Dela',
    last_name: 'Santos',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-A',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 92,
    dob: 'April 15, 2008',
    gender: 'Male',
    email: 'juan.santos@example.com',
    contact: '0917 123 4567',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Mario Santos',
    guardian_contact: '0917 765 4321',
    relationship: 'Father',
    notes: 'No known medical conditions. Active in Math olympiad.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200'
  },
  {
    id: 2,
    student_id_number: 'S2026-002',
    first_name: 'Nicole Anne',
    middle_name: 'Marie',
    last_name: 'Garcia',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-A',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 95,
    dob: 'January 14, 2008',
    gender: 'Female',
    email: 'nicole.garcia@example.com',
    contact: '0920 456 7890',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Carmen Garcia',
    guardian_contact: '0920 765 4321',
    relationship: 'Mother',
    notes: 'Class representative.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
  },
  {
    id: 3,
    student_id_number: 'S2026-003',
    first_name: 'Christian Mark',
    middle_name: 'Paul',
    last_name: 'Dela Peña',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-A',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 88,
    dob: 'March 05, 2008',
    gender: 'Male',
    email: 'christian.pena@example.com',
    contact: '0921 567 8901',
    address: 'Barangay 2, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Mark Dela Peña',
    guardian_contact: '0921 654 3210',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
  },
  {
    id: 4,
    student_id_number: 'S2026-004',
    first_name: 'Samantha Rose',
    middle_name: 'Cruz',
    last_name: 'Alcantara',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-A',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 94,
    dob: 'May 22, 2008',
    gender: 'Female',
    email: 'samantha.alcantara@example.com',
    contact: '0925 123 7890',
    address: 'Barangay 3, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Teresa Alcantara',
    guardian_contact: '0925 987 6543',
    relationship: 'Mother',
    notes: 'Honor student.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 5,
    student_id_number: 'S2026-005',
    first_name: 'Ethan Gabriel',
    middle_name: 'Luis',
    last_name: 'Mercado',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-A',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 90,
    dob: 'July 11, 2008',
    gender: 'Male',
    email: 'ethan.mercado@example.com',
    contact: '0926 234 8901',
    address: 'San Andres, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Ramon Mercado',
    guardian_contact: '0926 876 5432',
    relationship: 'Father',
    notes: 'School robotics club officer.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  },
  {
    id: 6,
    student_id_number: 'S2026-006',
    first_name: 'Hannah Mae',
    middle_name: 'Joy',
    last_name: 'Bautista',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-B',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 96,
    dob: 'September 08, 2008',
    gender: 'Female',
    email: 'hannah.bautista@example.com',
    contact: '0927 345 9012',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Maria Bautista',
    guardian_contact: '0927 765 4321',
    relationship: 'Mother',
    notes: 'Consistent perfect attendance contender.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200'
  },
  {
    id: 7,
    student_id_number: 'S2026-007',
    first_name: 'Joshua David',
    middle_name: 'Lee',
    last_name: 'Tan',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-B',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 86,
    dob: 'October 19, 2008',
    gender: 'Male',
    email: 'joshua.tan@example.com',
    contact: '0928 456 0123',
    address: 'Barangay 5, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'David Tan',
    guardian_contact: '0928 654 3210',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200'
  },
  {
    id: 8,
    student_id_number: 'S2026-008',
    first_name: 'Patricia Claire',
    middle_name: 'Anne',
    last_name: 'Ramos',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-B',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 91,
    dob: 'December 03, 2008',
    gender: 'Female',
    email: 'patricia.ramos@example.com',
    contact: '0929 567 1234',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Claire Ramos',
    guardian_contact: '0929 543 2109',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200'
  },
  {
    id: 9,
    student_id_number: 'S2026-009',
    first_name: 'Miguel Antonio',
    middle_name: 'Jose',
    last_name: 'Mendoza',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-B',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 93,
    dob: 'February 27, 2008',
    gender: 'Male',
    email: 'miguel.mendoza@example.com',
    contact: '0930 678 2345',
    address: 'Barangay 1, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Antonio Mendoza',
    guardian_contact: '0930 432 1098',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200'
  },
  {
    id: 10,
    student_id_number: 'S2026-010',
    first_name: 'Chloe Sofia',
    middle_name: 'Grace',
    last_name: 'Pascual',
    class_name: 'Grade 11 - STEM',
    section: 'STEM-B',
    strand: 'STEM',
    status: 'Active',
    attendance_rate: 89,
    dob: 'November 15, 2008',
    gender: 'Female',
    email: 'chloe.pascual@example.com',
    contact: '0931 789 3456',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Sofia Pascual',
    guardian_contact: '0931 321 0987',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200'
  },

  // =========================================================================
  // COHORT 2: Grade 10 - ABM (10 Students)
  // =========================================================================
  {
    id: 11,
    student_id_number: 'S2026-011',
    first_name: 'Maria Angelica',
    middle_name: 'Santos',
    last_name: 'Reyes',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-A',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 89,
    dob: 'June 10, 2009',
    gender: 'Female',
    email: 'maria.reyes@example.com',
    contact: '0918 234 5678',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Elena Reyes',
    guardian_contact: '0918 987 6543',
    relationship: 'Mother',
    notes: 'Active in Entrepreneurship fair.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200'
  },
  {
    id: 12,
    student_id_number: 'S2026-012',
    first_name: 'Beatriz Chloe',
    middle_name: 'Uy',
    last_name: 'Lim',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-A',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 92,
    dob: 'December 04, 2009',
    gender: 'Female',
    email: 'beatriz.lim@example.com',
    contact: '0924 890 1234',
    address: 'Barangay 4, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Grace Lim',
    guardian_contact: '0924 321 0987',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200'
  },
  {
    id: 13,
    student_id_number: 'S2026-013',
    first_name: 'Kyle Justin',
    middle_name: 'B.',
    last_name: 'Navarro',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-A',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 85,
    dob: 'August 14, 2009',
    gender: 'Male',
    email: 'kyle.navarro@example.com',
    contact: '0932 890 4567',
    address: 'San Andres, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Justin Navarro',
    guardian_contact: '0932 210 9876',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200'
  },
  {
    id: 14,
    student_id_number: 'S2026-014',
    first_name: 'Andrea Camille',
    middle_name: 'Diaz',
    last_name: 'Flores',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-A',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 94,
    dob: 'October 25, 2009',
    gender: 'Female',
    email: 'andrea.flores@example.com',
    contact: '0933 901 5678',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Camille Flores',
    guardian_contact: '0933 109 8765',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200'
  },
  {
    id: 15,
    student_id_number: 'S2026-015',
    first_name: 'Vincent Paul',
    middle_name: 'Torres',
    last_name: 'Salazar',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-A',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 88,
    dob: 'April 02, 2009',
    gender: 'Male',
    email: 'vincent.salazar@example.com',
    contact: '0934 012 6789',
    address: 'Barangay 2, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Paul Salazar',
    guardian_contact: '0934 098 7654',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200'
  },
  {
    id: 16,
    student_id_number: 'S2026-016',
    first_name: 'Stephanie Joyce',
    middle_name: 'G.',
    last_name: 'Torres',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-B',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 90,
    dob: 'February 18, 2009',
    gender: 'Female',
    email: 'stephanie.torres@example.com',
    contact: '0935 123 7890',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Joyce Torres',
    guardian_contact: '0935 987 6543',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=200'
  },
  {
    id: 17,
    student_id_number: 'S2026-017',
    first_name: 'Adrian James',
    middle_name: 'Castro',
    last_name: 'Del Rosario',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-B',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 82,
    dob: 'July 29, 2009',
    gender: 'Male',
    email: 'adrian.delrosario@example.com',
    contact: '0936 234 8901',
    address: 'Barangay 3, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'James Del Rosario',
    guardian_contact: '0936 876 5432',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=200'
  },
  {
    id: 18,
    student_id_number: 'S2026-018',
    first_name: 'Bianca Marie',
    middle_name: 'R.',
    last_name: 'Ocampo',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-B',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 95,
    dob: 'March 12, 2009',
    gender: 'Female',
    email: 'bianca.ocampo@example.com',
    contact: '0937 345 9012',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Marie Ocampo',
    guardian_contact: '0937 765 4321',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=200'
  },
  {
    id: 19,
    student_id_number: 'S2026-019',
    first_name: 'Kevin Matthew',
    middle_name: 'S.',
    last_name: 'Aquino',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-B',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 87,
    dob: 'May 09, 2009',
    gender: 'Male',
    email: 'kevin.aquino@example.com',
    contact: '0938 456 0123',
    address: 'Barangay 5, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Matthew Aquino',
    guardian_contact: '0938 654 3210',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=200'
  },
  {
    id: 20,
    student_id_number: 'S2026-020',
    first_name: 'Alyssa Nicole',
    middle_name: 'P.',
    last_name: 'Castro',
    class_name: 'Grade 10 - ABM',
    section: 'ABM-B',
    strand: 'ABM',
    status: 'Active',
    attendance_rate: 91,
    dob: 'November 20, 2009',
    gender: 'Female',
    email: 'alyssa.castro@example.com',
    contact: '0939 567 1234',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Nicole Castro',
    guardian_contact: '0939 543 2109',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=200'
  },

  // =========================================================================
  // COHORT 3: Grade 12 - HUMSS (10 Students)
  // =========================================================================
  {
    id: 21,
    student_id_number: 'S2026-021',
    first_name: 'Daniel Lorenzo',
    middle_name: 'M.',
    last_name: 'Cruz',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-A',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 85,
    dob: 'September 22, 2007',
    gender: 'Male',
    email: 'daniel.cruz@example.com',
    contact: '0919 345 6789',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Roberto Cruz',
    guardian_contact: '0919 876 5432',
    relationship: 'Father',
    notes: 'Journalism editor.',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=200'
  },
  {
    id: 22,
    student_id_number: 'S2026-022',
    first_name: 'Sophia Isabelle',
    middle_name: 'Grace',
    last_name: 'Valdez',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-A',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 93,
    dob: 'January 30, 2007',
    gender: 'Female',
    email: 'sophia.valdez@example.com',
    contact: '0940 678 2345',
    address: 'San Andres, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Isabelle Valdez',
    guardian_contact: '0940 432 1098',
    relationship: 'Mother',
    notes: 'Debate society captain.',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200'
  },
  {
    id: 23,
    student_id_number: 'S2026-023',
    first_name: 'Rafael Dominic',
    middle_name: 'Jose',
    last_name: 'Villanueva',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-A',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 84,
    dob: 'August 30, 2007',
    gender: 'Male',
    email: 'rafael.v@example.com',
    contact: '0923 789 0123',
    address: 'Barangay 1, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Jose Villanueva',
    guardian_contact: '0923 432 1098',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200'
  },
  {
    id: 24,
    student_id_number: 'S2026-024',
    first_name: 'Mikaela Denise',
    middle_name: 'L.',
    last_name: 'Soriano',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-A',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 96,
    dob: 'April 14, 2007',
    gender: 'Female',
    email: 'mikaela.soriano@example.com',
    contact: '0941 789 3456',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Denise Soriano',
    guardian_contact: '0941 321 0987',
    relationship: 'Mother',
    notes: 'Student council president.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 25,
    student_id_number: 'S2026-025',
    first_name: 'Justin Carlo',
    middle_name: 'D.',
    last_name: 'Morales',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-A',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 88,
    dob: 'June 05, 2007',
    gender: 'Male',
    email: 'justin.morales@example.com',
    contact: '0942 890 4567',
    address: 'Barangay 2, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Carlo Morales',
    guardian_contact: '0942 210 9876',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  },
  {
    id: 26,
    student_id_number: 'S2026-026',
    first_name: 'Katrina Mae',
    middle_name: 'B.',
    last_name: 'Espino',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-B',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 92,
    dob: 'November 11, 2007',
    gender: 'Female',
    email: 'katrina.espino@example.com',
    contact: '0943 901 5678',
    address: 'Barangay 4, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Mae Espino',
    guardian_contact: '0943 109 8765',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200'
  },
  {
    id: 27,
    student_id_number: 'S2026-027',
    first_name: 'Dominic Rafael',
    middle_name: 'V.',
    last_name: 'Cortez',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-B',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 86,
    dob: 'February 03, 2007',
    gender: 'Male',
    email: 'dominic.cortez@example.com',
    contact: '0944 012 6789',
    address: 'San Andres, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Rafael Cortez',
    guardian_contact: '0944 098 7654',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
  },
  {
    id: 28,
    student_id_number: 'S2026-028',
    first_name: 'Celine Joanne',
    middle_name: 'T.',
    last_name: 'David',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-B',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 95,
    dob: 'July 19, 2007',
    gender: 'Female',
    email: 'celine.david@example.com',
    contact: '0945 123 7890',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Joanne David',
    guardian_contact: '0945 987 6543',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200'
  },
  {
    id: 29,
    student_id_number: 'S2026-029',
    first_name: 'Gabriel Luis',
    middle_name: 'M.',
    last_name: 'Romero',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-B',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 89,
    dob: 'March 29, 2007',
    gender: 'Male',
    email: 'gabriel.romero@example.com',
    contact: '0946 234 8901',
    address: 'Barangay 3, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Luis Romero',
    guardian_contact: '0946 876 5432',
    relationship: 'Father',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200'
  },
  {
    id: 30,
    student_id_number: 'S2026-030',
    first_name: 'Trisha Louise',
    middle_name: 'C.',
    last_name: 'Velasco',
    class_name: 'Grade 12 - HUMSS',
    section: 'HUMSS-B',
    strand: 'HUMSS',
    status: 'Active',
    attendance_rate: 90,
    dob: 'December 21, 2007',
    gender: 'Female',
    email: 'trisha.velasco@example.com',
    contact: '0947 345 9012',
    address: 'Poblacion, Kadingilan, Bukidnon, Philippines',
    guardian_name: 'Louise Velasco',
    guardian_contact: '0947 765 4321',
    relationship: 'Mother',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200'
  }
];

// Master Daily Attendance Database (Per-Date records keyed by YYYY-MM-DD)
let DAILY_ATTENDANCE = {
  '2026-05-20': {
    1: 'Present', 2: 'Present', 3: 'Present', 4: 'Present', 5: 'Late',
    6: 'Present', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Present',
    11: 'Present', 12: 'Present', 13: 'Absent', 14: 'Present', 15: 'Present',
    16: 'Present', 17: 'Late', 18: 'Present', 19: 'Present', 20: 'Present',
    21: 'Present', 22: 'Present', 23: 'Absent', 24: 'Present', 25: 'Present',
    26: 'Present', 27: 'Present', 28: 'Present', 29: 'Present', 30: 'Present'
  },
  '2026-05-19': {
    1: 'Present', 2: 'Absent', 3: 'Present', 4: 'Present', 5: 'Present',
    6: 'Present', 7: 'Present', 8: 'Late', 9: 'Present', 10: 'Present',
    11: 'Present', 12: 'Present', 13: 'Present', 14: 'Absent', 15: 'Present',
    16: 'Present', 17: 'Present', 18: 'Present', 19: 'Late', 20: 'Present',
    21: 'Present', 22: 'Present', 23: 'Present', 24: 'Present', 25: 'Late',
    26: 'Absent', 27: 'Present', 28: 'Present', 29: 'Present', 30: 'Present'
  },
  '2026-05-18': {
    1: 'Absent', 2: 'Present', 3: 'Present', 4: 'Late', 5: 'Present',
    6: 'Present', 7: 'Absent', 8: 'Present', 9: 'Present', 10: 'Present',
    11: 'Late', 12: 'Present', 13: 'Present', 14: 'Present', 15: 'Present',
    16: 'Present', 17: 'Present', 18: 'Present', 19: 'Present', 20: 'Present',
    21: 'Absent', 22: 'Present', 23: 'Present', 24: 'Present', 25: 'Present',
    26: 'Present', 27: 'Late', 28: 'Present', 29: 'Present', 30: 'Present'
  },
  '2026-05-17': {
    1: 'Present', 2: 'Present', 3: 'Late', 4: 'Present', 5: 'Present',
    6: 'Present', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Absent',
    11: 'Present', 12: 'Present', 13: 'Present', 14: 'Present', 15: 'Present',
    16: 'Absent', 17: 'Present', 18: 'Present', 19: 'Present', 20: 'Present',
    21: 'Present', 22: 'Late', 23: 'Present', 24: 'Present', 25: 'Present',
    26: 'Present', 27: 'Present', 28: 'Absent', 29: 'Present', 30: 'Present'
  },
  '2026-05-16': {
    1: 'Present', 2: 'Present', 3: 'Present', 4: 'Present', 5: 'Present',
    6: 'Late', 7: 'Present', 8: 'Present', 9: 'Absent', 10: 'Present',
    11: 'Present', 12: 'Absent', 13: 'Present', 14: 'Present', 15: 'Present',
    16: 'Present', 17: 'Present', 18: 'Present', 19: 'Present', 20: 'Late',
    21: 'Present', 22: 'Present', 23: 'Present', 24: 'Absent', 25: 'Present',
    26: 'Present', 27: 'Present', 28: 'Present', 29: 'Late', 30: 'Present'
  },
  '2026-05-15': {
    1: 'Present', 2: 'Present', 3: 'Present', 4: 'Present', 5: 'Present',
    6: 'Present', 7: 'Present', 8: 'Present', 9: 'Present', 10: 'Present',
    11: 'Present', 12: 'Present', 13: 'Late', 14: 'Present', 15: 'Present',
    16: 'Present', 17: 'Present', 18: 'Absent', 19: 'Present', 20: 'Present',
    21: 'Present', 22: 'Present', 23: 'Present', 24: 'Present', 25: 'Present',
    26: 'Late', 27: 'Present', 28: 'Present', 29: 'Present', 30: 'Absent'
  }
};

let ATTENDANCE_MAP = DAILY_ATTENDANCE['2026-05-20'];

let studentToDeleteId = null;

// =========================================================================
// SYSTEM USERS & MULTI-ACCOUNT ACTIVE SESSION STATE
// =========================================================================
let USERS_DATA = [
  {
    id: 1,
    name: 'Neil Herbert U. Betacura',
    email: 'neil.betacura@sams.edu.ph',
    username: 'neil',
    aliases: ['admin', 'neil.betacura'],
    password: 'admin123',
    role: 'Administrator',
    department: 'Repository Lead & IT Architecture',
    status: 'Active',
    last_active: 'Today, 8:15 AM',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
  },
  {
    id: 2,
    name: 'Demelyn Concepcion',
    email: 'demelyn.concepcion@sams.edu.ph',
    username: 'demelyn',
    aliases: ['board', 'demelyn.concepcion'],
    password: 'board2026',
    role: 'Administrator',
    department: 'Board Lead & Academic Oversight',
    status: 'Active',
    last_active: 'Today, 9:20 AM',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200'
  },
  {
    id: 3,
    name: 'Jamaica Ganolon',
    email: 'jamaica.ganolon@sams.edu.ph',
    username: 'jamaica',
    aliases: ['scribe', 'staff', 'jamaica.ganolon'],
    password: 'scribe123',
    role: 'Staff',
    department: 'Scribe & Records Registry',
    status: 'Active',
    last_active: 'Today, 8:45 AM',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200'
  },
  {
    id: 4,
    name: 'Angelo Dairo',
    email: 'angelo.dairo@sams.edu.ph',
    username: 'dairo',
    aliases: ['angelo.dairo', 'stem'],
    password: 'stem2026',
    role: 'Instructor',
    department: 'Builder & Grade 11 - STEM (Math)',
    status: 'Active',
    last_active: 'Today, 7:55 AM',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200'
  },
  {
    id: 5,
    name: 'Angelo Madolaria',
    email: 'angelo.madolaria@sams.edu.ph',
    username: 'madolaria',
    aliases: ['angelo.madolaria', 'abm'],
    password: 'abm2026',
    role: 'Instructor',
    department: 'Builder & Grade 10 - ABM (ICT)',
    status: 'Active',
    last_active: 'Today, 8:05 AM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200'
  },
  {
    id: 6,
    name: 'Prof. Alan Turing',
    email: 'alan.turing@sams.edu.ph',
    username: 'turing',
    aliases: ['alan.turing'],
    password: 'turing123',
    role: 'Instructor',
    department: 'Senior Science & Logic Studies',
    status: 'Active',
    last_active: 'Yesterday, 4:20 PM',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200'
  },
  {
    id: 7,
    name: 'Dr. Ada Lovelace',
    email: 'ada.lovelace@sams.edu.ph',
    username: 'lovelace',
    aliases: ['ada.lovelace'],
    password: 'ada123',
    role: 'Instructor',
    department: 'Business Analytics & Economics',
    status: 'Active',
    last_active: 'Yesterday, 3:15 PM',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200'
  },
  {
    id: 8,
    name: 'Prof. Grace Hopper',
    email: 'grace.hopper@sams.edu.ph',
    username: 'hopper',
    aliases: ['grace', 'grace.hopper', 'humss'],
    password: 'humss2026',
    role: 'Instructor',
    department: 'Grade 12 - HUMSS (English)',
    status: 'Active',
    last_active: 'May 18, 2026',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200'
  }
];

let CURRENT_USER = USERS_DATA[0];

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

  // If user is an instructor, auto-select their section in the Roll Call view
  const classSelect = document.getElementById('rollcall-class-select');
  if (classSelect) {
    if (user.name.includes('Dairo')) {
      classSelect.value = 'Grade 11 - STEM';
    } else if (user.name.includes('Madolaria')) {
      classSelect.value = 'Grade 10 - ABM';
    } else if (user.name.includes('Hopper')) {
      classSelect.value = 'Grade 12 - HUMSS';
    }
  }
}

function loadStoredUsers() {
  try {
    const stored = localStorage.getItem('sams_users_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        parsed.forEach(storedUser => {
          const idx = USERS_DATA.findIndex(u => u.id === storedUser.id);
          if (idx !== -1) {
            USERS_DATA[idx] = Object.assign({}, USERS_DATA[idx], storedUser);
          } else {
            USERS_DATA.push(storedUser);
          }
        });
      }
    }
}

function persistUsersData() {
  try {
    localStorage.setItem('sams_users_data', JSON.stringify(USERS_DATA));
  } catch (e) {}
}

function loadStoredStudents() {
  try {
    const stored = localStorage.getItem('sams_students_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        STUDENTS_DATA = parsed;
      }
    }
  } catch (e) {}
}

function persistStudentsData() {
  try {
    localStorage.setItem('sams_students_data', JSON.stringify(STUDENTS_DATA));
  } catch (e) {}
}

function loadStoredClasses() {
  try {
    const stored = localStorage.getItem('sams_classes_data');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        CLASSES_DATA = parsed;
      }
    }
  } catch (e) {}
}

function persistClassesData() {
  try {
    localStorage.setItem('sams_classes_data', JSON.stringify(CLASSES_DATA));
  } catch (e) {}
}

function loadStoredCalendarEvents() {
  try {
    const stored = localStorage.getItem('sams_calendar_events');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        CALENDAR_EVENTS = parsed;
      }
    }
  } catch (e) {}
}

function persistCalendarEvents() {
  try {
    localStorage.setItem('sams_calendar_events', JSON.stringify(CALENDAR_EVENTS));
  } catch (e) {}
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

function loadStoredAttendance() {
  try {
    const storedDaily = localStorage.getItem('sams_daily_attendance');
    if (storedDaily) {
      const parsed = JSON.parse(storedDaily);
      if (parsed && typeof parsed === 'object') {
        DAILY_ATTENDANCE = Object.assign({}, DAILY_ATTENDANCE, parsed);
      }
    }
    const curDate = getSelectedRollcallDate();
    ATTENDANCE_MAP = getAttendanceForDate(curDate);

    const storedHist = localStorage.getItem('sams_attendance_history');
    if (storedHist) {
      const parsed = JSON.parse(storedHist);
      if (Array.isArray(parsed) && parsed.length > 0) {
        ATTENDANCE_HISTORY = parsed;
      }
    }
  } catch (e) {}
}

function persistAttendanceData() {
  try {
    const curDate = getSelectedRollcallDate();
    if (ATTENDANCE_MAP) {
      DAILY_ATTENDANCE[curDate] = Object.assign({}, ATTENDANCE_MAP);
    }
    localStorage.setItem('sams_daily_attendance', JSON.stringify(DAILY_ATTENDANCE));
    localStorage.setItem('sams_attendance_map', JSON.stringify(ATTENDANCE_MAP));
    localStorage.setItem('sams_attendance_history', JSON.stringify(ATTENDANCE_HISTORY));
  } catch (e) {}
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

    const targetId = userId || (CURRENT_USER ? CURRENT_USER.id : USERS_DATA[0]?.id);
    select.value = targetId;
    onCredUserSelected(targetId);
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
document.addEventListener('DOMContentLoaded', () => {
  loadStoredUsers();
  loadStoredStudents();
  loadStoredClasses();
  loadStoredCalendarEvents();
  loadStoredAttendance();
  initNavigation();
  loadSystemSettings();

  // Load saved active user or default to Neil (Admin)
  try {
    const savedUser = localStorage.getItem('sams_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const matched = USERS_DATA.find(u => u.id === parsed.id || u.username === parsed.username || u.email === parsed.email);
      CURRENT_USER = matched ? Object.assign(matched, parsed) : parsed;
    }
  } catch (e) {}

  if (!CURRENT_USER) {
    CURRENT_USER = USERS_DATA[0];
  }
  applyCurrentUser(CURRENT_USER);

  // Check persisted login session and last active tab
  try {
    const loggedInState = localStorage.getItem('sams_logged_in');
    if (loggedInState === 'false') {
      showLoginView();
    } else {
      document.getElementById('view-login')?.classList.add('d-none');
      document.getElementById('view-app')?.classList.remove('d-none');
      const savedTab = localStorage.getItem('sams_active_tab') || 'dashboard';
      if (savedTab && document.getElementById(`pane-${savedTab}`)) {
        switchTab(savedTab);
      }
    }
  } catch (e) {}

  updateAllKPIs();
  renderStudentsTable();
  loadRosterForAttendance();
  renderClassesGrid();
  renderCalendar();
  renderUsersTable();
  renderCredentialsDirectory();
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
  } else if (tabName === 'settings') {
    loadSystemSettings();
  }
}

// Switch between Login View and App View
function showLoginView() {
  try {
    localStorage.setItem('sams_logged_in', 'false');
  } catch (e) {}
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

function handleCreateStudentPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('create-photo-preview');
    const placeholder = document.getElementById('create-upload-icon-placeholder');
    if (preview) {
      preview.src = e.target.result;
      preview.style.display = 'block';
    }
    if (placeholder) placeholder.style.display = 'none';
    showToast('Student photo selected!', 'info');
  };
  reader.readAsDataURL(file);
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

  setTimeout(() => {
    const customAvatar = document.getElementById('create-photo-preview')?.src;
    const newStudent = {
      id: Date.now(),
      student_id_number: form.student_id_number.value,
      first_name: form.first_name.value,
      middle_name: form.middle_name.value || '',
      last_name: form.last_name.value,
      class_name: `${form.grade_level.value} - ${form.strand.value}`,
      section: form.section.value,
      strand: form.strand.value,
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
    persistStudentsData();
    form.reset();
    const createPreview = document.getElementById('create-photo-preview');
    if (createPreview) createPreview.style.display = 'none';
    const createPlaceholder = document.getElementById('create-upload-icon-placeholder');
    if (createPlaceholder) createPlaceholder.style.display = 'flex';
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Save Student';
    showToast(`New student "${newStudent.first_name} ${newStudent.last_name}" created successfully!`, 'success');
    switchTab('students');
  }, 600);
}

// =========================================================================
// EDIT STUDENT (IMAGE 2)
// =========================================================================
function handleEditStudentPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('edit-photo-preview');
    if (preview) preview.src = e.target.result;
    showToast('Student photo updated in preview. Click "Update Student" to save.', 'info');
  };
  reader.readAsDataURL(file);
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

function showEditStudentForm(id) {
  const student = STUDENTS_DATA.find(s => s.id === id) || STUDENTS_DATA[0];
  document.getElementById('edit-student-id').value = student.id;
  document.getElementById('edit-first-name').value = student.first_name || '';
  document.getElementById('edit-middle-name').value = student.middle_name || '';
  document.getElementById('edit-last-name').value = student.last_name || '';
  document.getElementById('edit-id-number').value = student.student_id_number || '';
  document.getElementById('edit-dob').value = student.dob || '';
  document.getElementById('edit-gender').value = student.gender || 'Male';
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

  setTimeout(() => {
    const id = Number(document.getElementById('edit-student-id').value);
    const student = STUDENTS_DATA.find(s => s.id === id);
    if (student) {
      student.first_name = document.getElementById('edit-first-name')?.value || student.first_name;
      student.middle_name = document.getElementById('edit-middle-name')?.value || '';
      student.last_name = document.getElementById('edit-last-name')?.value || student.last_name;
      student.student_id_number = document.getElementById('edit-id-number')?.value || student.student_id_number;
      student.dob = document.getElementById('edit-dob')?.value || student.dob;
      student.gender = document.getElementById('edit-gender')?.value || student.gender;
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
      persistStudentsData();
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i> Update Student';
    showToast(`Student information updated successfully!`, 'success');
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

  setTimeout(() => {
    STUDENTS_DATA = STUDENTS_DATA.filter(s => s.id !== studentToDeleteId);
    persistStudentsData();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-regular fa-trash-can"></i> Yes, Delete';
    closeDeleteModal();
    showToast('Student record deleted successfully.', 'success');
    renderStudentsTable();
  }, 600);
}

// =========================================================================
// ATTENDANCE & ROLL CALL (IMAGE 4)
// =========================================================================
function loadRosterForAttendance(isManual = false) {
  const btn = document.getElementById('btn-load-students');
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const selectedDate = document.getElementById('rollcall-date')?.value || '2026-05-20';
  const selectedSubject = document.getElementById('rollcall-subject')?.value || 'General Mathematics';

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

    const list = (selectedClass === 'All')
      ? STUDENTS_DATA
      : STUDENTS_DATA.filter(s => s.class_name === selectedClass);

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

  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const list = (selectedClass === 'All') ? STUDENTS_DATA : STUDENTS_DATA.filter(s => s.class_name === selectedClass);
  updateAttendanceCounters(list);
}

function updateAttendanceCounters(customList = null) {
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const list = customList || ((selectedClass === 'All') ? STUDENTS_DATA : STUDENTS_DATA.filter(s => s.class_name === selectedClass));
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
  if (elShowing) elShowing.textContent = `Showing 1 to ${total} of ${total} students`;
}

function markAllAttendance(status) {
  const selectedDate = getSelectedRollcallDate();
  if (!DAILY_ATTENDANCE[selectedDate]) {
    DAILY_ATTENDANCE[selectedDate] = {};
  }
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const list = (selectedClass === 'All') ? STUDENTS_DATA : STUDENTS_DATA.filter(s => s.class_name === selectedClass);
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
  const selectedClass = document.getElementById('rollcall-class-select')?.value || 'All';
  const list = (selectedClass === 'All') ? STUDENTS_DATA : STUDENTS_DATA.filter(s => s.class_name === selectedClass);
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
    const selectedClass = document.getElementById('rollcall-class-select')?.value || 'Grade 11 - STEM';
    const selectedDate = getSelectedRollcallDate();

    // Ensure DAILY_ATTENDANCE for this date is committed
    DAILY_ATTENDANCE[selectedDate] = Object.assign({}, ATTENDANCE_MAP);

    // Push into ATTENDANCE_HISTORY
    const list = (selectedClass === 'All') ? STUDENTS_DATA : STUDENTS_DATA.filter(s => s.class_name === selectedClass);
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
  loadRosterForAttendance();
}

// =========================================================================
// ATTENDANCE HISTORY LOGS
// =========================================================================
let ATTENDANCE_HISTORY = [
  { id: 1, date: '2026-05-19', dateFormatted: 'May 19, 2026', className: 'Grade 11 - STEM', present: 9, absent: 0, late: 1, rate: '90.0%' },
  { id: 2, date: '2026-05-19', dateFormatted: 'May 19, 2026', className: 'Grade 10 - ABM', present: 8, absent: 1, late: 1, rate: '80.0%' },
  { id: 3, date: '2026-05-18', dateFormatted: 'May 18, 2026', className: 'Grade 12 - HUMSS', present: 9, absent: 1, late: 0, rate: '90.0%' },
  { id: 4, date: '2026-05-18', dateFormatted: 'May 18, 2026', className: 'Grade 11 - STEM', present: 10, absent: 0, late: 0, rate: '100.0%' },
  { id: 5, date: '2026-05-17', dateFormatted: 'May 17, 2026', className: 'Grade 10 - ABM', present: 9, absent: 1, late: 0, rate: '90.0%' },
  { id: 6, date: '2026-05-16', dateFormatted: 'May 16, 2026', className: 'Grade 12 - HUMSS', present: 8, absent: 2, late: 0, rate: '80.0%' }
];

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
  loadRosterForAttendance();
  showToast(`Loaded historical attendance for ${className} (${date})`, 'info');
}

// =========================================================================
// CLASSES MANAGEMENT ACTIONS & STATE
// =========================================================================
let currentViewingClass = 'Grade 11 - STEM';

let CLASSES_DATA = [
  { id: 1, name: 'Grade 11 - STEM', room: 'Room 201', subject: 'General Mathematics', instructor: 'Angelo Dairo', enrolled: 10, avg_attendance: '91.4%', status: 'Active' },
  { id: 2, name: 'Grade 10 - ABM', room: 'Room 204', subject: 'Entrepreneurship & ICT', instructor: 'Angelo Madolaria', enrolled: 10, avg_attendance: '89.3%', status: 'Active' },
  { id: 3, name: 'Grade 12 - HUMSS', room: 'Room 305', subject: 'English for Academic Purposes', instructor: 'Prof. Grace Hopper', enrolled: 10, avg_attendance: '89.8%', status: 'Active' }
];

function renderClassesGrid() {
  const container = document.getElementById('classes-grid-container');
  if (!container) return;
  container.innerHTML = '';

  CLASSES_DATA.forEach(c => {
    const classStudents = STUDENTS_DATA.filter(s => s.class_name === c.name);
    const count = classStudents.length || c.enrolled;
    const avg = classStudents.length
      ? (classStudents.reduce((acc, s) => acc + s.attendance_rate, 0) / classStudents.length).toFixed(1) + '%'
      : c.avg_attendance;

    const card = document.createElement('div');
    card.className = 'class-card';
    card.innerHTML = `
      <div class="class-card-header">
        <div class="class-card-title">
          <h3>${escapeHTML(c.name)}</h3>
          <p>${escapeHTML(c.room)} • ${escapeHTML(c.subject)}</p>
        </div>
        <span class="status-pill status-${c.status === 'Active' ? 'active' : 'inactive'}">${escapeHTML(c.status)}</span>
      </div>
      <p style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-solid fa-user-tie"></i> Instructor: ${escapeHTML(c.instructor)}</p>
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
      </div>
    `;
    container.appendChild(card);
  });
}

function openAddClassModal() {
  const modal = document.getElementById('modal-add-class');
  if (modal) modal.classList.add('active');
}

function closeAddClassModal() {
  const modal = document.getElementById('modal-add-class');
  if (modal) modal.classList.remove('active');
}

function handleAddClassSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('new-class-name')?.value.trim();
  const subject = document.getElementById('new-class-subject')?.value.trim();
  const room = document.getElementById('new-class-room')?.value.trim();
  const instructor = document.getElementById('new-class-instructor')?.value.trim();

  if (!name || !subject || !room || !instructor) {
    showToast('All fields are required to register a class.', 'error');
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
    status: 'Active'
  };

  CLASSES_DATA.push(newClass);
  persistClassesData();

  // Add to Attendance class dropdown if not existing
  const select = document.getElementById('rollcall-class-select');
  if (select && !Array.from(select.options).some(opt => opt.value === name)) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  }

  closeAddClassModal();
  renderClassesGrid();
  showToast(`Class "${name}" created successfully!`, 'success');

  // Reset form
  document.getElementById('new-class-name').value = '';
  document.getElementById('new-class-subject').value = '';
  document.getElementById('new-class-room').value = '';
  document.getElementById('new-class-instructor').value = '';
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
    title: 'Gen Math Session',
    date: '2026-05-05',
    time: '08:00 AM - 10:00 AM',
    location: 'Room 201',
    type: 'class',
    desc: 'Regular classroom roll call session for Grade 11 - STEM.'
  },
  {
    id: 2,
    title: 'Midterm Examination',
    date: '2026-05-12',
    time: '10:00 AM - 12:00 PM',
    location: 'Main Hall B',
    type: 'exam',
    desc: 'Quarterly general mathematics and science examination.'
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

function handleUserModalPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview = document.getElementById('user-avatar-preview');
    const urlInput = document.getElementById('user-avatar-url');
    if (preview) preview.src = e.target.result;
    if (urlInput) urlInput.value = e.target.result;
    showToast('User photo updated!', 'info');
  };
  reader.readAsDataURL(file);
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

function loadSystemSettings() {
  try {
    const saved = localStorage.getItem('sams_system_settings');
    if (saved) {
      SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, JSON.parse(saved));
    }
  } catch (err) {
    console.warn('LocalStorage not available, using in-memory settings.');
  }



  // Populate DOM elements
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const setChecked = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(val);
  };

  setVal('setting-cutoff-time', SYSTEM_SETTINGS.cutoff_time);
  setVal('setting-grace-period', SYSTEM_SETTINGS.grace_period);
  setVal('setting-consecutive-threshold', SYSTEM_SETTINGS.consecutive_threshold);
  setChecked('setting-allow-retro', SYSTEM_SETTINGS.allow_retro);
  setChecked('setting-auto-lock', SYSTEM_SETTINGS.auto_lock);
  setChecked('setting-require-remarks', SYSTEM_SETTINGS.require_remarks);
  setChecked('setting-notify-guardian', SYSTEM_SETTINGS.notify_guardian);
  setChecked('setting-weekly-digest', SYSTEM_SETTINGS.weekly_digest);
  setVal('setting-warning-pct', SYSTEM_SETTINGS.warning_pct);
  setVal('setting-org-name', SYSTEM_SETTINGS.org_name);
  setVal('setting-academic-term', SYSTEM_SETTINGS.academic_term);
  setVal('setting-org-email', SYSTEM_SETTINGS.org_email);
  setVal('setting-org-phone', SYSTEM_SETTINGS.org_phone);
  setVal('setting-org-address', SYSTEM_SETTINGS.org_address);

  // Update profile banner preview
  const nameDisp = document.getElementById('profile-display-name');
  if (nameDisp) nameDisp.textContent = SYSTEM_SETTINGS.org_name;
  const subDisp = document.getElementById('profile-display-sub');
  if (subDisp) subDisp.textContent = `Accredited Institution • ${SYSTEM_SETTINGS.academic_term}`;

  if (SYSTEM_SETTINGS.badge_icon) {
    const iconEl = document.getElementById('center-badge-icon');
    if (iconEl) {
      iconEl.className = `fa-solid ${SYSTEM_SETTINGS.badge_icon}`;
    }
  }
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
      localStorage.setItem('sams_system_settings', JSON.stringify(SYSTEM_SETTINGS));
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
    localStorage.setItem('sams_system_settings', JSON.stringify(SYSTEM_SETTINGS));
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

function handleAvatarFileUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    const preview = document.getElementById('modal-avatar-preview');
    if (preview) preview.src = dataUrl;
    showToast('Photo loaded from local device!', 'info');
  };
  reader.readAsDataURL(file);
}

function handleSaveAdminProfile(event) {
  if (event) event.preventDefault();

  const newAvatar = document.getElementById('modal-avatar-preview')?.src || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
  const newName = (document.getElementById('modal-profile-name')?.value || 'Neil Herbert U. Betacura').trim();
  const newRole = (document.getElementById('modal-profile-role')?.value || 'Repository Lead').trim();
  const newEmail = (document.getElementById('modal-profile-email')?.value || 'neil.betacura@sams.edu.ph').trim();
  const newDept = (document.getElementById('modal-profile-dept')?.value || 'Repository Lead & IT Architecture').trim();

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
    const userToUpdate = (CURRENT_USER ? USERS_DATA.find(u => u.id === CURRENT_USER.id) : null) || USERS_DATA[0];
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
        SYSTEM_SETTINGS = Object.assign(SYSTEM_SETTINGS, parsed.settings);
        loadSystemSettings();
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
    previewBox.textContent = `[SAMS NOTICE]: Dear ${guardian}, your student ${student} was marked ABSENT for Morning Roll Call today (May 20, 2026). Please contact the academic registrar if excused.`;
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
    `"${CURRENT_USER ? CURRENT_USER.name : 'Neil Herbert U. Betacura'} (${CURRENT_USER ? CURRENT_USER.role : 'Administrator'})"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  downloadCSV(`sams_attendance_report_${selectedDate}.csv`, csvContent);
  showToast('Exported attendance log to CSV successfully!', 'success');
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

