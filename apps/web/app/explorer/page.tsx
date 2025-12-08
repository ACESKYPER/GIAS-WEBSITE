'use client'

import { useState } from 'react'
import { useGiasApi } from '@/lib/api/gias'
import type { AttestationVerification } from '@/types/certification'

export default function ExplorerPage() {
  const [attestationId, setAttestationId] = useState('')
  const [result, setResult] = useState<AttestationVerification | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const api = useGiasApi()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!attestationId.trim()) {
      setError('Please enter an attestation ID')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const verified = await api.verifyAttestation(attestationId)
      setResult(verified)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify attestation')
    } finally {
      setIsLoading(false)
    }
  }

  const getCertificationColor = (level: string) => {
    switch (level) {
      case 'platinum':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900'
      case 'gold':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'silver':
        return 'bg-gray-100 border-gray-300 text-gray-900'
      case 'bronze':
        return 'bg-orange-100 border-orange-300 text-orange-900'
      default:
        return 'bg-red-100 border-red-300 text-red-900'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Attestation Explorer</h1>
          <p className="text-lg text-gray-600">
            Verify AI certifications and attestations issued under GIAS standards.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label htmlFor="attestationId" className="block text-sm font-medium text-gray-700 mb-2">
                Attestation ID
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  id="attestationId"
                  value={attestationId}
                  onChange={(e) => setAttestationId(e.target.value)}
                  placeholder="e.g., 550e8400-e29b-41d4-a716-446655440000"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium"
                >
                  {isLoading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </form>

          {/* Sample IDs Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-2">Sample attestation IDs:</p>
            <p className="font-mono text-xs">550e8400-e29b-41d4-a716-446655440000</p>
            <p className="text-xs mt-1 text-blue-700">Try verifying any valid attestation ID from your dashboard</p>
          </div>
        </div>
      </section>

      {/* Error State */}
      {error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-lg bg-red-50 border border-red-200 p-6">
            <h3 className="font-semibold text-red-900 mb-2">Verification Failed</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-6 flex items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
            <div>
              <p className="font-medium text-blue-900">Verifying attestation...</p>
              <p className="text-sm text-blue-700">Checking certificate authenticity</p>
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {result && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Result */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Status Header */}
                <div className={`border-t-4 ${result.valid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'} p-6`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                        {result.valid ? '✓ Certificate Valid' : '✗ Certificate Invalid'}
                      </p>
                      <p className={`text-xs mt-1 ${result.valid ? 'text-green-700' : 'text-red-700'}`}>
                        Verified on {new Date(result.verified_timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  {/* Model Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Model Name</dt>
                        <dd className="text-base font-semibold text-gray-900 mt-1">{result.model_name}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Version</dt>
                        <dd className="text-base font-semibold text-gray-900 mt-1">{result.model_version}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="text-sm font-medium text-gray-600">Organization</dt>
                        <dd className="text-base font-semibold text-gray-900 mt-1">{result.organization}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Certification Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification Details</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Issued Date</dt>
                        <dd className="text-base text-gray-900 mt-1">
                          {new Date(result.issued_date).toLocaleDateString()}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-600">Score</dt>
                        <dd className="text-2xl font-bold text-blue-600 mt-1">
                          {result.score.toFixed(1)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Certification Badge */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Certification Level</h3>
                    <div className={`inline-block px-4 py-2 rounded-lg border ${getCertificationColor(result.certification_level)} font-semibold`}>
                      {result.certification_level.toUpperCase()}
                    </div>
                  </div>

                  {/* Attestation ID */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-600 mb-1">Attestation ID</p>
                    <p className="font-mono text-sm text-gray-900 break-all">{result.id}</p>
                  </div>
                </div>
              </div>

              {/* Verification Info */}
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Verification Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  This attestation has been verified against the GIAS registry and confirmed as authentic.
                  The certification level indicates the quality and robustness of the AI model across multiple dimensions.
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Platinum:</strong> Exceeds all standards (score ≥ 90)</p>
                  <p><strong>Gold:</strong> Meets all standards (score ≥ 80)</p>
                  <p><strong>Silver:</strong> Adequate compliance (score ≥ 70)</p>
                  <p><strong>Bronze:</strong> Minimum requirements (score ≥ 50)</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Certificate Summary</h3>
                
                <div className="space-y-4">
                  {/* Status Indicator */}
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${result.valid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {result.valid ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Score Badge */}
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-xs font-medium text-blue-600 mb-1">Overall Score</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {result.score.toFixed(0)}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">/ 100</p>
                  </div>

                  {/* Links */}
                  <div className="border-t border-gray-200 pt-4">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                      Download Certificate
                    </button>
                    <button className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Initial State - No Results */}
      {!result && !isLoading && !error && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg text-gray-600">Enter an attestation ID above to verify its authenticity</p>
          </div>
        </section>
      )}
    </div>
  )
  }
