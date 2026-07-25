import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Keep Cloudflare export builds from overwriting an active local dev cache.
  distDir:
    process.env.CLOUDFLARE_DEPLOY === "1" ? ".next-pages" : ".next",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_VIDEO_BASE_URL:
      process.env.NEXT_PUBLIC_VIDEO_BASE_URL ??
      (process.env.CLOUDFLARE_DEPLOY === "1"
        ? process.env.CLOUDFLARE_PUBLIC_URL
        : undefined) ??
      "",
  },
};

export default config;
