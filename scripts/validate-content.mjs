import fs from "node:fs/promises";
import assert from "node:assert/strict";
const data = JSON.parse(
  await fs.readFile(
    new URL("../content/portfolio.json", import.meta.url),
    "utf8",
  ),
);
const slugs = new Set();
let imageCount = 0;
let filmCount = 0;
async function image(img) {
  assert(img.width > 0 && img.height > 0, "Image dimensions required");
  assert(img.src.startsWith("/images/"), "Images must be local");
  await fs.access(new URL("../public" + img.src, import.meta.url));
  imageCount++;
}
for (const p of data.projects) {
  assert(!slugs.has(p.slug), `Duplicate slug: ${p.slug}`);
  slugs.add(p.slug);
  assert(/^[a-z0-9-]+$/.test(p.slug));
  assert(p.title && p.blocks.length, `Missing content: ${p.slug}`);
  assert(
    data.collections.some(
      (c) => c.slug === p.collection && c.projects.includes(p.slug),
    ),
    `Missing collection membership: ${p.slug}`,
  );
  await image(p.cover);
  if (p.coverHover) await image(p.coverHover);
  for (const b of p.blocks) {
    if (b.type === "images") for (const i of b.images) await image(i);
    else if (b.type === "video") {
      assert(
        ["player.vimeo.com", "www.youtube.com", "www-ccv.adobe.io"].includes(
          new URL(b.src).hostname,
        ),
        "Unapproved film host",
      );
      filmCount++;
    } else {
      assert.equal(b.type, "text");
      assert(
        !/<script|on\w+=|javascript:/i.test(b.html),
        "Unsafe content HTML",
      );
    }
  }
}
for (const c of data.collections)
  for (const slug of c.projects)
    assert(slugs.has(slug), `Unknown project: ${slug}`);
await image(data.portrait);
await image(data.favicon);
console.log(
  `Validated ${slugs.size} projects, ${imageCount} image references and ${filmCount} films.`,
);
