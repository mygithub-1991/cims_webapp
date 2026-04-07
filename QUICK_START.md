# CIMS Web App - Quick Start Guide

**Get up and running in 5 minutes!**

---

## 🚀 Quick Start

### Step 1: Start Backend API (Required)

```bash
# Open terminal 1
cd C:\android\cims_backend
uvicorn app.main:app --reload
```

✅ Backend should be running at: `http://localhost:8000`

---

### Step 2: Start Web App

```bash
# Open terminal 2
cd C:\android\cims_webapp
npm start
```

✅ Web app will automatically open at: `http://localhost:3000`

---

### Step 3: Login

- **Username:** `admin`
- **Password:** `admin`

---

## 📋 What You'll See

### 1. Login Page
- Modern Material-UI design
- Form validation
- Error handling

### 2. Dashboard
- Total Students, Teachers, Batches
- Financial metrics (Revenue, Expenses, Profit)
- Pending Fees alert
- Quick action buttons

### 3. Students Page (Fully Functional)
- List all students in table
- Click "Add Student" button
- Fill form and save
- Edit/Delete operations
- Fee tracking (paid vs pending)

### 4. Other Pages
- Currently showing placeholder layouts
- Ready to implement (follow StudentsPage pattern)

---

## 🔧 Troubleshooting

**Problem:** Cannot connect to backend
```bash
# Solution: Check backend is running
curl http://localhost:8000/docs
# Should show API documentation
```

**Problem:** Login fails
```bash
# Solution: Check backend has users
# Use backend /docs to call POST /auth/bootstrap-admin
```

**Problem:** npm start fails
```bash
# Solution: Install dependencies
npm install
```

---

## 📱 Navigation

Use the sidebar to navigate between modules:
- Dashboard (home)
- Students (full CRUD)
- Teachers (admin only)
- Batches
- Attendance
- Fees
- Expenses (admin/accountant only)
- Reports
- User Management (admin only)
- Logout

---

## 🎯 Next Steps

1. **Explore Dashboard** - View stats and metrics
2. **Add Students** - Test full CRUD operations
3. **Check Role-Based Access** - Login as different roles
4. **Implement Other Pages** - Follow StudentsPage pattern

---

## 📚 Documentation

- **WEBAPP_SUMMARY.md** - Complete project overview
- **README.md** - Installation and features
- **Backend Docs:** http://localhost:8000/docs

---

## 💡 Tips

- Press F12 to open browser DevTools
- Check Console for errors
- Check Network tab for API calls
- React DevTools extension helpful

---

**Happy Coding!** 🚀
