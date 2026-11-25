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
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://geocoding-api.open-meteo.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
