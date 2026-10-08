import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/portfolio";
export function ProjectGrid({
  projects,
  editorial = false,
}: {
  projects: Project[];
  editorial?: boolean;
}) {
  return (
    <div className={`project-grid ${editorial ? "editorial-grid" : ""}`}>
      {projects.map((p, i) => (
        <Link href={`/${p.slug}`} key={p.slug} className="project-tile">
          <div className="project-cover">
            <Image
              src={p.cover.src}
              width={p.cover.width}
              height={p.cover.height}
              alt=""
              sizes="(max-width: 700px) 100vw, 50vw"
              loading={!editorial && i < 2 ? "eager" : "lazy"}
            />
            {p.coverHover && (
              <Image
                className="cover-hover"
                src={p.coverHover.src}
                width={p.coverHover.width}
                height={p.coverHover.height}
                alt=""
                sizes="(max-width: 700px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="project-caption">
            <h2>{p.title}</h2>
            <span>{p.year}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
