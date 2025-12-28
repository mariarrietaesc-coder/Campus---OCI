
import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, Info, ShieldCheck, FileText } from 'lucide-react';
import { ESCUDO_BASE64 } from './LogoData';

export const MinistryLogo: React.FC<{ className?: string, variant?: 'vertical' | 'horizontal', whiteText?: boolean }> = ({ className = "", variant = 'vertical', whiteText = false }) => {
  if (variant === 'horizontal') {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img src={ESCUDO_BASE64} alt="Escudo de Colombia" className="h-10 w-auto object-contain" />
        </div>
      );
  }
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
        <img src={ESCUDO_BASE64} alt="Ministerio de Igualdad" className="h-24 w-auto object-contain drop-shadow-xl" />
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; onClick?: () => void }> = ({ children, className = "", title, onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-700 p-8 transition-all ${onClick ? 'hover:shadow-xl hover:scale-[1.01] cursor-pointer' : ''} ${className}`}>
    {title && (
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-5 bg-brand-500 rounded-full"></div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-brand-400 tracking-tight">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; type?: 'brand' | 'success' | 'warning' | 'info'; className?: string }> = ({ children, type = 'brand', className = "" }) => {
  const styles = {
    brand: "bg-brand-50 text-brand-700 border-brand-100",
    success: "bg-emerald-50 text-emerald-700 border-emerald-100",
    warning: "bg-amber-50 text-amber-700 border-amber-100",
    info: "bg-blue-50 text-blue-700 border-blue-100"
  };
  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-bold border ${styles[type]} ${className}`}>
      {children}
    </span>
  );
};

export const EvidenceItem: React.FC<{ item: string; support: string }> = ({ item, support }) => (
  <div className="group flex items-center gap-4 p-5 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-transparent hover:border-brand-200 hover:bg-white transition-all shadow-sm hover:shadow-md">
    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-brand-500 shadow-sm transition-transform group-hover:scale-110">
      <FileText size={18} />
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-400 leading-none mb-1.5">{item}</p>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{support}</p>
    </div>
  </div>
);

export const Callout: React.FC<{ children: React.ReactNode; type?: 'conclusion' | 'info' }> = ({ children, type = 'info' }) => (
  <div className={`p-6 rounded-[2rem] border-l-4 ${type === 'conclusion' ? 'bg-brand-50/50 border-brand-500' : 'bg-blue-50/50 border-blue-500'} my-6 animate-fade-in backdrop-blur-sm`}>
    <div className="flex gap-4">
      {type === 'conclusion' ? <ShieldCheck className="text-brand-600 shrink-0" /> : <Info className="text-blue-600 shrink-0" />}
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-medium italic">
        {children}
      </div>
    </div>
  </div>
);

export const Accordion: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`border border-slate-100 dark:border-slate-700 rounded-[2rem] bg-white dark:bg-slate-800 mb-4 overflow-hidden transition-all ${isOpen ? 'shadow-lg' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 text-left font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 transition-colors">
        <span className="flex items-center gap-3 text-[10px] font-bold">
          {isOpen ? <ChevronUp size={16} className="text-brand-500" /> : <ChevronDown size={16} className="text-slate-400" />}
          {title}
        </span>
      </button>
      {isOpen && <div className="p-8 pt-0 border-t border-slate-50 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-fade-in">{children}</div>}
    </div>
  );
};

export const TimelineItem: React.FC<{ year: string; title: string; description: string }> = ({ year, title, description }) => (
  <div className="relative pl-8 pb-8 border-l-2 border-slate-200 dark:border-slate-700 last:border-0 ml-4 group">
    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white dark:bg-slate-800 border-2 border-brand-500 group-hover:scale-125 transition-transform shadow-sm"></div>
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group-hover:shadow-md transition-all">
      <span className="text-[10px] font-bold text-brand-500 bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded-md">{year}</span>
      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-2 mb-1 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  </div>
);

export const Quiz: React.FC<{ questions: any[], onComplete: (score: number) => void }> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    let newScore = score;
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      newScore = score + 1;
      setScore(newScore);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      onComplete(Math.round((newScore / questions.length) * 100));
    }
  };

  if (isFinished) {
    return (
      <div className="text-center space-y-6 py-12 animate-fade-in bg-white dark:bg-slate-800 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-700 shadow-xl">
        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={48} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Evaluación completada</h3>
        <p className="text-slate-500 dark:text-slate-400">Has finalizado satisfactoriamente este módulo.</p>
        <div className="text-5xl font-black text-brand-600">
            {Math.round((score / questions.length) * 100)}%
        </div>
        <p className="text-xs font-bold text-slate-400 tracking-widest">Resultado de la prueba</p>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end px-4">
        <div>
          <Badge type="warning">Cuestionario</Badge>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter">Validación técnica</h3>
        </div>
        <div className="text-xs font-bold text-slate-400">Pregunta {currentQuestion + 1} de {questions.length}</div>
      </div>
      <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700 space-y-8">
        <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed">{q.question}</h4>
        <div className="space-y-3">
          {q.options.map((opt: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold text-sm ${selectedOption === idx ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300' : 'border-slate-50 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedOption === idx ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                  {selectedOption === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>
        <button
          disabled={selectedOption === null}
          onClick={handleNext}
          className="w-full py-5 bg-slate-900 dark:bg-brand-600 text-white rounded-2xl font-black text-xs tracking-[0.1em] shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-30 disabled:translate-y-0"
        >
          {currentQuestion + 1 === questions.length ? 'Finalizar examen' : 'Siguiente pregunta'}
        </button>
      </div>
    </div>
  );
};
