"use client"

import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <Link href="/" className="text-2xl font-serif font-bold text-slate-900">
            GIAS
          </Link>
          <div className="text-xs text-slate-600">Global Interoperability & AI Standards Institute</div>
        </div>

        <nav className="hidden md:flex gap-8 text-slate-700">
          <Link href="/standards" className="hover:text-slate-900 transition">Standards</Link>
          <Link href="/certification" className="hover:text-slate-900 transition">Certification</Link>
          <Link href="/governance" className="hover:text-slate-900 transition">Governance</Link>
          <Link href="/explorer" className="hover:text-slate-900 transition">Explorer</Link>
          <Link href="/legal" className="hover:text-slate-900 transition">Legal</Link>
        </nav>

        <div className="flex gap-4">
          <Link href="https://portal.gias.institute" className="px-3 py-1 border rounded text-sm text-slate-800">Portal</Link>
          <Link href="/contact" className="px-3 py-1 bg-slate-800 text-white rounded text-sm">Contact</Link>
        </div>
      </div>
    </header>
  )
}
