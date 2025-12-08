/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  experimental: {
    typedRoutes: false,
  },
  output: 'standalone',
  trailingSlash: false,
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
