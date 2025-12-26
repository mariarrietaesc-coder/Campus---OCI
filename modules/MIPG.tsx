
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz } from '../components/UI';
import { BookOpen, Clock, Shield, RefreshCw, CheckCircle, Layout, Layers, Lock, ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'intro', label: '¿Qué es MIPG?', icon: BookOpen, desc: 'Marco de referencia para la gestión pública.' },
  { id: 'timeline', label: 'Línea de Tiempo', icon: Clock, desc: 'Evolución del modelo en el Ministerio.' },
  { id: 'dimensions', label: '7 Dimensiones', icon: Layout, desc: 'Estructura operativa y políticas.' },
  { id: 'subsystems', label: 'Subsistemas SIG', icon: Layers, desc: 'Calidad, Ambiental, SST y más.' },
  { id: 'defenses', label: 'Líneas de Defensa', icon: Shield, desc: 'Roles y responsabilidades de control.' },
  { id: 'operation', label: 'Ciclo Operativo', icon: RefreshCw, desc: 'La mejora continua (PHVA).' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Prueba rápida de conocimiento.' }
];

export const MIPGModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const pushTime = () => {
      const now = Date.now();
      const diff = Math.floor((now - startTimeRef.current) / 1000);
      if (diff > 0) { onTimeUpdate(diff); startTimeRef.current = now; }
    };
    timerRef.current = window.setInterval(pushTime, 2000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); pushTime(); saveProgress(); };
  }, []);

  const timeSpent = data.timeSpentSeconds || 0;
  const isLocked = (timeSpent < (data.minTimeSeconds || 60)) && !data.completed;

  const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);
  const nextSection = SECTIONS[currentIndex + 1];
  const prevSection = SECTIONS[currentIndex - 1];

  const navigateTo = (id: string) => {
    if (id === 'quiz' && isLocked) return;
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTab === 'menu') {
    return (
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge type="brand">Módulo 2</Badge>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter uppercase">MIPG y SIG</h1>
            <p className="text-slate-500 font-medium">Modelo Integrado de Planeación y Gestión.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 text-brand-600">
            <Clock size={24}/>
            <p className="font-mono font-black text-lg">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const locked = section.id === 'quiz' && isLocked;
            return (
              <button
                key={section.id}
                onClick={() => !locked && setActiveTab(section.id)}
                className={`group p-8 bg-white rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden ${locked ? 'opacity-60 grayscale' : 'hover:border-brand-500 border-transparent shadow-xl shadow-slate-200/50'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                    {locked ? <Lock size={28}/> : <Icon size={28}/>}
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight">{section.label}</h3>
                <p className="text-sm text-slate-500 font-medium">{section.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-32 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md py-4 z-20 border-b">
        <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors">
                <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 uppercase">{SECTIONS[currentIndex].label}</h2>
        </div>
      </div>

      <main>
        {activeTab === 'intro' && (
            <Card title="¿Qué es MIPG?" className="border-l-8 border-brand-500">
            <p className="font-medium text-slate-600 leading-relaxed text-xl">MIPG es un marco de referencia para dirigir, planear, ejecutar, hacer seguimiento, evaluar y controlar la gestión de las entidades públicas.</p>
            </Card>
        )}

        {activeTab === 'defenses' && (
            <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-8 bg-white rounded-[2rem] shadow-sm border-2 border-slate-50">
                <h4 className="font-black text-brand-600 text-lg mb-2 underline decoration-brand-200 underline-offset-4">1ra Línea</h4>
                <p className="text-sm text-slate-600">Líderes de proceso y equipos de trabajo (Autocontrol).</p>
            </div>
            <div className="p-8 bg-white rounded-[2rem] shadow-sm border-2 border-slate-50">
                <h4 className="font-black text-brand-600 text-lg mb-2 underline decoration-brand-200 underline-offset-4">2da Línea</h4>
                <p className="text-sm text-slate-600">Planeación y áreas transversales (Evaluación).</p>
            </div>
            <div className="p-8 bg-brand-600 text-white rounded-[2rem] shadow-xl border-2 border-brand-500 scale-105">
                <h4 className="font-black text-white text-lg mb-2">3ra Línea</h4>
                <p className="text-sm text-white/90 font-bold">Oficina de Control Interno (Evaluación Independiente).</p>
            </div>
            </div>
        )}

        {activeTab === 'quiz' && (
            <Quiz 
            questions={[
                { id: 1, question: "¿Cuántas dimensiones tiene MIPG?", options: ["5", "7", "19"], correctAnswer: 1 },
                { id: 2, question: "¿Quién ejerce la 3ra línea de defensa?", options: ["Planeación", "Control Interno", "Contratación"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
            />
        )}
      </main>

      {/* Floating Navigator */}
      {activeTab !== 'quiz' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
          <div className="bg-slate-900 text-white p-2 rounded-[2rem] shadow-2xl flex items-center justify-between">
            {prevSection ? (
              <button onClick={() => navigateTo(prevSection.id)} className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm font-bold">
                <ArrowLeft size={20} />
              </button>
            ) : <div className="w-12"></div>}
            <button onClick={() => navigateTo('menu')} className="p-4 bg-white/10 hover:bg-white/20 rounded-full">
                <LayoutGrid size={20} />
            </button>
            {nextSection && (
              <button 
                onClick={() => navigateTo(nextSection.id)} 
                className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-black uppercase ${nextSection.id === 'quiz' && isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <span>{nextSection.id === 'quiz' ? 'Examen' : nextSection.label}</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
