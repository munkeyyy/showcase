/** @type {import('next').NextConfig} */
// The site is one client-rendered page with no server code, so it exports to plain static files (out/),
// which Cloudflare Pages serves for free.
const nextConfig = {
  output: 'export'
};

export default nextConfig;
