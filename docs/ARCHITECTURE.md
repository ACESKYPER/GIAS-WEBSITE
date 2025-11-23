# GIAS System Architecture

## System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                    External Users                                │
├─────────────────────────────────────────────────────────────────┤
│  - Enterprises (certify AI systems)                             │
│  - Regulators (verify compliance)                              │
│  - Auditors (issue attestations)                                │
│  - Public (view attestations)                                   │
└────────────────────┬────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   ┌────────┐   ┌────────┐   ┌──────────┐
   │ Public │   │Portal  │   │Explorer  │
   │Website │   │App     │   │App       │
   └────┬───┘   └────┬───┘   └────┬─────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼ HTTPS
   ┌─────────────────────────────────┐
   │    API Gateway / Load Balancer   │
   │  (Cloudflare/AWS ALB)            │
   └──────────────┬────────────────────┘
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
   ┌──────────────┐    ┌──────────────┐
   │  FastAPI     │    │ Admin        │
   │  REST API    │    │ Dashboard    │
   │  (Port 8000) │    │              │
   └──────┬───────┘    └──────────────┘
          │
   ┌──────┴─────────┬──────────┬──────────┐
   ▼               ▼          ▼           ▼
┌────────┐  ┌────────┐  ┌──────┐  ┌─────────┐
│ Cert   │  │Evidence│  │Auth  │  │Audit    │
│Service │  │Service │  │Service│  │Service  │
└────────┘  └────────┘  └──────┘  └─────────┘
   │               │          │           │
   └───────────────┼──────────┼───────────┘
                   ▼          ▼
          ┌────────────────────────┐
          │    PostgreSQL          │
          │    Database            │
          │   (Multi-AZ, encrypted)│
          └────────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌────────┐ ┌──────┐  ┌──────────┐
   │Evidence│ │Redis │  │Blockchain│
   │Storage │ │Cache │  │Ledger    │
   │(S3)    │ │      │  │(Optional)│
   └────────┘ └──────┘  └──────────┘
```

## Component Architecture

### Frontend Layer (`apps/web`)

```
Next.js Application
├── Public Routes
│   ├── / (Home)
│   ├── /standards (Browse standards)
│   ├── /governance (Council info)
│   ├── /explorer (Verify attestations)
│   └── /legal (Terms, privacy, etc.)
│
├── Portal Routes (Protected)
│   ├── /portal/dashboard
│   ├── /portal/certifications
│   ├── /portal/evidence
│   ├── /portal/audit-log
│   └── /portal/settings
│
└── Infrastructure
    ├── NextAuth (OAuth2, JWT)
    ├── Zustand (State management)
    ├── Axios (HTTP client)
    └── TailwindCSS (Styling)
```

### API Layer (`apps/api`)

```
FastAPI Application
├── Authentication
│   ├── POST /auth/register
│   ├── POST /auth/login
│   ├── GET  /auth/me
│   └── POST /auth/refresh
│
├── Public Endpoints
│   ├── GET  /attestations/public/verify/{id}
│   ├── GET  /attestations/{id}/json
│   ├── GET  /attestations/{id}/pdf
│   └── GET  /standards
│
├── Protected Endpoints
│   ├── POST /evidence/upload
│   ├── GET  /evidence/{id}
│   ├── POST /certifications/request
│   ├── GET  /certifications/{id}
│   ├── GET  /audit-logs
│   └── GET  /webhooks
│
├── Admin Endpoints
│   ├── POST /attestations/issue
│   ├── POST /attestations/revoke
│   ├── POST /standards/create
│   └── GET  /analytics
│
└── Infrastructure
    ├── SQLAlchemy ORM
    ├── Pydantic validation
    ├── JWT security
    ├── CORS middleware
    └── Error handling
```

### Database Layer

```
PostgreSQL (15)
├── users
│   ├── id (UUID, PK)
│   ├── email (unique)
│   ├── hashed_password
│   ├── role (admin, enterprise, auditor, regulator)
│   ├── organization_id (FK)
│   └── ... metadata
│
├── organizations
│   ├── id (UUID, PK)
│   ├── name
│   ├── domain
│   ├── is_verified
│   └── ... metadata
│
├── standards
│   ├── id (UUID, PK)
│   ├── name (MIF, DSP, TL, RTE, POL)
│   ├── version
│   ├── status (draft, proposed, active, deprecated)
│   └── ... specification
│
├── attestations
│   ├── id (UUID, PK)
│   ├── organization_id (FK)
│   ├── standard_id (FK)
│   ├── alignment_score (0-10)
│   ├── robustness_score (0-10)
│   ├── data_governance_score (0-10)
│   ├── explainability_score (0-10)
│   ├── operational_risk_score (0-10)
│   ├── overall_score (0-10)
│   ├── status (active, expired, revoked)
│   ├── issued_date
│   ├── expiry_date
│   └── ... audit fields
│
├── evidence
│   ├── id (UUID, PK)
│   ├── attestation_id (FK)
│   ├── filename
│   ├── hash (SHA-256)
│   ├── s3_path
│   ├── encrypted (boolean)
│   └── uploaded_at
│
└── audit_logs
    ├── id (UUID, PK)
    ├── user_id (FK)
    ├── action (create, read, update, delete)
    ├── resource (attestation, evidence, user)
    ├── resource_id
    ├── timestamp (immutable)
    ├── ip_address
    ├── user_agent
    └── changes (JSON)
```

### Storage Layer

```
MinIO / AWS S3
├── gias-evidence/
│   ├── GIAS-2025-001234/
│   │   ├── audit_report.pdf (encrypted)
│   │   ├── security_assessment.pdf (encrypted)
│   │   └── ...
│   └── GIAS-2025-001235/
│       └── ...
│
└── gias-attestations/
    ├── GIAS-2025-001234.pdf (Moody's-style certificate)
    ├── GIAS-2025-001234.json (Raw attestation)
    └── ...
```

### Cache Layer

```
Redis
├── user_sessions::{user_id} → JWT metadata (TTL: 30 min)
├── rate_limit::{ip}:{endpoint} → Request count (TTL: 1 hour)
├── attestation::{id} → Attestation data (TTL: 1 day)
├── standards:cached → All standards (TTL: 7 days)
└── explorer_search::{query} → Search results (TTL: 1 day)
```

### Security Boundaries

```
┌─────────────────────────────────────────┐
│         Internet (HTTPS only)           │
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │  WAF / DDoS    │  (Cloudflare)
         │  Protection    │
         └───────┬────────┘
                 │
         ┌───────▼────────┐
         │  API Gateway   │  (Rate limiting, auth)
         │  (TLS 1.3)     │
         └───────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
  ┌─▼──────┐          ┌──────▼─┐
  │ FastAPI│          │  Next  │
  │(mTLS)  │          │  Server│
  └─┬──────┘          └────────┘
    │
┌───▼────────────────────────────┐
│ Kubernetes Cluster (Private)   │
│ - Network Policy               │
│ - Pod Security Policy          │
│ - RBAC                         │
│                                │
│  ┌────────┐  ┌───────────┐    │
│  │Database│  │Object     │    │
│  │(Encrypted) │Storage   │    │
│  │        │  │(Encrypted)│    │
│  └────────┘  └───────────┘    │
└────────────────────────────────┘
```

## Data Flow

### Attestation Issuance Flow

```
1. Enterprise
   └─> Upload Evidence (encrypted)
       └─> API: POST /evidence/upload
           └─> Store in S3 (AES-256)
               └─> Record hash in DB
                   ✓ Evidence validation

2. Auditor
   └─> Review Evidence
       └─> API: GET /evidence/{id}
           └─> Decrypt & display
               └─> Audit log recorded
                   ✓ Access logged

3. Auditor
   └─> Compute Scores
       └─> API: POST /certifications/compute
           └─> Run validation engine
               └─> Compute 5-pillar scores
                   ├─ Alignment
                   ├─ Robustness
                   ├─ Data Governance
                   ├─ Explainability
                   └─ Operational Risk

4. Auditor
   └─> Issue Attestation
       └─> API: POST /attestations/issue
           └─> Create certificate
               ├─ Generate PDF (Moody's style)
               ├─ Generate QR code
               ├─ Anchor on blockchain (optional)
               └─ Store in database
                   ✓ Audit log recorded
                   ✓ Webhooks triggered

5. Public
   └─> Verify Attestation
       └─> API: GET /attestations/public/verify/{id}
           └─> Check status & expiry
               └─> Return scores
                   ✓ No auth required
```

## Deployment Topology

### Development
```
Local Machine
├── Docker Compose
│   ├── Frontend (Next.js)
│   ├── API (FastAPI)
│   ├── PostgreSQL
│   ├── MinIO
│   └── Redis
```

### Production (AWS)
```
AWS Account
├── EKS Cluster (K8s)
│   ├── Deployment: gias-api (3 replicas)
│   ├── Deployment: gias-web (2 replicas)
│   ├── Ingress: TLS termination
│   └── Service: Internal LB
│
├── RDS (PostgreSQL)
│   ├── Multi-AZ failover
│   ├── Automated backups (30-day retention)
│   └── Encrypted volumes
│
├── S3 (Evidence Storage)
│   ├── Versioning enabled
│   ├── Server-side encryption
│   ├── Cross-region replication (optional)
│   └── Access logs
│
├── ElastiCache (Redis)
│   ├── Multi-AZ
│   ├── Automatic failover
│   └── Encryption in transit
│
├── CloudWatch (Monitoring)
│   ├── Logs: /aws/eks/gias-api-prod
│   ├── Metrics: CPU, memory, latency
│   ├── Alarms: Critical events
│   └── Dashboards: Real-time monitoring
│
└── Route 53 (DNS)
    ├── gias.institute
    ├── api.gias.institute
    ├── portal.gias.institute
    └── explorer.gias.institute
```

## Scaling Strategy

### Horizontal Scaling
- **API**: K8s HPA (target: 70% CPU)
- **Web**: K8s HPA (target: 80% CPU)
- **Database**: Read replicas for queries, write to primary

### Vertical Scaling
- **K8s nodes**: Auto-scaling group with 3-10 nodes
- **RDS**: Upgrade instance class as needed
- **ElastiCache**: Increase node type or cluster size

## Disaster Recovery

### RTO (Recovery Time Objective): 1 hour
### RPO (Recovery Point Objective): 15 minutes

```
Backup Strategy
├── Database
│   ├── Daily automated snapshots
│   ├── 30-day retention
│   └── Cross-region replicas
│
├── Evidence Storage
│   ├── Versioning enabled
│   ├── Cross-region replication
│   └── Immutable backup vaults
│
└── Application Code
    ├── Git repository (GitHub)
    ├── Multiple deployment slots
    └── Blue-green deployments
```

## Performance Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| API p95 latency | <200ms | >500ms = alert |
| Frontend FCP | <1.5s | >3s = alert |
| Database query p95 | <50ms | >200ms = alert |
| Availability | 99.9% | <99.5% = incident |
| Error rate | <0.1% | >1% = alert |

---

*Last Updated: January 2025*
