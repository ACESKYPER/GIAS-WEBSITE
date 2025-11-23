export default function ExplorerPage(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-serif text-slate-900">Attestation Explorer</h1>
      <p className="text-sm text-slate-600 mt-2">Search and verify attestations issued by GIAS.</p>

      <div className="mt-6 bg-white border rounded p-6">
        <label className="block text-sm text-slate-700">Attestation ID</label>
        <div className="flex gap-2 mt-2">
          <input className="flex-1 border p-2" placeholder="GIAS-2025-001234" />
          <button className="bg-slate-800 text-white px-4 py-2 rounded">Lookup</button>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QRCode from 'qrcode.react'

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAttestation, setSelectedAttestation] = useState(null)

  // Mock attestations
  const mockAttestations = [
    {
      id: 'GIAS-2025-001234',
      entity: 'Acme AI Labs',
      standard: 'MIF v1.0',
      issuedDate: '2025-01-15',
      expiryDate: '2026-01-15',
      score: 8.7,
      status: 'Active',
    },
    {
      id: 'GIAS-2025-001235',
      entity: 'CloudML Corp',
      standard: 'DSP v1.0',
      issuedDate: '2025-01-20',
      expiryDate: '2026-01-20',
      score: 9.2,
      status: 'Active',
    },
    {
      id: 'GIAS-2025-001236',
      entity: 'DataGuard Systems',
      standard: 'RTE v1.0',
      issuedDate: '2025-02-01',
      expiryDate: '2026-02-01',
      score: 7.5,
      status: 'Active',
    },
  ]

  const filtered = mockAttestations.filter((att) =>
    att.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    att.entity.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Header />
      <main>
        <section className="bg-white border-b border-slate-200">
          <div className="container-max py-16">
            <h1 className="text-5xl mb-4">Attestation Explorer</h1>
            <p className="prose-text">
              Verify AI certifications and attestations issued under GIAS standards.
            </p>
          </div>
        </section>

        <section className="container-max py-16">
          <div className="max-w-2xl mb-12">
            <input
              type="text"
              placeholder="Search by Attestation ID or Entity Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {selectedAttestation ? (
            <div className="grid grid-cols-3 gap-8">
              <div className="col-span-2">
                <div className="card-panel mb-6">
                  <h2 className="text-3xl font-serif mb-4">{selectedAttestation.entity}</h2>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-slate-600 font-medium">Attestation ID</dt>
                      <dd className="text-lg font-mono">{selectedAttestation.id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-slate-600 font-medium">Standard</dt>
                      <dd className="text-lg">{selectedAttestation.standard}</dd>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-slate-600 font-medium">Issued</dt>
                        <dd className="text-lg">{selectedAttestation.issuedDate}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-slate-600 font-medium">Expires</dt>
                        <dd className="text-lg">{selectedAttestation.expiryDate}</dd>
                      </div>
                    </div>
                    <div>
                      <dt className="text-sm text-slate-600 font-medium">GIAS Compliance Score</dt>
                      <dd className="text-3xl font-bold text-blue-700">{selectedAttestation.score}/10</dd>
                    </div>
                  </dl>
                </div>
                <button
                  onClick={() => setSelectedAttestation(null)}
                  className="btn-secondary"
                >
                  Back to Search
                </button>
              </div>
              <div className="card-panel text-center">
                <h3 className="text-sm text-slate-600 font-medium mb-4">QR Verification</h3>
                <QRCode
                  value={`https://explorer.gias.institute/verify/${selectedAttestation.id}`}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((attestation) => (
                <button
                  key={attestation.id}
                  onClick={() => setSelectedAttestation(attestation)}
                  className="card-panel text-left hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-serif mb-2">{attestation.entity}</h3>
                      <p className="text-sm text-slate-600 mb-2">{attestation.id}</p>
                      <p className="text-sm">{attestation.standard} • Score: {attestation.score}/10</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                      {attestation.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
