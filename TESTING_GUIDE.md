# 🧪 GIAS Testing Guide - Local Development

## Quick Start (5 Minutes)

### Option 1: Docker Compose (Recommended - Easiest)
```powershell
cd "c:\GIAS WEBSITE"
docker-compose up
```

This starts **ALL** services:
- ✅ PostgreSQL (localhost:5432)
- ✅ MinIO/S3 (localhost:9001)
- ✅ Redis (localhost:6379)
- ✅ Backend API (localhost:8000)
- ✅ Frontend Web (localhost:3000)

**Wait 30 seconds for everything to boot**, then access:
- 🌐 Frontend: http://localhost:3000
- 📚 API Docs: http://localhost:8000/api/docs
- 💾 MinIO Console: http://localhost:9001 (admin/minioadmin)

---

### Option 2: Manual Setup (For Development)

#### Step 1: Start the Database & Services
```powershell
cd "c:\GIAS WEBSITE"
docker-compose up postgres redis minio
```

#### Step 2: Start the Backend (in a new terminal)
```powershell
cd "c:\GIAS WEBSITE\apps\api"
python -m pip install -q poetry
poetry install
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Step 3: Start the Frontend (in another new terminal)
```powershell
cd "c:\GIAS WEBSITE\apps\web"
npm install
npm run dev
```

---

## 🌐 What You Can Do Once Running

### 1. View the Public Website
Go to: **http://localhost:3000**

You'll see:
- ✅ Home page with 5-pillar overview
- ✅ Governance page
- ✅ Attestation Explorer
- ✅ Legal pages

### 2. Test the Public API
Go to: **http://localhost:8000/api/docs**

Try these endpoints:
```bash
# 1. Register a user
POST /auth/register
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

# 2. Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
# Response includes JWT token

# 3. Get current user
GET /me
# Add header: Authorization: Bearer <token_from_login>

# 4. Verify attestation (public, no auth needed)
GET /public/verify/GIAS-2025-001234

# 5. Upload evidence
POST /evidence/upload
# Requires: multipart/form-data with file + token
```

### 3. Access MinIO Console
Go to: **http://localhost:9001**

Login with:
- Username: `minioadmin`
- Password: `minioadmin`

You'll see S3 buckets for evidence storage.

---

## 🧪 Testing Workflows

### Workflow 1: Public Attestation Verification
```
1. Go to http://localhost:3000/explorer
2. Try searching for attestations
3. Try scanning a QR code (feature ready)
4. View attestation details
```

### Workflow 2: User Registration & Login
```
1. Go to http://localhost:8000/api/docs
2. Expand "auth" section
3. Click "POST /auth/register"
4. Enter test email: test@gias.local
5. Enter password: TestPass123!
6. Click "Execute"
7. Copy the access_token from response
8. Try "GET /me" with the token in Authorization header
```

### Workflow 3: Evidence Upload
```
1. Login (get token)
2. Go to http://localhost:8000/api/docs
3. Expand "evidence" section
4. Click "POST /evidence/upload"
5. Paste your token in Authorization header
6. Select a file to upload
7. Click "Execute"
8. You'll get file_id and S3 path
```

---

## 🐛 Troubleshooting

### Issue: "Port already in use"
```powershell
# Find what's using the port (example: 3000)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F

# Or use different port for frontend
cd apps/web
npm run dev -- -p 3001
```

### Issue: Docker containers won't start
```powershell
# Check Docker daemon
docker ps

# If Docker not running, start it:
# - Windows: Open "Docker Desktop" app

# Clean up and restart
docker-compose down
docker-compose up --build
```

### Issue: "Cannot find module 'next'"
```powershell
cd apps/web
npm install
npm run dev
```

### Issue: "ModuleNotFoundError" in backend
```powershell
cd apps/api
poetry install
poetry run uvicorn main:app --reload
```

### Issue: "Connection refused" on API
```powershell
# Make sure backend is running
# Check: http://localhost:8000/health should return 200

# If stuck, restart:
# 1. Stop backend (Ctrl+C)
# 2. Stop frontend (Ctrl+C)
# 3. docker-compose down
# 4. docker-compose up (fresh start)
```

---

## 📊 Test Data

The system includes pre-configured test data:

### Sample Users
```
Email: admin@gias.local
Password: AdminPass123!
Role: admin

Email: enterprise@gias.local
Password: EnterprisePass123!
Role: enterprise

Email: auditor@gias.local
Password: AuditorPass123!
Role: auditor
```

### Sample Attestations
- GIAS-2025-001234 (Acme AI Labs)
- GIAS-2025-001235 (TechCorp)
- GIAS-2025-001236 (DataFlow Inc)

---

## ✅ Validation Checklist

Run through this checklist to verify everything works:

- [ ] Frontend loads at http://localhost:3000
- [ ] All pages are responsive
- [ ] API docs at http://localhost:8000/api/docs
- [ ] Can register a user
- [ ] Can login and get token
- [ ] Can verify public attestations
- [ ] Can upload evidence
- [ ] MinIO console accessible
- [ ] All 6 containers running: `docker ps`

---

## 🚀 Common Testing Commands

### Check All Services
```powershell
docker ps
# Should show 6 running containers
```

### View Logs
```powershell
# All logs
docker-compose logs -f

# Backend only
docker-compose logs -f api

# Frontend only
docker-compose logs -f web

# Database only
docker-compose logs -f postgres
```

### Restart a Service
```powershell
docker-compose restart api
docker-compose restart web
```

### Full Reset
```powershell
docker-compose down
docker-compose up --build
```

### Access Database Directly
```powershell
# Using psql (if installed)
psql -h localhost -U gias_user -d gias_db
# Password: gias_password

# Or through Docker
docker exec -it <postgres_container_id> psql -U gias_user -d gias_db
```

---

## 📱 Testing on Mobile/Other Machines

### On Same Network
```
Frontend: http://<your-machine-ip>:3000
API: http://<your-machine-ip>:8000
```

Find your IP:
```powershell
ipconfig
# Look for "IPv4 Address"
```

### Using ngrok (Public Testing)
```powershell
# Install ngrok
choco install ngrok

# Expose backend
ngrok http 8000

# Expose frontend
ngrok http 3000

# Share URLs with team
```

---

## 📚 Next Steps

1. **Explore the API** → http://localhost:8000/api/docs
2. **Test a flow** → User registration → Login → Upload evidence
3. **Check the code** → `apps/web/` and `apps/api/`
4. **Read docs** → `docs/ARCHITECTURE.md` and `docs/API.md`
5. **Deploy** → Follow `docs/DEPLOYMENT.md`

---

## 💡 Pro Tips

- **Hot Reload**: Frontend and backend both support hot reload. Edit files and see changes instantly.
- **API Testing**: Use Swagger UI at http://localhost:8000/api/docs for interactive testing.
- **Database Queries**: Connect your IDE to PostgreSQL on localhost:5432 for direct queries.
- **File Upload**: Test with any file type; evidence is validated and stored in MinIO.
- **Rate Limiting**: Backend includes rate limiting; test by making 100+ requests quickly.

---

**Happy Testing! 🎉**

Need help? Check the docs or raise an issue.
