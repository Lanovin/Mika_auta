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

const mainNav = [
  { href: "/", label: "Domů" },
  { href: "/vozy", label: "Nabídka vozů" },
  { href: "/sluzby", label: "Služby" },
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
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/85 backdrop-blur-xl">
      <div className="container-page flex h-[var(--header-height)] items-center justify-between gap-4 lg:gap-6">
        <Link href="/" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          <img
            src="https://www.mikaauto.cz/sites/default/files/userdata/logo_mika.png"
            alt="Autobazar MIKA Logo"
            className="h-9 w-auto sm:h-10"
          />
          <div className="min-w-0">
            <div className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-slate-950 sm:text-xl">Autobazar Mika</div>
            <div className="text-[11px] font-medium uppercase tracking-[0.26em] text-slate-500">Praha 9</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-[15px] font-semibold text-slate-700 lg:gap-7">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap transition-colors hover:text-primary ${pathname === item.href ? "text-primary" : ""}`}
            >
              <span className="relative inline-flex pb-1">
                {item.label}
                {pathname === item.href ? <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" /> : null}
              </span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/kontakt"
            className="inline-flex items-center whitespace-nowrap rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
          >
            Domluvit prohlídku
          </Link>
          <div className="hidden items-center gap-4 xl:flex">
            {currentUser?.role === "admin" ? (
              <Link href="/admin" className="text-xs font-medium text-slate-500 transition hover:text-slate-800">
                Správa vozů
              </Link>
            ) : null}
            <Link href={currentUser ? "/ucet" : "/prihlaseni"} className="text-xs font-medium text-slate-500 transition hover:text-slate-800">
              {currentUser ? `Účet: ${currentUser.username}` : "Přihlášení"}
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 md:hidden"
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={isOpen}
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page py-4">
            <nav className="grid gap-1 text-sm">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`rounded-lg px-3 py-2 ${pathname === item.href ? "bg-primary/10 font-semibold text-primary" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 grid gap-2">
              <Link
                href="/kontakt"
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-primary-dark"
              >
                Domluvit prohlídku
              </Link>
              {currentUser?.role === "admin" ? (
                <Link
                  href="/admin"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Správa vozů
                </Link>
              ) : null}
              <Link
                href={currentUser ? "/ucet" : "/prihlaseni"}
                onClick={closeMenu}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {currentUser ? `Účet: ${currentUser.username}` : "Přihlášení"}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
