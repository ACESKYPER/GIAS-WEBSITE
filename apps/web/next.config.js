/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    typedRoutes: true,
  },
  redirects: async () => {
    return [
      {
        source: '/docs/:path*',
        destination: 'https://docs.gias.institute/:path*',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
