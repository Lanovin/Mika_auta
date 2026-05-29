export default function SluzbyDetailLoading() {
  return (
    <div className="container-page" style={{ padding: "48px 40px" }}>
      <div className="animate-pulse" style={{ height: 18, width: 100, background: "var(--black-border)" }} />
      <div
        className="animate-pulse"
        style={{ marginTop: 12, height: 36, width: 360, background: "var(--black-border)" }}
      />
      <div
        className="animate-pulse"
        style={{
          marginTop: 32,
          height: 220,
          background: "var(--black-card)",
          border: "1px solid var(--black-border)",
        }}
      />
    </div>
  );
}
