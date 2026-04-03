import axios from 'axios';
import { JobApplicationResponse } from '@/types';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function analyzeApplication(
  cvFile: File | null,
  cvText: string,
  jdText: string
): Promise<JobApplicationResponse> {
  if (cvFile) {
    const form = new FormData();
    form.append('cv_file', cvFile);
    form.append('jd_text', jdText);
    const { data } = await axios.post(`${API}/apply/upload`, form);
    return data;
  }
  const { data } = await axios.post(`${API}/apply`, { cv_text: cvText, jd_text: jdText });
  return data;
}

export async function downloadCV(cvText: string, jdText: string) {
  const res = await axios.post(`${API}/apply/download/cv`, { cv_text: cvText, jd_text: jdText }, { responseType: 'blob' });
  triggerDownload(res.data, 'tailored_cv.docx');
}

export async function downloadCoverLetter(cvText: string, jdText: string) {
  const res = await axios.post(`${API}/apply/download/cover-letter`, { cv_text: cvText, jd_text: jdText }, { responseType: 'blob' });
  triggerDownload(res.data, 'cover_letter.docx');
}

function triggerDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  window.URL.revokeObjectURL(url);
}
