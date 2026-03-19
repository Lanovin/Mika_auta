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
    <footer className="mt-20 border-t border-white/70 bg-slate-950 text-slate-200">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-2xl font-semibold uppercase tracking-[0.08em] text-white">
              Mika Auto – váš spolehlivý autobazar
            </div>
            <div className="mt-3 text-sm text-slate-300">
              Pomáháme lidem bezpečně a pohodlně koupit kvalitní ojetý vůz, který
              sedne jejich životnímu stylu i rozpočtu.
            </div>
            <div className="mt-6 grid gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Garance původu a prověřený technický stav
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Osobní přístup, financování a výkup na jednom místě
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Stránky</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link href="/" className="hover:text-white">Domů</Link></li>
              <li><Link href="/vozy" className="hover:text-white">Nabídka vozů</Link></li>
              <li><Link href="/sluzby" className="hover:text-white">Služby</Link></li>
              <li><Link href="/o-nas" className="hover:text-white">O nás</Link></li>
              <li><Link href="/kontakt" className="hover:text-white">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Adresa</div>
            <div className="mt-3 text-sm text-slate-300">
              <div>Kostelecká 1144/85</div>
              <div>Praha 9 - Čakovice 196 00</div>
              <div>Areál nákupního centra Globus</div>
            </div>
            <div className="mt-5 text-sm font-semibold text-white">Otevírací doba</div>
            <div className="mt-3 text-sm text-slate-300">
              <div>Po–Pá: 9:00–17:00</div>
              <div>So: 9:00–13:00</div>
              <div>Ne: zavřeno</div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-white">Kontakt</div>
            <div className="mt-3 text-sm text-slate-300">
              <div>Tel.: +420 774 333 774</div>
              <div>Email: info@mikaauto.cz</div>
            </div>
            <div className="mt-5 text-sm font-semibold text-white">Partneři</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {partners.map((partner) => (
                <span key={partner} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
                  {partner}
                </span>
              ))}
            </div>
            <div className="mt-5">
              <div className="text-sm font-semibold text-white">Newsletter</div>
              <div className="mt-3 flex">
                <input
                  type="email"
                  placeholder="Váš email"
                  className="flex-1 rounded-l-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-primary focus:outline-none"
                />
                <button className="rounded-r-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
                  Odebírat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-slate-950 py-4">
        <div className="container-page flex flex-col items-start gap-1 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Mika Auto – férové jednání a osobní přístup ke každému zákazníkovi.</span>
          <span>Praha 9 • prověřené vozy • osobní servis</span>
        </div>
      </div>
    </footer>
  );
}

