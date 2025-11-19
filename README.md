# Campus Verify - Attendance System

An elegant, professional, and minimal attendance tracking application with QR code scanning capabilities.

## Overview

Campus Verify is a React-based attendance system that allows students to:
- Login with their details (name, branch, division, year)
- Register their device automatically upon login
- Scan QR codes to mark attendance with real-time camera or simulation
- View their attendance statistics and recent activity in a clean dashboard

## Key Features

- **Elegant Login**: A clean, centered form to register the student and device details (Name, Branch, Division, Year)
- **Minimalist Dashboard**: Displays your attendance stats and recent activity with a modern, whitespace-heavy design
- **QR Scanner**: A simulated camera interface with scanning animation. Clicking the view (or the "Simulate Scan" button) registers attendance for a mock course
- **History**: Attendance records are collected and displayed on the dashboard

## Design Details

- **Typography**: Uses **Plus Jakarta Sans** for a modern, geometric, and professional look
- **Theme**: "Swiss Style" light mode—pure white backgrounds, subtle gray borders, and refined slate-colored text
- **Interactions**: Smooth page transitions and tactile button states
- **Custom Dropdowns**: Beautiful custom-styled select dropdowns with smooth animations (no browser defaults)

## Features Breakdown

### Student Login
- Campus Verify branded login with graduation cap icon
- Secure device registration
- Clean form layout with proper validation
- **Custom dropdown menus** with smooth animations and hover effects

### Dashboard
- Welcome message with student name
- User details display (Branch • Year • Division)
- **Statistics Cards**: 
  - Present count showing total classes attended
  - Attendance rate showing percentage
- **Recent Activity**: List of recently scanned courses with:
  - Course name and code
  - Lecture hall location
  - Time and date stamps
  - Green calendar icons

### QR Scanner
- Dark-themed camera scanner with:
  - Live camera feed with scanning frame and corner indicators
  - Animated scan line
  - "Simulate Scan" button for testing without camera
  - Success animation with green checkmark
  - Toast notification for attendance confirmation
- Smooth transitions between states

### Data Persistence
- All data stored locally using browser localStorage
- Attendance records persist across sessions
- Device registration tracked per browser

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **QR Scanner**: html5-qrcode library
- **Typography**: Plus Jakarta Sans (Google Fonts)
- **Styling**: Custom CSS with Swiss Style light theme
- **Data Storage**: Browser localStorage
- **Components**: Custom dropdown select components

## Project Structure

```
src/
├── main.jsx              # Application entry point
├── App.jsx               # Main app component with state management
├── App.css               # Global styles and theme
└── components/
    ├── Login.jsx         # Login form with Campus Verify branding
    ├── Dashboard.jsx     # Dashboard with stats and activity feed
    ├── QRScanner.jsx     # QR code scanner with camera and simulation
    └── CustomSelect.jsx  # Custom dropdown select component
```

## Recent Changes

- **November 19, 2025**: Complete UI/UX redesign
  - Implemented Plus Jakarta Sans typography
  - Applied Swiss Style light mode design
  - Implemented Campus Verify branding with graduation cap icon
  - Redesigned login screen with new layout and styling
  - **Created custom dropdown components** (no browser defaults)
  - Added smooth dropdown animations and hover effects
  - Created stats cards showing Present count and Attendance rate
  - Built recent activity feed with course details and timestamps
  - Redesigned QR scanner with dark theme and scanning frame
  - Added animated corner indicators and scan line
  - Implemented success animation with green checkmark
  - Added toast notifications for attendance confirmation
  - Updated all styling to match design prototypes
  - Improved color scheme and typography
  - Enhanced spacing and rounded corners throughout
  - Added smooth page transitions and tactile button states

- **November 19, 2025**: Initial project creation
  - Set up React + Vite application
  - Implemented student login system
  - Added device registration
  - Integrated QR scanner functionality
  - Configured localStorage for data persistence

## User Flow

1. **Login**: Student enters their details (name, branch, division, year)
2. **Device Registration**: System generates unique device ID automatically
3. **Dashboard**: View welcome message, attendance stats, and recent activity
4. **Scan QR**: Click "Scan QR Code" floating button to open scanner
5. **Camera/Simulate**: Use camera or simulate scan for testing
6. **Confirmation**: See success animation and toast notification
7. **View History**: All attendance records displayed in recent activity feed

## Design System

### Colors (Swiss Style Light Mode)
- **Primary Dark**: #2d3748 (buttons, dark cards)
- **Background**: #f5f6f8 (page background, whitespace-heavy)
- **Card White**: #ffffff (pure white)
- **Text Primary**: #1a1d29 (refined slate)
- **Text Secondary**: #718096 (subtle gray)
- **Border**: #e2e8f0 (subtle gray borders)
- **Success Green**: #22c55e
- **Scanner Dark**: #1a202c - #2d3748 gradient

### Typography (Plus Jakarta Sans)
- **Brand Title**: 28px, Bold (700)
- **Page Heading**: 28px, Bold (700)
- **Section Heading**: 12px, Bold (700), Uppercase
- **Body Text**: 14-15px, Regular (400) / Medium (500)
- **Small Text**: 12-13px, Regular (400)
- **Buttons**: 15px, Semi-Bold (600)

### Spacing & Layout
- Whitespace-heavy design for clarity
- Rounded corners (12px - 24px)
- Generous padding and margins
- Card-based layout with subtle shadows

### Custom Dropdowns
- Clean white background
- Subtle border and shadow
- Smooth slide-in animation
- Hover states for options
- Arrow rotation on open/close
- Click-outside to close functionality

## Data Storage

All data is stored in browser localStorage:
- `user`: Student information and device ID
- `attendanceRecords`: Array of attendance entries with timestamps and course details

## Running the Application

The app runs on port 5000 using Vite's development server. Simply hit "Run" and the application will start automatically.

## Testing

- Use the "Simulate Scan" button in the scanner to test without camera access
- Camera permissions are required for live QR scanning
- Data persists in localStorage until manually cleared or logout
- Custom dropdowns work seamlessly on all devices

## Notes

- Professional, minimal design with Swiss Style light theme
- Plus Jakarta Sans font for modern, geometric look
- Smooth animations and transitions throughout
- Tactile button states with hover effects
- Custom-styled dropdowns (no browser defaults)
- Fully responsive for mobile and desktop
- Offline-capable with localStorage persistence
- Each device gets a unique ID for tracking purposes
