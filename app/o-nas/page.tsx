import Image from "next/image";

export default function AboutPage() {
  const milestones = [
    "Od roku 2007 vybíráme vozy s důrazem na původ, stav a reálnou použitelnost pro běžný život.",
    "Každý obchod řešíme osobně, ne přes anonymní formuláře bez kontextu.",
    "Dlouhodobě stavíme na doporučení zákazníků a transparentním procesu bez nátlaku."
  ];

  return (
    <div className="pb-16">
      <section className="relative h-72 w-full overflow-hidden bg-slate-900 sm:h-80">
        <Image
          src="https://lh6.googleusercontent.com/proxy/7G7xKKpkBip0iiv17iIE6-BAnLnts3dFyha8OG3nWx_Z4mb7dLr028_t_yPKYnLvTC5cnLK0zetK"
          alt="Showroom s vozy"
          fill
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent" />
        <div className="relative h-full">
          <div className="container-page flex h-full flex-col justify-center">
            <p className="section-kicker text-amber-300">O nás</p>
            <h1 className="mt-2 font-display text-4xl font-semibold uppercase tracking-[0.03em] text-white sm:text-5xl">
              O nás – Autobazar MIKA
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-200 sm:text-base">
              Společnost MIKAAUTO s.r.o. se od roku 2007 zabývá výkupem a prodejem použitých a zánovních vozidel všech značek.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page mt-10 grid gap-10 md:grid-cols-2">
        <div className="card-panel p-6 md:p-8">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.03em] text-slate-900">
            Naše historie a poslání
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Našim zákazníkům nabízíme vždy bohatou nabídku kvalitních vozů nejrůznějších značek a typů, které vždy projdou důkladnou kontrolou, čímž stoprocentně garantujeme jejich původ.
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Naším hlavním cílem je spokojený zákazník, a proto vám nabízíme ty nejkvalitnější služby na nejvyšší úrovni. Autobazar MIKA vám přináší: bohatou nabídku kvalitních vozů, 100% garanci původu, individuální a profesionální přístup ke každému zákazníkovi.
          </p>

          <div className="mt-6 space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone} className="flex gap-4 rounded-[24px] bg-slate-50 px-4 py-4 ring-1 ring-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  0{index + 1}
                </div>
                <p className="text-sm text-slate-600">{milestone}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-panel p-3">
          <div className="relative h-80 overflow-hidden rounded-[24px] bg-slate-100 shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1200&q=80"
              alt="Spokojený zákazník přebírá vůz"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page mt-12">
        <div className="card-panel px-6 py-8 md:px-10">
          <div className="grid gap-6 text-center text-sm text-slate-700 md:grid-cols-3">
            <div>
              <div className="text-2xl font-semibold text-slate-900">
                18+ let
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                na trhu
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">
                1000+
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                spokojených klientů
              </div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-slate-900">
                100%
              </div>
              <div className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                garance původu vozu
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-slate-950 px-6 py-6 text-white shadow-soft">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-300">Přístup</div>
            <div className="mt-3 text-xl font-semibold">Bez nátlaku a bez nejasností</div>
            <p className="mt-2 text-sm text-slate-300">Naším cílem není jen vůz prodat, ale doporučit auto, které bude dávat smysl i po několika letech provozu.</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/85 px-6 py-6 shadow-panel">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Výběr</div>
            <div className="mt-3 text-xl font-semibold text-slate-900">Prověřená nabídka místo přemíry kusů</div>
            <p className="mt-2 text-sm text-slate-600">Raději menší a kvalitnější výběr než sklad plný aut, za která nechceme ručit.</p>
          </div>
          <div className="rounded-[28px] border border-white/70 bg-white/85 px-6 py-6 shadow-panel">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Servis</div>
            <div className="mt-3 text-xl font-semibold text-slate-900">Pomoc i po podpisu smlouvy</div>
            <p className="mt-2 text-sm text-slate-600">Umíme dotáhnout pojištění, financování i převod tak, aby byl celý proces pro vás jednoduchý.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

