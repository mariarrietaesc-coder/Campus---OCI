
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz } from '../components/UI';
import { Target, Map, Layout, Scale, Users, FileText, CheckCircle, ArrowLeft, ArrowRight, Clock, Lock, LayoutGrid } from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'intro', label: '¿Qué es el Ministerio?', icon: Target, desc: 'Misión, Visión y objetivos institucionales.' },
  { id: 'normative', label: 'Línea de Tiempo', icon: Scale, desc: 'Evolución normativa y leyes de creación.' },
  { id: 'process', label: 'Mapa de Procesos', icon: Layout, desc: 'Estructura de procesos bajo MIPG.' },
  { id: 'structure', label: 'Estructura Orgánica', icon: Users, desc: 'Organigrama y dependencias del Ministerio.' },
  { id: 'approaches', label: 'Enfoques Transversales', icon: Map, desc: 'Los 8 enfoques que guían la política.' },
  { id: 'programs', label: 'Portafolio Programático', icon: FileText, desc: 'Conozca los 24 programas del sector.' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Prueba de conocimientos del Módulo 1.' }
];

const TIMELINE_DATA = [
    { id: 1, title: 'Ley 2281: Creación', year: 'Ene 2023', content: 'Crea el Ministerio de Igualdad y Equidad.' },
    { id: 2, title: 'Decreto 1075: Estructura', year: 'Jun 2023', content: 'Define despachos, viceministerios y direcciones.' },
    { id: 3, title: 'Resolución 668: Enfoques', year: 'Sep 2024', content: 'Institucionaliza los 8 enfoques transversales.' }
];

export const StrategicModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
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

  // Helpers para navegación lineal
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
            <Badge type="brand">Módulo 1</Badge>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter uppercase">Plataforma Estratégica</h1>
            <p className="text-slate-500 font-medium">Identidad, estructura y portafolio del Ministerio.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="bg-brand-50 p-3 rounded-xl text-brand-600"><Clock size={24}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estudio</p>
              <p className="font-mono font-black text-brand-600 text-lg">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
            </div>
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
                className={`group p-6 bg-white rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden ${locked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-brand-500 border-transparent shadow-xl shadow-slate-200/50'}`}
              >
                <div className="flex flex-col h-full">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                    {locked ? <Lock size={28}/> : <Icon size={28}/>}
                  </div>
                  <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight">{section.label}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4 flex-1">{section.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-32 max-w-4xl mx-auto">
      {/* Header de navegación interna */}
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md py-4 z-20 border-b border-slate-200">
        <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors" title="Volver al menú">
            <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">{currentIndex + 1}. {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {currentIndex + 1} / {SECTIONS.length}
        </div>
      </div>
      
      <main className="min-h-[40vh]">
        {activeTab === 'intro' && (
            <div className="grid gap-6">
            <Card title="Misión" className="border-l-8 border-brand-500 bg-white">
                <p className="text-slate-600 leading-relaxed text-lg">Formular e implementar políticas para avanzar en la garantía del derecho a la igualdad y equidad con enfoques diferenciales.</p>
            </Card>
            <Card title="Visión" className="border-l-8 border-brand-500 bg-white">
                <p className="text-slate-600 leading-relaxed text-lg">Ser un hito permanente en la historia de Colombia que transforma de forma concreta la vida de poblaciones excluidas.</p>
            </Card>
            </div>
        )}

        {activeTab === 'normative' && (
            <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Marco Legal de Creación</h3>
            <div className="grid gap-4">
                {TIMELINE_DATA.map(t => (
                <div key={t.id} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm flex gap-6 items-start hover:shadow-md transition-shadow">
                    <div className="text-brand-600 font-black text-xl whitespace-nowrap">{t.year}</div>
                    <div>
                    <h4 className="font-bold text-slate-900 text-lg">{t.title}</h4>
                    <p className="text-slate-500">{t.content}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}

        {/* ... Otros tabs seguirían el mismo patrón de contenido ... */}

        {activeTab === 'quiz' && (
            <Quiz 
            questions={[
                { id: 1, question: "¿Cuál ley creó el Ministerio?", options: ["Ley 100", "Ley 2281 de 2023", "Ley 80"], correctAnswer: 1 },
                { id: 2, question: "¿Cuántos programas estratégicos tiene el MIE?", options: ["12", "24", "48"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
            />
        )}
      </main>

      {/* Footer de navegación lineal (Botones de Siguiente/Anterior) */}
      {activeTab !== 'quiz' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
          <div className="bg-slate-900 text-white p-2 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
            {prevSection ? (
              <button 
                onClick={() => navigateTo(prevSection.id)}
                className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <ArrowLeft size={20} /> <span className="hidden sm:inline">Anterior</span>
              </button>
            ) : (
                <div className="w-12"></div>
            )}

            <button 
                onClick={() => navigateTo('menu')}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                title="Ir al menú principal"
            >
                <LayoutGrid size={20} />
            </button>

            {nextSection && (
              <button 
                onClick={() => navigateTo(nextSection.id)}
                className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-black uppercase tracking-tighter ${nextSection.id === 'quiz' && isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <span>{nextSection.id === 'quiz' ? 'Ir a Evaluación' : nextSection.label}</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
