import React, { useEffect, useState } from 'react';

interface Props { score: number; }

export default function MatchScore({ score }: Props) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(score / 40);
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { setDisplayed(score); clearInterval(timer); }
      else setDisplayed(start);
    }, 30);
    return () => clearInterval(timer);
  }, [score]);

  const color = score >= 80 ? 'var(--green)' : score >= 60 ? 'var(--accent)' : 'var(--red)';
  const label = score >= 80 ? 'Strong Match' : score >= 60 ? 'Good Match' : 'Needs Work';
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '1.2rem' }}>
        Match Score
      </div>

      <div style={{ position: 'relative', width: 130, height: 130, margin: '0 auto 1.2rem' }}>
        <svg width="130" height="130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r="52" fill="none" stroke="var(--border)" strokeWidth="8" />
          <circle
            cx="65" cy="65" r="52" fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '2rem', color, lineHeight: 1 }}>
            {displayed}%
          </div>
        </div>
      </div>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: score >= 80 ? 'var(--green-dim)' : score >= 60 ? 'var(--accent-dim)' : 'var(--red-dim)',
        border: `1px solid ${color}40`,
        borderRadius: 100, padding: '4px 14px',
        fontSize: '0.8rem', fontWeight: 600, color,
      }}>
        {score >= 80 ? '✓' : score >= 60 ? '~' : '!'} {label}
      </div>
    </div>
  );
}
