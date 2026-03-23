export default function AboutPage() {
  const milestones = [
    "Od roku 2007 vybíráme vozy s důrazem na původ, stav a reálnou použitelnost pro běžný život.",
    "Každý obchod řešíme osobně, ne přes anonymní formuláře bez kontextu.",
    "Dlouhodobě stavíme na doporučení zákazníků a transparentním procesu bez nátlaku."
  ];

  return (
    <div className="pb-16">
      {/* Header */}
      <section className="container-page pt-12 pb-6">
        <p className="section-kicker">O nás</p>
        <h1
          className="mt-2 text-4xl font-semibold uppercase tracking-[0.03em] sm:text-5xl"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
        >
          O nás – Autobazar MIKA
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-secondary sm:text-base">
          Společnost MIKAAUTO s.r.o. se od roku 2007 zabývá výkupem a prodejem
          použitých a zánovních vozidel všech značek.
        </p>
      </section>

      <div className="gold-divider" />

      {/* Historie + Milníky */}
      <section className="container-page mt-10">
        <div className="card-panel p-6 md:p-8">
          <h2
            className="text-3xl font-semibold uppercase tracking-[0.03em]"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
          >
            Naše historie a poslání
          </h2>
          <p className="mt-3 text-sm text-secondary">
            Našim zákazníkům nabízíme vždy bohatou nabídku kvalitních vozů nejrůznějších
            značek a typů, které vždy projdou důkladnou kontrolou, čímž stoprocentně
            garantujeme jejich původ.
          </p>
          <p className="mt-3 text-sm text-secondary">
            Naším hlavním cílem je spokojený zákazník, a proto vám nabízíme ty
            nejkvalitnější služby na <span className="text-highlight">nejvyšší úrovni</span>.
            Autobazar MIKA vám přináší: bohatou nabídku kvalitních vozů, 100% garanci
            původu, individuální a profesionální přístup ke každému zákazníkovi.
          </p>

          <div className="mt-6 space-y-4">
            {milestones.map((milestone, index) => (
              <div
                key={milestone}
                className="flex gap-4 px-4 py-4"
                style={{
                  background: "var(--black-card)",
                  border: "1px solid var(--black-border)",
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-sm font-semibold"
                  style={{
                    background: "var(--gold)",
                    color: "var(--black)",
                  }}
                >
                  0{index + 1}
                </div>
                <p className="text-sm text-secondary">{milestone}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Statistiky */}
      <section className="container-page mt-12">
        <div className="stats-bar">
          <div>
            <div className="stat-value">18+ let</div>
            <div className="stat-label">na trhu</div>
          </div>
          <div>
            <div className="stat-value">1000+</div>
            <div className="stat-label">spokojených klientů</div>
          </div>
          <div>
            <div className="stat-value">100%</div>
            <div className="stat-label">garance původu vozu</div>
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Náš přístup */}
      <section className="container-page mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card-panel px-6 py-6">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--gold-dim)" }}
            >
              Přístup
            </div>
            <div
              className="mt-3 text-xl font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Bez nátlaku a bez nejasností
            </div>
            <p className="mt-2 text-sm text-secondary">
              Naším cílem není jen vůz prodat, ale doporučit auto, které bude dávat
              smysl i po několika letech provozu.
            </p>
          </div>
          <div className="card-panel px-6 py-6">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--gold-dim)" }}
            >
              Výběr
            </div>
            <div
              className="mt-3 text-xl font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Prověřená nabídka místo přemíry kusů
            </div>
            <p className="mt-2 text-sm text-secondary">
              Raději menší a kvalitnější výběr než sklad plný aut, za která nechceme
              ručit.
            </p>
          </div>
          <div className="card-panel px-6 py-6">
            <div
              className="text-xs uppercase tracking-[0.24em]"
              style={{ color: "var(--gold-dim)" }}
            >
              Servis
            </div>
            <div
              className="mt-3 text-xl font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Pomoc i po podpisu smlouvy
            </div>
            <p className="mt-2 text-sm text-secondary">
              Umíme dotáhnout pojištění, financování i převod tak, aby byl celý
              proces pro vás jednoduchý.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
