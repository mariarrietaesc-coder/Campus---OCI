
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Accordion, TimelineItem, Quiz, MinistryLogo } from '../components/UI';
import { BookOpen, Clock, Activity, Shield, RefreshCw, CheckCircle, Info, Grid, ArrowLeft, ArrowRight, ChevronDown, Layout, Target, FileText, Layers, BarChart2, Lock } from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'intro', label: '¿Qué es MIPG?', icon: BookOpen, desc: 'Definición, principios y alcance.' },
  { id: 'timeline', label: 'Línea de Tiempo', icon: Clock, desc: 'Evolución normativa en el Ministerio.' },
  { id: 'dimensions', label: '7 Dimensiones', icon: Layout, desc: 'Políticas de Gestión y Desempeño.' },
  { id: 'subsystems', label: 'Subsistemas SIG', icon: Layers, desc: 'Calidad, Ambiental, SST, etc.' },
  { id: 'defenses', label: 'Líneas de Defensa', icon: Shield, desc: 'Roles y responsabilidades de control.' },
  { id: 'furag', label: 'Ciclo FURAG', icon: RefreshCw, desc: 'Planear, Hacer, Verificar, Actuar.' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Prueba rápida de conocimiento.' }
];

interface MIPGModuleProps {
    onComplete: (score: number) => void;
    onTimeUpdate: (seconds: number) => void;
    saveProgress: () => void;
    data: QuizState;
}

export const MIPGModule: React.FC<MIPGModuleProps> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState<'menu' | string>('menu');
  
  // Time tracking logic
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

  const currentSectionIndex = SECTIONS.findIndex(s => s.id === activeTab);

  const handleNext = () => {
      if (currentSectionIndex < SECTIONS.length - 1) {
          setActiveTab(SECTIONS[currentSectionIndex + 1].id);
          window.scrollTo(0,0);
      }
  };

  const handlePrev = () => {
      if (currentSectionIndex > 0) {
          setActiveTab(SECTIONS[currentSectionIndex - 1].id);
          window.scrollTo(0,0);
      }
  };

  const progressPercentage = activeTab === 'menu' ? 0 : Math.round(((currentSectionIndex + 1) / SECTIONS.length) * 100);

  const timeSpent = data.timeSpentSeconds || 0;
  const minTime = data.minTimeSeconds || 60;
  const timeLeft = Math.max(0, minTime - timeSpent);
  const isQuizLocked = timeLeft > 0 && !data.completed;

  // --- RENDER MENU ---
  if (activeTab === 'menu') {
      return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div>
                    <Badge type="brand">Módulo 2</Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Modelo Integrado de Planeación y Gestión</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Marco de referencia para dirigir, planear, ejecutar, hacer seguimiento, evaluar y controlar.</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm flex items-center gap-3">
                        <div className={`p-2 rounded-full ${timeLeft > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                            {timeLeft > 0 ? <Clock size={20} /> : <CheckCircle size={20} />}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Tiempo de Estudio</p>
                            <p className="font-mono font-bold text-slate-800 dark:text-white">
                                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s <span className="text-slate-400 text-xs">/ {Math.floor(minTime/60)}m req</span>
                            </p>
                        </div>
                    </div>
                    <MinistryLogo variant="horizontal" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SECTIONS.map((section) => {
                    const Icon = section.icon;
                    const isLockedQuiz = section.id === 'quiz' && isQuizLocked;

                    return (
                        <button 
                            key={section.id}
                            onClick={() => !isLockedQuiz && setActiveTab(section.id)}
                            disabled={isLockedQuiz}
                            className={`bg-white dark:bg-slate-800 p-6 rounded-2xl border transition-all text-left group relative overflow-hidden
                                ${isLockedQuiz 
                                    ? 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 opacity-75 cursor-not-allowed' 
                                    : 'border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-lg'
                                }
                            `}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform
                                ${isLockedQuiz ? 'bg-gray-200 text-gray-500' : 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 group-hover:scale-110'}
                            `}>
                                {isLockedQuiz ? <Lock size={24} /> : <Icon size={24} />}
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">{section.label}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{section.desc}</p>
                            
                            {isLockedQuiz && (
                                <div className="absolute inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                                    <span className="bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Faltan {Math.ceil(timeLeft / 60)} min
                                    </span>
                                </div>
                            )}
                        </button>
                    )
                })}
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex gap-3 text-blue-800 dark:text-blue-200 text-sm border border-blue-100 dark:border-blue-800">
                <Info className="shrink-0" />
                <p>
                    <b>Nota:</b> Para garantizar la apropiación del conocimiento, el examen final se desbloqueará después de <b>{Math.ceil(minTime/60)} minutos</b> de estudio en este módulo.
                </p>
            </div>
        </div>
      );
  }

  // --- RENDER SECTIONS ---
  const activeSection = SECTIONS.find(s => s.id === activeTab);

  return (
    <div className="space-y-6 animate-fade-in pb-24">
        {/* Header Navigation */}
        <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur z-30 pt-4 pb-2 border-b border-gray-200 dark:border-slate-700 mb-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setActiveTab('menu')} 
                        className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-brand-600 transition-colors shadow-sm"
                        title="Volver al Menú"
                    >
                        <Grid size={18} />
                        <span className="text-sm font-bold hidden sm:inline">Menú</span>
                    </button>

                    <div className="relative group flex-1 md:flex-none">
                        <select 
                            value={activeTab} 
                            onChange={(e) => {
                                const newVal = e.target.value;
                                if (newVal === 'quiz' && isQuizLocked) {
                                    alert(`Debes estudiar ${Math.ceil(timeLeft/60)} minutos más para habilitar la evaluación.`);
                                    return;
                                }
                                setActiveTab(newVal);
                                window.scrollTo(0,0);
                            }}
                            className="appearance-none w-full md:w-64 pl-9 pr-8 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer shadow-sm"
                        >
                            {SECTIONS.map(s => (
                                <option key={s.id} value={s.id} disabled={s.id === 'quiz' && isQuizLocked}>
                                    {s.label} {s.id === 'quiz' && isQuizLocked ? '(Bloqueado)' : ''}
                                </option>
                            ))}
                        </select>
                        <div className="absolute left-3 top-2.5 text-brand-600 dark:text-brand-400 pointer-events-none">
                            {activeSection?.icon && <activeSection.icon size={16} />}
                        </div>
                        <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                     <div className="hidden md:block text-xs font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">
                        {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
                     </div>
                     <div className="hidden md:flex items-center text-xs text-slate-400">
                        Tema {currentSectionIndex + 1} de {SECTIONS.length}
                    </div>
                </div>
            </div>
            <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-brand-500 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
        </div>

        {/* Content */}
        <div className="min-h-[500px]">

            {activeTab === 'intro' && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                    <div className="space-y-6">
                        <Card title="¿Qué es el MIPG?">
                            <p className="text-slate-600 dark:text-slate-300 mb-6">
                                Es un marco de referencia para <b>dirigir, planear, ejecutar, hacer seguimiento, evaluar y controlar</b> la gestión de las entidades públicas. Su objetivo es generar valor público y fortalecer las políticas de gestión y desempeño institucional.
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-center border border-brand-100 dark:border-brand-800">
                                    <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">7</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Dimensiones</div>
                                </div>
                                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-center border border-brand-100 dark:border-brand-800">
                                    <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">19</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Políticas</div>
                                </div>
                                <div className="p-4 bg-brand-50 dark:bg-brand-900/20 rounded-xl text-center border border-brand-100 dark:border-brand-800">
                                    <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">1</div>
                                    <div className="text-[10px] uppercase font-bold text-slate-500">Instrumento (FURAG)</div>
                                </div>
                            </div>
                        </Card>
                        <Card title="Principios">
                            <div className="flex flex-wrap gap-2">
                                {['Orientación a resultados', 'Excelencia y calidad', 'Articulación interinstitucional', 'Toma de decisiones basada en evidencia', 'Aprendizaje e innovación', 'Integridad y confianza'].map(p => (
                                    <span key={p} className="px-3 py-1 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300">{p}</span>
                                ))}
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card title="Implementación en el Ministerio" className="h-full border-l-4 border-l-brand-500">
                            <p className="text-slate-600 dark:text-slate-300 mb-4">
                                El MIPG fue adoptado formalmente mediante la <b>Resolución 1022 de 2024</b>, creando el Sistema Integrado de Gestión (SIG-MIPG).
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3 items-start">
                                    <FileText className="text-brand-500 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">Manual del SIG-MIPG</p>
                                        <code className="text-xs bg-gray-100 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-400">ES_A-MS-001</code>
                                        <p className="text-xs text-slate-500 mt-1">Establece la estructura, procesos, roles y responsabilidades.</p>
                                    </div>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Activity className="text-brand-500 shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white text-sm">Procedimiento de Administración</p>
                                        <code className="text-xs bg-gray-100 dark:bg-slate-700 px-1 py-0.5 rounded text-slate-600 dark:text-slate-400">GE_A-PR-004</code>
                                        <p className="text-xs text-slate-500 mt-1">Describe el ciclo operativo desde el autodiagnóstico hasta el reporte en FURAG.</p>
                                    </div>
                                </li>
                            </ul>
                        </Card>
                    </div>
                </div>
            )}

            {activeTab === 'timeline' && (
                <div className="animate-fade-in">
                    <Card title="Evolución Normativa del MIPG">
                        <div className="space-y-6 pl-4 border-l-2 border-gray-200 dark:border-slate-700 ml-4 relative">
                            {[
                                { year: '2003', title: 'Adopción del MECI (D. 1599)', desc: 'Primeros lineamientos de autorregulación y control.' },
                                { year: '2012', title: 'Creación del MIPG (D. 2482)', desc: 'Articulación de sistemas de desarrollo administrativo.' },
                                { year: '2017', title: 'Actualización MIPG (D. 1499)', desc: 'Integración con Calidad. Se hace obligatorio.' },
                                { year: '2023', title: 'Creación MinIgualdad (Ley 2281)', desc: 'Nace la entidad con obligación de adoptar el modelo.' },
                                { year: '2024', title: 'Adopción Formal (Res. 1022)', desc: 'El Ministerio constituye su Sistema Integrado de Gestión.' },
                                { year: '2025', title: 'Operación Plena', desc: 'Manuales, procedimientos y reportes FURAG.' },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-500 border-4 border-white dark:border-slate-800"></div>
                                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase">{item.year}</span>
                                    <h3 className="font-bold text-slate-800 dark:text-white">{item.title}</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'dimensions' && (
                <div className="animate-fade-in space-y-4">
                    <Card title="Las 7 Dimensiones Operativas">
                        <p className="text-sm text-slate-500 mb-6">Cada dimensión agrupa políticas de gestión. Despliega para ver detalles.</p>
                        <Accordion title="1. Talento Humano">
                            <p className="mb-2">Gestiona el ciclo del servidor público (ingreso, desarrollo, retiro). Garantiza mérito e integridad.</p>
                            <p className="text-xs"><b>Líder:</b> Subdirección de Talento Humano.</p>
                        </Accordion>
                        <Accordion title="2. Direccionamiento Estratégico">
                            <p className="mb-2">Define la ruta estratégica (metas, recursos) para satisfacer necesidades ciudadanas.</p>
                            <p className="text-xs"><b>Líder:</b> Oficina Asesora de Planeación.</p>
                        </Accordion>
                        <Accordion title="3. Gestión con Valores para Resultados">
                            <p className="mb-2">"De la ventanilla hacia adentro y hacia afuera". Incluye Servicio al ciudadano, Gobierno Digital, Trámites.</p>
                            <p className="text-xs"><b>Líderes:</b> Múltiples dependencias (Planeación, TICs, Relacionamiento Ciudadano).</p>
                        </Accordion>
                        <Accordion title="4. Evaluación de Resultados">
                            <p className="mb-2">Seguimiento a la gestión para conocer avances y mitigar riesgos.</p>
                            <p className="text-xs"><b>Líder:</b> Oficina de Saberes.</p>
                        </Accordion>
                        <Accordion title="5. Información y Comunicación">
                            <p className="mb-2">Garantiza flujo de información. Clave: Gestión Documental, Transparencia.</p>
                            <p className="text-xs"><b>Líderes:</b> SAF, TICs, Comunicaciones.</p>
                        </Accordion>
                        <Accordion title="6. Gestión del Conocimiento">
                            <p className="mb-2">Acciones para compartir y difundir conocimiento. Aprendizaje e innovación.</p>
                            <p className="text-xs"><b>Líder:</b> Oficina de Saberes.</p>
                        </Accordion>
                        <Accordion title="7. Control Interno">
                            <p className="mb-2">Lineamientos para el control y mejora continua. Asegura que las demás dimensiones funcionen.</p>
                            <p className="text-xs"><b>Líder:</b> Planeación (Coordina) / OCI (Evalúa).</p>
                        </Accordion>
                    </Card>
                </div>
            )}

            {activeTab === 'subsystems' && (
                <div className="animate-fade-in">
                    <Card title="Subsistemas del SIG-MIPG">
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { t: 'Gestión de Calidad', d: 'Mejora continua y estandarización.', r: 'Planeación' },
                                { t: 'Control Interno', d: 'Autorregulación y transparencia.', r: 'OCI' },
                                { t: 'Gestión Ambiental', d: 'Prácticas sostenibles.', r: 'Sub. Admin' },
                                { t: 'Seguridad de la Información', d: 'Confidencialidad e integridad.', r: 'TICs' },
                                { t: 'Gestión Documental', d: 'Archivos y memoria.', r: 'Sub. Admin' },
                                { t: 'Seguridad y Salud (SST)', d: 'Bienestar y prevención.', r: 'Talento Humano' },
                                { t: 'Gestión del Riesgo', d: 'Tratamiento de riesgos.', r: 'Planeación' },
                            ].map((s, i) => (
                                <div key={i} className="p-4 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-700/30">
                                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">{i + 1}. {s.t}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.d}</p>
                                    <span className="inline-block mt-2 text-[10px] font-bold bg-white dark:bg-slate-800 px-2 py-1 rounded border border-gray-200 dark:border-slate-600 text-brand-600 dark:text-brand-400">{s.r}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'defenses' && (
                <div className="animate-fade-in">
                    <Card title="Esquema de Líneas de Defensa">
                        <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-slate-700">
                            {[
                                { t: 'Línea Estratégica', a: 'Alta Dirección / CICCI', d: 'Define marco general, analiza riesgos estratégicos y supervisa.', c: 'bg-slate-800 text-white' },
                                { t: '1ra Línea de Defensa', a: 'Gerentes y Líderes', d: 'Autocontrol. "Yo ejecuto, yo controlo". Gestionan riesgos en la operación diaria.', c: 'bg-blue-600 text-white' },
                                { t: '2da Línea de Defensa', a: 'Planeación / Jefes', d: 'Autoevaluación. Monitoreo, seguimiento y gestión de riesgos transversales.', c: 'bg-indigo-600 text-white' },
                                { t: '3ra Línea de Defensa', a: 'Oficina de Control Interno', d: 'Evaluación Independiente. Aseguramiento objetivo sobre la efectividad del sistema.', c: 'bg-brand-600 text-white' },
                            ].map((l, i) => (
                                <div key={i} className="relative">
                                    <div className={`absolute -left-[29px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-slate-800 ${l.c}`}>
                                        {i === 0 ? 'E' : i}
                                    </div>
                                    <h3 className="font-bold text-slate-800 dark:text-white">{l.t}</h3>
                                    <p className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase mb-1">{l.a}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">{l.d}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'furag' && (
                <div className="animate-fade-in">
                     <Card title="Ciclo Operativo (FURAG)">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { step: '1', title: 'Planear', desc: 'Diagnóstico y hoja de ruta.', color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                                { step: '2', title: 'Hacer', desc: 'Autodiagnósticos y mejoras.', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' },
                                { step: '3', title: 'Verificar', desc: 'Reporte FURAG y análisis IDI.', color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' },
                                { step: '4', title: 'Actuar', desc: 'Cierre de brechas.', color: 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' },
                            ].map((s) => (
                                <div key={s.step} className={`p-4 rounded-xl border-t-4 ${s.color}`}>
                                    <div className="text-2xl font-black opacity-20 mb-1">{s.step}</div>
                                    <h4 className="font-bold text-slate-800 dark:text-white">{s.title}</h4>
                                    <p className="text-xs text-slate-600 dark:text-slate-300">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-800 dark:text-yellow-200">
                            <b>Hito Clave:</b> La ventana de reporte FURAG es anual. Planeación lidera la consolidación y validación antes del envío al DAFP.
                        </div>
                     </Card>
                </div>
            )}

            {activeTab === 'quiz' && (
                <div className="animate-fade-in">
                    {!isQuizLocked ? (
                        <Quiz 
                            questions={[
                                { id: 1, question: "¿Cuál es el instrumento de medición del desempeño institucional?", options: ["PAI", "FURAG", "Mapa de Procesos"], correctAnswer: 1 },
                                { id: 2, question: "Según el procedimiento, ¿quién lidera la 2da línea de defensa?", options: ["Oficina de Control Interno", "Secretaría General", "Oficina Asesora de Planeación"], correctAnswer: 2 },
                                { id: 3, question: "El Subsistema de Gestión Ambiental es responsabilidad de:", options: ["Subdirección Administrativa y Financiera", "TICs", "Talento Humano"], correctAnswer: 0 },
                                { id: 4, question: "¿Qué dimensión coordina la OCI?", options: ["Talento Humano", "Control Interno (Evaluación)", "Direccionamiento Estratégico"], correctAnswer: 1 }
                            ]}
                            onComplete={onComplete}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 text-gray-400 rounded-full flex items-center justify-center mb-6">
                                <Lock size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Evaluación Bloqueada</h2>
                            <p className="text-slate-600 dark:text-slate-400 max-w-md">
                                Debes completar el tiempo mínimo de estudio para acceder a la evaluación.
                            </p>
                            <div className="mt-6 bg-amber-50 dark:bg-amber-900/20 px-6 py-3 rounded-lg border border-amber-200 dark:border-amber-800">
                                <p className="text-amber-800 dark:text-amber-200 font-bold">
                                    Tiempo restante: {Math.ceil(timeLeft / 60)} minutos
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>

        {/* Footer Navigation */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
            <div className="flex gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 pointer-events-auto">
                <button 
                    onClick={handlePrev} 
                    disabled={currentSectionIndex <= 0}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                    <ArrowLeft size={16} /> Anterior
                </button>
                <div className="w-px bg-gray-300 dark:bg-slate-600"></div>
                <button 
                    onClick={handleNext}
                    disabled={currentSectionIndex >= SECTIONS.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                    Siguiente <ArrowRight size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};
