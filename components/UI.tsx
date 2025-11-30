import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ChevronDown, ChevronUp, MessageCircle, Send } from 'lucide-react';

// --- Ministry Logo ---
export const MinistryLogo: React.FC<{ className?: string, variant?: 'vertical' | 'horizontal', whiteText?: boolean }> = ({ className = "", variant = 'vertical', whiteText = false }) => {
  const textColor = whiteText ? 'text-white' : 'text-[#d23b78] dark:text-[#eb4884]'; // Using specific brand pink
  
  if (variant === 'horizontal') {
      return (
        <div className={`flex items-center gap-3 ${className}`}>
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_de_Colombia.svg/150px-Escudo_de_Colombia.svg.png" 
                alt="Escudo de Colombia" 
                className="w-8 h-auto object-contain opacity-90"
            />
            <div className="h-8 w-[1px] bg-gray-300 dark:bg-slate-600"></div>
            <div className="flex flex-col justify-center">
                <span className={`text-2xl font-bold leading-none tracking-tight ${textColor} font-sans`}>Igualdad</span>
                <div className="flex w-full h-1 mt-0.5 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-[#FCD116]"></div>
                    <div className="h-full w-1/4 bg-[#003893]"></div>
                    <div className="h-full w-1/4 bg-[#CE1126]"></div>
                </div>
            </div>
        </div>
      );
  }

  // Vertical Variant (Login)
  return (
    <div className={`flex flex-col items-center ${className}`}>
        <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Escudo_de_Colombia.svg/150px-Escudo_de_Colombia.svg.png" 
            alt="Escudo de Colombia" 
            className="w-20 mb-3 opacity-90"
        />
        <div className={`text-5xl font-bold tracking-tight ${textColor} font-sans`}>
            Igualdad
        </div>
         <div className="flex w-24 h-1.5 mt-2 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-[#FCD116]"></div>
            <div className="h-full w-1/4 bg-[#003893]"></div>
            <div className="h-full w-1/4 bg-[#CE1126]"></div>
        </div>
    </div>
  );
};

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = "", title }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-brand-100 dark:border-slate-700 p-6 ${className}`}>
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

// --- Feedback Form ---
export const FeedbackForm: React.FC<{ moduleName: string }> = ({ moduleName }) => {
    const [comment, setComment] = useState("");
    
    const handleSend = () => {
        const subject = encodeURIComponent(`Duda/Comentario Módulo: ${moduleName}`);
        const body = encodeURIComponent(comment);
        window.location.href = `mailto:rgonzalez@minigualdad.gov.co?subject=${subject}&body=${body}`;
    };

    return (
        <div className="mt-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="text-brand-600 dark:text-brand-400" size={24} />
                <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">¿Tienes dudas sobre este tema?</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Envía tus comentarios directamente al experto temático.</p>
                </div>
            </div>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escribe tu duda o comentario aquí..."
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-brand-500 outline-none mb-3"
                rows={3}
            />
            <button 
                onClick={handleSend}
                disabled={!comment.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 dark:bg-brand-600 text-white rounded-lg text-sm font-bold hover:bg-slate-700 dark:hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send size={16} /> Enviar al Correo
            </button>
        </div>
    );
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