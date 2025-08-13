/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lq/shared', '@lq/ui', '@lq/game'],
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig
