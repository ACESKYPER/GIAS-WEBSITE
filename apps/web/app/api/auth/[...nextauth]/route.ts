import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        // Call backend API to authenticate
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL not set')
        try {
          // Call backend public auth endpoint at /auth/login (proxy on backend)
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            throw new Error('Authentication failed')
          }

          const data = await response.json()

          // Backend returns: { access_token, refresh_token, user: { id, email, role } }
          const user = data.user || {}

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.email,
            role: user.role,
            access: data.access_token,
            refresh: data.refresh_token,
          }
        } catch (error) {
          throw new Error('Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.role = user.role
        token.accessToken = user.access
        token.refreshToken = user.refresh
      }
      return token
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.accessToken = token.accessToken as string
        session.refreshToken = token.refreshToken as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 60 * 60 * 24 * 7,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
