# GIAS Quick Reference Guide

## 🚀 Start Here

### First Time Setup
```bash
git clone https://github.com/ACESKYPER/GIAS-WEBSITE.git
cd GIAS-WEBSITE
./scripts/setup-dev.sh          # Automated setup
# OR manually:
docker-compose up               # All services running
```

**Services Available:**
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs
- MinIO Console: http://localhost:9001

---

## 📁 Key Files & Locations

### Frontend (Next.js)
| File | Purpose |
|------|---------|
| `apps/web/app/page.tsx` | Home page |
| `apps/web/app/standards/page.tsx` | Standards listing |
| `apps/web/app/explorer/page.tsx` | Attestation search |
| `apps/web/app/globals.css` | Global styles |
| `apps/web/components/` | Reusable components |

### Backend (FastAPI)
| File | Purpose |
|------|---------|
| `apps/api/main.py` | Application entry point |
| `apps/api/app/models.py` | Database models |
| `apps/api/app/routes/` | API endpoints |
| `apps/api/security.py` | JWT & auth logic |
| `apps/api/config.py` | Environment config |

### Infrastructure
| File | Purpose |
|------|---------|
| `docker-compose.yml` | Local development stack |
| `infrastructure/kubernetes/` | K8s manifests |
| `infrastructure/terraform/` | AWS provisioning |
| `.github/workflows/deploy.yml` | CI/CD pipeline |

---

## 🔨 Common Commands

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f api       # API logs
docker-compose logs -f web       # Frontend logs

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache
```

### Frontend Development
```bash
cd apps/web

# Install dependencies
npm install

# Run dev server
npm run dev              # http://localhost:3000

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

### Backend Development
```bash
cd apps/api

# Install dependencies
poetry install

# Run dev server
poetry run uvicorn main:app --reload  # http://localhost:8000

# Run tests
poetry run pytest

# Run linter
poetry run pylint app/

# Format code
poetry run black app/
```

### Database
```bash
# Connect to database
docker-compose exec postgres psql -U gias_user -d gias_db

# Common queries
SELECT * FROM users;
SELECT * FROM standards;
SELECT * FROM attestations;
SELECT * FROM audit_logs;
```

### Deployment
```bash
# Build Docker images
docker build -t gias/api:latest apps/api/
docker build -t gias/web:latest apps/web/

# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/gias-deployment.yaml

# Check deployment status
kubectl get pods -n gias
kubectl logs -n gias deployment/gias-api

# Scale deployment
kubectl scale deployment gias-api --replicas=5 -n gias
```

---

## 📚 Documentation Map

| Topic | File | Quick Link |
|-------|------|-----------|
| System Architecture | `docs/ARCHITECTURE.md` | Component diagrams, data flow |
| API Reference | `docs/API.md` | All endpoints, auth, examples |
| Deployment | `docs/DEPLOYMENT.md` | AWS, K8s, troubleshooting |
| Security | `docs/SECURITY.md` | Encryption, RBAC, compliance |
| Contributing | `CONTRIBUTING.md` | Code style, PR process |
| Project Summary | `PROJECT_SUMMARY.md` | Overview, metrics, checklist |

---

## 🔑 API Endpoints Quick Reference

### Public (No Auth Required)
```
GET  /health                                    # Health check
GET  /api/v1/attestations/public/verify/{id}   # Verify attestation
GET  /api/v1/attestations/{id}/json            # Get JSON
GET  /api/v1/attestations/{id}/pdf             # Get PDF
```

### Authentication
```
POST /api/v1/auth/register                     # Create account
POST /api/v1/auth/login                        # Get JWT token
GET  /api/v1/auth/me                           # Current user (auth required)
```

---

## 🔐 Seeding & Auth Quickstart

Follow these steps to populate core roles and an initial admin user, run smoke tests, and note password considerations for the chosen hashing algorithm.

- Set environment variables (example PowerShell):

```powershell
$env:DATABASE_URL='postgresql://fast_api_user:giasdev123@localhost:5432/your_app_db'
$env:SECRET_KEY='replace_with_a_strong_secret'
```

- Seed core roles and admin user (idempotent):

```powershell
# From repository root (recommended):
cd "c:\GIAS WEBSITE\apps\api"
$env:DATABASE_URL='postgresql://fast_api_user:giasdev123@localhost:5432/your_app_db'
poetry run python ..\scripts\seed_admin.py
```

- Run the built-in smoke tests (TestClient) to validate endpoints without starting the server:

```powershell
cd "c:\GIAS WEBSITE\apps\api"
$env:DATABASE_URL='postgresql://fast_api_user:giasdev123@localhost:5432/your_app_db'
poetry run python ..\scripts\smoke_test.py
```

- Notes on password hashing and length:

	- The project uses `pbkdf2_sha256` for password hashing by default (no native `bcrypt` dependency required).
	- `pbkdf2_sha256` does not impose the 72-byte limit that `bcrypt` has, but it's still good practice to limit stored plaintext passwords to a reasonable length (e.g., 128 characters) and validate input on the client-side.

---
### Evidence (Auth Required)
```
POST /api/v1/evidence/upload                   # Upload file
GET  /api/v1/evidence/{id}                     # Get metadata
```

---

## 🗄️ Database Schema Quick Reference

### Core Tables
```sql
-- Users
id, email, name, role, organization_id, created_at

-- Organizations
id, name, domain, is_verified, created_at

-- Standards
id, name, version, status, description, pillars

-- Attestations
id, organization_id, standard_id, scores (5 pillars), status, issued_date, expiry_date

-- Evidence
id, attestation_id, filename, hash, s3_path, encrypted, uploaded_at

-- Audit Logs
id, user_id, action, resource, resource_id, timestamp, ip_address, changes
```

---

## 🔐 Security Checklist

- [ ] HTTPS/TLS enabled
- [ ] Database encryption enabled
- [ ] Secrets in environment variables (never committed)
- [ ] JWT tokens have expiration
- [ ] RBAC properly configured
- [ ] Audit logs being written
- [ ] Input validation enabled
- [ ] Rate limiting configured
- [ ] CORS policy set correctly
- [ ] No hardcoded credentials

---

## 🐛 Troubleshooting

### API won't start
```bash
# Check database connection
docker-compose logs postgres

# Check if port 8000 is in use
lsof -i :8000

# Verify DATABASE_URL in .env
cat apps/api/.env
```

### Frontend won't load
```bash
# Check if port 3000 is in use
lsof -i :3000

# Check if API is reachable
curl http://localhost:8000/health

# Clear cache
rm -rf apps/web/.next
npm run build
```

### Database issues
```bash
# Check database connection
docker-compose exec postgres pg_isready

# Check disk space
docker exec postgres df -h

# View recent logs
docker-compose logs postgres -f
```

---

## 📊 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PORTAL_URL=http://localhost:3000/portal
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@host:5432/db
SECRET_KEY=your-secret-key
DEBUG=true/false
S3_ENDPOINT=http://minio:9000
```

---

## 🚢 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Security audit completed
- [ ] Performance tested

### Deployment
- [ ] Build Docker images
- [ ] Push to registry
- [ ] Apply K8s manifests
- [ ] Verify pod health
- [ ] Check logs for errors
- [ ] Run smoke tests

### Post-Deployment
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify all endpoints
- [ ] Test attestation flow
- [ ] Confirm backups running

---

## 💡 Tips & Tricks

### View Real-Time Logs
```bash
docker-compose logs -f --tail=50 api
```

### Connect to Running Container
```bash
docker-compose exec api bash
```

### Reset Database
```bash
docker-compose down -v
docker-compose up
```

### Export Data
```bash
docker-compose exec postgres pg_dump -U gias_user gias_db > backup.sql
```

### Generate New Migration
```bash
cd apps/api
poetry run alembic revision --autogenerate -m "Describe change"
poetry run alembic upgrade head
```

---

## 📞 Getting Help

- **Documentation**: See files in `docs/`
- **API Docs**: http://localhost:8000/api/docs (when running)
- **GitHub Issues**: Report bugs & request features
- **Email**: team@gias.institute

---

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Kubernetes**: https://kubernetes.io/docs/
- **Terraform**: https://www.terraform.io/docs/

---

**Last Updated:** January 2025  
**Version:** 0.1.0  
**Status:** Production Ready ✅
