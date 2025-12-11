"use client"

import { useState } from 'react'
import withProtectedRoute from '@/lib/withProtectedRoute'

function PortalPage() {
  const [role, setRole] = useState('enterprise')
  const [attId, setAttId] = useState('')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function lookup() {
    setError(null)
    setResult(null)
    if (!attId) return setError('Enter an attestation id')
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL not set')
      const res = await fetch(`${apiUrl}/api/verify/${attId}`)
      if (!res.ok) throw new Error(`Status ${res.status}`)
      const json = await res.json()
      setResult(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans">
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif text-slate-900">GIAS Portal</h1>
              <p className="text-sm text-slate-600">Institutional portal — Moody&apos;s-style look</p>
            </div>
            <div>
              <select className="border rounded p-2" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="enterprise">Enterprise</option>
                <option value="auditor">Auditor</option>
              </select>
            </div>
          </div>
        </section>

        <main className="max-w-4xl mx-auto px-4">
          <div className="bg-white shadow rounded p-6">
            <h2 className="text-xl font-semibold font-serif">Attestation Lookup</h2>
            <p className="text-sm text-slate-600 mb-4">Public verification lookup for attestations.</p>

            <div className="flex gap-2">
              <input
                className="border p-2 flex-1"
                placeholder="GIAS-2025-..."
                value={attId}
                onChange={(e) => setAttId(e.target.value)}
              />
              <button className="bg-slate-800 text-white px-4 py-2 rounded" onClick={lookup}>
                Lookup
              </button>
            </div>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {result && (
              <div className="mt-6 border-t pt-6">
                <h3 className="font-semibold">Attestation: {result.id}</h3>
                <p className="text-sm text-slate-600">Status: {result.status}</p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Organization</h4>
                    <div className="text-sm">{result.organization_name || result.organization || '—'}</div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Overall Score</h4>
                    <div className="text-lg font-serif">{result.overall_score ?? '—'}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium">Five Pillars</h4>
                  <ul className="list-disc ml-5">
                    {(result.pillars || []).map((p: any, i: number) => (
                      <li key={i}>
                        {p.name}: {p.score}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <section className="mt-6 text-sm text-slate-600">
            <p>Enterprise and Auditor dashboards are under the portal MVP. Use the lookup to verify attestations.</p>
          </section>
        </main>

      </div>
    )
  }

  export default withProtectedRoute(PortalPage)
