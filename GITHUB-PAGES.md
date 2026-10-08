# Publish this portfolio on GitHub Pages

This project now supports GitHub Pages as well as Vercel. You do not need a server, hosting API key, or Codex to run or publish the Pages version.

## First publication

1. Extract the source ZIP. Use the contents of the `portfolio` folder as your repository root: `package.json`, `app`, `public`, and `.github` must be directly inside the repository, not inside another `portfolio` folder.
2. Create a GitHub repository, for example `bharath-portfolio`, and upload/push these source files to its `main` branch. GitHub Desktop is useful for publishing this folder and its images. Include the hidden `.github/workflows/deploy-pages.yml` file. Do not upload the ZIP itself, `node_modules`, `.next`, `.pages-build`, `out`, or credentials.
3. In the repository on GitHub, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**.
4. Open **Actions → Publish portfolio to GitHub Pages → Run workflow**. The first push may have failed if Pages was not enabled yet; running the workflow after step 3 resolves that prerequisite.
5. Wait for the build and deployment jobs to finish. The workflow and Settings → Pages will display the public website link. For a repository named `bharath-portfolio`, the usual URL is `https://YOUR-USERNAME.github.io/bharath-portfolio/`.

Use a public repository for the simplest free-account setup. Private-repository Pages availability depends on your GitHub plan; the published website is normally public. Only add content intended for public viewing.

The workflow discovers your actual GitHub Pages address automatically. It supports project URLs, the special `YOUR-USERNAME.github.io` repository, and a custom domain configured in Pages. No username or repository name is hardcoded into the website. If you change the Pages domain, rerun the workflow.

## Publish edits

Edit `content/portfolio.json`, images in `public/images`, or the design files, then commit and push to `main`. GitHub Actions rebuilds and publishes the site. If you use a different publishing branch, update `branches: [main]` in the workflow.

All 37 projects and their original URLs remain available, as do image enlargement, film players and mobile navigation. The old `/bharath-vishwakarma/` path uses a static HTML redirect to the new homepage.

## Contact form

GitHub Pages cannot run the email delivery backend. This build always uses the clearly labelled **Compose email** button, which opens a draft in the visitor's email app. It does not claim to send the message. Direct email and social links remain available. Embedded films still depend on their original hosts.

## Build a static copy yourself

With Node.js 22 or newer, from the project folder:

```sh
npm ci
npm run build:pages -- --base-path /bharath-portfolio
node scripts/verify-pages.mjs /bharath-portfolio
```

Replace `/bharath-portfolio` with your repository name. For a root website or custom domain, use `npm run build:pages` without a base path. Set `NEXT_PUBLIC_SITE_URL` to the complete public URL (including the repository path) if building manually and you want canonical URLs and the sitemap. GitHub Actions sets it automatically.

The generated static website is in `out/`. Serve it through an HTTP server at the configured base path; opening HTML directly through `file://` is not supported. Do not commit `out/`: the workflow generates it for every deployment.

The Pages build creates a temporary copy under `.pages-build/`, omits the server-only API, generates responsive WebP images at 640, 1280 and 1920 pixels, and exports static HTML. It does not alter the original images, source content, normal `.next` build or Vercel contact handler. Font URLs, image URLs, metadata and navigation work under the repository path. Generated `out/` is replaced on each successful build.

The normal `npm run dev` and `npm run build` commands still target the full Next.js/Vercel version.
