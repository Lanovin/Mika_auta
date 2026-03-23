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
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--black)', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
      <div className="container-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 'var(--header-height)', gap: '16px' }}>
        {/* Left nav — desktop */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px', fontFamily: "'Raleway', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const }} className="lg:!flex">
          {leftNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)', transition: 'color 0.2s ease', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo — desktop */}
        <Link href="/" style={{ display: 'none', alignItems: 'center', justifyContent: 'center' }} className="lg:!flex" onClick={closeMenu}>
          <img
            src="/auto_mika_logo.png"
            alt="Autobazar MIKA Logo"
            style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
          />
        </Link>

        {/* Right nav — desktop */}
        <div style={{ display: 'none', alignItems: 'center', gap: '28px', fontFamily: "'Raleway', sans-serif", fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const }} className="lg:!flex">
          {rightNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)', transition: 'color 0.2s ease', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)')}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/kontakt" className="btn-primary" style={{ padding: '12px 28px', fontSize: '11px' }}>
            Domluvit prohlídku
          </Link>
        </div>

        {/* Mobile logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} className="lg:!hidden" onClick={closeMenu}>
          <img
            src="/auto_mika_logo.png"
            alt="Autobazar MIKA Logo"
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
          />
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '16px', fontWeight: 700, color: 'var(--white)', letterSpacing: '0.04em' }}>
              Autobazar <span style={{ color: 'var(--gold)' }}>Mika</span>
            </div>
            <div style={{ fontFamily: "'Raleway', sans-serif", fontSize: '10px', letterSpacing: '0.24em', textTransform: 'uppercase' as const, color: 'var(--text-muted)' }}>Praha 9</div>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', border: '1px solid var(--black-border)', background: 'var(--black-card)', color: 'var(--cream)', transition: 'border-color 0.2s' }}
          className="lg:!hidden"
          aria-label={isOpen ? "Zavřít menu" : "Otevřít menu"}
          aria-expanded={isOpen}
        >
          <MenuIcon open={isOpen} />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen ? (
        <div style={{ borderTop: '1px solid var(--black-border)', background: 'var(--black)' }} className="lg:!hidden">
          <div className="container-page" style={{ padding: '16px 40px' }}>
            <nav style={{ display: 'grid', gap: '4px', fontSize: '14px' }}>
              {[...leftNav, ...rightNav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  style={{
                    display: 'block',
                    padding: '8px 12px',
                    color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)',
                    fontWeight: pathname === item.href ? 600 : 400,
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
              <Link href="/kontakt" onClick={closeMenu} className="btn-primary" style={{ textAlign: 'center' }}>
                Domluvit prohlídku
              </Link>
              {currentUser?.role === "admin" ? (
                <Link href="/admin" onClick={closeMenu} className="btn-secondary" style={{ textAlign: 'center' }}>
                  Správa vozů
                </Link>
              ) : null}
              <Link
                href={currentUser ? "/ucet" : "/prihlaseni"}
                onClick={closeMenu}
                className="btn-secondary"
                style={{ textAlign: 'center' }}
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
