# Backend Setup

## 1. Create database
Run `sql_schema.sql` in MySQL.

## 2. Create venv
```bash
python -m venv venv
```

## 3. Activate
mac/linux:
```bash
source venv/bin/activate
```

windows:
```bash
venv\Scripts\activate
```

## 4. Install packages
```bash
pip install -r requirements.txt
```

## 5. Run
```bash
uvicorn app.main:app --reload
```

## 6. Swagger
Open:
```bash
http://127.0.0.1:8000/docs
```

## 7. Create first admin
Use `/api/auth/register`:
```json
{
  "full_name": "Super Admin",
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "super_admin"
}
```
