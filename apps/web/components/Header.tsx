"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-serif font-bold text-slate-900">
            GIAS
          </Link>
          <div className="text-xs text-slate-600">Global Interoperability & AI Standards Institute</div>
        </div>

        <nav className="flex gap-6">
  <Link href="/standards" className="hover:underline font-semibold">Standards</Link> {/* New link */}
  <Link href="/certification" className="hover:underline font-semibold">Certification</Link>
  <Link href="/explorer" className="hover:underline font-semibold">Explorer</Link>
  <Link href="/governance" className="hover:underline font-semibold">Governance</Link>
  <Link href="/portal" className="hover:underline font-semibold">Portal</Link>
</nav>


        <div className="md:hidden">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen(!open)}
            className="p-2 rounded-md border"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center">
          <Link href="/auth/signin" className="px-3 py-1 border rounded text-sm text-slate-800">Institutional Portal</Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 pb-4 space-y-2">
          <Link href="/certification" className="block py-2">Certification</Link>
          <Link href="/governance" className="block py-2">Governance</Link>
          <Link href="/explorer" className="block py-2">Explorer</Link>
          <Link href="/portal" className="block py-2">Portal</Link>
          <Link href="/auth/signin" className="block py-2">Institutional Portal</Link>
        </div>
      </div>
    </header>
  )
}
