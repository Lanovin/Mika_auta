export default function ContactPage() {
  const reasons = [
    "Chci rezervovat prohlídku konkrétního vozu",
    "Potřebuji kalkulaci financování nebo pojištění",
    "Mám zájem o výkup nebo protiúčet"
  ];

  return (
    <div className="container-page py-10 pb-16">
      {/* Header */}
      <header className="max-w-3xl">
        <p className="section-kicker">Kontakt</p>
        <h1
          className="mt-2 text-3xl font-semibold uppercase tracking-[0.03em] sm:text-4xl"
          style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
        >
          Kontakt
        </h1>
        <p className="mt-3 text-sm text-secondary">
          Máte dotaz k vybranému vozu, financování nebo chcete jen nezávazně
          poradit? Ozvěte se nám a společně najdeme řešení, které vám bude
          vyhovovat.
        </p>
      </header>

      <div className="gold-divider" />

      {/* Důvody */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason}
            className="card-panel px-5 py-4 text-sm font-medium text-secondary"
          >
            {reason}
          </div>
        ))}
      </section>

      <div className="gold-divider" />

      {/* Kontaktní info + Formulář */}
      <section className="mt-8 grid gap-10 md:grid-cols-2">
        <div className="card-panel space-y-6 p-6 text-sm text-secondary">
          {/* Rychlý kontakt */}
          <div
            className="px-5 py-5"
            style={{
              background: "var(--black-card)",
              border: "1px solid var(--black-border)",
            }}
          >
            <div
              className="text-xs uppercase tracking-[0.24em] text-secondary"
            >
              Rychlý kontakt
            </div>
            <div
              className="mt-3 text-2xl font-semibold"
              style={{ fontFamily: "Playfair Display, serif", color: "var(--gold-light)" }}
            >
              +420 774 333 774
            </div>
            <div className="mt-2 text-sm text-secondary">
              Odpovídáme rychle během provozní doby a umíme připravit i nezávaznou kalkulaci.
            </div>
          </div>

          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Adresa
            </h2>
            <p className="mt-1">
              Autobazar MIKA
              <br />
              Kostelecká 1144/85
              <br />
              196 00 Praha 9 - Čakovice
              <br />
              Areál nákupního centra Globus
              <br />
              Vedle pneuservisu PROCHAZKA
            </p>
          </div>

          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Kontakt
            </h2>
            <p className="mt-1">
              Telefon: <a href="tel:+420774333774" className="link-primary">+420 774 333 774</a>
              <br />
              E-mail: <a href="mailto:info@mikaauto.cz" className="link-primary">info@mikaauto.cz</a>
            </p>
          </div>

          <div>
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Otevírací doba
            </h2>
            <p className="mt-1">
              Pondělí až pátek: 9:00 - 17:00
              <br />
              Sobota: 9:00 - 13:00
              <br />
              Neděle: zavřeno
              <br />
              Mimo otevírací hodiny dle dohody
            </p>
          </div>

          <div
            className="p-5"
            style={{
              background: "var(--black-card)",
              border: "1px solid var(--black-border)",
            }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Fakturační údaje
            </h2>
            <p className="mt-2 text-sm text-secondary">
              IČO: 27941523
              <br />
              DIČ: CZ27941523
            </p>
          </div>

          <div
            className="p-5"
            style={{
              background: "var(--black-card)",
              border: "1px solid var(--black-border)",
            }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Bankovní spojení
            </h2>
            <p className="mt-2 text-sm text-secondary">
              ČSOB: 216 326 472 / 0300
              <br />
              Česká spořitelna: 248 841 7369 / 0800
            </p>
          </div>

          <div
            className="p-5"
            style={{
              background: "var(--black-card)",
              border: "1px solid var(--black-border)",
            }}
          >
            <h2
              className="text-sm font-semibold"
              style={{ color: "var(--cream)" }}
            >
              Co můžete čekat
            </h2>
            <div className="mt-3 space-y-3 text-sm text-secondary">
              <div>Nejprve si upřesníme, o jaký vůz nebo službu máte zájem.</div>
              <div>Připravíme termín prohlídky, rezervaci a orientační kalkulaci.</div>
              <div>Pokud chcete, navážeme rovnou výkupem nebo protiúčtem vašeho vozu.</div>
            </div>
          </div>
        </div>

        {/* Formulář */}
        <form className="card-panel p-6">
          <h2
            className="text-sm font-semibold"
            style={{ fontFamily: "Playfair Display, serif", color: "var(--cream)" }}
          >
            Napište nám zprávu
          </h2>
          <p className="mt-1 text-xs text-muted">
            Ozveme se vám zpět co nejdříve s odpovědí nebo nezávaznou nabídkou.
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Jméno</label>
              <input
                type="text"
                placeholder="Vaše jméno"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">E-mail</label>
                <input
                  type="email"
                  placeholder="vas@email.cz"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wide text-muted">Telefon</label>
                <input
                  type="tel"
                  placeholder="+420 ..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-muted">Zpráva</label>
              <textarea
                rows={4}
                placeholder="Jaký vůz hledáte nebo s čím vám můžeme pomoci?"
              />
            </div>

            <button type="button" className="btn-primary mt-2 w-full">
              Odeslat zprávu
            </button>
          </div>
        </form>
      </section>

      <div className="gold-divider" />

      {/* Mapa */}
      <section className="mt-10">
        <div
          className="overflow-hidden"
          style={{ border: "1px solid var(--black-border)" }}
        >
          <iframe
            title="Mapa Mika Auto"
            src="https://www.google.com/maps?q=Kosteleck%C3%A1%201144%2F85%2C%20Praha%209%20%C4%8Cakovice&output=embed"
            className="h-72 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
