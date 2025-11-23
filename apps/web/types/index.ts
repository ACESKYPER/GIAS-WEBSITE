// Authentication types
export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'enterprise' | 'auditor' | 'regulator'
  organizationId: string
  createdAt: Date
  lastLogin: Date
}

export interface Session {
  user: User
  token: string
  expiresAt: Date
}

// Certification types
export interface Attestation {
  id: string
  entityId: string
  entityName: string
  standardId: string
  standardVersion: string
  issuedDate: Date
  expiryDate: Date
  score: number
  pillars: {
    alignment: number
    robustness: number
    dataGovernance: number
    explainability: number
    operationalRisk: number
  }
  status: 'active' | 'expired' | 'revoked'
  jsonUrl: string
  pdfUrl: string
  qrCode: string
}

export interface Evidence {
  id: string
  attestationId: string
  type: string
  filename: string
  mimeType: string
  size: number
  hash: string
  encrypted: boolean
  uploadedAt: Date
}

// Standard types
export interface Standard {
  id: string
  name: string
  version: string
  description: string
  pillars: string[]
  releaseDate: Date
  status: 'draft' | 'proposed' | 'active' | 'deprecated'
}

// Audit log types
export interface AuditLog {
  id: string
  userId: string
  action: string
  resource: string
  resourceId: string
  timestamp: Date
  ipAddress: string
  userAgent: string
  changes?: Record<string, any>
}
