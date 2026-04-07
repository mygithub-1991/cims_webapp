# CIMS Web Application

**Coaching Institute Management System - React Web App**

A modern, responsive web application for managing coaching institute operations built with React, TypeScript, and Material-UI.

---

## 🚀 Features

### Core Modules
- **Dashboard** - Overview with key metrics and quick actions
- **Students Management** - Add, edit, view student records with fee tracking
- **Teachers Management** - Manage teaching staff  
- **Batches** - Create and manage course batches
- **Attendance** - Mark and track student attendance
- **Fees** - Collect fees and track payments
- **Expenses** - Manage institute expenses
- **Reports** - Generate analytics and reports
- **User Management** - Admin panel for user roles (RBAC)

### Key Features
- ✅ Role-Based Access Control (RBAC)
- ✅ IST Timezone Support
- ✅ Responsive Material-UI Design
- ✅ JWT Authentication
- ✅ Real-time Data Synchronization
- ✅ Advanced Reporting

---

## 🛠️ Tech Stack

- **Frontend:** React 18 with TypeScript
- **UI Library:** Material-UI (MUI) v5
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Backend API running on http://localhost:8000

### Steps

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env and set REACT_APP_API_URL
   ```

3. Start development server:
   ```bash
   npm start
   ```

   App opens at http://localhost:3000

---

## 🔐 Default Login
- Username: admin
- Password: admin

---

## 🏗️ Project Structure

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts (Auth)
├── pages/          # Page components
├── services/       # API services
├── types/          # TypeScript types
├── utils/          # Utility functions
└── config.ts       # Configuration
```

---

## 🌐 API Integration

Backend: Python FastAPI at http://localhost:8000/api

All services mirror the Android app and connect to the same backend.

---

## 📱 Responsive Design

Works on Desktop, Laptop, Tablet, and Mobile devices.

---

## 🚀 Deployment

```bash
npm run build
# Deploy build/ folder to hosting service
```

---

**Version:** 1.0.0  
**Date:** 2026-04-07  
**Status:** ✅ Ready

For detailed documentation, see WEBAPP_SUMMARY.md
