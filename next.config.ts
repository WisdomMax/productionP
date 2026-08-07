import type { NextConfig } from "next";

const isCloudflareBuild = process.env.CLOUDFLARE_DEPLOY === "1";
const isDevelopment = process.env.NODE_ENV === "development";

const config: NextConfig = {
  reactStrictMode: true,
  // Dev, local production and Cloudflare builds must never share a cache.
  // Sharing `.next` caused the dev server's app/layout.css bundle to disappear
  // after a production build, leaving pages as unstyled HTML.
  distDir: isCloudflareBuild
    ? ".next-pages"
    : isDevelopment
      ? ".next-dev"
      : ".next",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_VIDEO_BASE_URL:
      process.env.NEXT_PUBLIC_VIDEO_BASE_URL ??
      (isCloudflareBuild ? "https://video.productionp.com" : ""),
  },
};

export default config;
