"use client";

import { useEffect } from "react";

function isChunkLoadError(error: Error) {
  return error.name === "ChunkLoadError"
    || /loading( css)? chunk .*failed/i.test(error.message || "");
}

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[error-boundary]", error);

    // Stale deployment chunks: a single guarded reload fetches the fresh build.
    if (isChunkLoadError(error)) {
      try {
        const key = "mika-error-reload-at";
        const last = Number(window.sessionStorage.getItem(key) || "0");
        if (Date.now() - last > 60000) {
          window.sessionStorage.setItem(key, String(Date.now()));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <div className="container-page" style={{ padding: "80px 16px", textAlign: "center" }}>
      <p className="section-kicker">Mika Auto</p>
      <h1
        className="mt-2 text-2xl font-semibold uppercase tracking-[0.03em] sm:text-3xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--cream)" }}
      >
        Něco se pokazilo
      </h1>
      <p className="mt-3 text-sm" style={{ color: "var(--cream-muted)" }}>
        Omlouváme se, při načítání stránky došlo k chybě. Zkuste to prosím znovu.
      </p>
      <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button type="button" className="btn-primary" onClick={() => reset()}>
          Zkusit znovu
        </button>
        <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
          Obnovit stránku
        </button>
      </div>
    </div>
  );
}
