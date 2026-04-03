export interface Experience {
  company: string;
  role: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface TailoredCV {
  name: string;
  email?: string;
  phone?: string;
  tailored_summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications?: string[];
}

export interface JobApplicationResponse {
  match_score: number;
  missing_skills: string[];
  keyword_gaps: string[];
  recommendations: string[];
  tailored_cv: TailoredCV;
  cover_letter: string;
}

export type AppStep = 'upload' | 'loading' | 'results';
