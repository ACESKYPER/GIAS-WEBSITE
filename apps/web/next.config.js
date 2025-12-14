/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  async redirects() {
    return [
      { source: '/standards', destination: '/standards', permanent: true },
    ]
  }
}
