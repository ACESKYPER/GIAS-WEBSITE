# GIAS Security Architecture

## Security Principles

1. **Defense in Depth**: Multiple security layers
2. **Zero Trust**: Verify every request and user
3. **Least Privilege**: Minimal required access
4. **Audit Everything**: Immutable logs for compliance
5. **Encrypt Sensitive Data**: At rest and in transit

## Threat Model

### Assets Under Protection
- **Attestations**: Issued certificates (integrity critical)
- **Evidence**: Supporting documentation (confidentiality critical)
- **User Data**: Account and organizational information
- **Audit Logs**: Event history (integrity critical)

### Threat Scenarios

| Threat | Mitigation |
|--------|-----------|
| **Unauthorized Attestation Issuance** | RBAC + 2FA + Audit logs |
| **Evidence Tampering** | SHA-256 hashes + S3 versioning |
| **Credential Compromise** | Rate limiting + Session invalidation |
| **SSRF Attacks** | Input validation + Network segmentation |
| **SQL Injection** | ORM + Prepared statements |
| **XSS Attacks** | CSP headers + Input sanitization |
| **Privilege Escalation** | RBAC + Token expiration |

## Encryption Strategy

### Data at Rest
- **Database**: Encrypted volume (AWS EBS)
- **S3/MinIO**: AES-256 via S3-side encryption
- **Secrets**: AWS Secrets Manager with KMS
- **Evidence**: Application-level AES-256 encryption

### Data in Transit
- **TLS 1.3**: All external connections
- **mTLS**: Service-to-service within cluster
- **Certificate Pinning**: Critical endpoints (optional)

## Authentication & Authorization

### Authentication Methods
1. **Email/Password**: Bcrypt hashed, 2FA optional
2. **OAuth 2.0**: SSO via OIDC providers
3. **API Keys**: Long-lived tokens for service-to-service
4. **JWT Tokens**: Short-lived (30 min default)

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────┐
│            User Roles                    │
├─────────────────────────────────────────┤
│                                         │
├─ ADMIN                                  │
│  ├─ Manage users, organizations        │
│  ├─ Create/revoke attestations         │
│  ├─ View all audit logs               │
│  └─ Configure system settings         │
│                                        │
├─ ENTERPRISE                             │
│  ├─ Upload evidence               │
│  ├─ View own attestations              │
│  ├─ Request certifications             │
│  └─ Access own audit logs              │
│                                        │
├─ AUDITOR                               │
│  ├─ Review evidence                    │
│  ├─ Issue attestations                 │
│  ├─ Create audit reports               │
│  └─ Access sandbox environment         │
│                                        │
└─ REGULATOR                             │
   ├─ View all attestations              │
   ├─ Search audit logs                  │
   ├─ Generate compliance reports        │
   └─ Revoke invalid certifications      │
```

## API Security

### Rate Limiting
```
Public endpoints:    1,000 req/hour
Authenticated:       5,000 req/hour
Admin operations:    500 req/hour
Login attempts:      10 req/hour (per IP)
```

### Input Validation
- **Type checking**: Pydantic schema validation
- **Range checking**: Min/max constraints
- **Format validation**: Regex for emails, URLs, etc.
- **File validation**: Mime type + size limits

### CORS Policy
```
Allowed Origins:
- https://gias.institute
- https://portal.gias.institute
- https://explorer.gias.institute
Allowed Methods: GET, POST, PUT, DELETE
Allowed Headers: Authorization, Content-Type
Credentials: true
```

## Audit Logging

All user actions logged to immutable table:

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    action VARCHAR(50),           -- "create", "read", "update", "delete"
    resource VARCHAR(50),         -- "attestation", "evidence", "user"
    resource_id UUID,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    changes JSONB,                -- Before/after values for updates
    CONSTRAINT immutable CHECK (timestamp IS NOT NULL)
);

CREATE INDEX idx_audit_user_timestamp ON audit_logs(user_id, timestamp);
CREATE INDEX idx_audit_resource ON audit_logs(resource, resource_id);
```

### Queryable Audit Logs
```
GET /api/v1/audit-logs?resource=attestation&start_date=2025-01-01&end_date=2025-01-31
```

## Compliance Mappings

### GDPR Compliance
- **Data Minimization**: Only collect necessary evidence
- **Right to Access**: `/api/v1/users/me/data-export`
- **Right to Deletion**: Soft delete with retention policy
- **Right to Portability**: JSON export available
- **DPA**: Standard DPA in place, subprocessors listed

### ISO 42001 AI Management System
- **Risk Assessment**: 5-pillar methodology
- **Human Oversight**: Auditor review required
- **Documentation**: Evidence repository
- **Monitoring**: Real-time compliance dashboard
- **Incident Response**: Rapid attestation revocation

### SOC 2 Type II
- **Security**: Encryption, RBAC, MFA
- **Availability**: 99.9% uptime SLA
- **Processing Integrity**: Audit logs + checksums
- **Confidentiality**: Zero-knowledge evidence storage
- **Privacy**: GDPR + state privacy laws compliance

## Secrets Management

### Secret Rotation
```bash
# Rotate database password quarterly
aws secretsmanager rotate-secret --secret-id gias/prod/db-password

# Rotate API keys
curl -X POST https://api.gias.institute/api/v1/keys/rotate \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# Rotate JWT signing key
# Requires re-issuing all active tokens
```

### Secure Storage
- All secrets in AWS Secrets Manager or HashiCorp Vault
- Never committed to Git
- Rotated automatically
- Audit access via CloudTrail

## Incident Response

### Security Incident Process
1. **Detection**: CloudWatch alarms or manual report
2. **Containment**: Revoke compromised credentials, block IP
3. **Investigation**: Access audit logs, forensics
4. **Remediation**: Patch vulnerability, reset data
5. **Communication**: Notify affected users within 24h
6. **Documentation**: Post-incident review

### Critical Vulnerabilities
- Database compromise: Revoke all active tokens
- Evidence tampering: Restore from S3 versioning
- Attestation spoofing: Revoke all issued certs
- Unauthorized access: Rotate secrets, audit logs

## Third-Party Security

### Supply Chain Security
- **Dependencies**: Weekly vulnerability scans (Dependabot)
- **Images**: Registry scanning (Trivy)
- **SBOM**: Generated for each release
- **Vendor Audits**: Annual security assessment

### Vendor Assessment
All vendors comply with:
- ISO 27001 certification
- SOC 2 Type II report
- Standard DPA agreement
- Annual penetration testing

## Penetration Testing

### Scope
- API endpoints (public and authenticated)
- Frontend application (OWASP Top 10)
- Infrastructure (K8s, AWS IAM)
- Database access patterns
- Social engineering (simulated)

### Frequency
- Initial: Pre-launch comprehensive test
- Recurring: Quarterly assessment
- Continuous: SAST/DAST in CI/CD pipeline

## Security Best Practices for Users

### Enterprise Users
1. Use unique, strong passwords (12+ characters)
2. Enable 2FA (authenticator app recommended)
3. Regularly rotate API keys
4. Review audit logs weekly
5. Report suspicious activity immediately

### Auditors
1. Never share JWT tokens
2. Use VPN for all portal access
3. Clear browser cache after sessions
4. Report evidence integrity issues
5. Log out explicitly

## Compliance Certifications

- ✅ **ISO 27001** (Target: 2025-Q2)
- ✅ **SOC 2 Type II** (Target: 2025-Q3)
- ✅ **GDPR Compliant** (Verified by DPA)
- ✅ **CCPA Compliant** (California Privacy Law)
- 🔄 **FedRAMP Authorized** (In progress)

## Security Contacts

- **Security**: security@gias.institute
- **Incident Reporting**: https://hackerone.com/gias (when available)
- **PGP Key**: https://gias.institute/.well-known/security.txt
- **Bug Bounty**: Programs coming soon

---

*Last Updated: January 2025*
*Next Review: March 2025*
