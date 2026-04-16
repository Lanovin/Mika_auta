"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Phone, Clock, ChevronDown, Home, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/src/lib/LanguageContext";
import { t } from "@/src/lib/translations";

type CurrentUser = {
  username: string;
  role: "admin" | "user";
} | null;

interface HeaderClientProps {
  currentUser: CurrentUser;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getLeftNav(lang: "cs" | "en") {
  return [
    { href: "/", label: "", isHome: true },
    { href: "/vozy", label: t("nav.inventory", lang) },
    { href: "/sluzby", label: t("nav.services", lang), hasSubmenu: true }
  ];
}

function getRightNav(lang: "cs" | "en") {
  return [
    { href: "/o-nas", label: t("nav.about", lang) },
    { href: "/kontakt", label: t("nav.contact", lang) }
  ];
}

function getSluzbySubmenu(lang: "cs" | "en") {
  const keys = [
    "service.financovani",
    "service.pojisteni",
    "service.vykup",
    "service.zprostredkovani",
    "service.protiucet",
    "service.hotove",
    "service.uver",
    "service.prevody",
  ];
  // Slugs are based on Czech labels (URLs don't change)
  const csLabels = [
    "Financování vozu",
    "Pojištění",
    "Výkup vozů za hotové",
    "Zprostředkování prodeje",
    "Nákup na protiúčet",
    "Nákup za hotové",
    "Nákup na úvěr",
    "Převody vozidel na městském úřadě",
  ];
  return keys.map((key, i) => ({
    label: t(key, lang),
    href: `/sluzby/${slugify(csLabels[i])}`
  }));
}

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
  const { lang, toggleLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [sluzbyOpen, setSluzbyOpen] = useState(false);
  const [mobileSluzbyOpen, setMobileSluzbyOpen] = useState(false);
  const sluzbyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [alertText, setAlertText] = useState("");
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [kontakt, setKontakt] = useState<{ phone: string; hours: { weekdays: string; saturday: string; sunday: string } } | null>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        const a = data?.alert;
        if (a?.active) {
          const txt = lang === "en" && a.text_en ? a.text_en : a.text;
          setAlertText(txt || "");
        }
        const k = lang === "en" ? (data?.kontakt_en ?? data?.kontakt) : data?.kontakt;
        if (k) setKontakt(k);
      })
      .catch(() => {});
  }, [lang]);

  const leftNav = getLeftNav(lang);
  const rightNav = getRightNav(lang);
  const sluzbySubmenu = getSluzbySubmenu(lang);

  const closeMenu = () => { setIsOpen(false); setMobileSluzbyOpen(false); };

  const openSluzby = () => {
    if (sluzbyTimeout.current) clearTimeout(sluzbyTimeout.current);
    setSluzbyOpen(true);
  };
  const closeSluzby = () => {
    sluzbyTimeout.current = setTimeout(() => setSluzbyOpen(false), 150);
  };

  useEffect(() => {
    return () => { if (sluzbyTimeout.current) clearTimeout(sluzbyTimeout.current); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (currentY < lastScrollY.current || currentY <= 10) {
        setHeaderVisible(true);
      } else if (currentY > lastScrollY.current) {
        setHeaderVisible(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Parse short hours for the top bar
  const shortHours = kontakt ? (() => {
    const wd = kontakt.hours.weekdays;
    const sat = kontakt.hours.saturday;
    // Extract just the time part after the colon/label
    const wdTime = wd.replace(/^[^:]+:\s*/, '').replace(/^[^0-9]*/, '');
    const satTime = sat.replace(/^[^:]+:\s*/, '').replace(/^[^0-9]*/, '');
    return lang === 'cs'
      ? `Po–Pá ${wdTime} · So ${satTime}`
      : `Mon–Fri ${wdTime} · Sat ${satTime}`;
  })() : '';

  return (
    <>
    {/* Top info bar */}
    {kontakt && (
      <div className="topbar" style={{
        position: 'sticky',
        top: headerVisible ? '0' : '-40px',
        zIndex: 31,
        transition: 'top 0.35s ease',
      }}>
        <div className="container-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '36px', gap: '16px' }}>
          <a href={`tel:${kontakt.phone.replace(/\s/g, '')}`}
            className="topbar-item"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: 'var(--gold)', fontWeight: 600, fontSize: '13px', letterSpacing: '0.04em' }}
          >
            <Phone style={{ width: '13px', height: '13px', flexShrink: 0 }} />
            {kontakt.phone}
          </a>
          <span
            className="topbar-item topbar-hours"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--cream-muted)', fontSize: '12px', letterSpacing: '0.04em' }}
          >
            <Clock style={{ width: '12px', height: '12px', flexShrink: 0, color: 'var(--gold-dim)' }} />
            {shortHours}
          </span>
        </div>
      </div>
    )}

    <header style={{ position: 'sticky', top: headerVisible ? (kontakt ? '36px' : '0') : '-140px', zIndex: 30, background: 'var(--black)', borderBottom: alertText && !alertDismissed ? 'none' : '1px solid rgba(201,168,76,0.08)', transition: 'top 0.35s ease' }}>
      <div className="container-page" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '120px', gap: '16px' }}>
        {/* Left nav — desktop */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '36px', fontFamily: "var(--font-body)", fontSize: '15px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' as const, flex: 1, justifyContent: 'flex-end', paddingRight: '180px' }} className="lg:!flex">
          {leftNav.map((item) => {
            if (item.hasSubmenu) {
              const isActive = pathname.startsWith('/sluzby/');
              return (
                <div
                  key={item.href}
                  style={{ position: 'relative' }}
                  onMouseEnter={openSluzby}
                  onMouseLeave={closeSluzby}
                >
                  <span
                    style={{ whiteSpace: 'nowrap', color: isActive || sluzbyOpen ? 'var(--gold)' : 'var(--cream-muted)', transition: 'color 0.2s ease', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = isActive || sluzbyOpen ? 'var(--gold)' : 'var(--cream-muted)')}
                  >
                    {item.label}
                    <ChevronDown style={{ width: '14px', height: '14px', transition: 'transform 0.2s', transform: sluzbyOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </span>
                  {sluzbyOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      paddingTop: '12px',
                      zIndex: 50
                    }}>
                      <div style={{
                        background: 'var(--black-card)',
                        border: '1px solid var(--black-border)',
                        padding: '8px 0',
                        minWidth: '260px',
                        boxShadow: '0 12px 32px rgba(0,0,0,0.5)'
                      }}>
                        {sluzbySubmenu.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setSluzbyOpen(false)}
                            style={{
                              display: 'block',
                              padding: '8px 20px',
                              fontSize: '13px',
                              fontWeight: 400,
                              letterSpacing: '0.06em',
                              textTransform: 'none',
                              color: 'var(--cream-muted)',
                              textDecoration: 'none',
                              transition: 'color 0.15s, background 0.15s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--gold)'; e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--cream-muted)'; e.currentTarget.style.background = 'transparent'; }}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{ whiteSpace: 'nowrap', color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)', transition: 'color 0.2s ease', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)')}
              >
                {'isHome' in item && item.isHome ? <Home style={{ width: '22px', height: '22px' }} /> : item.label}
              </Link>
            );
          })}
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
            src="/mikalogo2.png"
            alt="MIKA AUTO Logo"
            style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{
            fontSize: '10px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase' as const,
            color: 'var(--gold)',
            fontFamily: 'var(--font-body)',
            marginTop: '1px',
          }}>
            since 2007
          </span>
        </Link>

        {/* Right nav — desktop */}
        <div style={{ display: 'none', alignItems: 'center', gap: '36px', fontFamily: "var(--font-body)", fontSize: '15px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' as const, flex: 1, justifyContent: 'flex-start', paddingLeft: '180px' }} className="lg:!flex">
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
          <button
            type="button"
            onClick={toggleLang}
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              marginLeft: 'auto',
              whiteSpace: 'nowrap',
              background: 'transparent',
              border: '1px solid var(--gold-dim)',
              color: 'var(--gold)',
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
              fontFamily: 'var(--font-body)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gold-dim)'; e.currentTarget.style.color = 'var(--gold)'; }}
          >
            <span style={{ opacity: lang === 'cs' ? 1 : 0.4, fontSize: '20px', lineHeight: 1 }}>🇨🇿</span>
            <span style={{ color: 'var(--gold-dim)', fontSize: '13px' }}>/</span>
            <span style={{ opacity: lang === 'en' ? 1 : 0.4, fontSize: '13px', lineHeight: 1, fontWeight: 600, letterSpacing: '0.05em' }}>ENG</span>
          </button>
        </div>

        {/* Mobile: spacer + logo (centered) + hamburger */}
        <div style={{ width: '40px', flexShrink: 0 }} className="lg:!hidden" />
        <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textDecoration: 'none', flexShrink: 0, position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} className="lg:!hidden" onClick={closeMenu}>
          <img
            src="/mikalogo2.png"
            alt="MIKA AUTO Logo"
            style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
          />
          <span style={{
            fontSize: '8px',
            fontWeight: 500,
            letterSpacing: '0.2em',
            textTransform: 'uppercase' as const,
            color: 'var(--gold)',
            fontFamily: 'var(--font-body)',
            marginTop: '1px',
          }}>
            since 2007
          </span>
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', border: '1px solid var(--black-border)', background: 'var(--black-card)', color: 'var(--cream)', transition: 'border-color 0.2s' }}
          className="lg:!hidden"
          aria-label={isOpen ? t("nav.closeMenu", lang) : t("nav.openMenu", lang)}
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
              {[...leftNav, ...rightNav].map((item) => {
                if ('hasSubmenu' in item && item.hasSubmenu) {
                  return (
                    <div key={item.href}>
                      <button
                        type="button"
                        onClick={() => setMobileSluzbyOpen((v) => !v)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '8px 12px',
                          color: pathname.startsWith('/sluzby/') ? 'var(--gold)' : 'var(--cream-muted)',
                          fontWeight: pathname.startsWith('/sluzby/') ? 600 : 400,
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: 'inherit',
                          fontFamily: 'inherit',
                          letterSpacing: 'inherit',
                          textAlign: 'left'
                        }}
                      >
                        {item.label}
                        <ChevronDown style={{ width: '16px', height: '16px', transition: 'transform 0.2s', transform: mobileSluzbyOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                      </button>
                      {mobileSluzbyOpen && (
                        <div style={{ paddingLeft: '12px', borderLeft: '2px solid var(--gold-dim)' }}>
                          {sluzbySubmenu.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={closeMenu}
                              style={{
                                display: 'block',
                                padding: '6px 12px',
                                fontSize: '13px',
                                color: 'var(--cream-muted)',
                                textDecoration: 'none',
                                transition: 'color 0.15s'
                              }}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      color: pathname === item.href ? 'var(--gold)' : 'var(--cream-muted)',
                      fontWeight: pathname === item.href ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'color 0.2s'
                    }}
                  >
                    {'isHome' in item && item.isHome ? <Home style={{ width: '16px', height: '16px' }} /> : item.label}
                  </Link>
                );
              })}
            </nav>

            <div style={{ marginTop: '16px', display: 'grid', gap: '8px' }}>
              <button
                type="button"
                onClick={() => { toggleLang(); closeMenu(); }}
                className="btn-primary"
                style={{ textAlign: 'center', cursor: 'pointer' }}
              >
                {lang === 'cs' ? 'ENG Switch to English' : '🇨🇿 Přepnout do češtiny'}
              </button>
              {currentUser?.role === "admin" ? (
                <Link href="/admin" onClick={closeMenu} className="btn-secondary" style={{ textAlign: 'center' }}>
                  {t("nav.admin", lang)}
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>

    {/* Alert bar – below header */}
    {alertText && !alertDismissed && (
      <div style={{
        position: 'sticky',
        top: headerVisible ? (kontakt ? '156px' : '120px') : '-40px',
        zIndex: 29,
        background: 'linear-gradient(90deg, #c9a84c 0%, #e2c97e 50%, #c9a84c 100%)',
        color: '#0e0e0e',
        fontSize: '13px',
        fontWeight: 600,
        textAlign: 'center',
        padding: '9px 48px',
        lineHeight: 1.4,
        letterSpacing: '0.03em',
        fontFamily: 'var(--font-body)',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        transition: 'top 0.35s ease',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', lineHeight: 1 }}>⚠</span>
          {alertText}
        </span>
        <button
          type="button"
          onClick={() => setAlertDismissed(true)}
          aria-label="Zavřít"
          style={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.08)',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            color: '#3d3018',
            width: '24px',
            height: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.08)'; }}
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      </div>
    )}
    </>
  );
}
