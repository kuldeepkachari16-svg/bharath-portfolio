import type { MetadataRoute } from "next";
import { origin, projects } from "@/lib/portfolio";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return origin
    ? [
        "",
        "/work",
        "/design-projects",
        "/contact",
        ...projects.map((p) => `/${p.slug}`),
      ].map((path) => ({ url: `${origin}${path}` }))
    : [];
}
