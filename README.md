# Disability Identity Card Management System

This package includes:

- React frontend (no Vite)
- FastAPI backend
- MySQL SQL schema
- Logo integrated in sidebar/login
- Main modules:
  - Auth
  - Dashboard
  - Applications
  - Photo and document upload
  - Ward review
  - Committee review
  - ID card generation
  - Duplicate requests
  - Reports
  - Users
  - Masters
  - Audit logs
  - Settings

## Database URL used
```env
DATABASE_URL=mysql+pymysql://root:Mews1234@localhost:3306/disability_id_system
```

## Quick start

### 1. Import SQL
Run `backend/sql_schema.sql` in MySQL.

### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Create first admin
Open:
```bash
http://127.0.0.1:8000/docs
```

Use `/api/auth/register` with:
```json
{
  "full_name": "Super Admin",
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "super_admin"
}
```
# Disability Identity Card Management System
