"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type CurrentUser = {
  username: string;
  role: "admin" | "user";
} | null;

interface HeaderClientProps {
  currentUser: CurrentUser;
}

const leftNav = [
  { href: "/", label: "Domů" },
  { href: "/vozy", label: "Nabídka vozů" },
  { href: "/sluzby", label: "Služby" }
];

const rightNav = [
  { href: "/o-nas", label: "O nás" },
  { href: "/kontakt", label: "Kontakt" }
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  );
}

export function HeaderClient({ currentUser }: HeaderClientProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-primary/20 bg-slate-950/90 backdrop-blur-xl">
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4">
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium uppercase tracking-[0.16em] text-slate-200">
          {leftNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "text-primary" : ""}`}
            >
              <span className="relative inline-flex pb-1">
                {item.label}
                {pathname === item.href ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
              </span>
            </Link>
          ))}
        </nav>

        <Link href="/" className="hidden lg:flex min-w-0 items-center justify-center" onClick={closeMenu}>
          <img
            src="/auto_mika_logo.png"
            alt="Autobazar MIKA Logo"
            className="h-16 w-auto object-contain"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium uppercase tracking-[0.16em] text-slate-200">
          {rightNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${pathname === item.href ? "text-primary" : ""}`}
            >
              <span className="relative inline-flex pb-1">
                {item.label}
                {pathname === item.href ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
              </span>
            </Link>
          ))}
          <Link
            href="/kontakt"
            className="btn-primary whitespace-nowrap px-6 text-[13px] tracking-[0.08em]"
          >
            Domluvit prohlídku
          </Link>
        </div>

        <Link href="/" className="flex min-w-0 items-center gap-2 lg:hidden" onClick={closeMenu}>
          <img
            src="/auto_mika_logo.png"
            alt="Autobazar MIKA Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-slate-100">Autobazar Mika</div>
            <div className="text-muted text-[11px] font-medium uppercase tracking-[0.24em]">Praha 9</div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-slate-900 text-slate-100 transition hover:bg-slate-800 lg:hidden"
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={isOpen}
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 bg-slate-950 lg:hidden">
          <div className="container-page py-4">
            <nav className="grid gap-1 text-sm">
              {[...leftNav, ...rightNav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-2 ${pathname === item.href ? "bg-primary/15 font-semibold text-primary" : "text-slate-200 hover:bg-white/5"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-2">
              <Link
                href="/kontakt"
                onClick={closeMenu}
                className="btn-primary"
              >
                Domluvit prohlídku
              </Link>
              {currentUser?.role === "admin" ? (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="btn-secondary"
                >
                  Správa vozů
                </Link>
              ) : null}
              <Link
                href={currentUser ? "/ucet" : "/prihlaseni"}
                onClick={closeMenu}
                className="btn-secondary"
              >
                {currentUser ? `Účet: ${currentUser.username}` : "Přihlášení"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
    </header>
  );
}
