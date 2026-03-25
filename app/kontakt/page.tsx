import { readContent } from "@/src/lib/content-store";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const content = await readContent();
  const c = content.kontakt as {
    header: { kicker: string; title: string; description: string };
    reasons: string[];
    phone: string;
    phoneNote: string;
    address: { name: string; street: string; city: string; note1: string; note2: string };
    email: string;
    hours: { weekdays: string; saturday: string; sunday: string; note: string };
    billing: { ico: string; dic: string };
    bank: { csob: string; sporitelna: string };
    process: string[];
    formTitle: string;
    formNote: string;
  };

  return (
    <div className="container-page py-10 pb-16">
      {/* Header */}
      <header className="max-w-3xl">
        <p className="section-kicker">{c.header.kicker}</p>
        <h1
          className="mt-2 text-3xl font-semibold uppercase tracking-[0.03em] sm:text-4xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          {c.header.title}
        </h1>
        <p className="mt-3 text-sm text-secondary">
          {c.header.description}
        </p>
      </header>

      <div className="gold-divider" />

      {/* Důvody */}
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {c.reasons.map((reason: string) => (
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
              style={{ fontFamily: "var(--font-display)", color: "var(--gold-light)" }}
            >
              {c.phone}
            </div>
            <div className="mt-2 text-sm text-secondary">
              {c.phoneNote}
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
              {c.address.name}
              <br />
              {c.address.street}
              <br />
              {c.address.city}
              <br />
              {c.address.note1}
              <br />
              {c.address.note2}
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
              Telefon: <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="link-primary">{c.phone}</a>
              <br />
              E-mail: <a href={`mailto:${c.email}`} className="link-primary">{c.email}</a>
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
              {c.hours.weekdays}
              <br />
              {c.hours.saturday}
              <br />
              {c.hours.sunday}
              <br />
              {c.hours.note}
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
              IČO: {c.billing.ico}
              <br />
              DIČ: {c.billing.dic}
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
              ČSOB: {c.bank.csob}
              <br />
              Česká spořitelna: {c.bank.sporitelna}
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
              {c.process.map((step: string, i: number) => (
                <div key={i}>{step}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Formulář */}
        <form className="card-panel p-6">
          <h2
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
          >
            {c.formTitle}
          </h2>
          <p className="mt-1 text-xs text-muted">
            {c.formNote}
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
