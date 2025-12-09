
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, MinistryLogo } from '../components/UI';
import { Target, Map, Layout, Scale, Users, FileText, ChevronRight, Search, X, ChevronDown, CheckCircle, Info, BookOpen, ArrowRight, Grid, ArrowLeft, Menu, Clock, Lock } from 'lucide-react';
import { QuizState } from '../types';

// --- DATA: Programas y Proyectos ---
const PROGRAMAS_DATA = [
    {id:'agua-vida', nombre:'Agua es Vida', viceministerio:'Pobreza', dependencia:'Acceso Igualitario al Agua', poblacion:'Territorios marginados con baja cobertura de agua', estrategia:'Infraestructura para cerrar brechas', breve:'Acceso igualitario y digno al agua potable mediante soluciones pertinentes territorialmente.', tags:'agua,territorio,inclusion,servicios'}, 
    {id:'hambre-cero', nombre:'Hambre Cero', viceministerio:'Pobreza', dependencia:'Superación de la Pobreza', poblacion:'Hogares en pobreza y extrema pobreza', estrategia:'Condiciones para vida digna', breve:'Asegurar alimentación adecuada y soberanía alimentaria con enfoque territorial.', tags:'alimentacion,pobreza,seguridad-alimentaria'}, 
    {id:'personas-mayores', nombre:'Bienestar para Personas Mayores', viceministerio:'Pobreza', dependencia:'Personas Mayores', poblacion:'Personas mayores en exclusión', estrategia:'Abordaje psicosocial y bienestar', breve:'Cuidados, protección social y participación para un envejecimiento digno.', tags:'personas-mayores,cuidado,proteccion'}, 
    {id:'habitantes-calle', nombre:'Construyendo Dignidad', viceministerio:'Pobreza', dependencia:'Personas en Situación de Calle', poblacion:'Habitantes de calle', estrategia:'Acompañamiento para restablecimiento de derechos', breve:'Abordaje integral y territorial con rutas de restablecimiento de derechos.', tags:'calle,restablecimiento,proteccion'}, 
    {id:'cuidado', nombre:'Sistema de Cuidado en Territorios', viceministerio:'Pobreza', dependencia:'Cuidado', poblacion:'Personas cuidadoras y receptoras de cuidado', estrategia:'Ecosistema institucional del Sector Igualdad', breve:'Implementación territorial del cuidado como derecho y trabajo reconocido.', tags:'cuidado,corresponsabilidad,servicios'}, 
    {id:'migracion', nombre:'Raíces en Movimiento', viceministerio:'Pobreza', dependencia:'Población Migrante', poblacion:'Población migrante, refugiada y retornada', estrategia:'Condiciones para vida digna', breve:'Respuesta humanitaria, integración socioeconómica y cohesión social para población migrante.', tags:'migracion,humanitaria,integracion'}, 
    {id:'casas-dignidad', nombre:'Casas de la Dignidad', viceministerio:'Mujeres', dependencia:'Prevención y Atención de las Violencias', poblacion:'Mujeres víctimas de violencias', estrategia:'Acompañamiento para restablecimiento de derechos', breve:'Espacios seguros de acogida, atención y empoderamiento para mujeres y sus familias.', tags:'violencia-genero,proteccion,refugio'}, 
    {id:'autonomia-eco', nombre:'Mujeres por la Autonomía Económica', viceministerio:'Mujeres', dependencia:'Autonomía Económica', poblacion:'Mujeres en condiciones de vulnerabilidad económica', estrategia:'Iniciativas productivas', breve:'Fomento de emprendimientos y acceso a mercados para la independencia económica de las mujeres.', tags:'emprendimiento,economia,empoderamiento'}, 
    {id:'derechos-sexuales', nombre:'Mis Derechos, Mi Decisión', viceministerio:'Mujeres', dependencia:'Garantía de Derechos', poblacion:'Mujeres, adolescentes y niñas', estrategia:'Cambio cultural', breve:'Promoción y garantía de los derechos sexuales y reproductivos en todo el territorio nacional.', tags:'derechos-reproductivos,salud,pedagogia'}, 
    {id:'masp', nombre:'Reconocimiento y Dignidad (MASP)', viceministerio:'Mujeres', dependencia:'Mujeres en Actividades Sexuales Pagas', poblacion:'Mujeres en actividades sexuales pagas', estrategia:'Condiciones para vida digna', breve:'Garantía de derechos, reducción de estigmas y alternativas de vida digna.', tags:'masp,derechos-humanos,inclusion-social'}, 
    {id:'madres-cabeza', nombre:'Madres que Lideran', viceministerio:'Mujeres', dependencia:'Madres Cabeza de Familia', poblacion:'Madres cabeza de familia', estrategia:'Alianzas público-populares y comunitarias', breve:'Apoyo integral para el bienestar, autonomía y liderazgo de las madres cabeza de familia.', tags:'maternidad,liderazgo,cuidado'}, 
    {id:'jovenes-paz', nombre:'Jóvenes en Paz', viceministerio:'Juventud', dependencia:'Jóvenes en Paz', poblacion:'Jóvenes en riesgo de violencia y exclusión', estrategia:'Acompañamiento para restablecimiento de derechos', breve:'Alternativas de vida y construcción de paz a través de educación, cultura y empleo.', tags:'paz,juventud,oportunidades'}, 
    {id:'barrismo-social', nombre:'Fútbol y Convivencia', viceministerio:'Juventud', dependencia:'Barrismo Social', poblacion:'Jóvenes barristas', estrategia:'Espacios de juntanza', breve:'Transformación de las barras de fútbol en actores de convivencia y paz territorial.', tags:'barrismo,convivencia,deporte'}, 
    {id:'oportunidades-joven', nombre:'Sacúdete por tus Derechos', viceministerio:'Juventud', dependencia:'Goce Efectivo de Derechos y Oportunidades', poblacion:'Jóvenes de 14 a 28 años', estrategia:'Iniciativas productivas', breve:'Plataforma de oportunidades en educación, empleo, emprendimiento y participación juvenil.', tags:'educacion,empleo,participacion'}, 
    {id:'lgbtiq', nombre:'Orgullo Diverso', viceministerio:'Diversidades', dependencia:'Derechos de la Población LGBTIQ+', poblacion:'Población LGBTIQ+', estrategia:'Cambio cultural', breve:'Garantía de derechos, lucha contra la discriminación y visibilización de la diversidad sexual y de género.', tags:'lgbtiq,inclusion,derechos'}, 
    {id:'discapacidad', nombre:'Colombia sin Barreras', viceministerio:'Diversidades', dependencia:'Derechos de Personas con Discapacidad', poblacion:'Personas con discapacidad', estrategia:'Infraestructura para cerrar brechas', breve:'Inclusión social, laboral y educativa a través de la eliminación de barreras físicas y sociales.', tags:'discapacidad,accesibilidad,inclusion'}, 
    {id:'narp', nombre:'Herencia Viva (NARP)', viceministerio:'Étnicos', dependencia:'NARP', poblacion:'Comunidades Negras, Afrocolombianas, Raizales y Palenqueras', estrategia:'Reconocimiento y transmisión de saberes', breve:'Fortalecimiento de la identidad cultural, protección de territorios y lucha contra el racismo.', tags:'etnico,antirracismo,territorio,saberes'}, 
    {id:'indigenas', nombre:'Saberes Ancestrales', viceministerio:'Étnicos', dependencia:'Pueblos Indígenas', poblacion:'Pueblos Indígenas', estrategia:'Reconocimiento y transmisión de saberes', breve:'Protección de la autonomía, la cultura y los derechos territoriales de los pueblos indígenas.', tags:'indigenas,saberes,autonomia'}, 
    {id:'rrom', nombre:'Kumpania en Movimiento', viceministerio:'Étnicos', dependencia:'Pueblo Rrom', poblacion:'Pueblo Rrom (Gitanos)', estrategia:'Reconocimiento y transmisión de saberes', breve:'Preservación de la identidad cultural, nomadismo y garantía de derechos del pueblo Rrom.', tags:'rrom,cultura,derechos,saberes'}, 
    {id:'campesinado', nombre:'Tierra y Territorio Campesino', viceministerio:'Étnicos', dependencia:'Campesinado', poblacion:'Población campesina', estrategia:'Condiciones para vida digna', breve:'Reconocimiento del campesinado como sujeto de derechos, acceso a tierra y producción sostenible.', tags:'campesinado,tierra,soberania-alimentaria'}, 
    {id:'justicia-racial', nombre:'Justicia Étnica y Racial', viceministerio:'Étnicos', dependencia:'NARP', poblacion:'Pueblos y comunidades étnicas', estrategia:'Cambio cultural', breve:'Acciones afirmativas y de reparación histórica para combatir el racismo estructural.', tags:'antirracismo,reparacion,justicia'}, 
    {id:'pactos-territoriales', nombre:'Pactos Territoriales por la Igualdad', viceministerio:'Pobreza', dependencia:'Superación de la Pobreza', poblacion:'Territorios PDET y ZOMAC', estrategia:'Alianzas público-populares y comunitarias', breve:'Articulación de inversiones y acciones para cerrar brechas de desigualdad en territorios excluidos.', tags:'territorio,paz,inversion'}, 
    {id:'datos-igualdad', nombre:'Observatorio de la Igualdad', viceministerio:'Pobreza', dependencia:'Superación de la Pobreza', poblacion:'Academia, sociedad civil, entidades', estrategia:'Gobernanza interna', breve:'Generación y análisis de datos para orientar políticas públicas de igualdad y equidad.', tags:'datos,investigacion,politica-publica'}, 
    {id:'cultura-paz', nombre:'Cultura para la Paz y la No Estigmatización', viceministerio:'Juventud', dependencia:'Jóvenes en Paz', poblacion:'Toda la población colombiana', estrategia:'Cambio cultural', breve:'Estrategias de comunicación y pedagogía para transformar imaginarios que perpetúan la desigualdad.', tags:'cultura,paz,pedagogia'}
];

// --- DATA: Organigrama ---
const ORG_DATA: any = {
      'entidades': { title: 'Entidades Adscritas y Vinculadas', description: 'Organismos que, aunque tienen autonomía, están vinculados al sector para coordinar políticas. El Ministerio ejerce como ente rector.', dependencies: ['Instituto Colombiano de Bienestar Familiar (ICBF)', 'Instituto Nacional para Sordos (INSOR)', 'Instituto Nacional para Ciegos (INCI)'] },
      'territoriales': { title: 'Direcciones Territoriales', description: 'Funciones (Art. 17, D.1075): Apoyar la articulación y coordinación territorial, implementar estrategias para poblaciones marginadas y participar en la planeación y ejecución de políticas a nivel local.', dependencies: ['32 Direcciones Territoriales (una por departamento)'] },
      'secretaria': { title: 'Secretaría General', description: 'Funciones (Art. 43, D.1075): Asistir a la Ministra en la administración del Ministerio, coordinar la gestión de recursos físicos, financieros y de talento humano, y liderar la implementación de políticas y procesos administrativos.', dependencies: ['Subdirección Administrativa y Financiera', 'Subdirección de Contratación', 'Subdirección de Talento Humano'] },
      'despacho': { title: 'Despacho de la Ministra', description: 'Funciones (Art. 6, D.1075): Formular y dirigir las políticas del sector, coordinar la planeación estratégica, ejercer la representación legal y asegurar el cumplimiento de las funciones y competencias del Ministerio.', dependencies: ['Viceministerios', 'Secretaría General', 'Oficinas Asesoras', 'Direcciones Territoriales'] },
      'asesoras': { title: 'Oficinas Asesoras', description: 'Funciones (Arts. 7 al 16, D.1075): Apoyan la gestión estratégica en áreas clave como planeación, jurídica, comunicaciones, TICs, control interno y cooperación, asegurando la coherencia y legalidad de las acciones del Ministerio.', dependencies: ['Oficina de Saberes y Conocimientos', 'Oficina de Proyectos', 'Oficina de TICs', 'Oficina de Comunicaciones', 'Oficina de Control Interno', 'Oficina de Control Disciplinario', 'Oficina de Planeación', 'Oficina Jurídica', 'Oficina de Alianzas Estratégicas', 'Oficina de Relacionamiento con la Ciudadanía'] },
      'vm-mujeres': { title: 'Viceministerio de las Mujeres', description: 'Funciones (Art. 18, D.1075): Liderar la política pública para la promoción de los derechos de las mujeres en su diversidad, coordinar el Sistema Nacional de Mujeres y articular acciones para prevenir y atender las violencias de género.', dependencies: ['Dirección para la Prevención de Violencias', 'Dirección para la Autonomía Económica', 'Dirección para Garantía de Derechos', 'Dirección para Mujeres en Actividades Sexuales Pagas', 'Dirección para Madres Cabeza de Familia'] },
      'vm-juventud': { title: 'Viceministerio de las Juventudes', description: 'Funciones (Art. 24, D.1075): Liderar la política pública para promover los derechos de la juventud, articular el programa "Jóvenes en Paz" y fomentar oportunidades para el desarrollo integral de los y las jóvenes del país.', dependencies: ['Dirección para el Goce Efectivo de los Derechos', 'Dirección de Barrismo Social', 'Dirección de Jóvenes en Paz'] },
      'vm-poblaciones': { title: 'Viceministerio para Poblaciones y Territorios Excluidos', description: 'Funciones (Art. 28, D.1075): Liderar políticas para la superación de la pobreza y la exclusión de poblaciones vulnerables (migrantes, personas mayores, habitantes de calle) y dirigir el Sistema Nacional de Cuidado.', dependencies: ['Dirección para la Superación de la Pobreza', 'Dirección de Cuidado', 'Dirección para la Población Migrante', 'Dirección de Acceso Igualitario al Agua', 'Dirección para Personas en Situación de Calle', 'Dirección para Personas Mayores'] },
      'vm-diversidades': { title: 'Viceministerio de las Diversidades', description: 'Funciones (Art. 35, D.1075): Liderar la política para la promoción de los derechos de las personas con discapacidad y la población LGBTIQ+, y coordinar acciones para prevenir y erradicar la discriminación.', dependencies: ['Dirección para la Garantía de Derechos de la Población LGBTIQ+', 'Dirección para la Garantía de Derechos de las Personas con Discapacidad'] },
      'vm-etnicos': { title: 'Viceministerio de Pueblos Étnicos y Campesinos', description: 'Funciones (Art. 38, D.1075): Liderar la política para la promoción de los derechos de los pueblos y comunidades negras, afrodescendientes, raizales, palenqueras, indígenas, Rrom y campesinos.', dependencies: ['Dirección para Comunidades Negras, Afro, Raizales y Palenqueras', 'Dirección para Pueblos Indígenas', 'Dirección para el Pueblo Rrom', 'Dirección para el Campesinado'] }
};

// --- DATA: Timeline ---
const TIMELINE_DATA = [
    { id: 1, title: 'Ley 2281: Creación', year: 'Ene 2023', content: 'La ley crea el Ministerio de Igualdad y Equidad, define su objeto y competencias; es la base legal que luego desarrolla el Gobierno. (Referencia dentro del Decreto 1075, que explicita que actúa “en virtud de las facultades del artículo 189” y la Ley 2294/2023 del PND).' },
    { id: 2, title: 'Ley 2294: PND 2022-26', year: 'May 2023', content: 'El Plan Nacional de Desarrollo “Colombia potencia mundial de la vida” incorpora compromisos y macrometas sectoriales (Jóvenes en Paz, Mujeres autónomas, Una sociedad para el cuidado) que condicionan la planeación sectorial del Ministerio.' },
    { id: 3, title: 'Decreto 1075: Estructura', year: 'Jun 2023', content: 'Define despachos, 5 viceministerios y 20 direcciones, oficinas y Secretaría General, y asigna funciones. El mismo decreto indica la sujeción al PND 2294/2023.' },
    { id: 4, title: 'Decreto 1076: Planta (P1)', year: 'Jun 2023', content: 'Establece los componentes iniciales de la planta de personal del Ministerio. Es uno de los dos decretos de planta expedidos en 2023. (Mencionado en los considerandos de la Resolución 22 de 2023).' },
    { id: 5, title: 'Resolución 003: Manual v1', year: 'Ago 2023', content: 'Adopta la primera versión del Manual Específico de Funciones y Competencias Laborales del Ministerio, sirviendo como antecedente para futuras actualizaciones.' },
    { id: 6, title: 'Resolución 668: Enfoques', year: 'Sep 2024', content: 'Institucionaliza los 8 enfoques (derechos, territorial, diferencial, étnico-racial/antirracista, género, interseccional, justicia ambiental y curso de vida) como el eje articulador de toda la política pública del sector.' },
    { id: 7, title: 'Resolución 669: Estrategias', year: 'Sep 2024', content: 'Establece las 11 estrategias programáticas para materializar los objetivos del Ministerio y medir su impacto (alianzas público-populares, iniciativas productivas, etc.).' },
    { id: 8, title: 'PEI v2: Aprobación', year: 'Oct 2024', content: 'Formaliza la plataforma estratégica (misión, visión, objetivos) y el despliegue estratégico con dos objetivos estratégicos y uno operacional, alineados al PND y a los ODS.' }
];

interface StrategicModuleProps {
    onComplete: (score: number) => void;
    onTimeUpdate: (seconds: number) => void;
    saveProgress: () => void;
    data: QuizState;
}

export const StrategicModule: React.FC<StrategicModuleProps> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState<'menu' | string>('menu');
  
  // Specific view states
  const [enfoqueSubTab, setEnfoqueSubTab] = useState('enfoques');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todo');
  const [selectedOrgNode, setSelectedOrgNode] = useState<string | null>(null);
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<any>(null);

  // Time tracking logic
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Start/Stop Timer based on visibility/mounting
  useEffect(() => {
      // Function to push time update
      const pushTime = () => {
          const now = Date.now();
          const diffSeconds = Math.floor((now - startTimeRef.current) / 1000);
          if (diffSeconds > 0) {
              onTimeUpdate(diffSeconds);
              startTimeRef.current = now; // Reset start marker
          }
      };

      // Interval to update UI every second (optional, could update only every 10s)
      timerRef.current = window.setInterval(pushTime, 2000); // Update every 2 seconds

      // Cleanup on unmount or tab switch
      return () => {
          if (timerRef.current) window.clearInterval(timerRef.current);
          pushTime(); // Save remaining time
          saveProgress(); // Push to DB on unmount
      };
  }, []);

  const filteredPrograms = useMemo(() => {
    let result = PROGRAMAS_DATA;
    if (activeFilter !== 'Todo') {
        if (activeFilter === 'Saberes') result = result.filter(p => p.tags.includes('saberes'));
        else result = result.filter(p => p.viceministerio === activeFilter || (activeFilter === 'Pobreza' && ['Pobreza'].includes(p.viceministerio)));
    }
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        result = result.filter(p => 
            p.nombre.toLowerCase().includes(q) || 
            p.poblacion.toLowerCase().includes(q) || 
            p.tags.toLowerCase().includes(q)
        );
    }
    return result;
  }, [searchQuery, activeFilter]);

  const sections = [
    { id: 'intro', label: 'Introducción', icon: Target, desc: 'Misión, Visión y Objetivos' },
    { id: 'normative', label: 'Normativa', icon: Scale, desc: 'Leyes y Decretos Clave' },
    { id: 'process', label: 'Procesos', icon: Layout, desc: 'Mapa de Procesos (MIPG)' },
    { id: 'structure', label: 'Estructura', icon: Users, desc: 'Organigrama interactivo' },
    { id: 'approaches', label: 'Enfoques', icon: Map, desc: 'Enfoques Transversales' },
    { id: 'programs', label: 'Programas', icon: FileText, desc: 'Portafolio de 24 Programas' },
    { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Valida tus conocimientos' }
  ];

  const currentSectionIndex = sections.findIndex(s => s.id === activeTab);
  
  const handleNext = () => {
      if (currentSectionIndex < sections.length - 1) {
          setActiveTab(sections[currentSectionIndex + 1].id);
          window.scrollTo(0,0);
      }
  };

  const handlePrev = () => {
      if (currentSectionIndex > 0) {
          setActiveTab(sections[currentSectionIndex - 1].id);
          window.scrollTo(0,0);
      }
  };
  
  const progressPercentage = activeTab === 'menu' ? 0 : Math.round(((currentSectionIndex + 1) / sections.length) * 100);

  // Time Calculation
  const timeSpent = data.timeSpentSeconds || 0;
  const minTime = data.minTimeSeconds || 60; // Default 1 min if not set
  const timeLeft = Math.max(0, minTime - timeSpent);
  const isQuizLocked = timeLeft > 0 && !data.completed;

  // --- RENDER MENU GRID ---
  if (activeTab === 'menu') {
      return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-gray-100 dark:border-slate-800">
                <div>
                    <Badge type="brand">Módulo 1</Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Plataforma Estratégica</h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Identidad, estructura y portafolio del Ministerio.</p>
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
                {sections.map((section) => {
                    const Icon = section.icon;
                    const isLockedQuiz = section.id === 'quiz' && isQuizLocked;
                    
                    return (
                        <button 
                            key={section.id}
                            onClick={() => !isLockedQuiz && setActiveTab(section.id)}
                            disabled={isLockedQuiz}
                            className={`p-6 rounded-2xl border transition-all text-left group relative overflow-hidden
                                ${isLockedQuiz 
                                    ? 'bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-slate-800 opacity-75 cursor-not-allowed' 
                                    : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-lg'
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

  // --- RENDER DETAIL VIEW ---
  const activeSection = sections.find(s => s.id === activeTab);
  
  return (
    <div className="space-y-6 animate-fade-in pb-24">
        {/* Detail Header with Enhanced Navigation */}
        <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur z-30 pt-4 pb-2 border-b border-gray-200 dark:border-slate-700 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Back to Menu Button */}
                    <button 
                        onClick={() => setActiveTab('menu')} 
                        className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-brand-600 transition-colors shadow-sm"
                        title="Volver al Menú"
                    >
                        <Grid size={18} />
                        <span className="text-sm font-bold hidden sm:inline">Menú</span>
                    </button>

                    {/* Quick Jump Dropdown */}
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
                            {sections.map(s => (
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
                        Tema {currentSectionIndex + 1} de {sections.length}
                    </div>
                </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-brand-500 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>
        </div>

        {/* Content Area (Full Width) */}
        <div className="min-h-[500px]">
            {/* 1. INTRODUCCIÓN */}
            {activeTab === 'intro' && (
                <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                        <Card title="¿Qué es el Ministerio?" className="bg-gradient-to-br from-white to-brand-50/50 dark:from-slate-800 dark:to-slate-800">
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                Entidad del Gobierno nacional encargada de <b>diseñar, formular, adoptar, dirigir, coordinar y ejecutar políticas, planes y programas</b> para eliminar desigualdades, garantizar el derecho a la igualdad y articular la política de Estado en igualdad y equidad.
                            </p>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                                    <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">5</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Viceministerios</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                                    <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">20</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Direcciones</span>
                                </div>
                                <div className="p-3 bg-white dark:bg-slate-700 rounded-xl border border-brand-100 dark:border-brand-900/30 shadow-sm">
                                    <span className="block text-2xl font-extrabold text-brand-600 dark:text-brand-400">24</span>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">Programas</span>
                                </div>
                            </div>
                        </Card>
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={80}/></div>
                                <h3 className="text-lg font-bold text-brand-700 dark:text-brand-400 mb-2 relative z-10">Misión</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 relative z-10">
                                    Formular, implementar, coordinar y evaluar políticas, planes, programas y proyectos para avanzar en la garantía del derecho a la igualdad y la equidad, con enfoque de derechos, de género, diferencial, étnico-antirracista, interseccional y territorial.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><BookOpen size={80}/></div>
                                <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2 relative z-10">Visión</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 relative z-10">
                                    Ser un hito permanente en la historia de Colombia que transforma, de forma concreta, la vida de poblaciones y territorios históricamente excluidos, haciendo tangible la igualdad y la equidad.
                                </p>
                            </div>
                        </div>
                </div>
            )}

            {/* 2. NORMATIVA */}
            {activeTab === 'normative' && (
                <div className="animate-fade-in">
                    <Card title="Línea de Tiempo y Normativa Clave">
                        <p className="text-slate-500 mb-6 text-sm">Hitos normativos que marcan la creación y estructuración del Ministerio. Haz clic para ver detalles.</p>
                        <div className="relative max-w-2xl mx-auto space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-200 before:to-transparent">
                            {TIMELINE_DATA.map((item, i) => (
                                <div key={item.id} className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-pointer`} onClick={() => setSelectedTimelineItem(item)}>
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-brand-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-brand-600 text-xs hover:bg-brand-600 hover:text-white transition-colors">
                                        {i + 1}
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-brand-200 transition-all">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{item.year}</div>
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm">{item.title}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    {selectedTimelineItem && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedTimelineItem(null)}>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl max-w-lg w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => setSelectedTimelineItem(null)}><X /></button>
                                <span className="text-xs font-bold bg-brand-100 text-brand-800 px-2 py-1 rounded uppercase">{selectedTimelineItem.year}</span>
                                <h3 className="text-2xl font-bold mt-2 mb-4 text-slate-900 dark:text-white">{selectedTimelineItem.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedTimelineItem.content}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 3. PROCESOS */}
            {activeTab === 'process' && (
                <div className="animate-fade-in">
                    <Card title="Esquema de Procesos (Interactivo)">
                        <p className="text-sm text-slate-500 mb-6">Explore cómo funciona el Ministerio. Pase el cursor sobre cada componente para ver su función.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="md:col-span-2 lg:col-span-3 bg-brand-50 dark:bg-brand-900/30 border border-brand-200 dark:border-brand-800 p-4 rounded-xl text-center font-bold text-brand-800 dark:text-brand-300 relative group cursor-help">
                                Enfoques Transversales
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 font-normal">
                                    Cobija toda la actuación con los enfoques de Derecho, Territorial, Intersectorial, Diferencial, de Género, Étnico-Racial y Antirracista.
                                </div>
                            </div>
                            <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 flex flex-col gap-3">
                                <div className="text-center font-bold text-slate-700 dark:text-slate-300 border-b pb-2 mb-2">Procesos Estratégicos</div>
                                {['Gestión de Saberes', 'Gestión Estratégica', 'Gestión de Proyectos', 'Relacionamiento Ciudadano', 'Comunicaciones', 'Cooperación Internacional', 'Gestión TICs'].map((p, i) => (
                                    <div key={i} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-xs font-medium text-center hover:bg-white hover:shadow hover:scale-105 transition-all cursor-help relative group">
                                        {p}
                                    </div>
                                ))}
                            </div>
                            <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 flex flex-col gap-3">
                                <div className="text-center font-bold text-slate-700 dark:text-slate-300 border-b pb-2 mb-2">Procesos Misionales</div>
                                {['Atención a Juventudes', 'Atención a Mujeres', 'Poblaciones y Territorios Excluidos', 'Pueblos Étnicos y Campesinos', 'Discapacidad y LGBTIQ+'].map((p, i) => (
                                    <div key={i} className="p-3 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs font-medium text-center hover:shadow hover:scale-105 transition-all cursor-help relative group">
                                        {p}
                                    </div>
                                ))}
                                <div className="p-3 bg-brand-600 text-white rounded-lg text-xs font-bold text-center hover:shadow hover:scale-105 transition-all cursor-help relative group">
                                    Articulación Intersectorial
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-lg hidden group-hover:block z-10">
                                        Coordina acciones entre direcciones y entidades para una respuesta transformadora.
                                    </div>
                                </div>
                            </div>
                            <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 bg-white dark:bg-slate-800 flex flex-col gap-3">
                                <div className="text-center font-bold text-slate-700 dark:text-slate-300 border-b pb-2 mb-2">Procesos de Apoyo</div>
                                {['Talento Humano', 'Gestión Contractual', 'Gestión Jurídica', 'Logística y Recursos', 'Gestión Documental', 'Gestión Financiera'].map((p, i) => (
                                    <div key={i} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg text-xs font-medium text-center hover:bg-white hover:shadow hover:scale-105 transition-all cursor-help relative group">
                                        {p}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* 4. ESTRUCTURA */}
            {activeTab === 'structure' && (
                <div className="animate-fade-in">
                    <Card title="Estructura Orgánica (Decreto 1075)">
                        <p className="text-sm text-slate-500 mb-8">Haga clic en una dependencia para ver sus funciones y componentes.</p>
                        <div className="flex flex-col items-center gap-8 relative overflow-x-auto pb-4">
                            <div className={`w-56 p-4 rounded-xl text-center font-bold text-sm cursor-pointer transition-all shadow-md border hover:-translate-y-1 ${selectedOrgNode === 'entidades' ? 'bg-slate-800 text-white ring-4 ring-slate-200' : 'bg-slate-200 text-slate-700 border-slate-300'}`} onClick={() => setSelectedOrgNode('entidades')}>Entidades Adscritas</div>
                            <div className="w-px h-8 bg-slate-300"></div>
                            <div className="flex flex-wrap justify-center gap-8 relative">
                                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-slate-300 -z-10"></div>
                                <div className={`w-48 p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all shadow border hover:-translate-y-1 bg-white dark:bg-slate-800 ${selectedOrgNode === 'territoriales' ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'}`} onClick={() => setSelectedOrgNode('territoriales')}>Direcciones Territoriales</div>
                                <div className={`w-56 p-5 rounded-xl text-center font-bold text-white shadow-xl cursor-pointer transition-all hover:-translate-y-1 z-10 ${selectedOrgNode === 'despacho' ? 'bg-slate-900 ring-4 ring-brand-200' : 'bg-brand-600'}`} onClick={() => setSelectedOrgNode('despacho')}>Despacho de la Ministra</div>
                                <div className={`w-48 p-3 rounded-xl text-center font-bold text-xs cursor-pointer transition-all shadow border hover:-translate-y-1 bg-white dark:bg-slate-800 ${selectedOrgNode === 'asesoras' ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'}`} onClick={() => setSelectedOrgNode('asesoras')}>Oficinas Asesoras</div>
                            </div>
                            <div className="w-px h-8 bg-slate-300"></div>
                            <div className="flex flex-wrap justify-center gap-3">
                                {[{k: 'vm-mujeres', l: 'VM Mujeres'}, {k: 'vm-juventud', l: 'VM Juventud'}, {k: 'vm-poblaciones', l: 'VM Poblaciones'}, {k: 'vm-diversidades', l: 'VM Diversidades'}, {k: 'vm-etnicos', l: 'VM Pueblos Étnicos'}].map(vm => (
                                    <div key={vm.k} className={`p-3 rounded-lg text-xs font-bold cursor-pointer transition-all border shadow-sm hover:-translate-y-1 ${selectedOrgNode === vm.k ? 'bg-slate-800 text-white' : 'bg-gray-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-gray-200'}`} onClick={() => setSelectedOrgNode(vm.k)}>{vm.l}</div>
                                ))}
                            </div>
                        </div>
                    </Card>
                    {selectedOrgNode && ORG_DATA[selectedOrgNode] && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedOrgNode(null)}>
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl max-w-lg w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500" onClick={() => setSelectedOrgNode(null)}><X /></button>
                                <h3 className="text-xl font-bold mb-2 text-brand-700 dark:text-brand-400 border-b pb-2">{ORG_DATA[selectedOrgNode].title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{ORG_DATA[selectedOrgNode].description}</p>
                                {ORG_DATA[selectedOrgNode].dependencies && (
                                    <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-xl">
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Componentes / Dependencias</h4>
                                        <ul className="space-y-1">
                                            {ORG_DATA[selectedOrgNode].dependencies.map((dep: string, idx: number) => (
                                                <li key={idx} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2"><ChevronRight size={12} className="mt-0.5 text-brand-500"/> {dep}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 5. ENFOQUES */}
            {activeTab === 'approaches' && (
                <div className="animate-fade-in">
                    <Card>
                        <div className="flex gap-2 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                            <button onClick={() => setEnfoqueSubTab('enfoques')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${enfoqueSubTab === 'enfoques' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-600'}`}>Enfoques Transversales</button>
                            <button onClick={() => setEnfoqueSubTab('estrategias')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${enfoqueSubTab === 'estrategias' ? 'bg-brand-600 text-white' : 'bg-gray-100 dark:bg-slate-700 text-slate-600'}`}>Estrategias</button>
                        </div>
                        {enfoqueSubTab === 'enfoques' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {[{n:'01', t:'Enfoque de Derechos', d:'Sitúa a las personas como titulares de derechos.'}, {n:'02', t:'Enfoque Territorial', d:'Ecosistema social, geográfico y cultural.'}, {n:'03', t:'Enfoque Diferencial', d:'Respuestas adaptadas a barreras específicas.'}, {n:'04', t:'Enfoque Étnico-Racial', d:'Protege la diversidad y supera el racismo.'}, {n:'05', t:'Enfoque de Género', d:'Elimina desigualdades de mujeres y LGBTIQ+.'}, {n:'06', t:'Enfoque Interseccional', d:'Reconoce múltiples ejes de discriminación.'}, {n:'07', t:'Justicia Ambiental', d:'Respuesta justa a la crisis climática.'}, {n:'08', t:'Curso de Vida', d:'Desarrollo humano como continuo.'}].map(item => (
                                    <div key={item.n} className="text-center p-2">
                                        <div className="w-12 h-12 rounded-full bg-brand-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-lg ring-4 ring-brand-50 dark:ring-brand-900">{item.n}</div>
                                        <h3 className="font-bold text-brand-700 dark:text-brand-400 text-sm mb-1">{item.t}</h3>
                                        <p className="text-xs text-slate-500">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['Alianzas Público-Populares', 'Iniciativas Productivas', 'Infraestructura para Cerrar Brechas', 'Espacios para la Juntanza', 'Cambio Cultural y Erradicación', 'Abordaje Psicosocial', 'Transmisión de Saberes', 'Ecosistema Institucional', 'Gobernanza Interna', 'Condiciones para Vida Digna', 'Restablecimiento de Derechos'].map((e, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 dark:border-slate-700 hover:border-brand-300 hover:shadow-md transition-all">
                                        <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1">{e}</h3>
                                        <p className="text-xs text-slate-500">Estrategia transversal para el cierre de brechas.</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* 6. PROGRAMAS */}
            {activeTab === 'programs' && (
                <div className="animate-fade-in">
                    <Card title="Portafolio Programático (24)">
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input type="text" placeholder="Buscar por nombre, población..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none text-sm text-slate-900 dark:text-white"/>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                                {['Todo', 'Mujeres', 'Juventud', 'Pobreza', 'Diversidades', 'Étnicos', 'Saberes'].map(f => (
                                    <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeFilter === f ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-slate-800 text-slate-600 border-gray-200 dark:border-slate-600 hover:bg-gray-50'}`}>{f}</button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredPrograms.length > 0 ? filteredPrograms.map(p => (
                                <div key={p.id} className="border border-gray-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800 hover:border-brand-300 transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 dark:text-white">{p.nombre}</h3>
                                        <span className="text-[10px] uppercase font-bold bg-gray-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded">{p.viceministerio}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{p.breve}</p>
                                    <details className="group/details">
                                        <summary className="text-xs font-bold text-brand-600 cursor-pointer flex items-center gap-1">Más información <ChevronDown size={12} className="group-open/details:rotate-180 transition-transform"/></summary>
                                        <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-xs space-y-2 animate-fade-in">
                                            <p><b>Población:</b> {p.poblacion}</p>
                                            <p><b>Dependencia:</b> {p.dependencia}</p>
                                            <p><b>Estrategia:</b> {p.estrategia}</p>
                                            <div className="flex flex-wrap gap-1 mt-1">{p.tags.split(',').map(t => (<span key={t} className="bg-white dark:bg-slate-600 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-500 text-[10px] text-slate-500 dark:text-slate-300">#{t}</span>))}</div>
                                        </div>
                                    </details>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center py-12 text-slate-400"><Info className="mx-auto mb-2 opacity-50" size={32} /><p>No se encontraron programas.</p></div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* 7. EVALUACIÓN */}
            {activeTab === 'quiz' && (
                <div className="animate-fade-in">
                    {!isQuizLocked ? (
                        <Quiz 
                            questions={[
                                { id: 1, question: "¿Cuál ley creó el Ministerio de Igualdad y Equidad?", options: ["Ley 100", "Ley 2281 de 2023", "Ley 87 de 1993"], correctAnswer: 1 },
                                { id: 2, question: "¿Cuántos programas estratégicos conforman el portafolio actual?", options: ["10", "24", "32"], correctAnswer: 1 },
                                { id: 3, question: "¿Qué decreto define la estructura orgánica del Ministerio?", options: ["Decreto 1075 de 2023", "Decreto 1499", "Decreto 1600"], correctAnswer: 0 },
                                { id: 4, question: "¿Quién ejerce la tercera línea de defensa en el MIPG?", options: ["Planeación", "Control Interno", "Talento Humano"], correctAnswer: 1 },
                                { id: 5, question: "¿Cuál es el enfoque que protege la diversidad y supera el racismo?", options: ["Interseccional", "Étnico-Racial", "Territorial"], correctAnswer: 1 }
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
        
        {/* Navigation Footer */}
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
                    disabled={currentSectionIndex >= sections.length - 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                    Siguiente <ArrowRight size={16} />
                </button>
            </div>
        </div>
    </div>
  );
};
