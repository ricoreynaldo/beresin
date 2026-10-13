import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark teks. Tanpa ikon: nama brand sendiri yang jadi logonya. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("text-[22px] font-bold tracking-[-0.01em] text-ink-900", className)}>
      BERESIN
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
    <header className="relative z-30">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 sm:h-24 md:justify-center md:gap-12">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active === item.key ? "page" : undefined}
              className={cn(
                "relative py-1.5 text-sm text-ink-700 transition-colors hover:text-ink-900",
                "after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:bg-ink-900 after:transition-transform",
                active === item.key ? "text-ink-900 after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-ink-200">
      <div className="container-page flex flex-col gap-3 py-8 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Beresin. Butuh sesuatu? Biar kita Beresin.</p>
        <div className="flex items-center gap-5">
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
      <SiteHeader active={active} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
