"use client"

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-xs text-slate-600">
        <div className="flex justify-between">
          <div>
            <div className="font-serif text-sm text-slate-800">GIAS</div>
            <div>Global Interoperability & AI Standards Institute</div>
          </div>
          <div className="text-right">
            <div>© {new Date().getFullYear()} GIAS Institute</div>
            <div className="mt-1">Privacy · Terms · Cookie Policy</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
