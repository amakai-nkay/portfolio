import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — solutions engineering portfolio`,
  description: "Solutions engineering, customer success and product marketing work, built around Kova, a working demo product with a real API.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <header className="nav">
          <div className="nav-in">
            <Link href="/" className="nav-name">{site.name}</Link>
            <nav aria-label="Main">
              <Link href="/kova">Try Kova</Link>
              <Link href="/kova/docs">API</Link>
              <Link href="/#demo">Demo</Link>
              <Link href="/#work">Work</Link>
              <Link href="/#about">About</Link>
            </nav>
            {site.cvUrl ? <a className="btn small" href={site.cvUrl}>Download CV</a> : null}
          </div>
        </header>
        {children}
        <footer className="foot">
          <div className="wrap">
            <p>{site.name}. Kova is a product I made up so I could show real work without breaking client confidentiality. The data in it is fictional; the code, API and integrations are real.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
