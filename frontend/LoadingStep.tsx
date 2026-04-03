import React, { useEffect, useState } from 'react';

const STEPS = [
  { id: 1, label: 'Parsing your CV',          icon: '📄', detail: 'Extracting skills, experience & education' },
  { id: 2, label: 'Analyzing job description', icon: '🔍', detail: 'Identifying requirements & keywords' },
  { id: 3, label: 'Running gap analysis',      icon: '📊', detail: 'Comparing your profile against the role' },
  { id: 4, label: 'Rewriting your CV',         icon: '✍️', detail: 'Tailoring content for maximum impact' },
  { id: 5, label: 'Crafting cover letter',     icon: '💌', detail: 'Personalizing your application story' },
];

export default function LoadingStep() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(p => (p < STEPS.length - 1 ? p + 1 : p));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fade-in" style={{ maxWidth: 520, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>

      {/* Spinner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{
          width: 80, height: 80, margin: '0 auto 1.5rem',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <h2 style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 8 }}>
          Analyzing your application
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          5 AI agents are working on your application right now
        </p>
      </div>

      {/* Pipeline steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
        {STEPS.map((step, i) => {
          const done    = i < active;
          const current = i === active;
          return (
            <div key={step.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 'var(--r)',
              border: `1px solid ${current ? 'rgba(200,251,87,0.3)' : done ? 'var(--border)' : 'var(--border)'}`,
              background: current ? 'var(--accent-dim)' : done ? 'var(--bg-card)' : 'var(--bg-card)',
              transition: 'all 0.4s ease',
              opacity: i > active + 1 ? 0.4 : 1,
            }}>
              {/* Status icon */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: done ? 'var(--green-dim)' : current ? 'var(--accent-dim)' : 'var(--bg-input)',
                border: `1px solid ${done ? 'var(--green)' : current ? 'var(--accent)' : 'var(--border)'}`,
                fontSize: '0.85rem',
              }}>
                {done ? '✓' : current ? (
                  <span style={{ width: 12, height: 12, border: '2px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%', display: 'block', animation: 'spin 0.7s linear infinite' }} />
                ) : step.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: '0.88rem',
                  color: done ? 'var(--text-muted)' : current ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                  Agent {step.id} · {step.label}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: 1 }}>
                  {step.detail}
                </div>
              </div>

              {done && (
                <span style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600 }}>Done</span>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: '2rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
        This usually takes 20–40 seconds depending on CV length
      </p>
    </div>
  );
}
