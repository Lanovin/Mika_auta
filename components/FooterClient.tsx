"use client";

import { useLanguage } from "@/src/lib/LanguageContext";
import { t } from "@/src/lib/translations";

interface FooterContent {
  description: string;
  copyright: string;
  tagline: string;
  partners: string[];
}

interface KontaktContent {
  phone: string;
  email: string;
  address: { street: string; city: string; note1: string };
  hours: { weekdays: string; saturday: string; sunday: string };
}

interface FooterClientProps {
  f: FooterContent;
  fEn: FooterContent;
  k: KontaktContent;
  kEn: KontaktContent;
}

export function FooterClient({ f, fEn, k, kEn }: FooterClientProps) {
  const { lang } = useLanguage();
  const fc = lang === "en" ? fEn : f;
  const kc = lang === "en" ? kEn : k;

  return (
    <footer style={{ marginTop: '80px', borderTop: '1px solid var(--black-border)', background: 'var(--black)' }}>
      <div className="container-page" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(3, 1fr)' }} className="footer-grid">
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: '20px', fontWeight: 700, color: 'var(--white)' }}>
              Mika <span style={{ color: 'var(--gold)' }}>Auto</span>
            </div>
            <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>
              {fc.description}
            </p>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginTop: '20px', marginBottom: '10px' }}>{t("footer.social", lang)}</div>
            <a
              href="https://www.instagram.com/mikaauto.cz?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="footer-ig-link"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 011.47.957c.453.453.757.91.957 1.47.163.46.349 1.26.404 2.43.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 01-.957 1.47 4.088 4.088 0 01-1.47.957c-.46.163-1.26.349-2.43.404-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 01-1.47-.957 4.088 4.088 0 01-.957-1.47c-.163-.46-.349-1.26-.404-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 01.957-1.47A4.088 4.088 0 015.063 2.293c.46-.163 1.26-.349 2.43-.404C8.759 1.831 9.139 1.82 12 1.82h.343M12 0C8.741 0 8.333.014 7.053.072 5.775.131 4.903.333 4.14.63a5.876 5.876 0 00-2.126 1.384A5.876 5.876 0 00.63 4.14C.333 4.903.131 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.059 1.278.261 2.15.558 2.913a5.876 5.876 0 001.384 2.126 5.876 5.876 0 002.126 1.384c.763.297 1.635.499 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.059 2.15-.261 2.913-.558a5.876 5.876 0 002.126-1.384 5.876 5.876 0 001.384-2.126c.297-.763.499-1.635.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.059-1.278-.261-2.15-.558-2.913a5.876 5.876 0 00-1.384-2.126A5.876 5.876 0 0019.86.63C19.097.333 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
          </div>

          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px' }}>{t("footer.address", lang)}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>{kc.address.street}</div>
              <div>{kc.address.city}</div>
              <div>{kc.address.note1}</div>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>{t("footer.hours", lang)}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>{kc.hours.weekdays}</div>
              <div>{kc.hours.saturday}</div>
              <div>{kc.hours.sunday}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px' }}>{t("footer.contact", lang)}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>Tel.: {kc.phone}</div>
              <div>Email: {kc.email}</div>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>{lang === 'cs' ? 'Finance' : 'Finance'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {[
                { src: '/partners/moneta.png', href: 'https://gemoney.cz/', alt: 'Moneta' },
                { src: '/partners/leasingcs-logo.png', href: 'https://leasingcs.cz/', alt: 'Leasing ČS' },
                { src: '/partners/kb_essox.png', href: 'https://www.essox.cz/', alt: 'Essox' },
                { src: '/partners/homecredit.png', href: 'https://www.homecredit.cz/', alt: 'Home Credit' },
              ].map((p) => (
                <a key={p.alt} href={p.href} target="_blank" rel="noopener noreferrer" className="partner-logo-link">
                  <img src={p.src} alt={p.alt} style={{ height: '32px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.6, transition: 'opacity 0.2s' }} />
                </a>
              ))}
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginTop: '20px', marginBottom: '12px' }}>{lang === 'cs' ? 'Pojištění' : 'Insurance'}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              {[
                { src: '/partners/generali_poj.png', href: 'https://www.generaliceska.cz/', alt: 'Generali' },
                { src: '/partners/defend.jpg', href: 'https://www.defendinsurance.eu/', alt: 'Defend Insurance' },
                { src: '/partners/cebia.gif', href: 'https://www.cebia.cz/', alt: 'Cebia' },
              ].map((p) => (
                <a key={p.alt} href={p.href} target="_blank" rel="noopener noreferrer" className="partner-logo-link">
                  <img src={p.src} alt={p.alt} style={{ height: '32px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.6, transition: 'opacity 0.2s' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--black-border)', padding: '16px 0' }}>
        <div className="container-page" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ textAlign: 'center', flex: '1 1 auto' }}>{fc.copyright}</span>
          <span style={{ textAlign: 'center', flex: '1 1 auto' }}>{fc.tagline}</span>
        </div>
      </div>

      <style>{`
        .footer-ig-link {
          display: inline-flex;
          color: var(--gold);
          transition: opacity 0.2s;
        }
        .footer-ig-link:hover {
          opacity: 0.7;
        }
        .partner-logo-link img {
          transition: opacity 0.2s;
        }
        .partner-logo-link:hover img {
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </footer>
  );
}
