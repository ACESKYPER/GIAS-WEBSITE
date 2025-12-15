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

        <nav className="hidden md:flex gap-8 text-slate-700">
          <Link href="/certification" className="hover:text-slate-900 transition">Certification</Link>
          <Link href="/governance" className="hover:text-slate-900 transition">Governance</Link>
          <Link href="/explorer" className="hover:text-slate-900 transition">Explorer</Link>
          <Link href="/portal" className="hover:text-slate-900 transition">Portal</Link>
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
          <Link href="/auth/signin" className="px-3 py-1 border rounded text-sm text-slate-800">Sign in</Link>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
          <div className="px-4 pb-4 space-y-2">
          <Link href="/certification" className="block py-2">Certification</Link>
          <Link href="/governance" className="block py-2">Governance</Link>
          <Link href="/explorer" className="block py-2">Explorer</Link>
          <Link href="/portal" className="block py-2">Portal</Link>
          <Link href="/auth/signin" className="block py-2">Sign in</Link>
        </div>
      </div>
    </header>
  )
}
