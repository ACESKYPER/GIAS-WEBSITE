/**
 * API client utilities for GIAS backend communication
 */

import { useAuth } from '@/lib/hooks/useAuth'
import type { EvidenceBundle, ValidationResult, CertificationScore, Attestation, AttestationVerification } from '@/types/certification'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

/**
 * Make authenticated API request with JWT token
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Merge additional headers if provided
  if (options.headers && typeof options.headers === 'object') {
    Object.assign(headers, options.headers)
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `API error: ${response.statusText}`)
  }

  return response.json()
}

/**
 * Validate evidence bundle against GIAS-MIF schema
 */
export async function validateEvidence(
  evidence: EvidenceBundle,
  token: string
): Promise<ValidationResult> {
  return apiRequest<ValidationResult>(
    '/api/validate',
    {
      method: 'POST',
      body: JSON.stringify(evidence),
    },
    token
  )
}

/**
 * Get certification scores for validated evidence
 */
export async function getCertificationScores(
  evidence: EvidenceBundle,
  validationResult: ValidationResult,
  token: string
): Promise<CertificationScore> {
  return apiRequest<CertificationScore>(
    '/api/certification/score',
    {
      method: 'POST',
      body: JSON.stringify({
        evidence,
        validation_result: validationResult,
      }),
    },
    token
  )
}

/**
 * Generate and issue attestation for certified model
 */
export async function issueAttestation(
  evidence: EvidenceBundle,
  scores: CertificationScore,
  organizationId: string,
  token: string
): Promise<Attestation> {
  return apiRequest<Attestation>(
    '/api/attestation/issue',
    {
      method: 'POST',
      body: JSON.stringify({
        evidence,
        scores,
        organization_id: organizationId,
      }),
    },
    token
  )
}

/**
 * Verify attestation by ID or hash
 */
export async function verifyAttestation(
  attestationId: string
): Promise<AttestationVerification> {
  return apiRequest<AttestationVerification>(
    `/api/verify/${attestationId}`,
    { method: 'GET' }
  )
}

/**
 * Get user's attestations
 */
export async function getAttestations(token: string): Promise<Attestation[]> {
  return apiRequest<Attestation[]>(
    '/api/attestation/my',
    { method: 'GET' },
    token
  )
}

/**
 * Hook for API calls with automatic token injection
 */
export function useGiasApi() {
  const { token } = useAuth()

  return {
    validateEvidence: (evidence: EvidenceBundle) =>
      validateEvidence(evidence, token || ''),
    getCertificationScores: (evidence: EvidenceBundle, validationResult: ValidationResult) =>
      getCertificationScores(evidence, validationResult, token || ''),
    issueAttestation: (evidence: EvidenceBundle, scores: CertificationScore, orgId: string) =>
      issueAttestation(evidence, scores, orgId, token || ''),
    verifyAttestation,
    getAttestations: () => getAttestations(token || ''),
  }
}
