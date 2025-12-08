'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { RoleGate } from '@/lib/hooks/withProtectedRoute'
import { EvidenceUpload } from '@/components/EvidenceUpload'
import Link from 'next/link'

export default function EvidencePage() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Upload Evidence</h1>
          <p className="mt-2 text-gray-600">
            Submit your model's evidence bundle for validation and certification
          </p>
        </div>

        {/* Role Gate */}
        <RoleGate
          requiredRoles={['Enterprise', 'Admin']}
          fallback={
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-6 text-center">
              <p className="text-yellow-800">
                Only Enterprise and Admin users can upload evidence. Please contact support to upgrade your account.
              </p>
            </div>
          }
        >
          {/* Instructions */}
          <div className="mb-8 rounded-lg bg-blue-50 border border-blue-200 p-6">
            <h2 className="font-semibold text-blue-900 mb-3">Evidence Bundle Requirements</h2>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span><strong>Model Information:</strong> Name and version</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span><strong>Data Governance:</strong> Data sources, lineage, consent, retention</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span><strong>Explainability:</strong> Feature importance, model cards, interpretability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span><strong>Robustness:</strong> Adversarial testing, bias audits, minority group performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span><strong>Operational:</strong> Monitoring, incident response, degradation thresholds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span><strong>Alignment:</strong> Privacy controls, fairness commitments, human oversight</span>
              </li>
            </ul>
          </div>

          {/* Upload Component */}
          <div className="rounded-lg bg-white shadow p-8">
            <EvidenceUpload />
          </div>

          {/* Sample JSON */}
          <div className="mt-12 rounded-lg bg-gray-100 border border-gray-300 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Sample Evidence Bundle</h3>
            <pre className="text-xs text-gray-700 overflow-x-auto bg-white p-4 rounded border border-gray-300">
{`{
  "model_name": "Fraud Detection Model",
  "model_version": "1.2.0",
  "data_governance": {
    "data_sources": ["Customer transactions", "Historical fraud labels"],
    "data_lineage_documented": true,
    "consent_obtained": true,
    "retention_policy_days": 2555
  },
  "explainability": {
    "feature_importance_available": true,
    "model_cards_documented": true,
    "interpretability_methods": ["SHAP", "LIME"]
  },
  "robustness": {
    "adversarial_testing_performed": true,
    "bias_audit_score": 92,
    "performance_on_minority_groups": 88
  },
  "operational": {
    "monitoring_enabled": true,
    "incident_response_plan": true,
    "model_degradation_threshold": 0.05
  },
  "alignment": {
    "privacy_controls": true,
    "fairness_commitments": true,
    "human_oversight": true
  }
}`}
            </pre>
          </div>
        </RoleGate>
      </div>
    </div>
  )
}
