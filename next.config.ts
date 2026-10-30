import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig = {
  reactStrictMode: true,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  typescript: {
    ignoreBuildErrors: true,
  },
} satisfies NextConfig;

// PWA: Serwist (the maintained successor of next-pwa) builds the service worker
// served from /serwist/sw.js - see app/serwist/[path]/route.ts and app/sw.ts
export default withSerwist(nextConfig);
