
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, MessageCircle, Send, Shield } from 'lucide-react';
import { ESCUDO_BASE64 } from './LogoData';

// --- Ministry Logo (Official Government Layout) ---
export const MinistryLogo: React.FC<{ className?: string, variant?: 'vertical' | 'horizontal', whiteText?: boolean }> = ({ className = "", variant = 'vertical', whiteText = false }) => {
  // --- Horizontal Layout (Sidebar / Header) ---
  if (variant === 'horizontal') {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img 
                src={ESCUDO_BASE64} 
                alt="Escudo de Colombia" 
                className="h-14 w-auto object-contain drop-shadow-sm filter"
                style={{ minWidth: '40px' }}
            />
        </div>
      );
  }

  // --- Vertical Layout (Login / Certificate) ---
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
        <img 
            src={ESCUDO_BASE64} 
            alt="Ministerio de Igualdad y Equidad" 
            className="h-44 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
        />
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; onClick?: () => void }> = ({ children, className = "", title, onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-brand-100 dark:border-slate-700 p-6 ${className}`}>
    {title && <h3 className="text-xl font-bold text-brand-700 dark:text-brand-400 mb-4">{title}</h3>}
    {children}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; type?: 'brand' | 'success' | 'warning' }> = ({ children, type = 'brand' }) => {
  const styles = {
    brand: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-700",
    success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700"
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${styles[type]}`}>
      {children}
    </span>
  );
};

// --- Accordion ---
export const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`border border-brand-100 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 mb-3 transition-all duration-200 ${isOpen ? 'shadow-md ring-1 ring-brand-200 dark:ring-slate-600' : ''}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left font-semibold text-brand-800 dark:text-slate-200 hover:bg-brand-50/50 dark:hover:bg-slate-700 rounded-xl transition-colors"
      >
        <span className="flex items-center gap-2">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          {title}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-brand-50 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Feedback Form (Placeholder) ---
export const FeedbackForm: React.FC<{ moduleName: string }> = ({ moduleName }) => {
    return null; 
};


// --- Quiz Component ---
interface QuizProps {
  questions: { id: number; question: string; options: string[]; correctAnswer: number }[];
  onComplete: (score: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, opIdx: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: opIdx }));
  };

  const handleSubmit = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    setSubmitted(true);
    onComplete(score);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  }

  const allAnswered = questions.length === Object.keys(answers).length;

  return (
    <Card className="mt-8 border-t-4 border-t-brand-500" title="Evaluación de Conocimientos">
      <div className="space-y-6">
        {questions.map((q, idx) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          const showFeedback = submitted;
          
          return (
            <div key={q.id} className="pb-4 border-b border-gray-100 dark:border-slate-700 last:border-0">
              <p className="font-semibold text-slate-800 dark:text-slate-200 mb-3">{idx + 1}. {q.question}</p>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(q.id, oIdx)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 border
                      ${answers[q.id] === oIdx 
                        ? (submitted ? (isCorrect ? 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700 text-red-800 dark:text-red-300') : 'bg-brand-50 dark:bg-brand-900/40 border-brand-300 dark:border-brand-700 text-brand-800 dark:text-brand-200')
                        : 'bg-gray-50 dark:bg-slate-700/50 border-transparent hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <span>{opt}</span>
                      {showFeedback && answers[q.id] === oIdx && (
                         isCorrect ? <CheckCircle size={16} className="text-green-600 dark:text-green-400"/> : <AlertCircle size={16} className="text-red-600 dark:text-red-400"/>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-all
            ${allAnswered ? 'bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-200 dark:shadow-none' : 'bg-gray-300 dark:bg-slate-600 cursor-not-allowed'}
          `}
        >
          Finalizar Evaluación
        </button>
      ) : (
         <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-center">
            <p className="text-brand-800 dark:text-brand-300 font-bold text-lg mb-2">
              Resultado: {Object.keys(answers).filter(id => answers[Number(id)] === questions.find(q => q.id === Number(id))?.correctAnswer).length} / {questions.length}
            </p>
            <button onClick={reset} className="text-sm text-brand-600 dark:text-brand-400 underline">Intentar de nuevo</button>
         </div>
      )}
    </Card>
  );
};

// --- Timeline Item ---
export const TimelineItem: React.FC<{ year: string; title: string; description: string }> = ({ year, title, description }) => (
  <div className="relative pl-8 pb-8 border-l-2 border-brand-200 dark:border-brand-900 last:pb-0 last:border-transparent">
    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-50 dark:bg-brand-900 border-4 border-brand-500"></div>
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow -mt-2">
      <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">{year}</span>
      <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">{title}</h4>
      <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{description}</p>
    </div>
  </div>
);
