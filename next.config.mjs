/** @type {import('next').NextConfig} */
// The site is one client-rendered page with no server code, so it exports to plain static files (out/),
// which Cloudflare or GitHub Pages serve for free. NEXT_PUBLIC_BASE_PATH is set only for GitHub Pages
// project sites, which live under /<repo-name>.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined
};

export default nextConfig;
