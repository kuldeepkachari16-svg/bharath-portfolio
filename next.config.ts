import type { NextConfig } from "next";
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? process.env.NEXT_PUBLIC_BASE_PATH || "" : "";
const config: NextConfig = {
  poweredByHeader: false,
  ...(pages ? { output: "export", trailingSlash: true, basePath } : {}),
  images: pages
    ? { loader: "custom", loaderFile: "./lib/static-image-loader.ts" }
    : { formats: ["image/avif", "image/webp"] },
  ...(!pages
    ? {
        async redirects() {
          return [
            {
              source: "/bharath-vishwakarma",
              destination: "/",
              permanent: true,
            },
          ];
        },
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                {
                  key: "Referrer-Policy",
                  value: "strict-origin-when-cross-origin",
                },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
              ],
            },
          ];
        },
      }
    : {}),
};
export default config;
