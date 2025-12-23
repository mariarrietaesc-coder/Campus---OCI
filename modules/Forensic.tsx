
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, MinistryLogo } from '../components/UI';
import { Search, AlertTriangle, Lock, Eye, BookOpen, Clock, CheckCircle, Scale, Zap, ShieldCheck } from 'lucide-react';
import { QuizState } from '../types';

interface ForensicModuleProps {
    onComplete: (score: number) => void;
    onTimeUpdate: (seconds: number) => void;
    saveProgress: () => void;
    data: QuizState;
}

export const ForensicModule: React.FC<ForensicModuleProps> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [showCaseResult, setShowCaseResult] = useState(false);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const saveProgressRef = useRef(saveProgress);

  useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate;
      saveProgressRef.current = saveProgress;
  }, [onTimeUpdate, saveProgress]);

  useEffect(() => {
      const pushTime = () => {
          const now = Date.now();
          const diffSeconds = Math.floor((now - startTimeRef.current) / 1000);
          if (diffSeconds > 0) {
              onTimeUpdateRef.current(diffSeconds);
              startTimeRef.current = now;
          }
      };
      timerRef.current = window.setInterval(pushTime, 2000);
      return () => {
          if (timerRef.current) window.clearInterval(timerRef.current);
          pushTime();
          saveProgressRef.current();
      };
  }, []);

  const timeSpent = data.timeSpentSeconds || 0;
  const minTime = data.minTimeSeconds || 60;
  const timeLeft = Math.max(0, minTime - timeSpent);
  const isQuizLocked = timeLeft > 0 && !data.completed;

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-4">
          <div className="space-y-2">
            <Badge type="brand">Módulo Técnico 04</Badge>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Auditoría Forense</h1>
            <div className="h-1.5 w-20 bg-brand-500 rounded-full"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Investigación aplicada para la detección de fraude y corrupción.</p>
          </div>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${timeLeft > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {timeLeft > 0 ? <Clock size={24} className="animate-pulse" /> : <CheckCircle size={24} />}
                </div>
                <div className="pr-4">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Estudio en Curso</p>
                    <p className="font-mono font-black text-slate-800 dark:text-white text-lg leading-none">
                        {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
                    </p>
                </div>
          </div>
      </div>

      <Card className="relative overflow-hidden pt-10 pb-16 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-[2.5rem]">
        <div className="text-center mb-16 relative z-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">El Triángulo del Fraude</h2>
            <p className="text-brand-600 dark:text-brand-400 text-xs font-black uppercase tracking-[0.3em]">Modelo Analítico de Donald Cressey</p>
            <p className="max-w-2xl mx-auto mt-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
                Para que ocurra un fraude, generalmente deben converger tres factores clave. Como auditores, nuestra mayor incidencia está en la <b>Oportunidad</b>.
            </p>
        </div>
        
        <div className="relative h-[480px] w-full max-w-2xl mx-auto mt-10">
             {/* SVG Lines Connector */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100">
                <path 
                    d="M 50,15 L 15,85 L 85,85 Z" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.5" 
                    strokeDasharray="4,4"
                    className="text-slate-200 dark:text-slate-700 animate-[dash_20s_linear_infinite]"
                />
             </svg>

             {/* Top Vertex: Pressure */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 flex flex-col items-center group">
                <div className="w-24 h-24 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-red-50 dark:border-red-900/30 relative transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-red-500/5 blur-xl animate-pulse"></div>
                    <AlertTriangle size={44} className="text-red-500 relative z-10" />
                </div>
                <div className="text-center p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-700 shadow-lg">
                    <p className="font-black text-red-600 uppercase text-xs tracking-widest mb-1">Presión</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-tight">Problemas financieros,<br/>vicios, metas irreales.</p>
                </div>
             </div>

             {/* Bottom Left: Opportunity */}
             <div className="absolute bottom-4 left-0 w-56 flex flex-col items-center group">
                <div className="w-24 h-24 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-amber-50 dark:border-amber-900/30 relative transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-xl animate-pulse"></div>
                    <Lock size={44} className="text-amber-500 relative z-10" />
                </div>
                <div className="text-center p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-700 shadow-lg ring-4 ring-amber-500/10">
                    <p className="font-black text-amber-600 uppercase text-xs tracking-widest mb-1">Oportunidad</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-tight">Ausencia de controles,<br/>supervisión deficiente.</p>
                </div>
             </div>

             {/* Bottom Right: Rationalization */}
             <div className="absolute bottom-4 right-0 w-56 flex flex-col items-center group">
                <div className="w-24 h-24 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 shadow-2xl border-4 border-blue-50 dark:border-blue-900/30 relative transition-transform duration-500 group-hover:scale-110">
                    <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-xl animate-pulse"></div>
                    <Scale size={44} className="text-blue-500 relative z-10" />
                </div>
                <div className="text-center p-5 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100 dark:border-slate-700 shadow-lg">
                    <p className="font-black text-blue-600 uppercase text-xs tracking-widest mb-1">Racionalización</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold leading-tight">"Me lo deben", "Es temporal",<br/>"Todos lo hacen".</p>
                </div>
             </div>
        </div>
      </Card>

      {/* Marco de Actuación: Rol de la OCI */}
      <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-900 text-white p-8 rounded-[2.5rem] border-none shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform duration-700 group-hover:scale-125">
                  <ShieldCheck size={120} />
              </div>
              <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={24} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-black">Rol de la OCI</h3>
                  </div>
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0"></div>
                          <p className="font-bold text-slate-200">Evaluar controles antifraude.</p>
                      </li>
                      <li className="flex items-start gap-3">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0"></div>
                          <p className="font-bold text-slate-200">Asegurar evidencia digital y física.</p>
                      </li>
                      <li className="flex items-start gap-3 pt-2">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                          <p className="font-black text-red-400 uppercase text-sm tracking-widest">NO captura ni juzga.</p>
                      </li>
                  </ul>
              </div>
          </Card>

          <Card className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Foco del Auditor</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed italic">
                  "Como auditores internos, nuestra mayor capacidad de mitigación reside en eliminar la <b>Oportunidad</b> mediante el fortalecimiento de los controles institucionales."
              </p>
          </Card>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-2xl p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150"></div>
        <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                <BookOpen size={24} />
            </div>
            <h3 className="font-black text-2xl text-slate-900 dark:text-white">Escenario de Análisis</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
                <p className="text-brand-600 dark:text-brand-400 font-black uppercase text-[10px] tracking-[0.2em]">Caso: "Suministros Fantasma"</p>
                <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-lg font-medium">
                    Un funcionario con deudas personales firma la recepción de activos que nunca ingresaron al almacén, argumentando internamente que "la entidad le debe por horas extras no pagadas".
                </p>
            </div>
            <div className="flex flex-col justify-center">
                {!showCaseResult ? (
                    <button 
                        onClick={() => setShowCaseResult(true)}
                        className="bg-slate-900 dark:bg-brand-600 text-white font-black px-8 py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 tracking-widest text-xs shadow-xl"
                    >
                        DESCOMPONER FACTORES <Search size={18} />
                    </button>
                ) : (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 animate-slide-up space-y-4">
                        <div className="flex gap-2">
                            <span className="bg-red-100 text-red-700 text-[9px] font-black px-2 py-1 rounded">PRESIÓN: Deuda</span>
                            <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-2 py-1 rounded">OPORTUNIDAD: Falta de Segregación</span>
                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-1 rounded">RACIONALIZACIÓN: Deuda Laboral</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                            <b>Acción OCI:</b> Se evidencia falla en la segregación de funciones. Quien autoriza el pago no puede ser quien certifica la recepción sin un tercero validador.
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {!isQuizLocked ? (
        <Quiz 
            questions={[
                { id: 1, question: "¿Cuál de los tres factores es el único sobre el cual la organización tiene control directo?", options: ["Racionalización", "Presión", "Oportunidad"], correctAnswer: 2 },
                { id: 2, question: "Según el Decreto 1600 de 2024, ¿cada cuánto deben las entidades realizar auditorías forenses preventivas?", options: ["Anualmente", "Mínimo cada 2 años", "Solo cuando hay denuncias"], correctAnswer: 1 },
                { id: 3, question: "¿Cuál es el rol primordial de la OCI en un proceso forense?", options: ["Capturar y procesar sospechosos", "Evaluar controles y asegurar evidencia", "Definir sentencias disciplinarias"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
        />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Evaluación de Módulo Bloqueada</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Por políticas de calidad del Campus OCI, debes dedicar al menos 1 minuto a la revisión de este contenido técnico antes de habilitar el examen.
            </p>
            <div className="bg-brand-500/10 px-8 py-4 rounded-2xl inline-flex items-center gap-3">
                <Clock size={18} className="text-brand-600" />
                <span className="text-brand-700 font-black text-sm uppercase tracking-widest">
                    Habilitando en {Math.ceil(timeLeft / 60)} min
                </span>
            </div>
        </div>
      )}

      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 100;
          }
        }
      `}</style>
    </div>
  );
};
