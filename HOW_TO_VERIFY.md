# How to Verify Dashboard is Working

## Quick Verification Steps

### 1. Open the Application
- Navigate to: **http://localhost:3000**
- You should see the login page

### 2. Login
- **Username:** `admin`
- **Password:** `admin`
- Click "Login"

### 3. Check Dashboard
After successful login, the dashboard should display:

```
╔════════════════════════════════════╗
║ Total Students:  15                ║
║ Total Teachers:  5                 ║
║ Total Batches:   5                 ║
║ Pending Fees:    Rs.126,487        ║
║ Total Revenue:   Rs.164,487        ║
║ Total Expenses:  Rs.485,668        ║
║ Net Profit:      Rs.(321,181)      ║
╚════════════════════════════════════╝
```

## If Numbers Are Still Wrong

### Option 1: Browser Console Verification

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Paste this code and press Enter:

```javascript
// Quick Dashboard Check
const token = localStorage.getItem('cims_auth_token');
if (!token) {
    console.log('❌ Not logged in!');
} else {
    const headers = { 'Authorization': `Bearer ${token}` };
    Promise.all([
        fetch('http://localhost:8000/api/students/', { headers }).then(r => r.json()),
        fetch('http://localhost:8000/api/teachers/', { headers }).then(r => r.json()),
        fetch('http://localhost:8000/api/batches/', { headers }).then(r => r.json()),
        fetch('http://localhost:8000/api/fee-records/', { headers }).then(r => r.json()),
        fetch('http://localhost:8000/api/expenses/', { headers }).then(r => r.json())
    ]).then(([students, teachers, batches, fees, expenses]) => {
        const revenue = fees.reduce((s, f) => s + f.amount_paid, 0);
        const expenseTotal = expenses.reduce((s, e) => s + e.amount, 0);
        const pending = students.reduce((s, st) => s + Math.max(0, st.total_fees - st.paid_fees), 0);
        console.log('Students:', students.length);
        console.log('Teachers:', teachers.length);
        console.log('Batches:', batches.length);
        console.log('Revenue:', revenue);
        console.log('Expenses:', expenseTotal);
        console.log('Pending:', pending);
    });
}
```

### Option 2: Use Verification Script

1. Open browser console (F12)
2. Copy content from `verify_dashboard.js`
3. Paste and press Enter
4. Check the output

### Option 3: Direct API Test

1. Open `test_api.html` in browser
2. Click "Test Login"
3. Click "Fetch Data"
4. Compare results

## Common Issues & Solutions

### Issue 1: "0" or "NaN" values on dashboard

**Cause:** API calls are failing or returning empty data

**Solution:**
```bash
# Check backend is running
curl http://localhost:8000/docs

# Verify data exists
TOKEN=$(curl -X POST -s http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}' | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

curl -s "http://localhost:8000/api/students/" -H "Authorization: Bearer $TOKEN" | python -c "import sys, json; print(len(json.load(sys.stdin)), 'students')"
```

### Issue 2: Dashboard shows loading spinner forever

**Cause:** JavaScript error or API endpoint mismatch

**Solution:**
1. Open browser console (F12)
2. Look for errors (red text)
3. Common fixes:
   - Clear browser cache (Ctrl+Shift+Del)
   - Clear localStorage: `localStorage.clear()`
   - Re-login

### Issue 3: "401 Unauthorized" errors

**Cause:** Not logged in or token expired

**Solution:**
1. Logout and login again
2. Or in console: `localStorage.clear()` then refresh

### Issue 4: CORS errors

**Cause:** Backend CORS not configured

**Solution:** Check backend has CORS middleware enabled for `http://localhost:3000`

## Detailed Verification

### Check Each Component:

1. **Students Page** (`/students`)
   - Should show 15 students
   - Names: Rahul Sharma, Priya Patel, Amit Kumar, etc.
   - Each has total_fees and paid_fees

2. **Teachers Page** (`/teachers`)
   - Should show 5 teachers
   - Including: John Smith, Sarah Johnson, Mike Brown

3. **Batches Page** (`/batches`)
   - Should show 5 batches
   - Including: Grade 10 Mathematics, Grade 9 Science, Grade 8 English

4. **Fees Page** (`/fees`)
   - Should show 30 fee payment records
   - Each has amount_paid and receipt_id

5. **Expenses Page** (`/expenses`)
   - Should show 23 expense records
   - Including salaries, rent, utilities, etc.

## API Endpoints Reference

All endpoints require `Authorization: Bearer <token>` header:

- `GET /api/auth/login` - Login (public)
- `GET /api/students/` - List students
- `GET /api/teachers/` - List teachers
- `GET /api/batches/` - List batches
- `GET /api/fee-records/` - List fee records ⚠️ NOTE: Changed from `/api/fees/`
- `GET /api/expenses/` - List expenses

## Expected Data Counts

| Entity | Count | Sample Data |
|--------|-------|-------------|
| Students | 15 | Indian names, Rs.30k-47k fees |
| Teachers | 5 | John Smith, Sarah Johnson, etc. |
| Batches | 5 | Grade 8-10 classes |
| Fee Records | 30 | Rs.3k-8k payments |
| Expenses | 23 | Rs.1k-150k each |
| Attendance | 210 | Last 14 days |

## Final Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can login with admin/admin
- [ ] Dashboard shows 15 students
- [ ] Dashboard shows 5 teachers
- [ ] Dashboard shows 5 batches
- [ ] Dashboard shows Rs.164,487 revenue
- [ ] Dashboard shows Rs.485,668 expenses
- [ ] Dashboard shows Rs.126,487 pending fees
- [ ] No console errors
- [ ] All pages load correctly

## If Still Not Working

1. **Hard refresh**: Ctrl+Shift+R (clears React cache)
2. **Clear everything**:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```
3. **Restart servers**:
   ```bash
   # Stop React (Ctrl+C)
   # Restart React
   npm start
   ```
4. **Check this file**: `src/config.ts` should have:
   ```typescript
   FEES: '/fee-records',  // NOT '/fees'
   ```

## Success Indicators

✅ Dashboard loads in < 2 seconds
✅ All 7 stat cards show numbers (not 0)
✅ Numbers match the table above
✅ Clicking on Students/Teachers/etc shows data
✅ No red errors in browser console

---

**Last Updated:** 2026-04-07
**Status:** All fixes applied
**Build:** Successful with no errors
