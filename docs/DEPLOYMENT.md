# GIAS Deployment Guide

## Prerequisites

- AWS Account with appropriate permissions
- kubectl configured
- Terraform >= 1.0
- Docker & Docker Compose (for local development)

## Local Development

### Option 1: Docker Compose (Recommended)

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs
- MinIO Console: http://localhost:9001
- PostgreSQL: localhost:5432

### Option 2: Manual Setup

**Backend:**
```bash
cd apps/api
pip install poetry
poetry install
export DATABASE_URL="postgresql://user:pass@localhost:5432/gias_db"
poetry run uvicorn main:app --reload
```

**Frontend:**
```bash
cd apps/web
npm install
npm run dev
```

## Kubernetes Deployment

### 1. Prepare Infrastructure

```bash
cd infrastructure/terraform

# Create terraform.tfvars
cat > prod.tfvars <<EOF
environment = "prod"
aws_region = "us-east-1"
subnet_ids = ["subnet-xxx", "subnet-yyy", "subnet-zzz"]
EOF

# Initialize and deploy
terraform init
terraform plan -var-file="prod.tfvars"
terraform apply -var-file="prod.tfvars"
```

### 2. Deploy Applications

```bash
# Get kubeconfig
aws eks update-kubeconfig --region us-east-1 --name gias-prod

# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/gias-deployment.yaml

# Verify deployment
kubectl get pods -n gias
kubectl get svc -n gias
```

### 3. Set up Ingress

Configure DNS records:
- `gias.institute` → ALB IP
- `api.gias.institute` → ALB IP
- `portal.gias.institute` → ALB IP
- `explorer.gias.institute` → ALB IP

### 4. Configure SSL/TLS

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: cert@gias.institute
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

## Environment Configuration

### Production Environment Variables

Create `.env.prod`:
```bash
# API
DEBUG=false
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://admin:password@gias-db.xxx.rds.amazonaws.com:5432/gias_db

# S3/MinIO
S3_ENDPOINT=https://s3.amazonaws.com
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=gias-evidence-prod

# Encryption
ENCRYPTION_KEY=your-32-char-encryption-key

# CORS
ALLOWED_ORIGINS=https://gias.institute,https://portal.gias.institute

# Frontend
NEXT_PUBLIC_API_URL=https://api.gias.institute
NEXT_PUBLIC_PORTAL_URL=https://portal.gias.institute
NEXTAUTH_SECRET=your-nextauth-secret
```

## Database Migrations

```bash
cd apps/api

# Create migration
poetry run alembic revision --autogenerate -m "Add new table"

# Apply migration
poetry run alembic upgrade head

# Rollback
poetry run alembic downgrade -1
```

## Monitoring & Logging

### CloudWatch
```bash
# View logs
aws logs tail /aws/eks/gias-api-prod --follow
aws logs tail /aws/eks/gias-web-prod --follow
```

### Application Metrics
```bash
# Port-forward Prometheus
kubectl port-forward -n gias svc/prometheus 9090:9090

# Access at http://localhost:9090
```

## Backup & Disaster Recovery

### Database Backups
```bash
# RDS automatic backups (daily, 30-day retention)
aws rds describe-db-instances --db-instance-identifier gias-db-prod

# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier gias-db-prod \
  --db-snapshot-identifier gias-db-prod-manual-$(date +%Y%m%d)
```

### Evidence Storage
```bash
# S3 versioning enabled (in Terraform)
# Cross-region replication recommended for critical buckets
```

### Restore Database
```bash
# Restore from snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier gias-db-restored \
  --db-snapshot-identifier gias-db-prod-manual-20250120
```

## Scaling

### Horizontal Scaling (Kubernetes)
```bash
# Scale API deployment
kubectl scale deployment gias-api --replicas=5 -n gias

# Scale Web deployment
kubectl scale deployment gias-web --replicas=3 -n gias

# Auto-scaling via HPA
kubectl apply -f - <<EOF
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: gias-api-hpa
  namespace: gias
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: gias-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
EOF
```

### Database Scaling
```bash
# Modify RDS instance class
aws rds modify-db-instance \
  --db-instance-identifier gias-db-prod \
  --db-instance-class db.t3.large \
  --apply-immediately
```

## Troubleshooting

### Pod CrashLoopBackOff
```bash
# Check logs
kubectl logs gias-api-xxxxx -n gias

# Describe pod
kubectl describe pod gias-api-xxxxx -n gias

# Check events
kubectl get events -n gias --sort-by='.lastTimestamp'
```

### Database Connection Issues
```bash
# Test connection from pod
kubectl exec -it gias-api-xxxxx -n gias -- \
  psql postgresql://user:pass@postgres:5432/gias_db

# Check RDS security group
aws ec2 describe-security-groups --group-ids sg-xxxxx
```

### API Performance
```bash
# Check resource usage
kubectl top nodes -n gias
kubectl top pods -n gias

# Enable debug logging
kubectl set env deployment/gias-api DEBUG=true -n gias
```

## CI/CD Pipeline

Deployments are automatic via GitHub Actions:

1. **On push to `develop`**: Deploy to staging
2. **On push to `main`**: Deploy to production

See `.github/workflows/deploy.yml` for pipeline configuration.

Manual deployment:
```bash
# Trigger deployment
git push origin main
```

## Rollback

```bash
# View rollout history
kubectl rollout history deployment/gias-api -n gias

# Rollback to previous version
kubectl rollout undo deployment/gias-api -n gias

# Rollback to specific revision
kubectl rollout undo deployment/gias-api -n gias --to-revision=5
```

## Support

- Deployment Issues: ops@gias.institute
- Database Issues: dba@gias.institute
- Security: security@gias.institute
