import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const flag = args.indexOf("--base-path");
const basePath =
  (flag >= 0 ? args[flag + 1] : process.env.PAGES_BASE_PATH) || "";
if (basePath && !/^\/[a-zA-Z0-9_.-]+$/.test(basePath))
  throw new Error("Base path must be empty or /repository-name.");
const workspace = path.join(root, ".pages-build");
await fs.mkdir(workspace, { recursive: true });
const stage = await fs.mkdtemp(path.join(workspace, "export-"));
try {
  for (const entry of [
    "app",
    "components",
    "content",
    "lib",
    "public",
    "package.json",
    "tsconfig.json",
    "next.config.ts",
  ]) {
    await fs.cp(path.join(root, entry), path.join(stage, entry), {
      recursive: true,
      filter: (source) => source !== path.join(root, "app", "api"),
    });
  }
  // Build-time derivatives replace Next's server-side image optimizer on Pages.
  const imageDir = path.join(stage, "public", "images");
  const responsiveDir = path.join(imageDir, "responsive");
  await fs.mkdir(responsiveDir, { recursive: true });
  const queue = (await fs.readdir(imageDir)).filter((file) =>
    file.endsWith(".webp"),
  );
  console.log(
    `Preparing responsive images for ${queue.length} portfolio assets…`,
  );
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const file = queue.shift();
        for (const width of [640, 1280, 1920]) {
          await sharp(path.join(imageDir, file), { animated: true })
            .resize({ width, withoutEnlargement: true })
            .webp({ quality: 82, effort: 3 })
            .toFile(
              path.join(responsiveDir, file.replace(".webp", `-${width}.webp`)),
            );
        }
      }
    }),
  );
  const result = spawnSync(
    process.execPath,
    [path.join(root, "node_modules/next/dist/bin/next"), "build", "--webpack"],
    {
      cwd: stage,
      stdio: "inherit",
      env: {
        ...process.env,
        GITHUB_PAGES: "true",
        NEXT_PUBLIC_BASE_PATH: basePath,
        RESEND_API_KEY: "",
        CONTACT_FROM: "",
      },
    },
  );
  if (result.status !== 0)
    throw new Error(`Static build failed (${result.status}).`);
  const output = path.join(stage, "out");
  await fs.writeFile(path.join(output, ".nojekyll"), "");
  // GitHub Pages cannot apply server redirects; preserve the old home URL in HTML.
  const legacy = path.join(output, "bharath-vishwakarma");
  await fs.mkdir(legacy, { recursive: true });
  await fs.writeFile(
    path.join(legacy, "index.html"),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=${basePath}/"><title>Bharath Vishwakarma</title></head><body><a href="${basePath}/">Continue to the portfolio</a></body></html>`,
  );
  await fs.rm(path.join(root, "out"), { recursive: true, force: true });
  await fs.cp(output, path.join(root, "out"), { recursive: true });
  console.log(
    `GitHub Pages site ready in out/ (base path: ${basePath || "/"}).`,
  );
} finally {
  await fs.rm(stage, { recursive: true, force: true });
}
