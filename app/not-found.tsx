import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">404</span>
      <h1>Page not found.</h1>
      <Link href="/work">Return to Work</Link>
    </main>
  );
}
