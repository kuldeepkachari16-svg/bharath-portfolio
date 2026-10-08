# Bharath Vishwakarma — Portfolio

A responsive editorial portfolio built with Next.js App Router, React and TypeScript. The original 37 projects, 361 gallery images, 23 films, written content and social links are preserved. See [SOURCE-AUDIT.md](SOURCE-AUDIT.md) for the complete inventory.

## Run locally

Use Node.js 22 LTS or newer.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production build:

```sh
npm run build
npm start
```

## Deploy to Vercel

For GitHub hosting instead, follow [GITHUB-PAGES.md](GITHUB-PAGES.md). The included GitHub Actions workflow builds and publishes a static version with responsive images and the email-draft contact form.

1. Put this `portfolio` directory in a Git repository and import it into Vercel. If importing a parent repository, select `outputs/portfolio` as the Root Directory.
2. Use the Next.js framework preset, `npm run build`, and the default output directory. The lockfile is included.
3. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, without a trailing slash, then build/redeploy. This enables canonical project URLs and the sitemap.
4. To enable in-site contact delivery, set `RESEND_API_KEY` and `CONTACT_FROM` (a sender verified with Resend). `CONTACT_TO` defaults to the original `bharath_v@nid.edu` address. Rebuild after adding these values. Configure Vercel Firewall rate limiting for `/api/contact` before enabling public email submission.

Without email credentials, the site remains functional: its contact form is labelled “Compose email” and opens an email draft. It never reports a message as delivered in this mode. The API validates fields, rejects cross-origin submissions, limits payload size and includes a honeypot. Live email delivery requires credentials and has not been tested against a real inbox. Resend API reference: https://resend.com/docs/api-reference/emails/send-email

No deployment or external message was sent as part of the rebuild.

## Update projects

All content lives in `content/portfolio.json`; page layouts are shared.

- Edit a project's `title`, `year`, `cover`, or ordered `blocks` in the `projects` array.
- To add a project, choose a unique URL `slug`, add its record, then add its slug to the appropriate collection's `projects` list. Set `collection` to `work` or `design-projects`.
- Place images in `public/images`. An image record contains `src`, `width`, `height`, and `source` (the original provenance URL, or your own source reference). Use actual pixel dimensions. A `text` block contains trusted, sanitized HTML; do not paste scripts or untrusted markup.
- Blocks support `{ "type": "text", "html": "<p>…</p>" }`, `{ "type": "images", "images": […] }`, and `{ "type": "video", "src": "https://…" }`.
- Images in a block keep their order; a single image is displayed full width, and grouped images use a responsive grid. Films load only when the visitor chooses Play film.
- Keep source titles and descriptions accurate. The migrated biography deliberately preserves the original wording, including its time-sensitive education statement.
- Rebuild after content changes. Static routes and next-project navigation update automatically.

## Structure

```text
app/                 Routes, metadata, global styles, contact endpoint
components/          Navigation, footer, grids, media and contact form
content/portfolio.json  Project and artist content
lib/portfolio.ts     Typed content access
public/images/       Optimized portfolio images and original favicon
public/fonts/        Self-hosted display and body fonts
```

## Performance and accessibility

Static project pages; responsive Next.js images; WebP source assets with AVIF/WebP delivery; intrinsic dimensions; lazy gallery loading; click-to-load film embeds; local fonts; reduced-motion support; keyboard-operable navigation; labelled form controls; native modal image viewing with Escape and focus restoration.

Original downloadable image files are retained in the task's `work/original-images` directory outside the deployment. The deployment contains high-quality resized derivatives, not the 1 GB original payload. Source provenance is preserved per image. Third-party film availability and permissions remain controlled by Adobe, Vimeo and YouTube.

The original `/bharath-vishwakarma` path permanently redirects to `/`. Every original project, collection and contact path is retained.
