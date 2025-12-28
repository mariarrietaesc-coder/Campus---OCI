
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, Accordion, TimelineItem } from '../components/UI';
import { 
  BookOpen, Clock, Shield, RefreshCw, CheckCircle, 
  Layers, Lock, ArrowLeft, ArrowRight, 
  LayoutGrid, Info, FileText, ShieldCheck,
  Zap, Activity
} from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'que-es', label: '¿Qué es MIPG?', icon: Info, desc: 'Marco de referencia y principios institucionales.' },
  { id: 'timeline', label: 'Línea de tiempo', icon: Clock, desc: 'Hitos normativos desde 2003 hasta 2025.' },
  { id: 'dimensiones', label: '7 Dimensiones', icon: LayoutGrid, desc: 'Políticas de gestión y dependencias líderes.' },
  { id: 'subsistemas', label: 'Subsistemas SIG', icon: Layers, desc: 'Calidad, ambiental, SST y seguridad.' },
  { id: 'defensas', label: 'Líneas de defensa', icon: ShieldCheck, desc: 'Esquema de responsabilidades y control.' },
  { id: 'furag', label: 'Ciclo del MIPG', icon: RefreshCw, desc: 'Fases: Planear, hacer, verificar y actuar.' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Evaluación de conocimientos Módulo 2.' }
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
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-700 pb-12">
          <div>
            <Badge type="brand" className="mb-4">Módulo 2</Badge>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">MIPG y SIG</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg mt-4">Modelo integrado de planeación y gestión.</p>
          </div>
          <div className="bg-white dark:bg-slate-800 px-8 py-5 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-6 text-brand-600">
            <Clock size={28} />
            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider mb-1">Tiempo de estudio</p>
              <p className="font-mono font-black text-xl leading-none">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((section, i) => {
            const Icon = section.icon;
            const locked = section.id === 'quiz' && isLocked;
            return (
              <button
                key={section.id}
                onClick={() => !locked && setActiveTab(section.id)}
                className={`group p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 transition-all text-left shadow-xl ${locked ? 'opacity-40 grayscale cursor-not-allowed border-transparent' : 'hover:border-brand-500 border-transparent active:scale-95'}`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                    {locked ? <Lock size={26}/> : <Icon size={26}/>}
                  </div>
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
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors">
                <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Módulo 2 - {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS.length}</div>
      </div>

      <main className="min-h-[60vh] px-2 md:px-0">
        
        {activeTab === 'que-es' && (
          <div className="space-y-12">
            <Card title="Definición del modelo" className="border-l-8 border-brand-500 !rounded-[2.5rem]">
              <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                Es un marco de referencia para <b>dirigir, planear, ejecutar, hacer seguimiento, evaluar y controlar</b> la gestión de las entidades públicas. Su objetivo es generar valor público y fortalecer las políticas de gestión y desempeño institucional, siempre con un enfoque de integridad y servicio al ciudadano.
              </p>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-brand-100 dark:border-slate-700 shadow-xl">
                <div className="text-5xl font-black text-brand-600">7</div>
                <div className="text-xs font-bold text-slate-500 uppercase mt-4 tracking-widest">Dimensiones</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-brand-100 dark:border-slate-700 shadow-xl">
                <div className="text-5xl font-black text-brand-600">19</div>
                <div className="text-xs font-bold text-slate-500 uppercase mt-4 tracking-widest">Políticas</div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-brand-100 dark:border-slate-700 shadow-xl">
                <div className="text-5xl font-black text-brand-600">1</div>
                <div className="text-xs font-bold text-slate-500 uppercase mt-4 tracking-widest">FURAG</div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-black text-2xl text-brand-700 dark:text-brand-400 flex items-center gap-4 tracking-tighter">
                <Zap size={28} /> Principios del MIPG
              </h4>
              <div className="flex flex-wrap gap-4">
                {['Orientación a resultados', 'Excelencia y calidad', 'Articulación interinstitucional', 'Toma de decisiones basada en evidencia', 'Aprendizaje e innovación', 'Integridad y confianza'].map(p => (
                  <span key={p} className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-sm font-black border border-slate-100 dark:border-slate-700 shadow-md">{p}</span>
                ))}
              </div>
            </div>

            <Card title="Implementación institucional" className="bg-brand-50 dark:bg-brand-900/10 !rounded-[2.5rem]">
              <p className="text-lg mb-6 text-slate-700 dark:text-slate-300 font-medium">El MIPG fue adoptado formalmente mediante la <b>Resolución 1022 de 2024</b>, que crea el Sistema Integrado de Gestión (SIG-MIPG).</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-4 items-start bg-white dark:bg-slate-800 p-6 rounded-2xl border border-brand-100 dark:border-slate-700 shadow-xl">
                  <FileText className="text-brand-500 shrink-0" size={24} />
                  <p className="text-xs text-slate-700 dark:text-slate-300"><b>Manual del SIG-MIPG:</b> <code>ES_A-MS-001</code>. Establece la estructura, procesos, roles y responsabilidades.</p>
                </div>
                <div className="flex gap-4 items-start bg-white dark:bg-slate-800 p-6 rounded-2xl border border-brand-100 dark:border-slate-700 shadow-xl">
                  <Activity className="text-brand-500 shrink-0" size={24} />
                  <p className="text-xs text-slate-700 dark:text-slate-300"><b>Procedimiento de administración:</b> <code>GE_A-PR-004</code>. Ciclo operativo desde el autodiagnóstico hasta FURAG.</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <TimelineItem year="2003" title="Adopción del MECI" description="Decreto 1599. Primeros lineamientos obligatorios de autorregulación, autocontrol y autogestión." />
            <TimelineItem year="2012" title="Primer MIPG" description="Decreto 2482. Articulación de los sistemas de desarrollo administrativo y control interno." />
            <TimelineItem year="2017" title="Actualización y consolidación" description="Decreto 1499. Integración de calidad con desarrollo administrativo y MECI. Obligatorio cumplimiento." />
            <TimelineItem year="2023" title="Creación del ministerio" description="Ley 2281. El ministerio nace con la obligación de adoptar los marcos de gestión pública desde su inicio." />
            <TimelineItem year="2024" title="Resolución 1022" description="Adopción formal del MIPG en el MIE y constitución del SIG-MIPG institucional." />
            <TimelineItem year="2025" title="Documentos operativos" description="Aprobación del manual ES_A-MS-001 y procedimiento GE_A-PR-004 para la ruta operativa interna." />
          </div>
        )}

        {activeTab === 'dimensiones' && (
          <div className="space-y-4">
            <Accordion title="1. Talento humano">
              <p className="text-sm leading-relaxed">
                Gestiona el ciclo del servidor público (ingreso, desarrollo y retiro). Promueve integridad, mérito y desempeño individual.
                <br/><b>Dependencia líder:</b> Subdirección de Talento Humano.
                <br/><b>Políticas:</b> G.E. del Talento Humano; Integridad.
              </p>
            </Accordion>
            <Accordion title="2. Direccionamiento estratégico y planeación">
              <p className="text-sm leading-relaxed">
                Define la ruta para garantizar derechos y metas en términos de productos y servicios.
                <br/><b>Líderes:</b> Oficina de Planeación (Planeación), Subdirección Administrativa (Presupuesto), Subdirección de Contratación (Compras).
                <br/><b>Políticas:</b> Planeación institucional; Gestión presupuestal; Gestión de compras.
              </p>
            </Accordion>
            <Accordion title="3. Gestión con valores para resultados">
              <p className="text-sm leading-relaxed">
                Materializa las decisiones de planeación en la operación interna y relación con la ciudadanía.
                <br/><b>Líderes:</b> Planeación, Administrativa, Relacionamiento con la Ciudadanía, Oficina de TI.
                <br/><b>Políticas:</b> Fortalecimiento organizacional; Gestión ambiental; Servicio al ciudadano; Trámites; Gobierno digital; Seguridad digital; Defensa jurídica; Mejora normativa.
              </p>
            </Accordion>
            <Accordion title="4. Evaluación de resultados">
              <p className="text-sm leading-relaxed">
                Seguimiento permanente para conocer avances y plantear acciones de mitigación de riesgos.
                <br/><b>Dependencia líder:</b> Oficina de Saberes y Conocimientos Estratégicos.
                <br/><b>Políticas:</b> Seguimiento y evaluación del desempeño institucional.
              </p>
            </Accordion>
            <Accordion title="5. Información y comunicación">
              <p className="text-sm leading-relaxed">
                Garantiza flujo de información interna y externa. Gestión documental para trazabilidad y transparencia.
                <br/><b>Líderes:</b> Administrativa (Documental), TI (Seguridad Digital), Relacionamiento (Transparencia), Saberes (Estadística).
                <br/><b>Políticas:</b> Gestión documental; Gestión de la información estadística.
              </p>
            </Accordion>
            <Accordion title="6. Gestión del conocimiento e innovación">
              <p className="text-sm leading-relaxed">
                Comparte y difunde el conocimiento para el aprendizaje organizacional ("aprender haciendo").
                <br/><b>Dependencia líder:</b> Oficina de Saberes y Conocimientos Estratégicos.
                <br/><b>Políticas:</b> Gestión del conocimiento y la innovación.
              </p>
            </Accordion>
            <Accordion title="7. Control interno">
              <p className="text-sm leading-relaxed">
                Buenas prácticas para asegurar razonablemente que las demás dimensiones cumplan su propósito.
                <br/><b>Dependencia líder:</b> Oficina Asesora de Planeación (coordina), con aseguramiento independiente de la <b>Oficina de Control Interno</b>.
              </p>
            </Accordion>
          </div>
        )}

        {activeTab === 'subsistemas' && (
          <div className="space-y-4">
            <p className="text-slate-500 font-medium italic mb-4">El SIG articula diferentes subsistemas bajo el marco del MIPG:</p>
            <Accordion title="1. Gestión de la calidad (SGC)">
              <p className="text-sm">Base: NTCGP 1000:2017. Mejora procesos y estandariza para eficiencia. <b>Líder:</b> Planeación.</p>
            </Accordion>
            <Accordion title="2. Control interno (SCI)">
              <p className="text-sm">Base: Ley 87 de 1993 y MECI. Autocontrol y transparencia. <b>Líder:</b> Oficina Asesora de Planeación.</p>
            </Accordion>
            <Accordion title="3. Gestión ambiental (SGA)">
              <p className="text-sm">Base: Decreto 1076 de 2015. Ecoeficiencia y justicia ambiental. <b>Líder:</b> Administrativa y Financiera.</p>
            </Accordion>
            <Accordion title="4. Seguridad de la información (SGSI)">
              <p className="text-sm">Base: Modelo MSPI. Confidencialidad y trazabilidad de activos digitales. <b>Líder:</b> Oficina de TI.</p>
            </Accordion>
            <Accordion title="5. Gestión documental y archivos (SIGA)">
              <p className="text-sm">Base: Ley 594 de 2000. Memoria institucional y acceso a información. <b>Líder:</b> Administrativa y Financiera.</p>
            </Accordion>
            <Accordion title="6. Seguridad y salud en el trabajo (SST)">
              <p className="text-sm">Base: Decreto 1072 de 2015. Bienestar físico y mental de servidores. <b>Líder:</b> Talento Humano.</p>
            </Accordion>
            <Accordion title="7. Gestión del riesgo">
              <p className="text-sm">Identificación y tratamiento de riesgos institucionales. <b>Líder:</b> Planeación con líderes de proceso.</p>
            </Accordion>
          </div>
        )}

        {activeTab === 'defensas' && (
          <div className="space-y-6">
            <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl">
              <h4 className="font-bold text-brand-400 mb-6 flex items-center gap-4 text-xl tracking-tight"><Shield size={28}/> Línea estratégica</h4>
              <p className="text-lg leading-relaxed opacity-90">Ejercida por la <b>Alta dirección</b> y el <b>CICCI</b>. Define el marco general, supervisa metas y aprueba lineamientos de riesgo y control interno.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="1ra línea" className="text-center !rounded-[2rem]">
                <p className="text-[10px] font-bold text-brand-600 mb-2 uppercase tracking-widest">Autocontrol</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">Colaboradores y líderes de proceso. Ejecutan controles en la operación diaria.</p>
              </Card>
              <Card title="2da línea" className="text-center !rounded-[2rem]">
                <p className="text-[10px] font-bold text-brand-600 mb-2 uppercase tracking-widest">Autoevaluación</p>
                <p className="text-xs text-slate-700 dark:text-slate-300">Directivos y asesores (Planeación/SAF). Verifican gestión de riesgos transversales.</p>
              </Card>
              <Card title="3ra línea" className="text-center bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-700 !rounded-[2rem]">
                <p className="text-[10px] font-bold text-brand-600 mb-2 uppercase tracking-widest">Independiente</p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Oficina de Control Interno. Evaluación objetiva y mapa de aseguramiento.</p>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'furag' && (
          <div className="space-y-4">
            <Accordion title="Fase 1: PLANEAR" defaultOpen>
              <p className="text-sm">Diagnóstico inicial, plan anual MIPG y designación de enlaces operativos por dependencia.</p>
            </Accordion>
            <Accordion title="Fase 2: HACER">
              <p className="text-sm">Ejecución de autodiagnósticos por política, cierre de brechas y monitoreo de riesgos.</p>
            </Accordion>
            <Accordion title="Fase 3: VERIFICAR">
              <p className="text-sm">Alistamiento y diligenciamiento del <b>FURAG</b>. Análisis del Índice de desempeño institucional (IDI).</p>
            </Accordion>
            <Accordion title="Fase 4: ACTUAR">
              <p className="text-sm">Plan de mejora post-FURAG, integración de lecciones aprendidas y realimentación del ciclo.</p>
            </Accordion>
          </div>
        )}

        {activeTab === 'quiz' && (
          <Quiz 
            questions={[
              { 
                id: 1, 
                question: "¿Cuál es el instrumento de medición del desempeño institucional en el marco del MIPG?", 
                options: ["El plan de acción institucional", "El formulario único de reporte y avance de la gestión (FURAG)", "El mapa de procesos"], 
                correctAnswer: 1 
              },
              { 
                id: 2, 
                question: "Según el procedimiento del ministerio, ¿qué dependencia lidera la segunda línea de defensa?", 
                options: ["La oficina de control interno", "La secretaría general", "La oficina asesora de planeación"], 
                correctAnswer: 2 
              },
              { 
                id: 3, 
                question: "El subsistema de gestión ambiental (SGA) es responsabilidad de:", 
                options: ["La subdirección administrativa y financiera", "La oficina de tecnologías de la información", "La subdirección de talento humano"], 
                correctAnswer: 0 
              }
            ]}
            onComplete={onComplete}
          />
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40">
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-2 rounded-full shadow-2xl flex items-center justify-between border border-white/10">
          {prevSection ? (
            <button onClick={() => navigateTo(prevSection.id)} className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2" title="Anterior">
              <ArrowLeft size={20} />
            </button>
          ) : <div className="w-12"></div>}
          <button onClick={() => navigateTo('menu')} className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <LayoutGrid size={20} />
          </button>
          {nextSection && (
            <button 
              onClick={() => navigateTo(nextSection.id)} 
              className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-bold tracking-tighter ${nextSection.id === 'quiz' && isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <span>{nextSection.id === 'quiz' ? 'Examen' : nextSection.label}</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
