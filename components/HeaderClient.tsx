"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
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
      <div className="container-page" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100px', gap: '16px' }}>
        {/* Left nav — desktop */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '32px', fontFamily: "var(--font-body)", fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, flex: 1, justifyContent: 'flex-end', paddingRight: '120px' }} className="lg:!flex">
          {leftNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ whiteSpace: 'nowrap', color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)', transition: 'color 0.2s ease', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logo + phone — desktop (absolute center) */}
        <Link
          href="/"
          style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textDecoration: 'none'
          }}
          className="lg:!flex"
          onClick={closeMenu}
        >
          <img
            src="/auto_mika_logo1.png"
            alt="Autobazar MIKA Logo"
            style={{ height: '56px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            marginTop: '2px',
            fontSize: '11px',
            fontWeight: 500,
            color: 'var(--gold)',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-body)'
          }}>
            <Phone style={{ width: '11px', height: '11px' }} />
            +420 774 333 774
          </span>
        </Link>

        {/* Right nav — desktop */}
        <div style={{ display: 'none', alignItems: 'center', gap: '28px', fontFamily: "var(--font-body)", fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase' as const, flex: 1, justifyContent: 'flex-start', paddingLeft: '120px' }} className="lg:!flex">
          {rightNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ whiteSpace: 'nowrap', color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)', transition: 'color 0.2s ease', textDecoration: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)')}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/kontakt" className="btn-primary" style={{ padding: '12px 20px', fontSize: '11px', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
            Domluvit prohlídku
          </Link>
        </div>

        {/* Mobile logo + phone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} className="lg:!hidden">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }} onClick={closeMenu}>
            <img
              src="/auto_mika_logo1.png"
              alt="Autobazar MIKA Logo"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
          </Link>
          <a href="tel:+420774333774" style={{ fontFamily: "var(--font-body)", fontSize: '15px', fontWeight: 600, letterSpacing: '0.06em', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <Phone style={{ width: '14px', height: '14px' }} />
            +420 774 333 774
          </a>
        </div>

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
