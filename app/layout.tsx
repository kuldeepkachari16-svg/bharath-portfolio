import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { portfolio, origin } from "@/lib/portfolio";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: origin ? new URL(origin) : undefined,
  title: { default: portfolio.name, template: `%s — ${portfolio.name}` },
  description: portfolio.biography,
  icons: {
    icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${portfolio.favicon.src}`,
  },
  openGraph: {
    title: portfolio.name,
    description: portfolio.biography,
    images: [portfolio.og],
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
