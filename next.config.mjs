/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ["@prisma/client", "prisma", "adm-zip", "sharp"],
  experimental: {
    // Allow 150 MB ZIP backup uploads plus multipart form-data overhead through middleware
    middlewareClientMaxBodySize: 152 * 1024 * 1024,
  },
  images: {
    // Serve protected /api/images directly from the browser so session cookies are attached
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
