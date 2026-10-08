import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = path.join(root, "out");
const base = process.argv[2] || "";
const data = JSON.parse(
  await fs.readFile(path.join(root, "content/portfolio.json"), "utf8"),
);
const routes = [
  "",
  "work",
  "design-projects",
  "contact",
  "bharath-vishwakarma",
  ...data.projects.map((p) => p.slug),
];
const checked = new Set();
async function check(url) {
  if (!url || /^(https?:|mailto:|data:|#)/.test(url)) return;
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  assert(
    pathname.startsWith(`${base}/`),
    `Asset or link escapes repository path: ${url}`,
  );
  const relative = pathname.slice(base.length).replace(/^\//, "");
  if (checked.has(relative)) return;
  checked.add(relative);
  const target = path.join(out, relative);
  const stat = await fs.stat(target).catch(() => null);
  assert(stat, `Missing exported target: ${url}`);
  if (stat.isDirectory()) await fs.access(path.join(target, "index.html"));
}
for (const route of routes) {
  const html = await fs.readFile(path.join(out, route, "index.html"), "utf8");
  assert(
    !html.includes("/_next/image?"),
    `Server image optimizer remains in ${route}`,
  );
  const $ = load(html);
  for (const element of $("[src], [href]").toArray()) {
    const value = $(element).attr("src") || $(element).attr("href");
    await check(value);
  }
  for (const element of $("[srcset], [imagesrcset]").toArray()) {
    for (const part of (
      $(element).attr("srcset") || $(element).attr("imagesrcset")
    ).split(","))
      await check(part.trim().split(/\s+/)[0]);
  }
}
const cssFiles = [...checked].filter((file) => file.endsWith(".css"));
for (const file of cssFiles) {
  const css = await fs.readFile(path.join(out, file), "utf8");
  for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    if (match[1].startsWith("/")) await check(match[1]);
    else if (!match[1].startsWith("data:"))
      await fs.access(path.resolve(out, path.dirname(file), match[1]));
  }
}
await fs.access(path.join(out, ".nojekyll"));
assert(
  !(await fs.stat(path.join(out, "api")).catch(() => null)),
  "Server API must not be exported.",
);
const contact = await fs.readFile(path.join(out, "contact/index.html"), "utf8");
assert(
  contact.includes("Compose email"),
  "Static contact must use email draft mode.",
);
console.log(
  `Verified ${routes.length} exported routes and ${checked.size} local link/asset targets under ${base || "/"}.`,
);
