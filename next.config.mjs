/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static export — emits a self-contained site to ./out for Vercel/static hosting.
  // No server runtime, no API routes, no server components needed at request time.
  output: 'export',
  // The Next.js Image Optimizer requires a server; it cannot run in a static export.
  images: {
    unoptimized: true,
  },
  // Emit each route as a directory with index.html (e.g. /out/index.html) for clean static hosting.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
