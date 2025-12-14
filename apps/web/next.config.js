/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  // no redirects here to avoid redirect loops (especially /standards -> /standards)
}
