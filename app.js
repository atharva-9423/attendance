// Firebase imports - MUST be at top
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, get, set, update } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

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

// App State
let currentUser = null;
let attendanceRecords = [];
let deviceId = null;
let currentView = 'login';
let html5QrCode = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Generate or retrieve device ID
  deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = `DEVICE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('deviceId', deviceId);
  }

  // Check if user is logged in
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      attendanceRecords = JSON.parse(storedRecords);
    }
    showDashboard();
  } else {
    showLogin();
  }
});

// Show Login Screen
function showLogin() {
  currentView = 'login';
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="login-container">
      <div class="login-card">
        <div class="brand-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 9 3 12 0v-5"/>
          </svg>
        </div>
        
        <h1 class="brand-title">Checkpoint</h1>
        <p class="brand-subtitle">Attendance made simple</p>
        
        <h2 class="login-heading">Student Login</h2>
        <p class="login-description">Enter your details to register this device.</p>
        
        <form id="loginForm" class="login-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" placeholder="John Doe" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="branch">Branch</label>
              <div class="custom-dropdown" data-name="branch">
                <div class="dropdown-selected">Select<i class="ph ph-caret-down"></i></div>
                <div class="dropdown-options">
                  <div class="dropdown-option" data-value="">Select</div>
                  <div class="dropdown-option" data-value="AI & DS">AI & DS</div>
                  <div class="dropdown-option" data-value="CS">CS</div>
                  <div class="dropdown-option" data-value="IT">IT</div>
                  <div class="dropdown-option" data-value="ECE">ECE</div>
                  <div class="dropdown-option" data-value="A & R">A & R</div>
                  <div class="dropdown-option" data-value="Civil">Civil</div>
                  <div class="dropdown-option" data-value="Mechanical">Mechanical</div>
                  <div class="dropdown-option" data-value="E & TC">E & TC</div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="year">Year</label>
              <div class="custom-dropdown" data-name="year">
                <div class="dropdown-selected">Select<i class="ph ph-caret-down"></i></div>
                <div class="dropdown-options">
                  <div class="dropdown-option" data-value="">Select</div>
                  <div class="dropdown-option" data-value="1">1st year</div>
                  <div class="dropdown-option" data-value="2">2nd year</div>
                  <div class="dropdown-option" data-value="3">3rd year</div>
                  <div class="dropdown-option" data-value="4">4th year</div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="division">Division</label>
            <div class="custom-dropdown" data-name="division">
              <div class="dropdown-selected">Select<i class="ph ph-caret-down"></i></div>
              <div class="dropdown-options">
                <div class="dropdown-option" data-value="">Select</div>
                <div class="dropdown-option" data-value="A">A</div>
                <div class="dropdown-option" data-value="B">B</div>
                <div class="dropdown-option" data-value="C">C</div>
                <div class="dropdown-option" data-value="D">D</div>
                <div class="dropdown-option" data-value="E">E</div>
                <div class="dropdown-option" data-value="F">F</div>
                <div class="dropdown-option" data-value="G">G</div>
                <div class="dropdown-option" data-value="H">H</div>
                <div class="dropdown-option" data-value="I">I</div>
                <div class="dropdown-option" data-value="J">J</div>
                <div class="dropdown-option" data-value="K">K</div>
                <div class="dropdown-option" data-value="L">L</div>
                <div class="dropdown-option" data-value="M">M</div>
                <div class="dropdown-option" data-value="N">N</div>
                <div class="dropdown-option" data-value="O">O</div>
                <div class="dropdown-option" data-value="P">P</div>
                <div class="dropdown-option" data-value="Q">Q</div>
              </div>
            </div>
          </div>

          <button type="submit" class="btn-primary">Register Device & Login</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  initializeDropdowns();
  
  // Clear error on name input
  const nameInput = document.getElementById('name');
  nameInput.addEventListener('input', () => {
    if (nameInput.value.trim() !== '') {
      nameInput.classList.remove('error');
      const existingError = nameInput.parentElement.querySelector('.field-error');
      if (existingError) {
        existingError.remove();
      }
    }
  });
}

// Initialize custom dropdowns
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  
  dropdowns.forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    const options = dropdown.querySelector('.dropdown-options');
    const optionElements = dropdown.querySelectorAll('.dropdown-option');
    
    // Toggle dropdown
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Close other dropdowns
      document.querySelectorAll('.custom-dropdown').forEach(dd => {
        if (dd !== dropdown) {
          dd.classList.remove('active');
        }
      });
      
      dropdown.classList.toggle('active');
    });
    
    // Select option
    optionElements.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        selected.innerHTML = text + '<i class="ph ph-caret-down"></i>';
        selected.setAttribute('data-value', value);
        dropdown.classList.remove('active');
        
        // Clear error when a value is selected
        if (value) {
          selected.classList.remove('error');
          const existingError = dropdown.querySelector('.field-error');
          if (existingError) {
            existingError.remove();
          }
        }
      });
    });
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  });
}

// Handle Login
async function handleLogin(e) {
  e.preventDefault();
  
  // Clear previous errors
  document.querySelectorAll('.field-error').forEach(el => el.remove());
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  
  const formData = new FormData(e.target);
  
  // Get custom dropdown values
  const branchDropdown = document.querySelector('[data-name="branch"] .dropdown-selected');
  const yearDropdown = document.querySelector('[data-name="year"] .dropdown-selected');
  const divisionDropdown = document.querySelector('[data-name="division"] .dropdown-selected');
  
  const userData = {
    name: formData.get('name'),
    branch: branchDropdown.getAttribute('data-value'),
    year: yearDropdown.getAttribute('data-value'),
    division: divisionDropdown.getAttribute('data-value'),
    deviceId: deviceId,
    registeredAt: new Date().toISOString()
  };

  // Validate fields
  let hasError = false;
  
  if (!userData.name || userData.name.trim() === '') {
    showFieldError('name', 'Name is required');
    hasError = true;
  } else {
    // Validate name format: must contain at least first name and surname
    const nameParts = userData.name.trim().split(/\s+/);
    if (nameParts.length < 2) {
      showFieldError('name', 'Please enter your full name (e.g., John Doe)');
      hasError = true;
    }
  }
  
  if (!userData.branch) {
    showFieldError('branch', 'Branch is required');
    hasError = true;
  }
  
  if (!userData.year) {
    showFieldError('year', 'Year is required');
    hasError = true;
  }
  
  if (!userData.division) {
    showFieldError('division', 'Division is required');
    hasError = true;
  }
  
  if (hasError) {
    return;
  }

  // Check device registration in Firebase RTDB
  try {
    // Sanitize name for Firebase key (remove special characters)
    const sanitizedName = userData.name.replace(/[.#$/[\]]/g, '_');
    const deviceRef = ref(database, `devices/${sanitizedName}/${deviceId}`);
    const snapshot = await get(deviceRef);
    
    if (snapshot.exists()) {
      // Device exists - verify credentials match
      const registeredUser = snapshot.val();
      
      if (registeredUser.branch === userData.branch &&
          registeredUser.year === userData.year &&
          registeredUser.division === userData.division) {
        // Credentials match - allow login
        currentUser = userData;
        localStorage.setItem('user', JSON.stringify(userData));
        showDashboard();
      } else {
        // Credentials don't match - show error
        showFieldError('name', 'This device is registered to another account. Only one account per device is allowed.');
        return;
      }
    } else {
      // Device doesn't exist - check if device is registered to another user
      const allDevicesRef = ref(database, 'devices');
      const allDevicesSnapshot = await get(allDevicesRef);
      
      if (allDevicesSnapshot.exists()) {
        let deviceExistsElsewhere = false;
        allDevicesSnapshot.forEach((userSnapshot) => {
          userSnapshot.forEach((deviceSnapshot) => {
            if (deviceSnapshot.key === deviceId) {
              deviceExistsElsewhere = true;
            }
          });
        });
        
        if (deviceExistsElsewhere) {
          showFieldError('name', 'This device is registered to another account. Only one account per device is allowed.');
          return;
        }
      }
      
      // Register new device under user's name
      await set(deviceRef, {
        branch: userData.branch,
        year: userData.year,
        division: userData.division,
        deviceId: deviceId,
        registeredAt: userData.registeredAt
      });
      
      currentUser = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      showDashboard();
    }
  } catch (error) {
    console.error('Login error:', error);
    showFieldError('name', 'Connection error. Please try again.');
  }
}

// Show field error
function showFieldError(fieldName, message) {
  let field;
  
  if (fieldName === 'name') {
    field = document.getElementById('name');
    field.classList.add('error');
  } else {
    field = document.querySelector(`[data-name="${fieldName}"] .dropdown-selected`);
    field.classList.add('error');
  }
  
  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  
  field.parentElement.appendChild(errorEl);
}

// Show Dashboard
function showDashboard() {
  currentView = 'dashboard';
  const userRecords = attendanceRecords.filter(r => r.deviceId === currentUser.deviceId);
  const attendanceRate = userRecords.length > 0 
    ? Math.round((userRecords.length / (userRecords.length + 2)) * 100) 
    : 0;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div>
          <p class="welcome-text">Welcome back,</p>
          <h1 class="user-name">${currentUser.name}</h1>
          <p class="user-details">${currentUser.branch} • ${currentUser.year} Year • Div ${currentUser.division}</p>
        </div>
        <button id="logoutBtn" class="logout-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </header>

      <div class="stats-grid">
        <div class="stat-card stat-card-dark">
          <div class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span>Present</span>
          </div>
          <div class="stat-value">${userRecords.length}</div>
          <div class="stat-label">Classes attended</div>
        </div>

        <div class="stat-card stat-card-light">
          <div class="stat-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            <span>Rate</span>
          </div>
          <div class="stat-value">${attendanceRate}%</div>
          <div class="stat-label">Average attendance</div>
        </div>
      </div>

      <div class="activity-section">
        <h2 class="section-heading">RECENT ACTIVITY</h2>
        
        ${userRecords.length === 0 ? `
          <div class="empty-activity">
            <p>No recent activity</p>
            <p class="empty-subtitle">Scan a QR code to mark your attendance</p>
          </div>
        ` : `
          <div class="activity-list">
            ${userRecords.slice(-5).reverse().map(record => `
              <div class="activity-card">
                <div class="activity-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="activity-info">
                  <h3 class="activity-title">Present</h3>
                  <p class="activity-location">Lecture Hall 4B</p>
                </div>
                <div class="activity-time">
                  <span class="time">${formatTime(record.timestamp)}</span>
                  <span class="date">${formatDate(record.timestamp)}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <button id="scanBtn" class="scan-btn">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Scan QR Code
      </button>
    </div>
  `;

  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  document.getElementById('scanBtn').addEventListener('click', showScanner);
}

// Handle Logout
function handleLogout() {
  currentUser = null;
  attendanceRecords = [];
  localStorage.removeItem('user');
  localStorage.removeItem('attendanceRecords');
  showLogin();
}

// Show Scanner
function showScanner() {
  currentView = 'scanner';
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="scanner-container">
      <div class="scanner-header">
        <button id="closeBtn" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="scanner-badge">Scanner Active</div>
      </div>

      <div class="scanner-content">
        <div class="scanner-frame">
          <div id="qr-reader"></div>
          <div class="scan-overlay">
            <div class="scan-corners">
              <div class="corner corner-tl"></div>
              <div class="corner corner-tr"></div>
              <div class="corner corner-bl"></div>
              <div class="corner corner-br"></div>
            </div>
            <div class="scan-line"></div>
            <p class="scan-text">Point at QR Code</p>
          </div>
        </div>

        <p class="scanner-instruction">
          Align the QR code within the frame to check in automatically.
        </p>
      </div>
    </div>
  `;

  document.getElementById('closeBtn').addEventListener('click', () => {
    stopScanner();
    showDashboard();
  });

  startScanner();
}

// Start Scanner
function startScanner() {
  html5QrCode = new Html5Qrcode("qr-reader");
  
  html5QrCode.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    (decodedText) => {
      handleScanSuccess(decodedText);
    },
    (errorMessage) => {
      // Ignore scan errors
    }
  ).catch(err => {
    console.error('Error starting scanner:', err);
  });
}

// Stop Scanner
function stopScanner() {
  if (html5QrCode) {
    html5QrCode.stop().catch(err => {
      console.error('Error stopping scanner:', err);
    });
  }
}

// Simulate Scan
function simulateScan() {
  // Generate a mock token in the correct format
  const mockToken = `CHK-${Math.random().toString(36).substring(2, 18).toUpperCase()}`;
  handleScanSuccess(mockToken);
}

// Handle Scan Success
async function handleScanSuccess(qrData) {
  stopScanner();

  // Validate QR code format (must start with CHK-)
  if (!qrData.startsWith('CHK-')) {
    showErrorToast('Nice try! But that QR code isn\'t from our app. Maybe try scanning your grocery receipt? 🤷');
    setTimeout(() => {
      showDashboard();
    }, 2000);
    return;
  }

  // Validate token in Firebase
  try {
    const tokenRef = ref(database, `active_tokens/${qrData}`);
    const snapshot = await get(tokenRef);
    
    if (!snapshot.exists()) {
      showErrorToast('Hmm, this QR code doesn\'t exist. Did you make it up? 🤔');
      setTimeout(() => {
        showDashboard();
      }, 2000);
      return;
    }
    
    const tokenData = snapshot.val();
    
    // Check if token is still valid
    if (tokenData.expiresAt < Date.now()) {
      showErrorToast('Too slow! ⏰ This QR code self-destructed 30 seconds ago. Mission Impossible style! 💥');
      setTimeout(() => {
        showDashboard();
      }, 2000);
      return;
    }

    const newRecord = {
      id: Date.now(),
      studentName: currentUser.name,
      branch: currentUser.branch,
      division: currentUser.division,
      year: currentUser.year,
      qrCode: qrData,
      timestamp: new Date().toISOString(),
      deviceId: currentUser.deviceId
    };

    attendanceRecords.push(newRecord);
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));

    // Save to Firebase
    const sanitizedName = currentUser.name.replace(/[.#$/[\]]/g, '_');
    const attendanceRef = ref(database, `attendance/${sanitizedName}/${newRecord.id}`);
    await set(attendanceRef, newRecord);

    showSuccessToast(qrData);
    
    setTimeout(() => {
      showDashboard();
    }, 2000);
  } catch (error) {
    console.error('Error validating token:', error);
    showErrorToast('Connection error. Please try again.');
    setTimeout(() => {
      showDashboard();
    }, 2000);
  }
}

// Show Success Toast
function showSuccessToast(courseName) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.innerHTML = `
    <div class="toast-content">
      <h3>Attendance Registered</h3>
      <p>You have been marked present.</p>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Show Error Toast
function showErrorToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-notification error-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <h3>Error</h3>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Format Time
function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// Format Date
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}
