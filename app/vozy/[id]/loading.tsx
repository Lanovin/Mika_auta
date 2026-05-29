export default function VozyDetailLoading() {
  return (
    <div className="container-page" style={{ padding: "32px 24px" }}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)]">
        <div>
          <div
            className="animate-pulse"
            style={{
              width: "100%",
              height: "clamp(16rem, 50vw, 32rem)",
              background: "var(--black-rich)",
              border: "1px solid var(--black-border)",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse"
                style={{ width: 64, height: 44, background: "var(--black-border)" }}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            padding: 24,
            background: "var(--black-card)",
            border: "1px solid var(--black-border)",
            height: "fit-content",
          }}
        >
          <div className="animate-pulse" style={{ height: 18, width: 120, background: "var(--black-border)" }} />
          <div
            className="animate-pulse"
            style={{ marginTop: 12, height: 32, width: "70%", background: "var(--black-border)" }}
          />
          <div
            className="animate-pulse"
            style={{ marginTop: 20, height: 80, width: "100%", background: "var(--black-rich)" }}
          />
          <div
            className="animate-pulse"
            style={{ marginTop: 16, height: 44, width: "100%", background: "var(--black-border)" }}
          />
        </div>
      </div>
    </div>
  );
}
