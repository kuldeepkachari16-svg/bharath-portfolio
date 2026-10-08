import Image from "next/image";
import Link from "next/link";
import { portfolio, projects } from "@/lib/portfolio";
import { ProjectGrid } from "@/components/project-grid";
import { SocialLinks } from "@/components/footer";
export default function Home() {
  return (
    <main id="main">
      <section className="home-intro">
        <div className="intro-label">Visual Artist</div>
        <h1>
          Bharath
          <br />
          <em>Vishwakarma</em>
        </h1>
        <div className="intro-bottom">
          <span>Photography · Mix media · Cinematography</span>
          <Link className="text-link" href="/design-projects">
            Explore portfolio
          </Link>
        </div>
      </section>
      <figure className="home-image">
        <Image
          src={portfolio.portrait.src}
          alt="Photographic work by Bharath Vishwakarma"
          width={portfolio.portrait.width}
          height={portfolio.portrait.height}
          sizes="100vw"
          priority
        />
      </figure>
      <section className="about-section">
        <span className="eyebrow">About</span>
        <div>
          <p>{portfolio.biography}</p>
          <SocialLinks />
        </div>
      </section>
      <section className="home-projects">
        <div className="section-heading">
          <h2>Design projects</h2>
          <span className="eyebrow">01 — 04</span>
        </div>
        <ProjectGrid
          projects={projects.filter((p) => p.collection === "design-projects")}
          editorial
        />
        <div className="collection-link">
          <Link href="/work">Explore Work</Link>
          <span>
            {projects.filter((p) => p.collection === "work").length} projects
          </span>
        </div>
      </section>
    </main>
  );
}
