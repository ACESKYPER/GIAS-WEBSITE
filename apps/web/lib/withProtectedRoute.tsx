"use client"

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export type UserRole = 'Enterprise' | 'Auditor' | 'Regulator' | 'Admin'

export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') return null

    if (!session) {
      router.push('/portal/login')
      return null
    }

    const role = (session as any)?.user?.role as UserRole | undefined

    // requiredRoles may be a single role or an array
    const roles = Array.isArray(requiredRoles) ? requiredRoles : requiredRoles ? [requiredRoles] : []
    if (roles.length && role && !roles.includes(role)) {
      router.push('/unauthorized')
      return null
    }

    return <Component {...props} />
  }
}

export function RoleGate({
  requiredRoles,
  children,
  fallback,
}: {
  requiredRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}) {
  const { data: session, status } = useSession()

  if (status === 'loading') return <div>Loading...</div>

  const role = (session as any)?.user?.role as UserRole | undefined

  if (!role || !requiredRoles.includes(role)) {
    return fallback || <div>Access denied</div>
  }

  return <>{children}</>
}

export default withProtectedRoute
