import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-6xl font-serif font-bold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-6 py-2 bg-slate-900 text-white rounded hover:bg-slate-800 transition">
            Home
          </Link>
          <Link href="/standards" className="px-6 py-2 border border-slate-300 rounded hover:bg-slate-50 transition">
            Standards
          </Link>
        </div>
      </div>
    </div>
  )
}
