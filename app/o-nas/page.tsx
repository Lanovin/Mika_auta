import { readContent } from "@/src/lib/content-store";

export const dynamic = "force-dynamic";

interface ApproachItem {
  kicker: string;
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

export default async function AboutPage() {
  const content = await readContent();
  const c = content.onas as {
    header: { kicker: string; title: string; description: string };
    history: { title: string; text1: string; text2: string; milestones: string[] };
    stats: StatItem[];
    approach: ApproachItem[];
  };

  return (
    <div className="pb-16">
      {/* Header */}
      <section className="container-page pt-12 pb-6">
        <p className="section-kicker">{c.header.kicker}</p>
        <h1
          className="mt-2 text-4xl font-semibold uppercase tracking-[0.03em] sm:text-5xl"
          style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
        >
          {c.header.title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-secondary sm:text-base">
          {c.header.description}
        </p>
      </section>

      <div className="gold-divider" />

      {/* Historie + Milníky */}
      <section className="container-page mt-10">
        <div className="card-panel p-6 md:p-8">
          <h2
            className="text-3xl font-semibold uppercase tracking-[0.03em]"
            style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
          >
            {c.history.title}
          </h2>
          <p className="mt-3 text-sm text-secondary">
            {c.history.text1}
          </p>
          <p className="mt-3 text-sm text-secondary">
            {c.history.text2}
          </p>

          <div className="mt-6 space-y-4">
            {c.history.milestones.map((milestone: string, index: number) => (
              <div
                key={index}
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
          {c.stats.map((stat: StatItem, i: number) => (
            <div key={i}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="gold-divider" />

      {/* Náš přístup */}
      <section className="container-page mt-12">
        <div className="grid gap-6 md:grid-cols-3">
          {c.approach.map((item: ApproachItem, i: number) => (
            <div key={i} className="card-panel px-6 py-6">
              <div
                className="text-xs uppercase tracking-[0.24em]"
                style={{ color: "var(--gold-dim)" }}
              >
                {item.kicker}
              </div>
              <div
                className="mt-3 text-xl font-semibold"
                style={{ color: "var(--cream)" }}
              >
                {item.title}
              </div>
              <p className="mt-2 text-sm text-secondary">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
