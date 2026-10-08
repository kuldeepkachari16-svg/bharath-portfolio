"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
const links = [
  ["/", "Home"],
  ["/work", "Work"],
  ["/design-projects", "Design projects"],
  ["/contact", "Contact"],
];
export function Header() {
  const pathname = usePathname().replace(/\/$/, "") || "/";
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="site-header" id="top">
      <Link
        className="wordmark"
        href="/"
        aria-label="Bharath Vishwakarma — home"
      >
        Bharath
        <br />
        Vishwakarma<span className="wordmark-dot">.</span>
      </Link>
      <button
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id="navigation"
        aria-label="Main navigation"
        className={open ? "navigation open" : "navigation"}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {links.map(([href, title]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
          >
            {title}
          </Link>
        ))}
      </nav>
    </header>
  );
}
