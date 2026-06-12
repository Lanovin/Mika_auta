import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page" style={{ padding: "80px 16px", textAlign: "center" }}>
      <p className="section-kicker">404</p>
      <h1
        className="mt-2 text-2xl font-semibold uppercase tracking-[0.03em] sm:text-3xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
      >
        Stránka nenalezena
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--cream-muted)" }}>
        Tato stránka neexistuje nebo byla přesunuta.
      </p>
      <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/" className="btn-primary inline-flex">
          Zpět na úvod
        </Link>
        <Link href="/sluzby" className="btn-primary inline-flex">
          Naše služby
        </Link>
      </div>
    </div>
  );
}
