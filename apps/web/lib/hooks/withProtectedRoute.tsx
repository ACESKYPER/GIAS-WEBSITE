'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, type UserRole } from './useAuth'

/**
 * Higher-order component to protect routes
 * Redirects to signin if not authenticated or role doesn't match
 */
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: UserRole[]
) {
  return function ProtectedRoute(props: P) {
    const router = useRouter()
    const { user, isLoading, isAuthenticated } = useAuth()

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600 mx-auto"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }

    if (!isAuthenticated || !user) {
      router.push('/auth/signin')
      return null
    }

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      router.push('/auth/unauthorized')
      return null
    }

    return <Component {...props} />
  }
}

/**
 * Render-prop component for role-based access control
 */
export function RoleGate({
  requiredRoles,
  children,
  fallback,
}: {
  requiredRoles: UserRole[]
  children: ReactNode
  fallback?: ReactNode
}) {
  const { role, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!role || !requiredRoles.includes(role)) {
    return fallback || <div>Access denied. Required role: {requiredRoles.join(' or ')}</div>
  }

  return <>{children}</>
}
