# GIAS API Documentation

## Overview

The GIAS API provides programmatic access to AI certification, attestation verification, and evidence management. All endpoints follow REST conventions with JSON payloads.

**Base URL:** `https://api.gias.institute`

**API Version:** v1

## Authentication

### OAuth 2.0
GIAS uses OAuth 2.0 Bearer tokens for authenticated endpoints.

```bash
# Get access token
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "your_password"
}

# Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}

# Use token in requests
Authorization: Bearer {access_token}
```

### Rate Limits
- **Public endpoints**: 1000 req/hour
- **Authenticated endpoints**: 5000 req/hour
- **Rate limit headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## Endpoints

### Public Endpoints (No Auth Required)

#### Verify Attestation
```
GET /api/v1/attestations/public/verify/{attestation_id}
```

**Response:**
```json
{
  "id": "GIAS-2025-001234",
  "entity_name": "Acme AI Labs",
  "standard": "MIF v1.0",
  "issued_date": "2025-01-15T00:00:00Z",
  "expiry_date": "2026-01-15T00:00:00Z",
  "scores": {
    "alignment": 8.5,
    "robustness": 9.0,
    "data_governance": 8.2,
    "explainability": 7.8,
    "operational_risk": 8.9
  },
  "overall_score": 8.5,
  "status": "active",
  "qr_code_url": "https://..."
}
```

#### Get Attestation JSON
```
GET /api/v1/attestations/{attestation_id}/json
```

#### Get Attestation PDF
```
GET /api/v1/attestations/{attestation_id}/pdf
```

### Authenticated Endpoints

#### Login
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "password"
}
```

#### Register
```
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@company.com",
  "name": "Company Name",
  "password": "secure_password",
  "role": "enterprise"
}
```

#### Get Current User
```
GET /api/v1/auth/me
Authorization: Bearer {token}
```

#### Upload Evidence
```
POST /api/v1/evidence/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Parameters:
- attestation_id: string (required)
- file: file (required)

Response:
{
  "id": "evidence-uuid",
  "filename": "security_audit.pdf",
  "hash": "sha256_hash",
  "uploaded_at": "2025-01-20T10:30:00Z"
}
```

#### Get Evidence Metadata
```
GET /api/v1/evidence/{evidence_id}
Authorization: Bearer {token}

Response:
{
  "id": "evidence-uuid",
  "attestation_id": "GIAS-2025-001234",
  "filename": "security_audit.pdf",
  "hash": "sha256_hash",
  "uploaded_at": "2025-01-20T10:30:00Z"
}
```

## Error Handling

All errors follow a standard format:

```json
{
  "detail": "Error message",
  "status": 400,
  "error_code": "INVALID_REQUEST"
}
```

### Common Status Codes
- `200 OK` - Request succeeded
- `400 Bad Request` - Invalid parameters
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Webhooks

Subscribe to events via `POST /api/v1/webhooks/subscribe`

### Supported Events
- `attestation.issued`
- `attestation.revoked`
- `attestation.expired`
- `evidence.uploaded`
- `certification.completed`

**Webhook Payload:**
```json
{
  "event": "attestation.issued",
  "timestamp": "2025-01-20T10:30:00Z",
  "data": {
    "attestation_id": "GIAS-2025-001234",
    "entity_name": "Acme AI Labs",
    "score": 8.5
  }
}
```

## SDKs

Official SDKs available for:
- Python: `pip install gias-sdk`
- JavaScript/TypeScript: `npm install @gias/sdk`
- Go: `go get github.com/gias/sdk-go`

**Python Example:**
```python
from gias import GiasClient

client = GiasClient(token="your_token")

# Verify attestation
attestation = client.attestations.verify("GIAS-2025-001234")
print(attestation.overall_score)

# Upload evidence
evidence = client.evidence.upload(
    attestation_id="GIAS-2025-001234",
    file_path="./audit_report.pdf"
)
```

## Best Practices

1. **Secure Tokens**: Never commit tokens. Use environment variables.
2. **Retry Logic**: Implement exponential backoff for failed requests.
3. **Webhook Validation**: Verify webhook signatures using provided secret.
4. **Pagination**: Use `limit` and `offset` for large result sets.
5. **Caching**: Cache public attestations locally for offline verification.

## Support

- API Issues: api@gias.institute
- Security: security@gias.institute
- Docs: https://docs.gias.institute
