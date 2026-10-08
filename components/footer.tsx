import Link from "next/link";
import { portfolio } from "@/lib/portfolio";
export function SocialLinks() {
  return (
    <div className="social-links">
      {portfolio.social
        .filter((s) => s.label !== "Email")
        .map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
    </div>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <Link href="/contact" className="footer-contact">
          Contact
        </Link>
        <SocialLinks />
      </div>
      <div className="footer-bottom">
        <span>Bharath Vishwakarma</span>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}
