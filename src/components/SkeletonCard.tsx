export function SkeletonCard() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--black-card)', border: '1px solid var(--black-border)' }}>
      <div className="animate-pulse" style={{ height: '208px', width: '100%', background: 'var(--black-rich)' }} />
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '12px', padding: '16px' }}>
        <div>
          <div className="animate-pulse" style={{ height: '24px', width: '96px', background: 'var(--black-border)' }} />
          <div className="animate-pulse" style={{ height: '20px', width: '128px', marginTop: '4px', background: 'var(--black-border)' }} />
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <div className="animate-pulse" style={{ height: '24px', width: '64px', background: 'var(--black-border)' }} />
          <div className="animate-pulse" style={{ height: '24px', width: '80px', background: 'var(--black-border)' }} />
          <div className="animate-pulse" style={{ height: '24px', width: '72px', background: 'var(--black-border)' }} />
        </div>
      </div>
    </div>
  );
}