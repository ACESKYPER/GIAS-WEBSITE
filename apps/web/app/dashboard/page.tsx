'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { RoleGate } from '@/lib/hooks/withProtectedRoute'
import { useGiasApi } from '@/lib/api/gias'
import type { Attestation } from '@/types/certification'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const api = useGiasApi()
  const [attestations, setAttestations] = useState<Attestation[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && user) {
      const fetchAttestations = async () => {
        try {
          const data = await api.getAttestations()
          setAttestations(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load attestations')
        }
      }
      fetchAttestations()
    }
  }, [user, isLoading, api])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || user?.email}!
          </h1>
          <p className="mt-2 text-gray-600">
            Role: <span className="font-semibold">{user?.role}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <RoleGate requiredRoles={['Enterprise', 'Admin']}>
            <Link
              href="/evidence"
              className="rounded-lg bg-blue-600 p-6 text-white hover:bg-blue-700 transition-colors"
            >
              <div className="text-2xl font-bold mb-2">📊</div>
              <h3 className="font-semibold">Upload Evidence</h3>
              <p className="mt-1 text-sm text-blue-100">Submit model for certification</p>
            </Link>
          </RoleGate>

          <Link
            href="/explorer"
            className="rounded-lg bg-purple-600 p-6 text-white hover:bg-purple-700 transition-colors"
          >
            <div className="text-2xl font-bold mb-2">🔍</div>
            <h3 className="font-semibold">Verify Attestation</h3>
            <p className="mt-1 text-sm text-purple-100">Check certificate authenticity</p>
          </Link>

          <RoleGate requiredRoles={['Admin']}>
            <Link
              href="/governance"
              className="rounded-lg bg-green-600 p-6 text-white hover:bg-green-700 transition-colors"
            >
              <div className="text-2xl font-bold mb-2">⚖️</div>
              <h3 className="font-semibold">Governance</h3>
              <p className="mt-1 text-sm text-green-100">Review policies</p>
            </Link>
          </RoleGate>
        </div>

        {/* Attestations List */}
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Attestations</h2>
          </div>

          {attestations.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">
                No attestations yet.{' '}
                <RoleGate requiredRoles={['Enterprise', 'Admin']}>
                  <Link
                    href="/evidence"
                    className="font-medium text-blue-600 hover:text-blue-700"
                  >
                    Get started
                  </Link>
                </RoleGate>
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {attestations.map((attestation) => (
                <div key={attestation.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {attestation.model_name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        v{attestation.model_version} • {attestation.organization}
                      </p>
                      <div className="mt-2 flex gap-4 text-sm">
                        <span className="text-gray-600">
                          Issued: {new Date(attestation.issued_date).toLocaleDateString()}
                        </span>
                        <span
                          className={`font-medium ${
                            attestation.scores.certification_level === 'platinum'
                              ? 'text-yellow-600'
                              : attestation.scores.certification_level === 'gold'
                              ? 'text-yellow-500'
                              : attestation.scores.certification_level === 'silver'
                              ? 'text-gray-600'
                              : 'text-orange-600'
                          }`}
                        >
                          {attestation.scores.certification_level.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {attestation.scores.overall_score.toFixed(0)}
                      </div>
                      <p className="text-xs text-gray-500">Overall Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
