# School Data Source - Where It Comes From

## Summary
The initial school seed data comes from the **cloud PostgreSQL database on Neon.tech**, which is populated by the **Android mobile app** through sync operations.

## Architecture Overview

```
┌─────────────────┐
│  Android App    │
│  (CIMSMobile)   │──┐
└─────────────────┘  │
                     │ Sync/API
┌─────────────────┐  │   ┌────────────────────┐
│  React Web App  │──┼──▶│  Backend FastAPI   │
│  (cims_webapp)  │  │   │  (cims_backend)    │
└─────────────────┘  │   └────────────────────┘
                     │            │
                     └────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │  Cloud PostgreSQL        │
                     │  (Neon.tech)            │
                     │  ep-spring-cloud        │
                     └──────────────────────────┘
```

## Data Flow

### 1. **Primary Data Entry: Android App**
The Android app (`C:\android\CIMS\CIMSMobile`) is the primary data entry point:
- Users create schools in the Android app
- Data is stored locally in Room database
- Sync manager pushes data to backend API
- Backend stores in cloud PostgreSQL database

### 2. **Database: Cloud PostgreSQL (Neon.tech)**
Located at: `ep-spring-cloud-a1uaqtp7-pooler.ap-southeast-1.aws.neon.tech`

**Connection String:**
```
postgresql://cims_user:npg_8F3puoDUrWGf@ep-spring-cloud-a1uaqtp7-pooler.ap-southeast-1.aws.neon.tech/cims?sslmode=require
```

This is configured in: `C:\android\cims_backend\.env`

### 3. **Backend API: FastAPI**
The backend (`C:\android\cims_backend`) provides REST API endpoints:
- **GET /api/schools/** - List all schools
- **POST /api/schools/** - Create school
- **PUT /api/schools/{id}** - Update school
- **DELETE /api/schools/{id}** - Soft delete school
- **POST /api/schools/{id}/restore** - Restore school

### 4. **Web App: React**
The web app (`C:\android\cims_webapp`) consumes the same API:
- Displays schools from database
- Can add/edit/delete schools
- All changes go to the same cloud database
- Syncs with Android app through backend

## Initial Seed Data

### Where It Comes From:

1. **Android App Users** create schools like:
   - Kendriya Vidyalaya
   - Delhi Public School
   - Test School
   - etc.

2. **Sync Process:**
   ```
   Android App (Local Room DB)
        ↓
   Sync Manager
        ↓
   Backend API (POST /api/schools/)
        ↓
   Cloud PostgreSQL (Neon.tech)
        ↓
   Visible to Web App (GET /api/schools/)
   ```

3. **No SQL Seed Files:**
   - No `seed.sql` or initialization scripts
   - No hardcoded seed data in backend
   - All data is user-generated via Android app
   - Schema is managed by Alembic migrations

## Database Schema

Schools table structure (from backend models):
```python
class School(Base):
    __tablename__ = "schools"
    
    id = Column(Integer, primary_key=True)
    school_name = Column(String, nullable=False)
    address = Column(String, nullable=False)
    pincode = Column(String, nullable=False)
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(BigInteger, nullable=True)
    created_at = Column(BigInteger, nullable=False)
    updated_at = Column(BigInteger, nullable=False)
    last_synced_at = Column(BigInteger, nullable=True)
```

## Why No Data Initially?

If you don't see school data in the web app:

1. **Android app hasn't synced yet**
   - No Android app running
   - Sync hasn't been triggered
   - App is in offline mode

2. **Database is empty**
   - Fresh database setup
   - No users have created schools yet
   - Previous data was cleared

3. **Different environment**
   - Using local database instead of Neon
   - Different database URL in .env
   - Testing/development environment

## How to Add Initial Schools

### Option 1: Via Web App (Easiest)
1. Login to web app at `http://localhost:3000`
2. Navigate to Schools page (sidebar)
3. Click "Add School"
4. Fill in:
   - School Name
   - Address
   - Pincode
5. Click "Add"

### Option 2: Via Android App
1. Open Android app
2. Go to Schools section
3. Add new school
4. Sync with backend

### Option 3: Via API (Direct)
```bash
curl -X POST http://localhost:8000/api/schools/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "school_name": "Sample School",
    "address": "123 Main St, City",
    "pincode": "110001"
  }'
```

### Option 4: Create Seed Script (For Development)

Create: `C:\android\cims_webapp\create_sample_schools.sh`

```bash
#!/bin/bash

TOKEN=$(curl -X POST -s http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}' | \
  python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# Create sample schools
SCHOOLS=(
  '{"school_name":"Delhi Public School","address":"Sector 45, Gurgaon, Haryana","pincode":"122003"}'
  '{"school_name":"Kendriya Vidyalaya","address":"Sector 8, R.K. Puram, New Delhi","pincode":"110022"}'
  '{"school_name":"DAV Public School","address":"Pitampura, New Delhi","pincode":"110034"}'
  '{"school_name":"Amity International School","address":"Sector 43, Noida, UP","pincode":"201301"}'
  '{"school_name":"Modern School","address":"Barakhamba Road, New Delhi","pincode":"110001"}'
)

for school in "${SCHOOLS[@]}"; do
  NAME=$(echo $school | python -c "import sys, json; print(json.load(sys.stdin)['school_name'])")
  curl -X POST -s http://localhost:8000/api/schools/ \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$school" > /dev/null
  echo "Created: $NAME"
done

echo "✅ Sample schools created!"
```

Run it:
```bash
chmod +x create_sample_schools.sh
./create_sample_schools.sh
```

## System Integration

### Three-Way Sync:

1. **Android App ↔ Backend**
   - Room database syncs with backend
   - Bi-directional sync
   - Conflict resolution

2. **Web App ↔ Backend**
   - Real-time API calls
   - No local storage
   - Always up-to-date

3. **Backend ↔ Cloud DB**
   - Direct PostgreSQL connection
   - Alembic migrations for schema
   - Persistent storage

## Files Involved

### Backend:
- `app/models.py` - School model definition
- `app/schemas.py` - School request/response schemas
- `app/routers/schools.py` - School CRUD endpoints
- `alembic/versions/...` - Database migrations
- `.env` - Database connection (Neon.tech URL)

### Web App:
- `src/types/index.ts` - School TypeScript interface
- `src/services/schoolService.ts` - API service
- `src/pages/SchoolsPage.tsx` - UI component

### Android App:
- `app/src/main/java/.../entities/School.kt` - Room entity
- `app/src/main/java/.../api/SchoolApi.kt` - Retrofit API
- `app/src/main/java/.../sync/SyncManager.kt` - Sync logic

## Environment Configuration

### Development (.env)
```env
DATABASE_URL=postgresql://cims_user:npg_8F3puoDUrWGf@ep-spring-cloud-a1uaqtp7-pooler.ap-southeast-1.aws.neon.tech/cims?sslmode=require
JWT_SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:3000"]
```

### Production
Same database URL, but with:
- Production CORS origins
- Stronger JWT secret
- SSL enforcement
- Connection pooling

## Data Persistence

- ✅ **Persistent:** Cloud PostgreSQL on Neon.tech
- ✅ **Backed up:** Neon.tech handles backups
- ✅ **Shared:** All three apps use same database
- ✅ **Real-time:** Changes sync across apps
- ⚠️ **Internet required:** Cloud database needs connectivity

## Troubleshooting

### No schools showing in web app?

1. **Check backend is connected to Neon:**
   ```bash
   cd C:\android\cims_backend
   cat .env | grep DATABASE_URL
   ```

2. **Check backend is running:**
   ```bash
   curl http://localhost:8000/health
   ```

3. **Check schools exist in database:**
   ```bash
   curl -H "Authorization: Bearer TOKEN" http://localhost:8000/api/schools/
   ```

4. **Add sample schools:**
   - Use web app "Add School" button
   - Or run seed script above

### Android app not syncing?

1. Check internet connection
2. Check backend URL in app config
3. Trigger manual sync
4. Check sync logs in app

---

**Summary:** School data originates from the **Android mobile app**, is stored in **Neon.tech cloud PostgreSQL**, and is accessible to both **Android app** and **React web app** through the **FastAPI backend**.
