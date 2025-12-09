
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Accordion, TimelineItem, Quiz, MinistryLogo } from '../components/UI';
import { BookOpen, Clock, Activity, Shield, RefreshCw, CheckCircle, Info, Grid, ArrowLeft, ArrowRight, ChevronDown, Layout, Target, FileText, Layers, BarChart2, Lock, X, Lightbulb, Users, Zap, Scale, Leaf, Database, FileCheck, HardHat, Eye, UserCheck, Briefcase } from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'intro', label: '¿Qué es MIPG?', icon: BookOpen, desc: 'Definición, principios y alcance.' },
  { id: 'timeline', label: 'Línea de Tiempo', icon: Clock, desc: 'Evolución normativa en el Ministerio.' },
  { id: 'dimensions', label: '7 Dimensiones', icon: Layout, desc: 'Políticas de Gestión y Desempeño.' },
  { id: 'subsystems', label: 'Subsistemas SIG', icon: Layers, desc: 'Calidad, Ambiental, SST, etc.' },
  { id: 'defenses', label: 'Líneas de Defensa', icon: Shield, desc: 'Roles y responsabilidades de control.' },
  { id: 'operation', label: 'Ciclo Operativo', icon: RefreshCw, desc: 'La mejora continua (PHVA).' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Prueba rápida de conocimiento.' }
];

// --- DATA: PRINCIPIOS MIPG ---
const MIPG_PRINCIPLES = [
    {
        title: "Orientación a resultados",
        icon: Target,
        short: "Toma como eje de la gestión pública las necesidades de los ciudadanos.",
        desc: "Toma como eje de toda la gestión pública, las necesidades de los ciudadanos asociadas al propósito fundamental de la entidad, así como los resultados necesarios para su satisfacción.",
        application: [
            { area: "Direccionamiento Estratégico y Planeación", items: ["Caracterización de Usuarios", "Análisis de Contexto", "Planeación Estratégica", "Análisis de Capacidad Institucional", "Programación Presupuestal"] }
        ]
    },
    {
        title: "Articulación interinstitucional",
        icon: Users,
        short: "Coordinación y operación entre entidades públicas.",
        desc: "Adelantar acciones de coordinación, cooperación y articulación con otras organizaciones del sector público o privado, del orden territorial, nacional o internacional, con el fin de formular e implementar estrategias para resolver las necesidades de los ciudadanos asociadas al propósito fundamental de la entidad.",
        application: [
            { area: "Direccionamiento Estratégico y Planeación", items: ["Análisis de Capacidad Institucional"] },
            { area: "Gestión para el Resultado", items: ["Desarrollo de Alianzas"] }
        ]
    },
    {
        title: "Excelencia y calidad",
        icon: Zap,
        short: "Bienes y servicios públicos que satisfacen las necesidades de los ciudadanos.",
        desc: "Lograr que a lo largo del tiempo, los atributos de los servicios o productos públicos, brindados a los ciudadanos, sean los mejores para satisfacer sus necesidades.",
        application: [
            { area: "Direccionamiento Estratégico y Planeación", items: ["Necesidades y expectativas de los usuarios (Caracterización)", "Servicio al Ciudadano", "Ley de Transparencia y Acceso a la Información", "Racionalización de Trámites", "Rendición de Cuentas y Participación"] },
            { area: "Gestión para el Resultado", items: ["Modelo de operación por procesos"] }
        ]
    },
    {
        title: "Aprendizaje e innovación",
        icon: Lightbulb,
        short: "Mejora permanente, aprovechando los conocimientos y la innovación.",
        desc: "Mejora permanente, incorporando la innovación, aprovechando la creatividad de sus grupos internos y, en lo posible, de los grupos de interés de la entidad.",
        application: [
            { area: "Gestión del Conocimiento y la Innovación", items: [] },
            { area: "Evaluación de Resultados", items: [] },
            { area: "Control Interno", items: [] }
        ]
    },
    {
        title: "Integridad, transparencia y confianza",
        icon: Scale,
        short: "Como principal criterio de actuación de los servidores públicos.",
        desc: "Criterios de actuación de los servidores públicos y el deber hacia los ciudadanos.",
        application: [
            { area: "Direccionamiento Estratégico y Planeación", items: [] },
            { area: "Gestión del Talento Humano", items: ["Código de Integridad"] },
            { area: "Gestión para el Resultado", items: ["Participación ciudadana en la gestión pública", "Gestión Ambiental"] },
            { area: "Información y Comunicación", items: [] }
        ]
    },
    {
        title: "Toma de decisiones basada en evidencia",
        icon: BarChart2,
        short: "Captura, análisis y uso de información para la toma de decisiones.",
        desc: "Capturar, analizar y usar información para la toma de decisiones que afectan la consecución de los resultados de la entidad.",
        application: [
            { area: "Gestión del Conocimiento y la Innovación", items: [] },
            { area: "Evaluación de Resultados", items: [] },
            { area: "Control Interno", items: [] }
        ]
    }
];

// --- DATA: SUBSISTEMAS (Res 1022) ---
const SUBSYSTEMS_DATA = [
    {
        acronym: "SGC",
        name: "Gestión de Calidad",
        leader: "Oficina Asesora de Planeación",
        icon: FileCheck,
        desc: "Promueve la mejora continua, la satisfacción del ciudadano y el cumplimiento de requisitos legales (ISO 9001).",
        responsibilities: [
            "Promover la implementación y sostenibilidad del modelo de operación por procesos.",
            "Orientar el diseño y actualización de la documentación de procesos.",
            "Administrar el repositorio de acciones de mejora.",
            "Liderar la gestión de riesgos para maximizar objetivos estratégicos.",
            "Definir metodología para monitorear cumplimiento de requisitos."
        ]
    },
    {
        acronym: "SCI",
        name: "Control Interno",
        leader: "Oficina Asesora de Planeación",
        icon: Shield,
        desc: "Configura el esquema de controles (MECI) para la autoevaluación y gestión de riesgos (2da Línea de Defensa).",
        responsibilities: [
            "Diseñar mecanismos de autoevaluación y control organizacional (MECI).",
            "Articular el Sistema de Control Interno con las demás dimensiones MIPG.",
            "Promover la cultura del autocontrol en la entidad.",
            "Supervisar la gestión de alertas y desviaciones de procesos.",
            "Apoyar la formulación de planes de mejoramiento institucional."
        ]
    },
    {
        acronym: "SGA",
        name: "Gestión Ambiental",
        leader: "Sub. Administrativa y Financiera",
        icon: Leaf,
        desc: "Minimiza los impactos ambientales de la operación y promueve el uso eficiente de recursos (ISO 14001).",
        responsibilities: [
            "Identificar y evaluar aspectos e impactos ambientales en sedes.",
            "Controlar contaminación, uso de agua, energía y residuos.",
            "Realizar simulacros de emergencias ambientales.",
            "Promover buenas prácticas ambientales y toma de conciencia.",
            "Asegurar cumplimiento de obligaciones y permisos ambientales."
        ]
    },
    {
        acronym: "SGSI",
        name: "Seguridad de la Información",
        leader: "Oficina de Tecnologías (TIC)",
        icon: Lock,
        desc: "Garantiza la confidencialidad, integridad y disponibilidad de la información (ISO 27001).",
        responsibilities: [
            "Alinear el SGSI con estrategias de Gobierno Digital.",
            "Implementar controles de seguridad y privacidad de la información.",
            "Gestionar activos de información y riesgos tecnológicos.",
            "Supervisar la gestión de incidentes de seguridad.",
            "Garantizar la continuidad de la operación tecnológica."
        ]
    },
    {
        acronym: "SIGA",
        name: "Gestión Documental y Archivo",
        leader: "Sub. Administrativa y Financiera",
        icon: Database,
        desc: "Asegura la organización, preservación y acceso a la memoria institucional.",
        responsibilities: [
            "Diseñar políticas de administración y disposición final de documentos.",
            "Supervisar Tablas de Retención (TRD) y Cuadros de Clasificación (CCD).",
            "Promover digitalización y herramientas tecnológicas de archivo.",
            "Realizar auditorías internas al sistema documental.",
            "Capacitar en buenas prácticas de gestión documental."
        ]
    },
    {
        acronym: "SST",
        name: "Seguridad y Salud en el Trabajo",
        leader: "Sub. Talento Humano",
        icon: HardHat,
        desc: "Previene lesiones y enfermedades laborales, promoviendo el bienestar (ISO 45001).",
        responsibilities: [
            "Ejecutar Planes de Trabajo Anual del SG-SST.",
            "Generar estrategias de prevención de accidentalidad.",
            "Realizar simulacros y gestión de peligros.",
            "Apoyar funcionamiento del COPASST.",
            "Gestionar investigación de incidentes y accidentes laborales."
        ]
    }
];

// --- DATA: LINEAS DE DEFENSA (Manual GE_A-MN-003) ---
const DEFENSE_LINES_DATA = [
    {
        id: "E",
        name: "Línea Estratégica",
        actors: "Alta Dirección y Comité Institucional (CICCI)",
        icon: Users,
        color: "bg-slate-800 text-white",
        desc: "Define el marco general para la gestión del riesgo y el control.",
        roles: [
            "Definir el marco general de operación.",
            "Supervisar el cumplimiento de planes y objetivos.",
            "Analizar riesgos estratégicos que afectan la misión.",
            "Aprobar el Esquema de Líneas de Defensa y el Mapa de Aseguramiento."
        ]
    },
    {
        id: "1",
        name: "1ª Línea de Defensa",
        concept: "Autocontrol",
        actors: "Gerentes Públicos, Líderes de Proceso y Equipos",
        icon: UserCheck,
        color: "bg-blue-600 text-white",
        desc: "Responsables de la gestión operacional día a día. 'Yo ejecuto, yo controlo'.",
        roles: [
            "Identificar, monitorear y gestionar riesgos propios de su labor.",
            "Diseñar e implementar controles operativos.",
            "Garantizar que las actividades diarias cumplan con los procedimientos.",
            "Reportar desviaciones y aplicar acciones correctivas inmediatas."
        ]
    },
    {
        id: "2",
        name: "2ª Línea de Defensa",
        concept: "Autoevaluación",
        actors: "Oficina de Planeación, Líderes SIG y Supervisores",
        icon: Eye,
        color: "bg-indigo-600 text-white",
        desc: "Monitorean temas transversales y generan alertas de aseguramiento.",
        roles: [
            "Efectuar seguimiento a temas transversales (ej. Riesgos, Calidad, SST).",
            "Generar alertas a la 1ra Línea y a la Línea Estratégica.",
            "Consolidar información para la toma de decisiones.",
            "Facilitar la construcción del Mapa de Aseguramiento."
        ]
    },
    {
        id: "3",
        name: "3ª Línea de Defensa",
        concept: "Evaluación Independiente",
        actors: "Oficina de Control Interno (OCI)",
        icon: Shield,
        color: "bg-brand-600 text-white",
        desc: "Aseguramiento objetivo e independiente sobre la efectividad del sistema.",
        roles: [
            "Evaluar la efectividad de los controles de 1ra y 2da línea.",
            "Liderar la construcción del Mapa de Aseguramiento.",
            "Realizar auditorías basadas en riesgos.",
            "Medir el nivel de confianza de los servicios de aseguramiento de la 2da línea."
        ]
    }
];

interface MIPGModuleProps {
    onComplete: (score: number) => void;
    onTimeUpdate: (seconds: number) => void;
    saveProgress: () => void;
    data: QuizState;
}

export const MIPGModule: React.FC<MIPGModuleProps> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState<'menu' | string>('menu');
  const [selectedPrinciple, setSelectedPrinciple] = useState<any>(null);
  const [selectedSubsystem, setSelectedSubsystem] = useState<any>(null);
  const [selectedDefense, setSelectedDefense] = useState<any>(null);
  
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
                <div className="animate-fade-in space-y-8">
                    {/* Definition Section */}
                    <div className="grid md:grid-cols-2 gap-6">
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

                    {/* Principles Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 pl-2 border-l-4 border-brand-500">
                            Principios del Modelo
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm">
                            El MIPG se fundamenta en principios que guían la actuación de los servidores públicos. Haz clic en cada uno para conocer su aplicación práctica.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MIPG_PRINCIPLES.map((p, i) => {
                                const Icon = p.icon;
                                return (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedPrinciple(p)}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-lg transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">{p.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                            {p.short}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Principle Detail Modal */}
                    {selectedPrinciple && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedPrinciple(null)}>
                            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors" onClick={() => setSelectedPrinciple(null)}>
                                    <X size={24} />
                                </button>
                                
                                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                                    <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                                        <selectedPrinciple.icon size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Principio MIPG</span>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">{selectedPrinciple.title}</h3>
                                    </div>
                                </div>
                                
                                <div className="overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-xl mb-6">
                                        <p className="text-sm font-medium text-brand-900 dark:text-brand-100 leading-relaxed">
                                            {selectedPrinciple.desc}
                                        </p>
                                    </div>

                                    <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                        <Activity size={16} className="text-brand-500" />
                                        Cómo se aplica
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        {selectedPrinciple.application.map((app: any, idx: number) => (
                                            <div key={idx} className="border border-gray-100 dark:border-slate-700 rounded-lg p-4 bg-gray-50/50 dark:bg-slate-700/30">
                                                <h5 className="font-bold text-slate-700 dark:text-slate-200 text-sm mb-2">{app.area}</h5>
                                                {app.items.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {app.items.map((item: string, i: number) => (
                                                            <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2 items-start">
                                                                <span className="block w-1.5 h-1.5 rounded-full bg-brand-400 mt-1 shrink-0"></span>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">Aplica transversalmente a esta dimensión.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => setSelectedPrinciple(null)}
                                        className="px-6 py-2 bg-slate-900 dark:bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-brand-500 transition-colors shadow-lg"
                                    >
                                        Entendido
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                    <Card title="Subsistemas del SIG-MIPG (Res. 1022/2024)">
                        <p className="text-sm text-slate-500 mb-6">El SIG del Ministerio se compone de 6 subsistemas clave. Haz clic en cada uno para ver las responsabilidades específicas de su líder (Art. 15).</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {SUBSYSTEMS_DATA.map((sub, i) => {
                                const Icon = sub.icon;
                                return (
                                    <button 
                                        key={i} 
                                        onClick={() => setSelectedSubsystem(sub)}
                                        className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-lg transition-all text-left group flex flex-col h-full"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Icon size={20} />
                                            </div>
                                            <Badge type="brand">{sub.acronym}</Badge>
                                        </div>
                                        <h3 className="font-bold text-slate-800 dark:text-white mb-2">{sub.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                                            {sub.desc}
                                        </p>
                                        <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                                            <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Liderado por:</p>
                                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{sub.leader}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Subsystem Detail Modal */}
                    {selectedSubsystem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedSubsystem(null)}>
                            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors" onClick={() => setSelectedSubsystem(null)}>
                                    <X size={24} />
                                </button>
                                
                                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100 dark:border-slate-700">
                                    <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                                        <selectedSubsystem.icon size={24} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Subsistema SIG</span>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                            {selectedSubsystem.name} ({selectedSubsystem.acronym})
                                        </h3>
                                    </div>
                                </div>
                                
                                <div className="overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-xl mb-6 border border-gray-100 dark:border-slate-600">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide">Dependencia Líder</span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            {selectedSubsystem.leader}
                                        </p>
                                    </div>

                                    <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                        <FileText size={16} className="text-brand-500" />
                                        Responsabilidades Específicas (Art. 15)
                                    </h4>
                                    
                                    <ul className="space-y-3">
                                        {selectedSubsystem.responsibilities.map((item: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 p-3 rounded-lg border border-gray-100 dark:border-slate-700 shadow-sm">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0"></div>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => setSelectedSubsystem(null)}
                                        className="px-6 py-2 bg-slate-900 dark:bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-brand-500 transition-colors shadow-lg"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'defenses' && (
                <div className="animate-fade-in">
                    <Card title="Esquema de Líneas de Defensa (Manual GE_A-MN-003)">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                            El Ministerio distribuye la responsabilidad del control en una estructura de 4 roles clave. Haz clic en cada línea para ver sus actores y funciones.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {DEFENSE_LINES_DATA.map((line, i) => {
                                const Icon = line.icon;
                                return (
                                    <button 
                                        key={i}
                                        onClick={() => setSelectedDefense(line)}
                                        className="bg-white dark:bg-slate-800 p-0 rounded-2xl border border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-lg transition-all text-left group overflow-hidden flex flex-col h-full"
                                    >
                                        <div className={`p-4 flex items-center justify-between ${line.color}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="bg-white/20 p-2 rounded-lg">
                                                    <Icon size={20} className="text-white" />
                                                </div>
                                                <h3 className="font-bold text-white text-lg">{line.name}</h3>
                                            </div>
                                            {line.concept && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-1 rounded">
                                                    {line.concept}
                                                </span>
                                            )}
                                        </div>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <p className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wide mb-2">
                                                Responsables:
                                            </p>
                                            <p className="text-sm text-slate-800 dark:text-white font-semibold mb-4">
                                                {line.actors}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-auto">
                                                {line.desc}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Mapa de Aseguramiento Callout */}
                        <div className="mt-8 bg-gradient-to-r from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6">
                            <div className="p-4 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-full shrink-0">
                                <FileCheck size={32} />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Herramienta Clave: Mapa de Aseguramiento</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                    Es la herramienta que permite coordinar las actividades de aseguramiento entre la <b>2ª Línea (Autoevaluación)</b> y la <b>3ª Línea (Evaluación Independiente)</b>. Permite a la Alta Dirección visualizar la cobertura de riesgos y optimizar los recursos de auditoría.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Defense Line Modal */}
                    {selectedDefense && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedDefense(null)}>
                            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-2xl max-w-2xl w-full relative shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors" onClick={() => setSelectedDefense(null)}>
                                    <X size={24} />
                                </button>
                                
                                <div className={`flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-slate-700`}>
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${selectedDefense.color} shadow-lg`}>
                                        <selectedDefense.icon size={28} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Rol de Defensa</span>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                                            {selectedDefense.name}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDefense.concept || 'Responsabilidad General'}</p>
                                    </div>
                                </div>
                                
                                <div className="overflow-y-auto pr-2 custom-scrollbar">
                                    <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl mb-6 border-l-4 border-brand-500">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Actores Principales</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                                            {selectedDefense.actors}
                                        </p>
                                    </div>

                                    <h4 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                                        <Activity size={16} className="text-brand-500" />
                                        Funciones y Responsabilidades
                                    </h4>
                                    
                                    <ul className="space-y-3">
                                        {selectedDefense.roles.map((item: string, i: number) => (
                                            <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-slate-300 bg-gray-50/50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 shrink-0"></div>
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => setSelectedDefense(null)}
                                        className="px-6 py-2 bg-slate-900 dark:bg-brand-600 text-white text-sm font-bold rounded-xl hover:bg-slate-700 dark:hover:bg-brand-500 transition-colors shadow-lg"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'operation' && (
                <div className="animate-fade-in space-y-6">
                    <Card title="Ciclo Operativo MIPG (PHVA)">
                        <p className="text-slate-600 dark:text-slate-300 mb-6">
                            El MIPG opera bajo una lógica dinámica de <b>Planear, Hacer, Verificar y Actuar</b>. No es solo un reporte (FURAG), es la forma diaria de gestionar la entidad para generar resultados.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                             {/* PHVA Cards */}
                             <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={60} /></div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">P</span>
                                    <h3 className="font-bold text-blue-900 dark:text-blue-100">1. Planear</h3>
                                </div>
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Diagnóstico de necesidades, identificación de riesgos y programación de recursos (PAI, Presupuesto).
                                </p>
                             </div>
                             
                             <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={60} /></div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">H</span>
                                    <h3 className="font-bold text-indigo-900 dark:text-indigo-100">2. Hacer</h3>
                                </div>
                                <p className="text-sm text-indigo-800 dark:text-indigo-200">
                                    Implementación de las políticas de gestión. Ejecución de los procesos misionales y de apoyo.
                                </p>
                             </div>

                             <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><BarChart2 size={60} /></div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-sm">V</span>
                                    <h3 className="font-bold text-purple-900 dark:text-purple-100">3. Verificar</h3>
                                </div>
                                <p className="text-sm text-purple-800 dark:text-purple-200">
                                    Seguimiento y evaluación. Aquí se utilizan herramientas como el <b>FURAG</b>, auditorías internas e indicadores.
                                </p>
                             </div>

                             <div className="p-5 rounded-2xl bg-brand-50 dark:bg-brand-900/20 border border-brand-100 dark:border-brand-800 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><RefreshCw size={60} /></div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-600 text-white font-bold text-sm">A</span>
                                    <h3 className="font-bold text-brand-900 dark:text-brand-100">4. Actuar</h3>
                                </div>
                                <p className="text-sm text-brand-800 dark:text-brand-200">
                                    Acciones de mejora continua. Ajustes basados en la evaluación para cerrar brechas y optimizar el desempeño.
                                </p>
                             </div>
                        </div>
                    </Card>

                    <Card title="Modelo de Operación por Procesos">
                         <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                                    Según el <b>Artículo 3 de la Resolución 1022 de 2024</b>, el Ministerio materializa este ciclo a través de 4 macroprocesos:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600">
                                        <Target className="text-blue-500" size={20} />
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">1. Procesos Estratégicos</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600">
                                        <Users className="text-brand-500" size={20} />
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">2. Procesos Misionales</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600">
                                        <Briefcase className="text-slate-500" size={20} />
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">3. Procesos de Apoyo</span>
                                    </li>
                                    <li className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-700/50 border border-gray-100 dark:border-slate-600">
                                        <Shield className="text-amber-500" size={20} />
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">4. Procesos de Evaluación y Control</span>
                                    </li>
                                </ul>
                            </div>
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
