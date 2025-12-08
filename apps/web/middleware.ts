import { withAuth } from "next-auth/middleware"

export const middleware = withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      // Protected routes
      const protectedRoutes = ['/dashboard', '/evidence', '/portal']
      const pathname = req.nextUrl.pathname

      // Check if route is protected
      const isProtected = protectedRoutes.some(route => pathname.startsWith(route))

      // If route is protected, user must be logged in
      if (isProtected) {
        return !!token
      }

      // Public routes accessible without auth
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/evidence/:path*', '/portal/:path*'],
}
