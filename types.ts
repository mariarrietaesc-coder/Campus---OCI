export type ModuleId = 'dashboard' | 'strategic' | 'mipg' | 'competencies' | 'standards' | 'forensic' | 'library' | 'assistant' | 'tools';

export interface User {
  name: string;
  role: string;
  email: string;
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