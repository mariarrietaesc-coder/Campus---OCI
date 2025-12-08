
export type ModuleId = 'dashboard' | 'strategic' | 'mipg' | 'competencies' | 'standards' | 'forensic' | 'library' | 'assistant' | 'tools';

export interface User {
  id: string; // Email is used as ID usually, but good to have unique key
  name: string;
  role: string; // Cargo shown in certificate
  email: string;
  isAdmin?: boolean;
  isActive: boolean;
  password?: string; // Optional for simple email-only auth, but good for structure
}

export interface ModuleConfig {
  id: ModuleId;
  title: string;
  icon: any; // Lucide Icon component
  description: string;
  duration: string; // e.g., "45 min"
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index
}

export interface QuizState {
  completed: boolean;
  score: number;
}

export type ProgressMap = Record<ModuleId, QuizState>;
