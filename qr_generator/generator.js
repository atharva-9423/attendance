
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref, set, get, remove } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

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

// State
let currentToken = null;
let qrCodeInstance = null;
let countdownInterval = null;
let timeRemaining = 30;
let activeTokensCount = 0;
let totalGeneratedCount = 0;

// Generate cryptographic token
async function generateCryptoToken() {
  const timestamp = Date.now();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  const data = `${timestamp}-${randomHex}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `CHK-${hashHex.substring(0, 16).toUpperCase()}`;
}

// Initialize QR Code
function initQRCode() {
  const qrWrapper = document.getElementById('qrcode');
  qrWrapper.innerHTML = '';
  
  qrCodeInstance = new QRCode(qrWrapper, {
    width: 280,
    height: 280,
    colorDark: '#1a1d29',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  });
}

// Store token in Firebase
async function storeToken(token) {
  const expiryTime = Date.now() + 30000; // 30 seconds from now
  
  try {
    await set(ref(database, `active_tokens/${token}`), {
      token: token,
      createdAt: Date.now(),
      expiresAt: expiryTime,
      isValid: true
    });
    
    // Schedule token deletion after 30 seconds
    setTimeout(async () => {
      await invalidateToken(token);
    }, 30000);
    
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

// Invalidate token
async function invalidateToken(token) {
  try {
    await remove(ref(database, `active_tokens/${token}`));
    await updateStats();
  } catch (error) {
    console.error('Error invalidating token:', error);
  }
}

// Cleanup all expired tokens
async function cleanupExpiredTokens() {
  try {
    const tokensRef = ref(database, 'active_tokens');
    const snapshot = await get(tokensRef);
    
    if (snapshot.exists()) {
      const tokens = snapshot.val();
      const now = Date.now();
      
      // Remove all expired tokens
      for (const tokenKey in tokens) {
        const tokenData = tokens[tokenKey];
        if (tokenData.expiresAt < now) {
          await remove(ref(database, `active_tokens/${tokenKey}`));
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

// Update statistics and cleanup expired tokens
async function updateStats() {
  try {
    const tokensRef = ref(database, 'active_tokens');
    const snapshot = await get(tokensRef);
    
    if (snapshot.exists()) {
      const tokens = snapshot.val();
      const now = Date.now();
      let validTokenCount = 0;
      
      // Remove expired tokens
      for (const tokenKey in tokens) {
        const tokenData = tokens[tokenKey];
        if (tokenData.expiresAt < now) {
          // Token expired, remove it
          await remove(ref(database, `active_tokens/${tokenKey}`));
        } else {
          validTokenCount++;
        }
      }
      
      activeTokensCount = validTokenCount;
    } else {
      activeTokensCount = 0;
    }
    
    document.getElementById('activeTokens').textContent = activeTokensCount;
    document.getElementById('totalGenerated').textContent = totalGeneratedCount;
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Generate new QR code
async function generateNewQR() {
  // Clean up all expired tokens first
  await cleanupExpiredTokens();
  
  // Invalidate previous token if exists
  if (currentToken) {
    await invalidateToken(currentToken);
  }
  
  // Generate new token
  currentToken = await generateCryptoToken();
  
  // Update QR code
  if (qrCodeInstance) {
    qrCodeInstance.clear();
    qrCodeInstance.makeCode(currentToken);
  }
  
  // Store in Firebase
  await storeToken(currentToken);
  
  // Update display
  document.getElementById('tokenId').textContent = currentToken;
  
  // Increment total count
  totalGeneratedCount++;
  
  // Update stats
  await updateStats();
  
  // Add refresh animation
  const qrWrapper = document.querySelector('.qr-wrapper');
  qrWrapper.classList.add('refreshing');
  setTimeout(() => {
    qrWrapper.classList.remove('refreshing');
  }, 500);
  
  // Reset timer
  timeRemaining = 30;
  startCountdown();
}

// Start countdown timer
function startCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  countdownInterval = setInterval(() => {
    timeRemaining--;
    document.getElementById('timer').textContent = `${timeRemaining}s`;
    
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      generateNewQR();
    }
  }, 1000);
}

// Initialize app
async function init() {
  initQRCode();
  await generateNewQR();
  
  // Update stats every 5 seconds
  setInterval(updateStats, 5000);
}

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
