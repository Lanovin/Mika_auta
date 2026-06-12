"use client";

import { useEffect } from "react";

// Replaces the root layout when it crashes, so globals.css is not available
// here — everything must be styled inline.
export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="cs">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0d0d",
          color: "#f3ead7",
          fontFamily: "Arial, Helvetica, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "24px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
            Něco se pokazilo
          </h1>
          <p style={{ marginTop: "12px", fontSize: "14px", color: "#bdb39c" }}>
            Omlouváme se, při načítání webu došlo k chybě. Zkuste stránku obnovit.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: "24px",
              padding: "12px 28px",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "#c9a84c",
              color: "#0d0d0d",
              border: "none",
              cursor: "pointer",
            }}
          >
            Obnovit stránku
          </button>
        </div>
      </body>
    </html>
  );
}
