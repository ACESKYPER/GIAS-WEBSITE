import Link from 'next/link'
export default function PortalLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Portal Login</h1>
        <p className="text-sm mb-6">Please sign in to access the portal. You will be redirected to the authentication page.</p>
        <div className="flex gap-2">
          <Link href="/auth/signin" className="flex-1 px-4 py-2 bg-slate-900 text-white rounded text-center">Sign In</Link>
          <Link href="/" className="px-4 py-2 border rounded text-center">Home</Link>
        </div>
      </div>
    </div>
  )
}
