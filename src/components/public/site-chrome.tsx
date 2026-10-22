import Link from "next/link";
import { ArrowUpRight, Sparkle } from "lucide-react";
import { RequestCta } from "@/components/public/request-cta";
import { MotionObserver } from "@/components/public/motion-observer";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Beresin — Beranda" className={cn("site-logo", className)}>
      BERESIN<span>.</span>
    </Link>
  );
}

const NAV = [
  { href: "/", label: "Beranda", key: "home" },
  { href: "/#cara-kerja", label: "Cara Kerja", key: "how" },
  { href: "/#kategori", label: "Kategori", key: "categories" },
  { href: "/#faq", label: "FAQ", key: "faq" },
] as const;

export type NavKey = (typeof NAV)[number]["key"];

export function SiteHeader({ active }: { active?: NavKey }) {
  return (
    <header className="site-header">
      <div className="container-page header-inner">
        <Logo />
        <nav className="site-nav" aria-label="Navigasi utama">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
              className={cn("nav-link", active === item.key && "nav-active")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <RequestCta size="sm" className="header-cta">Buat request <ArrowUpRight size={15} aria-hidden="true" /></RequestCta>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container-page footer-main">
        <div><Logo /><p>Banyak kebutuhan. Satu teman beresin.</p></div>
        <div className="footer-links">
          <Link href="/#cara-kerja" className="hover:text-ink-900">
            Cara Kerja
          </Link>
          <Link href="/#faq" className="hover:text-ink-900">
            FAQ
          </Link>
          <Link href="/request" className="hover:text-ink-900">
            Buat Request
          </Link>
        </div>
      </div>
      <div className="container-page footer-bottom"><p>© {new Date().getFullYear()} Beresin.</p><p>Dibikin dengan niat. Diberesin bareng.</p><span className="footer-flower" aria-hidden="true"><Sparkle strokeWidth={1.4} /></span></div>
    </footer>
  );
}

export function PublicShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: NavKey;
}) {
  return (
    <div className="site-frame flex flex-col">
      <a href="#main-content" className="skip-link">Langsung ke konten</a>
      <SiteHeader active={active} />
      <main id="main-content" className="flex-1"><MotionObserver />{children}</main>
      <SiteFooter />
    </div>
  );
}
