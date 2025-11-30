import React, { useState } from 'react';
import { Card, Badge, Accordion, Quiz } from '../components/UI';
import { Search, AlertTriangle, FileText, Lock, Eye, BookOpen } from 'lucide-react';

export const ForensicModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  const [showCaseResult, setShowCaseResult] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="mb-6">
        <Badge type="brand">Módulo 4</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Auditoría Forense</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Detección, prevención e investigación de fraude y corrupción.</p>
      </div>

      {/* Visual Fraud Triangle */}
      <Card title="El Triángulo del Fraude (Cressey)" className="bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
        <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-lg mx-auto">
            Para que ocurra un fraude, generalmente deben converger tres factores. Como auditores, podemos incidir principalmente en la <b>Oportunidad</b> (Controles).
        </p>
        
        <div className="relative h-64 w-full max-w-md mx-auto">
             {/* Triangle Shapes using borders/absolute positioning for diagram feel */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-red-200 dark:border-red-800">
                    <AlertTriangle size={32} />
                </div>
                <div className="text-center">
                    <p className="font-bold text-red-800 dark:text-red-300">Presión</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Problemas financieros, vicios, metas irreales.</p>
                </div>
             </div>

             <div className="absolute bottom-0 left-0 w-36 flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-amber-200 dark:border-amber-800">
                    <Lock size={32} />
                </div>
                <div className="text-center">
                    <p className="font-bold text-amber-800 dark:text-amber-300">Oportunidad</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Ausencia de controles, supervisión deficiente.</p>
                </div>
             </div>

             <div className="absolute bottom-0 right-0 w-36 flex flex-col items-center animate-slide-up" style={{ animationDelay: '0.5s' }}>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2 shadow-sm border-2 border-blue-200 dark:border-blue-800">
                    <BrainIcon />
                </div>
                <div className="text-center">
                    <p className="font-bold text-blue-800 dark:text-blue-300">Racionalización</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">"Me lo deben", "Es temporal", "Todos lo hacen".</p>
                </div>
             </div>

             {/* Connecting Lines (SVG) */}
             <svg className="absolute inset-0 pointer-events-none -z-10 text-slate-300 dark:text-slate-600" width="100%" height="100%">
                 <line x1="50%" y1="20%" x2="15%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                 <line x1="50%" y1="20%" x2="85%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                 <line x1="15%" y1="80%" x2="85%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
             </svg>
        </div>
      </Card>

      {/* Case Study - Active Learning */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-brand-500 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-brand-600 dark:text-brand-400" size={24} />
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Estudio de Caso: "La Compra Fantasma"</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
            Un director técnico (que tiene deudas de juego - <b>Presión</b>) aprovecha que nadie revisa las actas de entrega (<b>Oportunidad</b>) para firmar el recibido de computadores que nunca llegaron, pensando "Es solo por esta vez mientras pago" (<b>Racionalización</b>).
        </p>
        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-2">¿Cómo podría haber prevenido esto la OCI?</p>
        
        {!showCaseResult ? (
            <button 
                onClick={() => setShowCaseResult(true)}
                className="text-sm bg-brand-50 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 font-bold px-4 py-2 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/60 transition-colors"
            >
                Ver Respuesta del Auditor
            </button>
        ) : (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 animate-fade-in">
                <p className="text-green-800 dark:text-green-200 text-sm">
                    <b>Respuesta:</b> Fortaleciendo la <b>Oportunidad</b>. La auditoría debería haber evaluado previamente los controles de recepción de inventarios (Segregación de funciones: quien compra no debe ser quien recibe).
                </p>
            </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <Card title="Rol de la OCI">
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={18} />
                    <span>Evaluar controles antifraude.</span>
                </li>
                <li className="flex gap-2">
                    <CheckCircle className="text-green-500 shrink-0" size={18} />
                    <span>Asegurar evidencia digital y física.</span>
                </li>
                <li className="flex gap-2">
                    <AlertTriangle className="text-red-500 shrink-0" size={18} />
                    <span><b>NO</b> captura ni juzga (eso es Fiscalía).</span>
                </li>
            </ul>
         </Card>
         <Card title="Decreto 1600 de 2024">
             <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-800 dark:text-amber-200 text-sm">
                 <p className="font-bold mb-1">Obligatoriedad:</p>
                 <p>Las entidades deben realizar auditorías forenses preventivas <b>mínimo cada 2 años</b> dentro del Plan de Auditoría.</p>
             </div>
         </Card>
      </div>

      <Quiz 
        questions={[
            { id: 1, question: "Según el Triángulo del Fraude, ¿qué factor podemos controlar mejor?", options: ["Presión", "Oportunidad", "Racionalización"], correctAnswer: 1 },
            { id: 2, question: "¿Cuál es la frecuencia mínima de auditorías forenses (D. 1600)?", options: ["Cada año", "Cada 2 años", "Cuando se sospeche algo"], correctAnswer: 1 },
            { id: 3, question: "Si la OCI detecta un delito, debe:", options: ["Capturar al responsable", "Denunciar a Fiscalía y Contraloría", "Despedir al funcionario"], correctAnswer: 1 }
        ]}
        onComplete={onComplete}
      />
    </div>
  );
};

// Helper components
const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.97 14.716A4 4 0 0 1 16 18"/></svg>
);
const CheckCircle = ({className, size}: any) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;