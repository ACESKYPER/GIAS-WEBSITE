/** @type {import('next').NextConfig} */
module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  // Optional root redirect: enable by setting ENABLE_ROOT_REDIRECT=1 in environment
  // This avoids redirect loops since it only redirects '/' to '/standards'.
  async redirects() {
    if (process.env.ENABLE_ROOT_REDIRECT === '1') {
      return [
        {
          source: '/',
          destination: '/standards',
          permanent: false,
        },
      ];
    }
    return [];
  },
}
