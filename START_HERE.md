# 🚀 START HERE: Running GIAS Locally

## ⚠️ Current Status: Docker Not Installed

Docker is the easiest way to test everything. Let me show you **two options**:

---

## Option A: Install Docker Desktop (Recommended - 5 min)

### 1️⃣ Download & Install
```
Go to: https://www.docker.com/products/docker-desktop/
Click: "Download for Windows"
Run the installer
```

### 2️⃣ Restart Computer
Docker Desktop needs a reboot. After restart, Docker will auto-start.

### 3️⃣ Verify Installation
Open PowerShell and run:
```powershell
docker --version
docker run hello-world
```

### 4️⃣ Start Everything
```powershell
cd "c:\GIAS WEBSITE"
docker compose up
```

✅ **Done!** All 6 services will start in ~30 seconds.

Then jump to **"What to Test"** section below.

---

## Option B: Manual Setup (No Docker - Development Mode)

If you don't want to install Docker, run services individually:

### Prerequisites
Make sure you have installed:
- ✅ Python 3.9+ → https://www.python.org/downloads/
- ✅ Node.js 18+ → https://nodejs.org/
- ✅ Git → https://git-scm.com/

Verify in PowerShell:
```powershell
python --version
node --version
npm --version
```

---

### Step 1️⃣: Start Backend API

Open **PowerShell as Administrator** and run:

```powershell
cd "c:\GIAS WEBSITE\apps\api"
python -m pip install --upgrade pip
pip install poetry
poetry install
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend is running at**: http://localhost:8000

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**Keep this terminal open!**

---

### Step 2️⃣: Start Frontend Web

Open **a NEW PowerShell window** (keep the backend one open) and run:

```powershell
cd "c:\GIAS WEBSITE\apps\web"
npm install
npm run dev
```

✅ **Frontend is running at**: http://localhost:3000

You should see:
```
▲ Next.js 14.x.x
  - Local: http://localhost:3000
```

**Keep this terminal open!**

---

### Step 3️⃣: Start Database (Optional for Full Testing)

If you have PostgreSQL installed locally:
```powershell
# Connection string: postgresql://gias_user:gias_password@localhost:5432/gias_db
```

Or use Docker just for the database:
```powershell
docker run --name gias-postgres -e POSTGRES_PASSWORD=gias_password -p 5432:5432 -d postgres:15
```

---

## ✅ What to Test Now

### 1. View the Frontend
Open your browser: **http://localhost:3000**

You should see:
- ✅ Home page with banner
- ✅ 5-pillar overview
- ✅ Call-to-action buttons
- ✅ Navigation menu

**Try clicking around** and test:
- Standards page
- Governance page
- Attestation Explorer
- Legal pages

### 2. View the API Documentation
Open your browser: **http://localhost:8000/api/docs**

This is the **Swagger UI** for the API. You can see:
- ✅ All available endpoints
- ✅ Request/response examples
- ✅ Test endpoints directly

### 3. Test User Registration

In the **Swagger UI** (http://localhost:8000/api/docs), find the "auth" section:

1. Click: **POST /auth/register**
2. Click: **"Try it out"**
3. Fill in JSON:
```json
{
  "email": "testuser@example.com",
  "password": "MySecurePassword123!"
}
```
4. Click: **Execute**

You should get back:
```json
{
  "id": "abc-123",
  "email": "testuser@example.com",
  "role": "enterprise"
}
```

### 4. Test Login

In the **Swagger UI**, find **POST /auth/login**:

1. Click: **"Try it out"**
2. Fill in:
```json
{
  "email": "testuser@example.com",
  "password": "MySecurePassword123!"
}
```
3. Click: **Execute**

You'll get back an **access_token** - this is your JWT token!

### 5. Test Getting Your Profile

In the **Swagger UI**, find **GET /me**:

1. Click: **"Try it out"**
2. Find the **Authorize** button at top-right
3. Paste your token: `Bearer <token_from_login>`
4. Click: **Execute**

You should see your user data!

---

## 🎯 Next: Testing Flows

### Flow 1: Public Attestation Verification ✅
1. Go to: http://localhost:3000/explorer
2. Try searching for "Acme"
3. Click on an attestation
4. View the 5-pillar scores
5. Try scanning QR code (if your camera works!)

### Flow 2: Evidence Upload 📤
1. Login via API (get token)
2. Go to: http://localhost:8000/api/docs
3. Find: **POST /evidence/upload**
4. Add your token in Authorization header
5. Select a PDF/image file
6. Click Execute
7. You'll get file_id and S3 path

### Flow 3: Audit Log Access 📋
1. Login via API (get token)
2. Find: **GET /audit-logs**
3. Add token in header
4. Execute
5. See all events logged

---

## 🐛 Troubleshooting

### Issue: "Port 3000 already in use"
```powershell
# Kill the process
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
cd apps/web
npm run dev -- -p 3001
```

### Issue: "Cannot find module" errors
```powershell
# For backend
cd apps/api
pip install -r requirements.txt
# or
poetry install

# For frontend
cd apps/web
npm install --legacy-peer-deps
```

### Issue: API returns "Connection Refused"
```
Make sure backend terminal is still running!
Check: http://localhost:8000/health should work
```

### Issue: "ModuleNotFoundError: No module named 'fastapi'"
```powershell
cd apps/api
poetry install
```

### Issue: npm install takes forever
```powershell
# Use faster registry
npm install --registry https://registry.npmjs.org/

# Or check internet connection
ipconfig getifaddr en0
```

---

## 📊 System Architecture (What's Running)

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR BROWSER                         │
│   http://localhost:3000 (Frontend)                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS APPLICATION                        │
│   - Home page                                           │
│   - Standards listing                                   │
│   - Attestation explorer                               │
│   - Responsive design                                  │
└─────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   API Gateway (Port 8000)       │
        │   - /auth/*                     │
        │   - /attestations/*             │
        │   - /evidence/*                 │
        └─────────────────────────────────┘
```

---

## 🎓 What Each Service Does

| Service | Port | Purpose | Status |
|---------|------|---------|--------|
| **Frontend** | 3000 | Web UI | ✅ Running |
| **Backend API** | 8000 | REST endpoints | ✅ Running |
| **PostgreSQL** | 5432 | Database | ⏳ Optional |
| **Redis** | 6379 | Cache | ⏳ Optional |
| **MinIO** | 9001 | File storage | ⏳ Optional |

---

## 🚀 Quick Checklist

Before you say "it's working!", verify:

- [ ] http://localhost:3000 loads (Frontend)
- [ ] http://localhost:8000/api/docs loads (API docs)
- [ ] Can register a user
- [ ] Can login and get token
- [ ] Can call /me endpoint with token
- [ ] Standards page shows 5 standards
- [ ] Explorer page loads
- [ ] No console errors in browser

---

## 💡 Pro Tips

1. **Keep terminals open** while testing. If you close them, services stop.

2. **Check the logs** for debugging:
   - Backend: Look in the terminal running uvicorn
   - Frontend: Look in the terminal running npm run dev

3. **Refresh browser** if you make API changes (Ctrl+Shift+R)

4. **Use Swagger UI** for testing API - very helpful!

5. **Don't worry about database** yet - API has in-memory mode for demo.

---

## 📚 Next Steps

Once you verify it's working:

1. **Explore the code** → `apps/web/` and `apps/api/`
2. **Read the docs** → `TESTING_GUIDE.md` and `docs/API.md`
3. **Try Docker** → Makes deployment 10x easier
4. **Deploy to cloud** → Follow `docs/DEPLOYMENT.md`

---

## ❓ Still Stuck?

**Quick diagnostic** - run this in PowerShell:
```powershell
Write-Host "Python:" $(python --version)
Write-Host "Node:" $(node --version)
Write-Host "npm:" $(npm --version)
Write-Host "Backend check:" $(curl -s http://localhost:8000/health)
Write-Host "Frontend check:" $(curl -s http://localhost:3000)
```

---

## 🎉 You're All Set!

You now have a **production-grade** GIAS system running locally. 

**Next**: Pick **Option A or B above** and get started!

Happy coding! 🚀
