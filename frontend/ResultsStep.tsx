import React, { useState } from 'react';
import { JobApplicationResponse } from '@/types';
import MatchScore from './MatchScore';

interface Props {
  result: JobApplicationResponse;
  cvText: string;
  jdText: string;
  onReset: () => void;
}

type Tab = 'overview' | 'cv' | 'cover';

export default function ResultsStep({ result, cvText, jdText, onReset }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [copied, setCopied] = useState(false);
  const { tailored_cv: cv } = result;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: 'overview',  label: '📊 Overview' },
    { id: 'cv',        label: '📄 Tailored CV' },
    { id: 'cover',     label: '💌 Cover Letter' },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.8rem', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Results for <span style={{ color: 'var(--accent)' }}>{cv.name}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Analysis complete · {result.missing_skills.length} skill gaps found · {result.recommendations.length} recommendations
          </div>
        </div>
        <button className="btn btn-ghost" onClick={onReset} style={{ fontSize: '0.85rem' }}>
          ← New Application
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--r)', padding: 5, marginBottom: '1.5rem',
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: '9px 16px', borderRadius: 8, border: 'none',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
            transition: 'all 0.15s',
            background: tab === t.id ? 'var(--bg-hover)' : 'transparent',
            color: tab === t.id ? 'var(--text)' : 'var(--text-muted)',
            fontFamily: 'var(--body)',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gap: '1.2rem' }}>
          {/* Top row */}
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1.2rem' }}>
            <MatchScore score={result.match_score} />

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '1.2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--red-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>⚠️</div>
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--red)' }}>{result.missing_skills.length}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Missing Skills</div>
                </div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--yellow-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>🔑</div>
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--yellow)' }}>{result.keyword_gaps.length}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Keyword Gaps</div>
                </div>
              </div>
            </div>
          </div>

          {/* Missing skills */}
          {result.missing_skills.length > 0 && (
            <div className="card">
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--red)' }}>●</span> Missing Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.missing_skills.map(s => (
                  <span key={s} className="tag" style={{ background: 'var(--red-dim)', border: '1px solid rgba(255,79,109,0.2)', color: 'var(--red)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Keyword gaps */}
          {result.keyword_gaps.length > 0 && (
            <div className="card">
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--yellow)' }}>●</span> Keyword Gaps
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.keyword_gaps.map(k => (
                  <span key={k} className="tag" style={{ background: 'var(--yellow-dim)', border: '1px solid rgba(255,203,71,0.2)', color: 'var(--yellow)' }}>
                    {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="card">
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--accent)' }}>●</span> AI Recommendations
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.recommendations.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                    background: 'var(--accent-dim)', border: '1px solid rgba(200,251,87,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.68rem', fontWeight: 700, color: 'var(--accent)',
                  }}>{i + 1}</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{r}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CV TAB ── */}
      {tab === 'cv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* CV Header */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card), #0f1520)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.02em', marginBottom: 6 }}>{cv.name}</h2>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  {cv.email && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✉️ {cv.email}</span>}
                  {cv.phone && <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📱 {cv.phone}</span>}
                </div>
              </div>
              <span className="tag" style={{ background: 'var(--accent-dim)', border: '1px solid rgba(200,251,87,0.2)', color: 'var(--accent)', fontSize: '0.75rem' }}>
                ✨ AI Tailored
              </span>
            </div>
            <div style={{ marginTop: '1.2rem', padding: '14px 16px', background: 'var(--bg-input)', borderRadius: 'var(--r)', fontSize: '0.88rem', lineHeight: 1.75, color: 'var(--text-muted)', borderLeft: '3px solid var(--accent)' }}>
              {cv.tailored_summary}
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {cv.skills.map((s, i) => (
                <span key={s} className="tag" style={{
                  background: i < 3 ? 'var(--accent-dim)' : 'var(--bg-input)',
                  border: `1px solid ${i < 3 ? 'rgba(200,251,87,0.2)' : 'var(--border)'}`,
                  color: i < 3 ? 'var(--accent)' : 'var(--text-muted)',
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="card">
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Experience</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cv.experience.map((exp, i) => (
                <div key={i} style={{ borderLeft: '2px solid var(--border)', paddingLeft: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{exp.role}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>{exp.company}</div>
                    </div>
                    <span className="tag" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.75rem', alignSelf: 'flex-start' }}>
                      {exp.duration}
                    </span>
                  </div>
                  <ul style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: 5 }}>
                    {exp.responsibilities.map((r, j) => (
                      <li key={j} style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="card">
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Education</div>
            {cv.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{edu.degree}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{edu.year}</span>
              </div>
            ))}
          </div>

          {/* Certifications */}
          {cv.certifications && cv.certifications.length > 0 && (
            <div className="card">
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>Certifications</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {cv.certifications.map(c => (
                  <span key={c} className="tag" style={{ background: 'var(--blue-dim)', border: '1px solid rgba(79,143,255,0.2)', color: 'var(--blue)' }}>🏅 {c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── COVER LETTER TAB ── */}
      {tab === 'cover' && (
        <div className="card" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem' }}>Cover Letter</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Personalized for this role</div>
            </div>
            <button className="btn btn-ghost" onClick={() => copy(result.cover_letter)} style={{ fontSize: '0.82rem', padding: '8px 16px' }}>
              {copied ? '✓ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div style={{
            background: 'var(--bg-input)', borderRadius: 'var(--r)',
            padding: '1.5rem', fontSize: '0.9rem', lineHeight: 1.85,
            color: 'var(--text-muted)', whiteSpace: 'pre-wrap',
            borderLeft: '3px solid var(--blue)',
          }}>
            {result.cover_letter}
          </div>
        </div>
      )}

      {/* Download bar */}
      <div style={{
        marginTop: '2rem', padding: '1.2rem 1.5rem',
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>Download your documents</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Formatted as professional .docx files</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={`http://localhost:8000/apply/download/cv`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '0.85rem', textDecoration: 'none' }}
          >
            📄 Download CV
          </a>
          <a
            href={`http://localhost:8000/apply/download/cover-letter`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', textDecoration: 'none' }}
          >
            💌 Download Cover Letter
          </a>
        </div>
      </div>
    </div>
  );
}
