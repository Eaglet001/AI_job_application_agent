import React, { useState, useRef, DragEvent } from 'react';

interface Props {
  onSubmit: (cvFile: File | null, cvText: string, jdText: string) => void;
  loading: boolean;
}

export default function UploadStep({ onSubmit, loading }: Props) {
  const [cvFile, setCvFile]   = useState<File | null>(null);
  const [cvText, setCvText]   = useState('');
  const [jdText, setJdText]   = useState('');
  const [tab, setTab]         = useState<'file' | 'text'>('file');
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setCvFile(f);
  };

  const canSubmit = !loading && !!jdText.trim() && (tab === 'file' ? !!cvFile : !!cvText.trim());

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 1.5rem' }}>

      {/* Hero */}
      <div className="fade-up" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent-dim)', border: '1px solid rgba(200,251,87,0.18)',
          borderRadius: 100, padding: '5px 14px', marginBottom: '1.4rem',
          fontSize: '0.73rem', fontWeight: 600, color: 'var(--accent)',
          letterSpacing: '0.09em', textTransform: 'uppercase',
        }}>✦ AI Job Application Agent</div>

        <h1 style={{
          fontFamily: 'var(--display)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800, lineHeight: 1.08,
          letterSpacing: '-0.03em', marginBottom: '1rem',
        }}>
          Your CV, tailored to<br />
          <span style={{ color: 'var(--accent)' }}>every job you want</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: 460, margin: '0 auto', lineHeight: 1.75 }}>
          Upload your CV and a job description. Our AI analyzes the gap, rewrites your CV, and generates a cover letter — all in seconds.
        </p>
      </div>

      {/* Stats row */}
      <div className="fade-up-2" style={{ display: 'flex', gap: 12, marginBottom: '2.5rem', justifyContent: 'center' }}>
        {[
          { val: '5', label: 'AI Agents' },
          { val: '70B', label: 'Parameters' },
          { val: '~30s', label: 'Analysis Time' },
        ].map(s => (
          <div key={s.val} style={{
            flex: 1, maxWidth: 160,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--r)', padding: '14px 0', textAlign: 'center',
          }}>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1.4rem', color: 'var(--accent)' }}>{s.val}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CV Input */}
      <div className="fade-up-2 card" style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>Your CV</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upload a file or paste plain text</div>
          </div>
          {/* Tab toggle */}
          <div style={{
            display: 'flex', background: 'var(--bg-input)',
            border: '1px solid var(--border)', borderRadius: 8, padding: 3, gap: 2,
          }}>
            {(['file', 'text'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '5px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 500, transition: 'all 0.15s',
                background: tab === t ? 'var(--bg-hover)' : 'transparent',
                color: tab === t ? 'var(--text)' : 'var(--text-muted)',
              }}>
                {t === 'file' ? '📎 File' : '✏️ Text'}
              </button>
            ))}
          </div>
        </div>

        {tab === 'file' ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--accent)' : cvFile ? 'var(--green)' : 'var(--border-light)'}`,
              borderRadius: 'var(--r)', padding: '2.5rem 1rem',
              textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
              background: dragging ? 'var(--accent-dim)' : cvFile ? 'var(--green-dim)' : 'var(--bg-input)',
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.docx,.txt" onChange={e => setCvFile(e.target.files?.[0] || null)} style={{ display: 'none' }} />
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>{cvFile ? '✅' : '📄'}</div>
            {cvFile ? (
              <div>
                <div style={{ fontWeight: 600, color: 'var(--green)', fontSize: '0.95rem' }}>{cvFile.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {(cvFile.size / 1024).toFixed(1)} KB · Click to change
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 500, color: 'var(--text)', marginBottom: 4 }}>Drop your CV here or click to browse</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Supports PDF, DOCX, TXT</div>
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={cvText}
            onChange={e => setCvText(e.target.value)}
            placeholder="Paste your CV content here..."
            rows={10}
            style={{
              width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-light)',
              borderRadius: 'var(--r)', padding: '14px 16px', color: 'var(--text)',
              fontFamily: 'var(--body)', fontSize: '0.88rem', lineHeight: 1.7,
              resize: 'vertical', outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
          />
        )}
      </div>

      {/* JD Input */}
      <div className="fade-up-3 card" style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>Job Description</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paste the full job description you want to apply for</div>
        </div>
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste the job description here — responsibilities, requirements, nice-to-haves..."
          rows={10}
          style={{
            width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border-light)',
            borderRadius: 'var(--r)', padding: '14px 16px', color: 'var(--text)',
            fontFamily: 'var(--body)', fontSize: '0.88rem', lineHeight: 1.7,
            resize: 'vertical', outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
        />
      </div>

      {/* Submit */}
      <div className="fade-up-4" style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={() => onSubmit(cvFile, cvText, jdText)}
          disabled={!canSubmit}
          style={{ width: '100%', maxWidth: 360, padding: '16px 32px', fontSize: '1rem', borderRadius: 'var(--r)' }}
        >
          {loading ? (
            <>
              <span style={{ width: 16, height: 16, border: '2px solid #080810', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
              Analyzing...
            </>
          ) : (
            <> ⚡ Analyze & Tailor My Application</>
          )}
        </button>
        <div style={{ marginTop: '0.9rem', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          Powered by Llama 3.1 70B · All processing runs locally
        </div>
      </div>
    </div>
  );
}
