/**
 * Evidence validation and certification types
 */

export interface EvidenceBundle {
  model_name: string
  model_version: string
  data_governance?: {
    data_sources: string[]
    data_lineage_documented: boolean
    consent_obtained: boolean
    retention_policy_days: number
  }
  explainability?: {
    feature_importance_available: boolean
    model_cards_documented: boolean
    interpretability_methods: string[]
  }
  robustness?: {
    adversarial_testing_performed: boolean
    bias_audit_score: number // 0-100
    performance_on_minority_groups: number // 0-100
  }
  operational?: {
    monitoring_enabled: boolean
    incident_response_plan: boolean
    model_degradation_threshold: number
  }
  alignment?: {
    privacy_controls: boolean
    fairness_commitments: boolean
    human_oversight: boolean
  }
}

export interface ValidationError {
  field: string
  message: string
  severity: 'error' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
  timestamp: string
}

export interface CertificationScore {
  alignment_score: number // 0-100
  robustness_score: number // 0-100
  data_governance_score: number // 0-100
  explainability_score: number // 0-100
  operational_risk_score: number // 0-100
  overall_score: number // 0-100
  certification_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'failed'
  recommendations: string[]
}

export interface Attestation {
  id: string
  model_name: string
  model_version: string
  organization: string
  issued_date: string
  valid_until: string
  scores: CertificationScore
  validation_results: ValidationResult
  certificate_hash: string
  verification_url: string
}

export interface AttestationVerification {
  id: string
  valid: boolean
  model_name: string
  model_version: string
  organization: string
  issued_date: string
  certification_level: string
  score: number
  verified_timestamp: string
}
