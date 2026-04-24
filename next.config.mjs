/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'perenual.com',
      },
    ],
  },
};

export default nextConfig;
