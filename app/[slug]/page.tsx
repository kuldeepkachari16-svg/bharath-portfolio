import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  portfolio,
  projects,
  getCollection,
  getProject,
  origin,
} from "@/lib/portfolio";
import { ProjectGrid } from "@/components/project-grid";
import { Film, ImageGroup } from "@/components/project-media";
export function generateStaticParams() {
  return [...portfolio.collections, ...projects].map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getProject(slug) || getCollection(slug);
  if (!record) return {};
  return {
    title: record.title,
    alternates: origin ? { canonical: `${origin}/${slug}` } : undefined,
  };
}
export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (collection)
    return (
      <main id="main" className="collection-page">
        <div className="page-heading">
          <h1>{collection.title}</h1>
          <span>{collection.projects.length} projects</span>
        </div>
        <nav className="collection-tabs" aria-label="Portfolio collections">
          {portfolio.collections.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              aria-current={c.slug === slug ? "page" : undefined}
            >
              {c.title}
            </Link>
          ))}
        </nav>
        <ProjectGrid
          projects={collection.projects.map((s) => getProject(s)!)}
        />
      </main>
    );
  const project = getProject(slug);
  if (!project) notFound();
  const siblings = projects.filter((p) => p.collection === project.collection);
  const next =
    siblings[
      (siblings.findIndex((p) => p.slug === slug) + 1) % siblings.length
    ];
  return (
    <main id="main" className="project-page">
      <header className="project-heading">
        <div className="project-meta">
          <Link href={`/${project.collection}`}>
            {getCollection(project.collection)?.title}
          </Link>
          <span>{project.year}</span>
        </div>
        <h1>{project.title}</h1>
      </header>
      <div className="project-content">
        {project.blocks.map((block, i) =>
          block.type === "text" ? (
            <div
              key={i}
              className="project-prose"
              dangerouslySetInnerHTML={{ __html: block.html }}
            />
          ) : block.type === "video" ? (
            <Film
              key={i}
              src={block.src}
              title={project.title}
              cover={project.cover}
            />
          ) : (
            <ImageGroup
              key={i}
              images={block.images}
              title={project.title}
              offset={project.blocks
                .slice(0, i)
                .reduce(
                  (sum, b) => sum + (b.type === "images" ? b.images.length : 0),
                  0,
                )}
            />
          ),
        )}
      </div>
      <nav className="next-project" aria-label="Next project">
        <span className="eyebrow">Next project</span>
        <Link href={`/${next.slug}`}>{next.title}</Link>
      </nav>
    </main>
  );
}
