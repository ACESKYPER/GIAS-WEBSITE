'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

export type UserRole = 'Enterprise' | 'Auditor' | 'Regulator' | 'Admin'

export interface AuthUser {
  id: string
  email: string
  name?: string
  role: UserRole
}

export interface ExtendedSession {
  user?: AuthUser & { email: string }
  accessToken?: string
}

/**
 * Hook to access current user session and auth state
 */
export function useAuth() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null
    status: 'authenticated' | 'loading' | 'unauthenticated'
  }

  return {
    user: session?.user,
    token: session?.accessToken,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    role: session?.user?.role,
  }
}
