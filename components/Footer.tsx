import Link from "next/link";

const partners = [
  "GE Money",
  "Sauto Leasing",
  "Essox",
  "Home Credit",
  "Česká pojišťovna",
  "Defend Insurance",
  "Cebia"
];

export function Footer() {
  return (
    <footer style={{ marginTop: '80px', borderTop: '1px solid var(--black-border)', background: 'var(--black)' }}>
      <div className="container-page" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div style={{ display: 'grid', gap: '40px', gridTemplateColumns: 'repeat(4, 1fr)' }} className="footer-grid">
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '20px', fontWeight: 700, color: 'var(--white)' }}>
              Mika <span style={{ color: 'var(--gold)' }}>Auto</span>
            </div>
            <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, fontWeight: 300 }}>
              Pomáháme lidem bezpečně a pohodlně koupit kvalitní ojetý vůz, který
              sedne jejich životnímu stylu i rozpočtu.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px' }}>Stránky</div>
            <nav style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
              <Link href="/" className="nav-link">Domů</Link>
              <Link href="/vozy" className="nav-link">Nabídka vozů</Link>
              <Link href="/sluzby" className="nav-link">Služby</Link>
              <Link href="/o-nas" className="nav-link">O nás</Link>
              <Link href="/kontakt" className="nav-link">Kontakt</Link>
            </nav>
          </div>

          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px' }}>Adresa</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>Kostelecká 1144/85</div>
              <div>Praha 9 - Čakovice 196 00</div>
              <div>Areál nákupního centra Globus</div>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>Otevírací doba</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>Po–Pá: 9:00–17:00</div>
              <div>So: 9:00–13:00</div>
              <div>Ne: zavřeno</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px' }}>Kontakt</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              <div>Tel.: +420 774 333 774</div>
              <div>Email: info@mikaauto.cz</div>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600, marginTop: '24px', marginBottom: '12px' }}>Partneři</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {partners.map((partner) => (
                <span key={partner} style={{ border: '1px solid var(--black-border)', padding: '4px 10px', fontSize: '11px', color: 'var(--cream-muted)' }}>
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--black-border)', padding: '16px 0' }}>
        <div className="container-page" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '8px' }}>
          <span>© 2026 Mika Auto – férové jednání a osobní přístup ke každému zákazníkovi.</span>
          <span>Praha 9 • prověřené vozy • osobní servis</span>
        </div>
      </div>

      <style>{`
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

