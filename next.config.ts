import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jegnit-storage-proxy.fikreyohannesbiruk.workers.dev',
      },
      {
        protocol: 'https',
        hostname: 'fbgmwoldofhnlfnqfsug.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
