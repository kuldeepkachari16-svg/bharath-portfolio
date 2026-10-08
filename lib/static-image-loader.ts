import type { ImageLoaderProps } from "next/image";

// GitHub Pages serves these responsive files generated at build time.
// No image server, third-party service or API key is needed.
export default function staticImageLoader({ src, width }: ImageLoaderProps) {
  const size = width <= 640 ? 640 : width <= 1280 ? 1280 : 1920;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${src.replace(/\.webp$/, `-${size}.webp`).replace("/images/", "/images/responsive/")}`;
}
