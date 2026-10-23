const demoUsers = {
  student: {
    email: 'student@study.com',
    password: 'student123',
    name: 'Aarav Sharma',
    role: 'student'
  },
  admin: {
    email: 'admin@study.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  }
};

const timetableData = [
  { subject: 'Maths', time: '6:00 AM - 7:30 AM', status: 'done' },
  { subject: 'English', time: '7:40 AM - 8:45 AM', status: 'done' },
  { subject: 'Physics', time: '9:30 AM - 11:00 AM', status: 'partial' },
  { subject: 'Hindi', time: '11:10 AM - 12:00 PM', status: 'pending' },
  { subject: 'Chemistry', time: '3:00 PM - 4:30 PM', status: 'pending' },
  { subject: 'Coding', time: '5:00 PM - 6:00 PM', status: 'done' },
  { subject: 'Math Revision', time: '6:30 PM - 7:30 PM', status: 'pending' },
  { subject: 'Coding Practice', time: '8:00 PM - 9:00 PM', status: 'done' }
];

const subjectProgress = [
  { name: 'Maths', value: 90 },
  { name: 'English', value: 78 },
  { name: 'Physics', value: 82 },
  { name: 'Hindi', value: 68 },
  { name: 'Chemistry', value: 75 },
  { name: 'Coding', value: 88 }
];

const adminStudents = [
  { name: 'Aarav Sharma', study: 88, coding: 91, attendance: 92, status: 'Excellent' },
  { name: 'Diya Singh', study: 76, coding: 74, attendance: 81, status: 'Good' },
  { name: 'Rohit Verma', study: 64, coding: 68, attendance: 70, status: 'Average' },
  { name: 'Meera Nair', study: 58, coding: 60, attendance: 62, status: 'Needs Focus' },
  { name: 'Karan Joshi', study: 80, coding: 83, attendance: 86, status: 'Strong' }
];

const weeklySchedule = [
  { day: 'Monday', slots: ['Maths', 'Physics', 'Coding', 'Chemistry'] },
  { day: 'Tuesday', slots: ['English', 'Hindi', 'Math Revision', 'Coding Practice'] },
  { day: 'Wednesday', slots: ['Maths', 'Physics', 'Coding', 'Chemistry'] },
  { day: 'Thursday', slots: ['English', 'Hindi', 'Math Revision', 'Coding Practice'] }
];

const codingTasks = [
  { title: 'HTML/CSS warmup', effort: '30 min' },
  { title: 'JavaScript logic practice', effort: '45 min' },
  { title: 'Project build', effort: '60 min' },
  { title: 'DSA basics', effort: '45 min' }
];

const state = {
  role: 'student',
  currentView: 'studentView',
  authenticated: false,
  theme: 'light'
};

const firebaseConfig = {
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_ID',
  appId: 'YOUR_APP_ID'
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const els = {
  authView: document.getElementById('authView'),
  studentView: document.getElementById('studentView'),
  adminView: document.getElementById('adminView'),
  timetableView: document.getElementById('timetableView'),
  progressView: document.getElementById('progressView'),
  attendanceView: document.getElementById('attendanceView'),
  codingView: document.getElementById('codingView'),
  pageTitle: document.getElementById('pageTitle'),
  greetingText: document.getElementById('greetingText'),
  loginForm: document.getElementById('loginForm'),
  roleButtons: document.querySelectorAll('.role-btn'),
  authTitle: document.getElementById('authTitle'),
  logoutBtn: document.getElementById('logoutBtn'),
  sidebar: document.getElementById('sidebar'),
  navItems: document.querySelectorAll('.nav-item'),
  timetableList: document.getElementById('timetableList'),
  subjectProgress: document.getElementById('subjectProgress'),
  attendanceTable: document.getElementById('attendanceTable'),
  performanceReport: document.getElementById('performanceReport'),
  adminTableBody: document.getElementById('adminTableBody'),
  adminStudentCount: document.getElementById('adminStudentCount'),
  avgAttendanceValue: document.getElementById('avgAttendanceValue'),
  needsFocusCount: document.getElementById('needsFocusCount'),
  weeklyTimetable: document.getElementById('weeklyTimetable'),
  progressOverview: document.getElementById('progressOverview'),
  attendanceLog: document.getElementById('attendanceLog'),
  codingTasks: document.getElementById('codingTasks'),
  studyHoursValue: document.getElementById('studyHoursValue'),
  codingHoursValue: document.getElementById('codingHoursValue'),
  attendanceValue: document.getElementById('attendanceValue'),
  pendingValue: document.getElementById('pendingValue')
};

async function getUserRole(uid) {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data().role || 'student';
    }
    return 'student';
  } catch (error) {
    console.error('Role fetch failed:', error);
    return 'student';
  }
}

async function createUserProfile(uid, email, role) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    await userRef.set({
      uid,
      email,
      role,
      name: email.split('@')[0],
      createdAt: new Date().toISOString()
    });
  }
}

function setView(viewName) {
  state.currentView = viewName;

  const pageViews = [
    els.studentView,
    els.adminView,
    els.timetableView,
    els.progressView,
    els.attendanceView,
    els.codingView
  ];

  pageViews.forEach((view) => {
    view.classList.toggle('active', view.id === viewName);
  });

  els.navItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.view === viewName);
  });

  if (viewName === 'studentView') {
    els.pageTitle.textContent = 'Student Dashboard';
  } else if (viewName === 'adminView') {
    els.pageTitle.textContent = 'Admin Panel';
  } else if (viewName === 'timetableView') {
    els.pageTitle.textContent = 'Timetable';
  } else if (viewName === 'progressView') {
    els.pageTitle.textContent = 'Progress';
  } else if (viewName === 'attendanceView') {
    els.pageTitle.textContent = 'Attendance';
  } else if (viewName === 'codingView') {
    els.pageTitle.textContent = 'Coding Practice';
  }
}

function renderStudentDashboard() {
  const doneCount = timetableData.filter((item) => item.status === 'done').length;
  const pendingCount = timetableData.filter((item) => item.status === 'pending').length;
  const studyHours = timetableData
    .filter((item) => item.status !== 'pending')
    .reduce((sum, item) => sum + parseFloat((item.subject.includes('Coding') ? 0 : 1.5).toFixed(1)), 0);

  const codingHours = timetableData
    .filter((item) => item.subject.toLowerCase().includes('coding'))
    .filter((item) => item.status !== 'pending').length * 1.5;

  const attendancePercent = Math.round((doneCount / timetableData.length) * 100);

  els.studyHoursValue.textContent = `${Math.max(3, Math.round(studyHours))}h`;
  els.codingHoursValue.textContent = `${Math.round(codingHours)}h`;
  els.attendanceValue.textContent = `${attendancePercent}%`;
  els.pendingValue.textContent = `${pendingCount} tasks`;

  els.timetableList.innerHTML = timetableData
    .map(
      (item) => `
        <div class="task-item">
          <div class="task-left">
            <input type="checkbox" ${item.status === 'done' ? 'checked' : ''} data-subject="${item.subject}" />
            <div class="task-meta">
              <span class="task-name">${item.subject}</span>
              <span class="task-time">${item.time}</span>
            </div>
          </div>
          <span class="task-status ${item.status === 'pending' ? 'pending' : ''}">${item.status === 'done' ? 'Done' : item.status === 'partial' ? 'Partial' : 'Pending'}</span>
        </div>
      `
    )
    .join('');

  els.subjectProgress.innerHTML = subjectProgress
    .map(
      (subject) => `
        <div class="progress-row">
          <div class="progress-head">
            <span>${subject.name}</span>
            <span>${subject.value}%</span>
          </div>
          <div class="progress-bar">
            <span style="width:${subject.value}%"></span>
          </div>
        </div>
      `
    )
    .join('');

  const attendanceRows = [
    { label: 'Maths', value: '92%', state: 'done' },
    { label: 'English', value: '78%', state: 'partial' },
    { label: 'Physics', value: '84%', state: 'done' },
    { label: 'Hindi', value: '66%', state: 'pending' },
    { label: 'Chemistry', value: '75%', state: 'partial' }
  ];

  els.attendanceTable.innerHTML = attendanceRows
    .map(
      (row) => `
        <div class="attendance-row">
          <div class="attendance-name">${row.label}</div>
          <strong>${row.value}</strong>
          <span class="pill ${row.state}">${row.state === 'done' ? 'Done' : row.state === 'partial' ? 'Partial' : 'Pending'}</span>
        </div>
      `
    )
    .join('');

  const reportData = [
    { label: 'Best subject', value: 'Maths', detail: 'Most consistent' },
    { label: 'Needs practice', value: 'Hindi', detail: 'Read more difficult questions' },
    { label: 'Code consistency', value: 'Strong', detail: 'Good daily rhythm' }
  ];

  els.performanceReport.innerHTML = reportData
    .map(
      (item) => `
        <div class="score-card">
          <div class="score">
            <span>${item.label}</span>
            <span>${item.value}</span>
          </div>
          <small>${item.detail}</small>
        </div>
      `
    )
    .join('');
}

function renderAdminDashboard() {
  const average = Math.round(
    adminStudents.reduce((sum, student) => sum + student.attendance, 0) / adminStudents.length
  );

  const needsFocus = adminStudents.filter((student) => student.attendance < 70).length;

  els.adminStudentCount.textContent = adminStudents.length;
  els.avgAttendanceValue.textContent = `${average}%`;
  els.needsFocusCount.textContent = needsFocus;

  els.adminTableBody.innerHTML = adminStudents
    .map(
      (student) => `
        <tr>
          <td>${student.name}</td>
          <td>${student.study}%</td>
          <td>${student.coding}%</td>
          <td>${student.attendance}%</td>
          <td><span class="pill ${student.attendance < 70 ? 'pending' : student.attendance < 85 ? 'partial' : 'done'}">${student.status}</span></td>
          <td>
            <div class="admin-actions">
              <button class="admin-btn">View</button>
              <button class="admin-btn warn">Alert</button>
            </div>
          </td>
        </tr>
      `
    )
    .join('');
}

function renderTimetableView() {
  els.weeklyTimetable.innerHTML = weeklySchedule
    .map(
      (day) => `
        <div class="week-card">
          <h4>${day.day}</h4>
          <ul>
            ${day.slots.map((slot) => `<li><span>${slot}</span><span>✓</span></li>`).join('')}
          </ul>
        </div>
      `
    )
    .join('');
}

function renderProgressView() {
  els.progressOverview.innerHTML = subjectProgress
    .map(
      (subject) => `
        <div class="chart-row">
          <div class="label"><span>${subject.name}</span><span>${subject.value}%</span></div>
          <div class="chart-bar"><span style="width:${subject.value}%"></span></div>
        </div>
      `
    )
    .join('');
}

function renderAttendanceLog() {
  const logs = [
    { date: 'Today', item: 'Physics', status: 'Present' },
    { date: 'Yesterday', item: 'Maths', status: 'Completed' },
    { date: 'Mon', item: 'Coding', status: 'Strong' },
    { date: 'Sun', item: 'Chemistry', status: 'Revision' }
  ];

  els.attendanceLog.innerHTML = logs
    .map(
      (log) => `
        <div class="log-item">
          <strong>${log.date}</strong>
          <span>${log.item}</span>
          <span class="pill done">${log.status}</span>
        </div>
      `
    )
    .join('');
}

function renderCodingTasks() {
  els.codingTasks.innerHTML = codingTasks
    .map(
      (task) => `
        <div class="coding-card">
          <h4>${task.title}</h4>
          <p>Focus time: ${task.effort}</p>
        </div>
      `
    )
    .join('');
}

async function loginUser(email, password, selectedRole) {
  try {
    const result = await auth.signInWithEmailAndPassword(email, password);
    const uid = result.user.uid;
    const userRole = await getUserRole(uid);

    if (selectedRole && userRole !== selectedRole) {
      await auth.signOut();
      throw new Error(`This account is not a ${selectedRole}.`);
    }

    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      if (userData.role === 'admin') {
        setView('adminView');
        renderAdminDashboard();
        els.greetingText.textContent = `Welcome back, ${userData.name || 'Admin'}`;
      } else {
        setView('studentView');
        renderStudentDashboard();
        els.greetingText.textContent = `Welcome back, ${userData.name || 'Student'}`;
      }
    } else {
      await createUserProfile(uid, email, selectedRole || 'student');
      if (selectedRole === 'admin') {
        setView('adminView');
        renderAdminDashboard();
      } else {
        setView('studentView');
        renderStudentDashboard();
      }
    }

    state.authenticated = true;
    state.role = userRole || selectedRole || 'student';
    els.authView.classList.remove('active');
    els.sidebar.style.display = 'flex';
  } catch (error) {
    console.error(error);
    alert(error.message || 'Invalid email or password.');
  }
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('emailInput').value.trim();
  const password = document.getElementById('passwordInput').value.trim();
  const chosenRole = document.querySelector('.role-btn.active')?.dataset.role || 'student';
  loginUser(email, password, chosenRole);
}

function handleRoleSwitch(targetRole) {
  state.role = targetRole;
  document.querySelectorAll('.role-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.role === targetRole);
  });

  els.authTitle.textContent = targetRole === 'admin' ? 'Admin Login' : 'Student Login';
}

async function handleLogout() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error(error);
  }

  state.authenticated = false;
  els.authView.classList.add('active');
  setView('studentView');
  document.getElementById('loginForm').reset();
  els.greetingText.textContent = 'Good morning';
  els.pageTitle.textContent = 'Student Dashboard';
}

function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  toggle.addEventListener('click', () => {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.body.style.filter = state.theme === 'dark' ? 'invert(0.05)' : 'none';
  });
}

function initCheckboxes() {
  els.timetableList.addEventListener('change', (event) => {
    const checkbox = event.target;
    if (!(checkbox instanceof HTMLInputElement)) return;

    const subject = checkbox.dataset.subject;
    const match = timetableData.find((item) => item.subject === subject);
    if (!match) return;

    match.status = checkbox.checked ? 'done' : 'pending';
    renderStudentDashboard();
  });
}

function initAll() {
  renderStudentDashboard();
  renderAdminDashboard();
  renderTimetableView();
  renderProgressView();
  renderAttendanceLog();
  renderCodingTasks();
  initThemeToggle();
  initCheckboxes();

  document.getElementById('loginForm').addEventListener('submit', handleLogin);

  document.querySelectorAll('.role-btn').forEach((button) => {
    button.addEventListener('click', () => handleRoleSwitch(button.dataset.role));
  });

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', () => {
      if (!state.authenticated) {
        els.authView.classList.add('active');
        return;
      }
      setView(item.dataset.view);
    });
  });

  document.getElementById('markAllDone').addEventListener('click', () => {
    timetableData.forEach((item) => {
      item.status = 'done';
    });
    renderStudentDashboard();
  });

  document.getElementById('refreshAdmin').addEventListener('click', () => {
    renderAdminDashboard();
  });

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      const role = await getUserRole(user.uid);
      state.authenticated = true;
      state.role = role;
      els.authView.classList.remove('active');
      els.sidebar.style.display = 'flex';
      if (role === 'admin') {
        setView('adminView');
        renderAdminDashboard();
        els.greetingText.textContent = `Welcome back, ${user.email || 'Admin'}`;
      } else {
        setView('studentView');
        renderStudentDashboard();
        els.greetingText.textContent = `Welcome back, ${user.email || 'Student'}`;
      }
    } else {
      state.authenticated = false;
      els.authView.classList.add('active');
      els.studentView.classList.remove('active');
      els.adminView.classList.remove('active');
      els.pageTitle.textContent = 'Student Dashboard';
      els.greetingText.textContent = 'Good morning';
    }
  });

  els.authView.classList.add('active');
  els.studentView.classList.remove('active');
  els.adminView.classList.remove('active');
  els.pageTitle.textContent = 'Student Dashboard';
  els.greetingText.textContent = 'Good morning';
}

initAll();
