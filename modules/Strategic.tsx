import React, { useState } from 'react';
import { Card, Badge, Quiz, Accordion, Callout } from '../components/UI';
import { ShieldCheck, Target, Layers, CheckCircle, ArrowLeft, ArrowRight, LayoutGrid, Info } from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'que-es', label: '¿Qué es?', icon: Info, desc: 'Definición y marco del control interno.' },
  { id: 'objetivos', label: 'Objetivos', icon: Target, desc: 'Para qué sirve el control interno.' },
  { id: 'defensas', label: 'Líneas de defensa', icon: Layers, desc: 'Roles y responsabilidades de control.' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Cierre del Módulo 1.' }
];

export const StrategicModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);
  const nextSection = SECTIONS[currentIndex + 1];
  const prevSection = SECTIONS[currentIndex - 1];
  const navigateTo = (id: string) => { setActiveTab(id); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (activeTab === 'menu') {
    return (
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="border-b border-slate-200 dark:border-slate-700 pb-12">
          <Badge type="brand" className="mb-4">Módulo 1</Badge>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Fundamentos del Control Interno</h1>
          <p className="text-slate-500 font-medium text-lg mt-4">Qué es, para qué sirve y cómo se organiza en una entidad.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <button key={section.id} onClick={() => navigateTo(section.id)} className="group p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 transition-all text-left shadow-xl hover:border-brand-500 border-transparent active:scale-95">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-brand-50 text-brand-600"><Icon size={26} /></div>
                  <span className="text-[9px] font-bold text-slate-300 tracking-wider">Sección 0{i + 1}</span>
                </div>
                <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-2 leading-tight tracking-tighter">{section.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-snug">{section.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-32 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 z-40 border-b border-slate-200 dark:border-slate-700 px-2">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors"><LayoutGrid size={24} /></button>
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Módulo 1 - {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS.length}</div>
      </div>

      <main className="min-h-[60vh] px-2 md:px-0">
        {activeTab === 'que-es' && (
          <div className="space-y-8">
            <Card title="Definición" className="border-l-8 border-brand-500 !rounded-[2.5rem]">
              <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">El <b>control interno</b> es el conjunto de planes, métodos, principios y mecanismos que adopta una entidad para dar seguridad razonable sobre el logro de sus objetivos, el uso adecuado de los recursos y el cumplimiento de la normativa. En el sector público colombiano se enmarca en la <b>Ley 87 de 1993</b> y en el modelo <b>MECI</b>, articulado con el MIPG.</p>
            </Card>
            <Callout type="info">El control interno no es un área aislada: es responsabilidad de toda la organización, desde la alta dirección hasta cada colaborador.</Callout>
          </div>
        )}

        {activeTab === 'objetivos' && (
          <div className="space-y-6">
            <Accordion title="Eficacia y eficiencia de las operaciones" defaultOpen>
              <p>Que los procesos cumplan su propósito y usen bien los recursos.</p>
            </Accordion>
            <Accordion title="Confiabilidad de la información">
              <p>Que la información financiera y de gestión sea íntegra, oportuna y verificable.</p>
            </Accordion>
            <Accordion title="Cumplimiento normativo">
              <p>Que la entidad actúe conforme a las leyes, reglamentos y políticas aplicables.</p>
            </Accordion>
            <Accordion title="Protección de los recursos">
              <p>Salvaguardar los bienes y activos frente a pérdida, uso indebido o fraude.</p>
            </Accordion>
          </div>
        )}

        {activeTab === 'defensas' && (
          <div className="space-y-6">
            <Card title="Modelo de las tres líneas">
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">El control se distribuye en roles complementarios para asegurar una gestión sana del riesgo.</p>
            </Card>
            <div className="grid md:grid-cols-3 gap-6">
              <Card title="1a linea" className="text-center !rounded-[2rem]"><p className="text-[10px] font-bold text-brand-600 mb-2 uppercase tracking-widest">Autocontrol</p><p className="text-xs text-slate-700 dark:text-slate-300">Líderes y colaboradores que ejecutan los controles en la operación diaria.</p></Card>
              <Card title="2a linea" className="text-center !rounded-[2rem]"><p className="text-[10px] font-bold text-brand-600 mb-2 uppercase tracking-widest">Supervisión</p><p className="text-xs text-slate-700 dark:text-slate-300">Áreas que vigilan riesgos y cumplimiento (planeación, calidad, riesgos).</p></Card>
              <Card title="3a linea" className="text-center bg-brand-50 dark:bg-brand-900/20 border-brand-200 !rounded-[2rem]"><p className="text-[10px] font-bold text-brand-600 mb-2 uppercase tracking-widest">Independiente</p><p className="text-xs font-bold text-slate-700 dark:text-slate-300">Auditoría interna: evaluación objetiva e independiente.</p></Card>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <Quiz
            questions={[
              { id: 1, question: "El control interno en el sector público colombiano se enmarca principalmente en:", options: ["La Ley 80 de 1993", "La Ley 87 de 1993 y el MECI", "El Código Sustantivo del Trabajo"], correctAnswer: 1 },
              { id: 2, question: "¿De quién es responsabilidad el control interno?", options: ["Solo de la Oficina de Control Interno", "De toda la organización", "Solo de la alta dirección"], correctAnswer: 1 },
              { id: 3, question: "La auditoría interna corresponde a:", options: ["La primera línea de defensa", "La segunda línea de defensa", "La tercera línea de defensa (independiente)"], correctAnswer: 2 }
            ]}
            onComplete={onComplete}
          />
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40">
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-2 rounded-full shadow-2xl flex items-center justify-between border border-white/10">
          {prevSection ? (
            <button onClick={() => navigateTo(prevSection.id)} className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2" title="Anterior"><ArrowLeft size={20} /></button>
          ) : <div className="w-12"></div>}
          <button onClick={() => navigateTo('menu')} className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"><LayoutGrid size={20} /></button>
          {nextSection && (
            <button onClick={() => navigateTo(nextSection.id)} className="p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-bold tracking-tighter">
              <span>{nextSection.id === 'quiz' ? 'Examen' : nextSection.label}</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
