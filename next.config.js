/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // External provider photos come from arbitrary hosts; skipping the optimizer
  // avoids maintaining a remotePatterns allowlist (and Hobby-plan image quotas).
  images: { unoptimized: true },
};

module.exports = nextConfig;
