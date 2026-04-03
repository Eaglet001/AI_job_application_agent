import React from 'react';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 60, padding: '0 2rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(8,8,16,0.8)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: '#080810',
          fontFamily: 'var(--display)',
        }}>A</div>
        <span style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
          ApplyAI
        </span>
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--green)',
            boxShadow: '0 0 6px var(--green)',
            display: 'block', animation: 'glow 2s ease infinite',
          }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            Llama 3.1 · 70B
          </span>
        </div>
        <a
          href="http://localhost:8000/docs"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          API Docs ↗
        </a>
      </div>
    </nav>
  );
}
