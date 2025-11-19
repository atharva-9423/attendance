
// Firebase imports
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHpsrL6-_xO5eH8BawleAJ-pITLguAXRo",
  authDomain: "attendance-99990.firebaseapp.com",
  databaseURL: "https://attendance-99990-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "attendance-99990",
  storageBucket: "attendance-99990.firebasestorage.app",
  messagingSenderId: "465471810224",
  appId: "1:465471810224:web:c0cae32dcdb23b9458a975",
  measurementId: "G-YLEJ5T7T54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Admin credentials (in production, use proper authentication)
const ADMIN_PASSWORD = "admin123";

// App State
let isAuthenticated = false;
let studentsData = [];
let selectedStudent = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const storedAuth = sessionStorage.getItem('adminAuth');
  if (storedAuth === 'true') {
    isAuthenticated = true;
    loadDashboard();
  } else {
    showLogin();
  }
});

// Show Login Screen
function showLogin() {
  const app = document.getElementById('admin-app');
  app.innerHTML = `
    <div class="admin-login-container">
      <div class="admin-login-card">
        <div class="brand-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        
        <h1 class="brand-title">Admin Panel</h1>
        <p class="brand-subtitle">Enter password to continue</p>
        
        <form id="adminLoginForm" class="login-form">
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter admin password" required>
          </div>
          
          <button type="submit" class="btn-primary">Login</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('adminLoginForm').addEventListener('submit', handleAdminLogin);
}

// Handle Admin Login
function handleAdminLogin(e) {
  e.preventDefault();
  const password = e.target.password.value;
  
  if (password === ADMIN_PASSWORD) {
    isAuthenticated = true;
    sessionStorage.setItem('adminAuth', 'true');
    loadDashboard();
  } else {
    showError('Incorrect password');
  }
}

// Show Error
function showError(message) {
  const input = document.getElementById('password');
  input.classList.add('error');
  
  const existingError = input.parentElement.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  input.parentElement.appendChild(errorEl);
  
  setTimeout(() => {
    input.classList.remove('error');
    errorEl.remove();
  }, 3000);
}

// Load Dashboard
async function loadDashboard() {
  const app = document.getElementById('admin-app');
  app.innerHTML = `
    <div class="admin-dashboard">
      <header class="admin-header">
        <div class="header-content">
          <h1>Admin Dashboard</h1>
          <button id="logoutBtn" class="logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div class="dashboard-content">
        <div class="stats-overview">
          <div class="stat-card">
            <div class="stat-icon">📚</div>
            <div class="stat-info">
              <div class="stat-value" id="totalStudents">0</div>
              <div class="stat-label">Total Students</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-value" id="totalScans">0</div>
              <div class="stat-label">Total Scans</div>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <div class="stat-value" id="avgAttendance">0%</div>
              <div class="stat-label">Average Attendance</div>
            </div>
          </div>
        </div>

        <div class="students-section">
          <div class="section-header">
            <h2>Students List</h2>
            <div class="filter-controls">
              <select id="branchFilter" class="filter-select">
                <option value="">All Branches</option>
                <option value="AI & DS">AI & DS</option>
                <option value="CS">CS</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="A & R">A & R</option>
                <option value="Civil">Civil</option>
                <option value="Mechanical">Mechanical</option>
                <option value="E & TC">E & TC</option>
              </select>
              
              <select id="yearFilter" class="filter-select">
                <option value="">All Years</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          
          <div id="studentsList" class="students-list">
            <div class="loading">Loading students...</div>
          </div>
        </div>

        <div id="studentDetails" class="student-details-panel hidden">
          <div class="panel-header">
            <h3>Student Details</h3>
            <button id="closeDetailsBtn" class="close-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div id="detailsContent"></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('branchFilter').addEventListener('change', filterStudents);
  document.getElementById('yearFilter').addEventListener('change', filterStudents);
  
  await loadStudentsData();
}

// Load Students Data from Firebase
async function loadStudentsData() {
  try {
    const devicesRef = ref(database, 'devices');
    const attendanceRef = ref(database, 'attendance');
    
    // Get all attendance records first
    const attendanceSnapshot = await get(attendanceRef);
    const allAttendance = {};
    
    if (attendanceSnapshot.exists()) {
      const attendanceData = attendanceSnapshot.val();
      Object.keys(attendanceData).forEach(studentName => {
        const studentRecords = attendanceData[studentName];
        allAttendance[studentName] = Object.values(studentRecords);
      });
    }
    
    onValue(devicesRef, (snapshot) => {
      studentsData = [];
      
      if (snapshot.exists()) {
        const devices = snapshot.val();
        
        Object.keys(devices).forEach(studentName => {
          const studentDevices = devices[studentName];
          
          Object.keys(studentDevices).forEach(deviceId => {
            const deviceData = studentDevices[deviceId];
            
            // Get attendance records for this student
            const studentRecords = allAttendance[studentName] || [];
            const deviceRecords = studentRecords.filter(r => r.deviceId === deviceId);
            
            studentsData.push({
              name: studentName.replace(/_/g, ' '),
              branch: deviceData.branch,
              year: deviceData.year,
              division: deviceData.division,
              deviceId: deviceId,
              registeredAt: deviceData.registeredAt,
              scans: deviceRecords,
              scanCount: deviceRecords.length,
              attendance: calculateAttendance(deviceRecords.length)
            });
          });
        });
      }
      
      updateStats();
      displayStudents(studentsData);
    });
    
    // Listen for attendance changes in real-time
    onValue(attendanceRef, async (snapshot) => {
      if (snapshot.exists()) {
        const attendanceData = snapshot.val();
        Object.keys(attendanceData).forEach(studentName => {
          const studentRecords = attendanceData[studentName];
          allAttendance[studentName] = Object.values(studentRecords);
        });
        
        // Reload students data with updated attendance
        const devicesSnapshot = await get(devicesRef);
        if (devicesSnapshot.exists()) {
          studentsData = [];
          const devices = devicesSnapshot.val();
          
          Object.keys(devices).forEach(studentName => {
            const studentDevices = devices[studentName];
            
            Object.keys(studentDevices).forEach(deviceId => {
              const deviceData = studentDevices[deviceId];
              const studentRecords = allAttendance[studentName] || [];
              const deviceRecords = studentRecords.filter(r => r.deviceId === deviceId);
              
              studentsData.push({
                name: studentName.replace(/_/g, ' '),
                branch: deviceData.branch,
                year: deviceData.year,
                division: deviceData.division,
                deviceId: deviceId,
                registeredAt: deviceData.registeredAt,
                scans: deviceRecords,
                scanCount: deviceRecords.length,
                attendance: calculateAttendance(deviceRecords.length)
              });
            });
          });
          
          updateStats();
          displayStudents(studentsData);
        }
      }
    });
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

// Calculate Attendance Percentage
function calculateAttendance(scanCount) {
  // Assume 20 total classes for percentage calculation
  const totalClasses = 20;
  return Math.min(Math.round((scanCount / totalClasses) * 100), 100);
}

// Update Stats
function updateStats() {
  const totalStudents = studentsData.length;
  const totalScans = studentsData.reduce((sum, s) => sum + s.scanCount, 0);
  const avgAttendance = totalStudents > 0 
    ? Math.round(studentsData.reduce((sum, s) => sum + s.attendance, 0) / totalStudents)
    : 0;
  
  document.getElementById('totalStudents').textContent = totalStudents;
  document.getElementById('totalScans').textContent = totalScans;
  document.getElementById('avgAttendance').textContent = `${avgAttendance}%`;
}

// Display Students
function displayStudents(students) {
  const listEl = document.getElementById('studentsList');
  
  if (students.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No students found</div>';
    return;
  }
  
  listEl.innerHTML = students.map(student => `
    <div class="student-card" data-student='${JSON.stringify(student).replace(/'/g, "&#39;")}'>
      <div class="student-info">
        <div class="student-avatar">${student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
        <div class="student-details">
          <h4>${student.name}</h4>
          <p>${student.branch} • ${student.year} Year • Div ${student.division}</p>
        </div>
      </div>
      
      <div class="student-stats">
        <div class="stat-item">
          <span class="stat-number">${student.scanCount}</span>
          <span class="stat-text">Scans</span>
        </div>
        <div class="stat-item">
          <span class="stat-number ${student.attendance >= 75 ? 'good' : student.attendance >= 50 ? 'medium' : 'low'}">${student.attendance}%</span>
          <span class="stat-text">Attendance</span>
        </div>
      </div>
      
      <button class="view-details-btn">View Details</button>
    </div>
  `).join('');
  
  // Add click handlers
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.student-card');
      const student = JSON.parse(card.getAttribute('data-student'));
      showStudentDetails(student);
    });
  });
}

// Filter Students
function filterStudents() {
  const branch = document.getElementById('branchFilter').value;
  const year = document.getElementById('yearFilter').value;
  
  let filtered = studentsData;
  
  if (branch) {
    filtered = filtered.filter(s => s.branch === branch);
  }
  
  if (year) {
    filtered = filtered.filter(s => s.year === year);
  }
  
  displayStudents(filtered);
}

// Show Student Details
function showStudentDetails(student) {
  selectedStudent = student;
  const panel = document.getElementById('studentDetails');
  const content = document.getElementById('detailsContent');
  
  // Group scans by date
  const scansByDate = {};
  student.scans.forEach(scan => {
    const date = new Date(scan.timestamp).toLocaleDateString();
    if (!scansByDate[date]) {
      scansByDate[date] = [];
    }
    scansByDate[date].push(scan);
  });
  
  content.innerHTML = `
    <div class="details-header">
      <div class="student-avatar-large">${student.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</div>
      <div class="student-info-large">
        <h3>${student.name}</h3>
        <p>${student.branch} • ${student.year} Year • Division ${student.division}</p>
        <p class="registered-date">Registered: ${new Date(student.registeredAt).toLocaleDateString()}</p>
      </div>
    </div>
    
    <div class="details-stats">
      <div class="detail-stat-card">
        <div class="detail-stat-value">${student.scanCount}</div>
        <div class="detail-stat-label">Total Scans</div>
      </div>
      
      <div class="detail-stat-card">
        <div class="detail-stat-value ${student.attendance >= 75 ? 'good' : student.attendance >= 50 ? 'medium' : 'low'}">${student.attendance}%</div>
        <div class="detail-stat-label">Attendance</div>
      </div>
      
      <div class="detail-stat-card">
        <div class="detail-stat-value">${Object.keys(scansByDate).length}</div>
        <div class="detail-stat-label">Days Present</div>
      </div>
    </div>
    
    <div class="scan-history">
      <h4>Scan History</h4>
      ${student.scans.length === 0 ? '<p class="empty-history">No scans recorded</p>' : `
        <div class="timeline">
          ${student.scans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).map(scan => `
            <div class="timeline-item">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="scan-info">
                  <strong>${scan.qrCode}</strong>
                  <span class="scan-location">Lecture Hall 4B</span>
                </div>
                <div class="scan-time">
                  ${new Date(scan.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
  
  panel.classList.remove('hidden');
  
  document.getElementById('closeDetailsBtn').addEventListener('click', () => {
    panel.classList.add('hidden');
  });
}

// Handle Logout
function handleLogout() {
  isAuthenticated = false;
  sessionStorage.removeItem('adminAuth');
  showLogin();
}
