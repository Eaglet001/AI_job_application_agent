import React, { useState } from 'react';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import UploadStep from '@/components/UploadStep';
import LoadingStep from '@/components/LoadingStep';
import ResultsStep from '@/components/ResultsStep';
import { analyzeApplication } from '@/lib/api';
import { AppStep, JobApplicationResponse } from '@/types';

export default function Home() {
  const [step, setStep]       = useState<AppStep>('upload');
  const [result, setResult]   = useState<JobApplicationResponse | null>(null);
  const [error, setError]     = useState<string | null>(null);
  const [cvText, setCvText]   = useState('');
  const [jdText, setJdText]   = useState('');

  const handleSubmit = async (cvFile: File | null, cv: string, jd: string) => {
    setError(null);
    setCvText(cv);
    setJdText(jd);
    setStep('loading');
    try {
      const data = await analyzeApplication(cvFile, cv, jd);
      setResult(data);
      setStep('results');
    } catch (e: any) {
      setError(e?.response?.data?.detail || e?.message || 'Something went wrong. Is the backend running?');
      setStep('upload');
    }
  };

  const handleReset = () => {
    setResult(null); setError(null);
    setCvText(''); setJdText('');
    setStep('upload');
  };

  return (
    <>
      <Head>
        <title>ApplyAI — AI-Powered Job Applications</title>
        <meta name="description" content="Tailor your CV and generate cover letters with Llama 3.1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>" />
      </Head>

      <Navbar />

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '-20vh', left: '50%', transform: 'translateX(-50%)',
        width: '60vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(200,251,87,0.04) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <main style={{
        minHeight: '100vh',
        paddingTop: step === 'upload' ? '120px' : '100px',
        paddingBottom: '80px',
        position: 'relative', zIndex: 1,
      }}>
        {error && (
          <div style={{
            maxWidth: 700, margin: '0 auto 1.5rem', padding: '0 1.5rem',
          }}>
            <div style={{
              padding: '14px 18px', borderRadius: 'var(--r)',
              background: 'var(--red-dim)', border: '1px solid rgba(255,79,109,0.3)',
              color: 'var(--red)', fontSize: '0.88rem',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <span>⚠️</span> {error}
            </div>
          </div>
        )}

        {step === 'upload' && (
          <UploadStep onSubmit={handleSubmit} loading={false} />
        )}
        {step === 'loading' && <LoadingStep />}
        {step === 'results' && result && (
          <ResultsStep result={result} cvText={cvText} jdText={jdText} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '1.5rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 8,
        fontSize: '0.78rem', color: 'var(--text-dim)',
      }}>
        <span>ApplyAI · Powered by Llama 3.1 70B via HuggingFace</span>
        <span>FastAPI + LangGraph + Next.js</span>
      </footer>
    </>
  );
}
