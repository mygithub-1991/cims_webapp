# Schools CRUD Module ✅

## Overview
Complete CRUD (Create, Read, Update, Delete) module for managing school records has been added to the CIMS webapp.

## Features

### ✅ View Schools
- Table view showing all schools
- Columns: School Name, Address, Pincode, Created Date, Actions
- Real-time search functionality
- Responsive design

### ✅ Add School
- Dialog form with validation
- Required fields:
  - School Name
  - Address (multiline)
  - Pincode
- Clean form on open
- Success feedback

### ✅ Edit School
- Edit existing school records
- Pre-populated form with current data
- Same validation as add
- Update in real-time

### ✅ Delete School
- Soft delete (not permanent)
- Confirmation dialog
- Can be restored via API

### ✅ Search Schools
- Search across multiple fields:
  - School Name
  - Address
  - Pincode
- Case-insensitive
- Real-time filtering

### ✅ Access Control
- Admin-only access
- Role-based menu visibility
- Protected route

## Files Created

### 1. `src/types/index.ts`
Added School interface:
```typescript
export interface School {
  id: number;
  school_name: string;
  address: string;
  pincode: string;
  is_deleted: boolean;
  deleted_at?: number;
  created_at: number;
  updated_at: number;
  last_synced_at?: number;
  sync_status?: string;
}
```

### 2. `src/services/schoolService.ts`
Full CRUD service with methods:
- `getAll(params?)` - Get all schools
- `getById(id)` - Get school by ID
- `create(data)` - Create new school
- `update(id, data)` - Update school
- `delete(id)` - Soft delete school
- `restore(id)` - Restore deleted school

### 3. `src/pages/SchoolsPage.tsx`
Complete page component (244 lines):
- Material-UI components
- Table with search
- Add/Edit dialog
- Delete confirmation
- Loading states
- Empty state message

## Files Modified

### 1. `src/App.tsx`
- Added SchoolsPage import
- Added route: `/schools` (Admin only)

### 2. `src/components/Layout/Sidebar.tsx`
- Added AccountBalance icon import
- Added "Schools" menu item
- Placed between Batches and Attendance
- Admin-only visibility

## API Integration

### Backend Endpoints
All endpoints are already available in the backend:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/schools/` | Get all schools |
| GET | `/api/schools/{id}` | Get school by ID |
| POST | `/api/schools/` | Create new school |
| PUT | `/api/schools/{id}` | Update school |
| DELETE | `/api/schools/{id}` | Delete school (soft) |
| POST | `/api/schools/{id}/restore` | Restore deleted school |

### Request/Response Schema

**Create/Update Request:**
```json
{
  "school_name": "Delhi Public School",
  "address": "Sector 45, Gurgaon, Haryana",
  "pincode": "122003"
}
```

**Response:**
```json
{
  "id": 1284,
  "school_name": "Delhi Public School",
  "address": "Sector 45, Gurgaon, Haryana",
  "pincode": "122003",
  "is_deleted": false,
  "deleted_at": null,
  "created_at": 1775568482440,
  "updated_at": 1775568482440,
  "last_synced_at": 1775568375604
}
```

## Usage

### Accessing Schools Page
1. Login as Admin user
2. Click "Schools" in the sidebar (between Batches and Attendance)
3. View list of schools

### Adding a School
1. Click "Add School" button
2. Fill in the form:
   - School Name (required)
   - Address (required, multiline)
   - Pincode (required)
3. Click "Add"

### Editing a School
1. Click the Edit icon on any school row
2. Modify the fields
3. Click "Update"

### Deleting a School
1. Click the Delete icon on any school row
2. Confirm deletion in the dialog
3. School is soft-deleted (can be restored via API)

### Searching Schools
1. Type in the search box above the table
2. Results filter automatically
3. Search works on: name, address, pincode

## Technical Details

### Component Structure
```
SchoolsPage
├── Header (Title + Actions)
│   ├── Refresh Button
│   └── Add School Button
├── Search TextField
├── Table
│   ├── TableHead (Columns)
│   └── TableBody (Data Rows)
│       ├── School Info
│       └── Action Buttons (Edit/Delete)
└── Dialog (Add/Edit Form)
    ├── School Name Field
    ├── Address Field (Multiline)
    ├── Pincode Field
    └── Actions (Cancel/Submit)
```

### State Management
```typescript
const [schools, setSchools] = useState<School[]>([]);
const [loading, setLoading] = useState(true);
const [dialogOpen, setDialogOpen] = useState(false);
const [editingSchool, setEditingSchool] = useState<School | null>(null);
const [searchQuery, setSearchQuery] = useState('');
const [formData, setFormData] = useState({...});
```

### Search Implementation
```typescript
const filteredSchools = schools.filter((school) => {
  const query = searchQuery.toLowerCase();
  return (
    school.school_name.toLowerCase().includes(query) ||
    school.address.toLowerCase().includes(query) ||
    school.pincode.toLowerCase().includes(query)
  );
});
```

## Testing Checklist

- [x] Schools page loads
- [x] Table displays school data
- [x] Add school dialog opens
- [x] Can create new school
- [x] Edit dialog pre-populates data
- [x] Can update school
- [x] Delete confirmation works
- [x] Can delete school
- [x] Search filters correctly
- [x] Only visible to admins
- [x] Menu item shows in sidebar
- [x] Route is protected
- [x] No console errors
- [x] App compiles successfully

## Sample Data

The backend already has sample schools:
- Test School (123 Test St, 12345)
- Kendriya Vidyalaya (Sector 8, R.K. Puram, New Delhi, 110022)
- Delhi Public School (Sector 45, Gurgaon, Haryana, 122003)

## UI/UX Consistency

The Schools module follows the same patterns as other CRUD pages:
- ✅ Same layout structure
- ✅ Same button styles
- ✅ Same dialog design
- ✅ Same table format
- ✅ Same search UI
- ✅ Same loading states
- ✅ Same error handling

## Integration Points

### With Students Module
Students can be associated with schools via `school_id` field (already exists in Student type).

### With Sync Module
Schools support sync functionality via:
- `last_synced_at` timestamp
- `sync_status` field
- Restore deleted schools API

## Future Enhancements (Optional)

- [ ] Add school logo/image
- [ ] Add contact information (phone, email)
- [ ] Add principal/admin details
- [ ] Link students to schools
- [ ] School-wise reports
- [ ] Bulk import schools
- [ ] Export schools list
- [ ] School statistics

## Git Commit

**Commit:** `77de325`
**Message:** "Add Schools CRUD module"
**Date:** 2026-04-07
**Files Changed:** 6 files, 497 insertions

## Browser Compatibility

✅ Works in all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari

## Performance

- **Fast loading** - Efficient API calls
- **Real-time search** - Client-side filtering
- **Responsive UI** - Material-UI components
- **Optimized rendering** - React best practices

## Security

- ✅ **Admin-only access** - Role-based protection
- ✅ **Route protection** - PrivateRoute wrapper
- ✅ **Authentication required** - JWT token validation
- ✅ **Soft delete** - Data can be recovered

---

**Status:** ✅ Completed
**Build:** Successful
**Pushed to GitHub:** ✅ Yes
**Ready for Use:** ✅ Yes

## Quick Start

1. **Hard refresh browser:** Ctrl+Shift+R
2. **Login as admin:** admin / admin
3. **Navigate to Schools:** Click "Schools" in sidebar
4. **Start managing schools!**
