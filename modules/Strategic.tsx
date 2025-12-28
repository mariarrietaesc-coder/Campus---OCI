
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Badge, Quiz, Accordion, TimelineItem } from '../components/UI';
import { 
  Target, Scale, Users, Map, FileText, CheckCircle, 
  ArrowLeft, ArrowRight, Clock, Lock, LayoutGrid, Info,
  Search, Filter, ChevronDown, ChevronUp, Zap, 
  ShieldCheck, Globe, Users2, Landmark, Home, 
  Database, Radio, Laptop, Briefcase, Gavel, X
} from 'lucide-react';
import { QuizState } from '../types';

// --- DATA: Portafolio Programático (24 Programas) ---
const PROGRAMAS = [
  { id: 'agua-vida', nombre: 'Agua es Vida', viceministerio: 'Pobreza', dependencia: 'Acceso Igualitario al Agua', poblacion: 'Territorios marginados con baja cobertura de agua', estrategia: 'Infraestructura para cerrar brechas', breve: 'Acceso igualitario y digno al agua potable mediante soluciones pertinentes territorialmente.' },
  { id: 'hambre-cero', nombre: 'Hambre Cero', viceministerio: 'Pobreza', dependencia: 'Superación de la Pobreza', poblacion: 'Hogares en pobreza y extrema pobreza', estrategia: 'Condiciones para vida digna', breve: 'Asegurar alimentación adecuada y soberanía alimentaria con enfoque territorial.' },
  { id: 'personas-mayores', nombre: 'Bienestar para Personas Mayores', viceministerio: 'Pobreza', dependencia: 'Personas Mayores', poblacion: 'Personas mayores en exclusión', estrategia: 'Abordaje psicosocial y bienestar', breve: 'Cuidados, protección social y participación para un envejecimiento digno.' },
  { id: 'habitantes-calle', nombre: 'Construyendo Dignidad', viceministerio: 'Pobreza', dependencia: 'Personas en Situación de Calle', poblacion: 'Habitantes de calle', estrategia: 'Acompañamiento para restablecimiento de derechos', breve: 'Abordaje integral y territorial con rutas de restablecimiento de derechos.' },
  { id: 'cuidado', nombre: 'Sistema de Cuidado en Territorios', viceministerio: 'Pobreza', dependencia: 'Cuidado', poblacion: 'Personas cuidadoras y receptoras de cuidado', estrategia: 'Ecosistema institucional del Sector Igualdad', breve: 'Implementación territorial del cuidado como derecho y trabajo reconocido.' },
  { id: 'migracion', nombre: 'Raíces en Movimiento', viceministerio: 'Pobreza', dependencia: 'Población Migrante', poblacion: 'Población migrante, refugiada y retornada', estrategia: 'Condiciones para vida digna', breve: 'Respuesta humanitaria, integración socioeconómica y cohesión social para población migrante.' },
  { id: 'casas-dignidad', nombre: 'Casas de la Dignidad', viceministerio: 'Mujeres', dependencia: 'Prevención y Atención de las Violencias', poblacion: 'Mujeres víctimas de violencias', strategy: 'Acompañamiento para restablecimiento de derechos', breve: 'Espacios seguros de acogida, atención y empoderamiento para mujeres y sus familias.' },
  { id: 'autonomia-eco', nombre: 'Mujeres por la Autonomía Económica', viceministerio: 'Mujeres', dependencia: 'Autonomía Económica', poblacion: 'Mujeres en condiciones de vulnerabilidad económica', estrategia: 'Iniciativas productivas', breve: 'Fomento de emprendimientos y acceso a mercados para la independencia económica de las mujeres.' },
  { id: 'derechos-sexuales', nombre: 'Mis Derechos, Mi Decisión', viceministerio: 'Mujeres', dependencia: 'Garantía de Derechos', poblacion: 'Mujeres, adolescentes y niñas', estrategia: 'Cambio cultural', breve: 'Promoción y garantía de los derechos sexuales y reproductivos en todo el territorio nacional.' },
  { id: 'masp', nombre: 'Reconocimiento y Dignidad (MASP)', viceministerio: 'Mujeres', dependencia: 'Mujeres en Actividades Sexuales Pagas', poblacion: 'Mujeres en actividades sexuales pagas', estrategia: 'Condiciones para vida digna', breve: 'Garantía de derechos, reducción de estigmas y alternativas de vida digna.' },
  { id: 'madres-cabeza', nombre: 'Madres que Lideran', viceministerio: 'Mujeres', dependencia: 'Madres Cabeza de Familia', poblacion: 'Madres cabeza de familia', estrategia: 'Alianzas público-populares y comunitarias', breve: 'Apoyo integral para el bienestar, autonomía y liderazgo de las madres cabeza de familia.' },
  { id: 'jovenes-paz', nombre: 'Jóvenes en Paz', viceministerio: 'Juventud', dependencia: 'Jóvenes en Paz', poblacion: 'Jóvenes en riesgo de violencia y exclusión', estrategia: 'Acompañamiento para restablecimiento de derechos', breve: 'Alternativas de vida y construcción de paz a través de educación, cultura y empleo.' },
  { id: 'barrismo-social', nombre: 'Fútbol y Convivencia', viceministerio: 'Juventud', dependencia: 'Barrismo Social', poblacion: 'Jóvenes barristas', estrategia: 'Espacios de juntanza', breve: 'Transformación de las barras de fútbol en actores de convivencia y paz territorial.' },
  { id: 'oportunidades-joven', nombre: 'Sacúdete por tus Derechos', viceministerio: 'Juventud', dependencia: 'Goce Efectivo de Derechos y Oportunidades', poblacion: 'Jóvenes de 14 a 28 años', estrategia: 'Iniciativas productivas', breve: 'Plataforma de oportunidades en educación, empleo, emprendimiento y participación juvenil.' },
  { id: 'lgbtiq', nombre: 'Orgullo Diverso', viceministerio: 'Diversidades', dependencia: 'Derechos de la Población LGBTIQ+', poblacion: 'Población LGBTIQ+', estrategia: 'Cambio cultural', breve: 'Garantía de derechos, lucha contra la discriminación y visibilización de la diversidad sexual y de género.' },
  { id: 'discapacidad', nombre: 'Colombia sin Barreras', viceministerio: 'Diversidades', dependencia: 'Derechos de Personas con Discapacidad', poblacion: 'Personas con discapacidad', estrategia: 'Infraestructura para cerrar brechas', breve: 'Inclusión social, laboral y educativa a través de la eliminación de barreras físicas y sociales.' },
  { id: 'narp', nombre: 'Herencia Viva (NARP)', viceministerio: 'Étnicos', dependencia: 'NARP', poblacion: 'Comunidades Negras, Afrocolombianas, Raizales y Palenqueras', estrategia: 'Reconocimiento y transmisión de saberes', breve: 'Fortalecimiento de la identidad cultural, protección de territorios y lucha contra el racismo.' },
  { id: 'indigenas', nombre: 'Saberes Ancestrales', viceministerio: 'Étnicos', dependencia: 'Pueblos Indígenas', poblacion: 'Pueblos Indígenas', estrategia: 'Reconocimiento y transmisión de saberes', breve: 'Protección de la autonomía, la cultura y los derechos territoriales de los pueblos indígenas.' },
  { id: 'rrom', nombre: 'Kumpania en Movimiento', viceministerio: 'Étnicos', dependencia: 'Pueblo Rrom', poblacion: 'Pueblo Rrom (Gitanos)', estrategia: 'Reconocimiento y transmisión de saberes', breve: 'Preservación de la identidad cultural, nomadismo y garantía de derechos del pueblo Rrom.' },
  { id: 'campesinado', nombre: 'Tierra y Territorio Campesino', viceministerio: 'Étnicos', dependencia: 'Campesinado', poblacion: 'Población campesina', estrategia: 'Condiciones para vida digna', breve: 'Reconocimiento del campesinado como sujeto de derechos, acceso a tierra y producción sostenible.' },
  { id: 'justicia-racial', nombre: 'Justicia Étnica y Racial', viceministerio: 'Étnicos', dependencia: 'NARP', poblacion: 'Pueblos y comunidades étnicas', estrategia: 'Cambio cultural', breve: 'Acciones afirmativas y de reparación histórica para combatir el racismo estructural.' },
  { id: 'pactos-territoriales', nombre: 'Pactos Territoriales por la Igualdad', viceministerio: 'Pobreza', dependencia: 'Superación de la Pobreza', poblacion: 'Territorios PDET y ZOMAC', estrategia: 'Alianzas público-populares y comunitarias', breve: 'Articulación de inversiones y acciones para cerrar brechas de desigualdad en territorios excluidos.' },
  { id: 'datos-igualdad', nombre: 'Observatorio de la Igualdad', viceministerio: 'Pobreza', dependencia: 'Superación de la Pobreza', poblacion: 'Academia, sociedad civil, entidades', estrategia: 'Gobernanza interna', breve: 'Generación y análisis de datos para orientar políticas públicas de igualdad y equidad.' },
  { id: 'cultura-paz', nombre: 'Cultura para la Paz y la No Estigmatización', viceministerio: 'Juventud', dependencia: 'Jóvenes en Paz', poblacion: 'Toda la población colombiana', estrategia: 'Cambio cultural', breve: 'Estrategias de comunicación y pedagogía para transformar imaginarios que perpetúan la desigualdad.' }
];

// --- DATA: Estructura Orgánica ---
const ORGANIGRAMA = {
  nombre: 'Despacho del Ministro',
  children: [
    { id: 'entidades', nombre: 'Entidades Adscritas y Vinculadas', items: ['ICBF', 'INSOR', 'INCI'] },
    { id: 'territoriales', nombre: 'Direcciones Territoriales', items: ['Amazonas', 'Antioquia', 'Arauca', 'San Andrés', 'Atlántico', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada'] },
    { id: 'secretaria', nombre: 'Secretaría General', items: ['Subdirección de Talento Humano', 'Subdirección Administrativa y Financiera', 'Subdirección de Contratación'] },
    { id: 'oficinas', nombre: 'Oficinas Asesoras', items: ['Oficina de Saberes y Conocimientos Estratégicos', 'Oficina de Tecnologías de la Información', 'Oficina de Control Interno', 'Oficina de Control Disciplinario Interno', 'Oficina de Relacionamiento con la Ciudadanía', 'Oficina de Alianzas Estratégicas y Cooperación Internacional', 'Oficina Asesora de Comunicaciones', 'Oficina Asesora de Planeación', 'Oficina Jurídica', 'Oficina de Proyectos para la Igualdad y la Equidad'] },
    { id: 'vm-mujeres', nombre: 'Viceministerio de las Mujeres', items: ['Dirección para la Prevención de Violencias', 'Dirección para la Autonomía Económica', 'Dirección para Garantía de Derechos'] },
    { id: 'vm-juventud', nombre: 'Viceministerio de la Juventud', items: ['Dirección de Fomento de Oportunidades', 'Dirección de Barrismo Social', 'Dirección de Jóvenes en Paz'] },
    { id: 'vm-poblaciones', nombre: 'Viceministerio para Poblaciones', items: ['Dirección para la Superación de la Pobreza', 'Dirección de Cuidado', 'Dirección para la Población Migrante'] },
    { id: 'vm-diversidades', nombre: 'Viceministerio de las Diversidades', items: ['Dirección para Población LGBTIQ+', 'Dirección para Personas con Discapacidad'] },
    { id: 'vm-etnicos', nombre: 'Viceministerio de Pueblos Étnicos', items: ['Dirección Comunidades Negras, Afro, Raizales', 'Dirección Pueblos Indígenas', 'Dirección Pueblo Rom', 'Dirección Campesinado'] }
  ]
};

// --- DATA: Definiciones de Procesos ---
const PROCESOS_DEFS = {
  estratégicos: [
    { n: 'Gestión Estratégica', icon: Target, def: "Definir y establecer los lineamientos, metodologías e instrumentos necesarios para orientar la ruta estratégica del Ministerio de la Igualdad y la Equidad, garantizando la creación y ejecución efectiva de políticas públicas que promuevan la equidad y la igualdad, generando así un valor público alineado con los objetivos de gobierno." },
    { n: 'Gestión de Proyectos para la Igualdad y la Equidad', icon: Briefcase, def: "Formular y estructurar los proyectos dirigidos a organismos públicos, privados e internacionales, teniendo en cuenta el ámbito de competencia del Ministerio y, en especial, el enfoque territorial, a través de las metodologías establecidas." },
    { n: 'Relacionamiento con la Ciudadanía', icon: Users2, def: "Implementar políticas que fortalezcan la relación entre el Estado y las ciudadanías, a través de un modelo de relacionamiento integral, transparente, participativo e incluyente, que facilite el avance en la garantía del derecho a la igualdad y la equidad, el acceso a la respuesta institucional, y mejore la experiencia de los sujetos de especial protección constitucional en su interacción con el Ministerio." },
    { n: 'Gestión de Comunicaciones', icon: Radio, def: "Fortalecer la gestión comunicativa del Ministerio de Igualdad y Equidad mediante la planificación, implementación, seguimiento y mejora continua de lineamientos, estrategias y acciones que garanticen una información clara, accesible y oportuna con especial énfasis en los sujetos de protección constitucional, para avanzar hacia una sociedad más justa, igualitaria y equitativa." },
    { n: 'Gestión de Cooperación Internacional', icon: Globe, def: "Gestionar alianzas estratégicas y convenios con agencias de cooperación, sector privado y organismos internacionales en temas de Igualdad y Equidad, mediante la participación en negociaciones para la suscripción y ratificación de instrumentos internacionales relacionados, y ejecutar las disposiciones vigentes en la materia." },
    { n: 'Gestión de Tecnologías de la Información', icon: Laptop, def: "Gestionar los servicios, información y recursos tecnológicos de forma segura, mediante la formulación, desarrollo y evaluación de políticas, lineamientos, planes, programas y proyectos, que aseguren el aprovechamiento de las tecnologías de la información (TI), para contribuir con el logro de los objetivos institucionales." },
    { n: 'Gestión del Conocimiento e Innovación Público Popular', icon: Landmark, def: "Desarrollar, integrar y difundir conocimientos e innovaciones que contribuyan a la identificación y superación de las desigualdades, valorando tanto el saber científico como el popular y ancestral, para informar y mejorar las políticas y programas del Ministerio de Igualdad y Equidad." }
  ],
  misionales: [
    { n: 'Formulación de Políticas Públicas, Diseño de Programas y Gestión de Recursos', def: "Diseñar e implementar políticas públicas, programas y gestión de recursos con enfoque diferencial e interseccional que contribuyan a reducir las brechas de desigualdad y promuevan la igualdad y equidad en los territorios y poblaciones objetivo del Ministerio." },
    { n: 'Atención a las Juventudes', def: "Implementar políticas, programas y estrategias transformadoras que promuevan el desarrollo integral, la convivencia pacífica y el cierre de brechas para la juventud, incluyendo acciones específicas para el barrismo social y jóvenes en situación de vulnerabilidad." },
    { n: 'Atención a Poblaciones y Territorios Marginados y Excluidos', def: "Implementar programas, proyectos y estrategias, para impulsar el goce efectivo de los derechos de las poblaciones y territorios marginados y excluidos, a fin de contribuir al cierre de brechas de desigualdad social, económica y territorial, garantizando la aplicación de los diferentes enfoques que enmarcan la actuación del Ministerio." },
    { n: 'Atención a Pueblos Étnicos y Campesinos', def: "Formular de manera efectiva las intervenciones, proyectos y acciones transformadoras dirigidas a pueblos y comunidades negras, afrodescendientes, raizales, palenqueras, indígenas, Rrom y campesinas, con enfoque de derechos, de género, diferencial, étnico-antirracista, interseccional y territorial, para contribuir a la superación de las brechas de desigualdad e inequidad." },
    { n: 'Atención a Personas con Discapacidad y población de sectores LGBTIQ+', def: "Diseñar, implementar y coordinar políticas, programas y estrategias integrales que garanticen los derechos, promuevan la inclusión plena y aseguren el goce efectivo de derechos de las personas con discapacidad y la población LGBTIQ+, fomentando una sociedad más equitativa, inclusiva y respetuosa de la diversidad." },
    { n: 'Articulación Intersectorial', def: "Establecer y mantener mecanismos efectivos de coordinación, comunicación y colaboración entre el Ministerio de Igualdad y Equidad y las diversas entidades gubernamentales, organizaciones de la sociedad civil y comunidades, para potenciar el impacto de las políticas de igualdad y equidad a nivel nacional y territorial.", isCore: true },
    { n: 'Traslado, Seguimiento y Evaluación', def: "Gestionar eficientemente el traslado de proyectos, realizar un seguimiento sistemático de la ejecución de programas y recursos, y evaluar el impacto de las acciones transformadoras del Ministerio, para asegurar el cumplimiento de las metas de igualdad y equidad." }
  ],
  apoyo: [
    { n: 'Gestión del Talento Humano', icon: Users, def: "Administrar de manera integral el ciclo de vida laboral de las servidoras y servidores públicos del Ministerio, mediante la gestión de los planes, programas, estrategias y acciones que garanticen su vinculación, desarrollo, bienestar, evaluación periódica y retiro, de conformidad con los lineamientos institucionales y la normativa vigente." },
    { n: 'Gestión Contractual', icon: FileText, def: "Adquirir los bienes, obras y/o servicios requeridos por el Ministerio durante cada vigencia, elaborando, modificando y liquidando los contratos y/o convenios necesarios a través de la aplicación de procedimientos administrativos y el correcto uso de las plataformas de Compras y Contratación Pública." },
    { n: 'Gestión Jurídica', icon: Gavel, def: "Establecer las políticas de gestión sobre las cuales se enmarca la actividad litigiosa y producción normativa, además de representar judicial y extrajudicialmente a la Entidad asesorando y conceptuando en materia jurídica a las dependencias que así lo requieran." },
    { n: 'Gestión de Logística y Recursos Físicos', icon: Home, def: "Gestionar los bienes, obras, locaciones e infraestructura y servicios administrativos, de mantenimiento y asistencia logística necesarios para el funcionamiento adecuado de los diferentes procesos del Ministerio, con el fin de asegurar la disponibilidad de recursos." },
    { n: 'Gestión Documental', icon: Database, def: "Orientar y coordinar los lineamientos administrativos y técnicos relacionados con la planificación, procesamiento, gestión y organización de la documentación generada y recibida por el Ministerio, asegurando la huella del conocimiento, así como la transparencia, integridad y conservación de la información." },
    { n: 'Gestión Financiera', icon: Landmark, def: "Gestionar los recursos públicos asignados al Ministerio, a través del desarrollo de actividades de planificación y control presupuestario, la administración de tesorería y la contabilidad pública, con el fin de optimizar el uso de los recursos asignados." }
  ],
  evaluacion: [
    { n: 'Aseguramiento del Control Interno', icon: ShieldCheck, def: "Articular la información proveniente de diversas fuentes internas y externas para fomentar el mejoramiento y control de la gestión institucional, asesorando a la alta dirección mediante la aplicación de técnicas modernas de auditoría, seguimiento y evaluación independiente." },
    { n: 'Control Interno Disciplinario', icon: Scale, def: "Garantizar el cumplimiento del régimen disciplinario del Ministerio, a través de la determinación de la responsabilidad disciplinaria de personas en el servicio público y exservidores públicos frente a conductas que representen el incumplimiento de deberes, extralimitación de funciones o prohibiciones." }
  ]
};

const SECTIONS = [
  { id: 'intro', label: 'Introducción', icon: Target, desc: 'Misión, visión y pilares fundamentales.' },
  { id: 'normativa', label: 'Marco normativo', icon: Scale, desc: 'Leyes y decretos que rigen la entidad.' },
  { id: 'procesos', label: 'Esquema de procesos', icon: LayoutGrid, desc: 'Mapa de gestión estratégica y misional.' },
  { id: 'organica', label: 'Estructura orgánica', icon: Users, desc: 'Organigrama y niveles directivos.' },
  { id: 'enfoques', label: 'Enfoques y estrategias', icon: Map, desc: 'Líneas transversales de acción pública.' },
  { id: 'programas', label: 'Programas y proyectos', icon: FileText, desc: 'Portafolio oficial de inversión social.' },
  { id: 'quiz', label: 'Evaluación', icon: CheckCircle, desc: 'Cierre del Módulo 1.' }
];

export const StrategicModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('*');
  const [subTab, setSubTab] = useState('enfoques');
  const [expandedOrg, setExpandedOrg] = useState<string[]>([]);
  const [activeDef, setActiveDef] = useState<{ n: string, d: string } | null>(null);
  
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

  const filteredProgramas = useMemo(() => {
    let list = PROGRAMAS;
    if (filter !== '*') {
      if (filter === 'Saberes') {
        list = list.filter(p => p.id === 'datos-igualdad' || p.dependencia.includes('Saberes'));
      } else {
        list = list.filter(p => p.viceministerio === filter);
      }
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => 
        p.nombre.toLowerCase().includes(q) || 
        p.poblacion.toLowerCase().includes(q) || 
        p.breve.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchTerm, filter]);

  if (activeTab === 'menu') {
    return (
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-700 pb-12">
          <div>
            <Badge type="brand" className="mb-4">Módulo 1</Badge>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Plataforma estratégica</h1>
            <p className="text-slate-500 font-medium text-lg mt-4">Misión, visión, estructura y portafolio institucional.</p>
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
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
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
      {activeDef && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] max-w-lg w-full p-12 shadow-2xl relative border border-brand-100 dark:border-slate-700">
            <button onClick={() => setActiveDef(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <Info size={30} className="text-brand-500" />
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{activeDef.n}</h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-lg">{activeDef.d}</p>
            <button onClick={() => setActiveDef(null)} className="mt-10 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-brand-600 transition-colors shadow-lg">Cerrar</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 z-40 border-b border-slate-200 dark:border-slate-700 px-2">
        <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors">
                <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Módulo 1 - {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS.length}</div>
      </div>

      <main className="min-h-[60vh] px-2 md:px-0">
        
        {activeTab === 'intro' && (
          <div className="space-y-12">
            <Card title="Naturaleza institucional" className="border-l-8 border-brand-500 !rounded-[2.5rem]">
              <p className="text-xl leading-relaxed text-slate-700 dark:text-slate-300">
                El Ministerio es la entidad pública perteneciente a la rama ejecutiva del nivel central encargada de <b>diseñar, formular, adoptar, dirigir, coordinar, articular, ejecutar, fortalecer y evaluar</b> las políticas, planes, programas y estrategias para eliminar desigualdades económicas, políticas y sociales.
              </p>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-xl">
                <h4 className="text-brand-400 font-bold text-xs tracking-wider mb-6">Misión</h4>
                <p className="text-lg font-medium leading-relaxed opacity-90">Formular, implementar, coordinar y evaluar políticas, planes, programas y proyectos para avanzar en la garantía del derecho a la igualdad y la equidad, con enfoque de derechos, de género, diferencial, étnico-antirracista, interseccional y territorial.</p>
              </div>
              <div className="bg-brand-600 p-10 rounded-[2.5rem] text-white shadow-xl">
                <h4 className="text-brand-100 font-bold text-xs tracking-wider mb-6">Visión</h4>
                <p className="text-lg font-medium leading-relaxed">Tiene raíces en la historia de Colombia como un hito permanente en la garantía de derechos que transforma, de forma concreta, la vida de poblaciones y territorios históricamente excluidos, haciendo tangible la igualdad y la equidad.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { n: '5', l: 'Viceministerios' },
                  { n: '20', l: 'Direcciones técnicas' },
                  { n: '24', l: 'Programas estratégicos' }
                ].map(k => (
                  <div key={k.l} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl text-center">
                    <div className="text-5xl font-black text-brand-600 mb-2">{k.n}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{k.l}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'normativa' && (
          <div className="space-y-6">
            <TimelineItem year="Enero 2023" title="Ley 2281: Creación del Ministerio" description="Define el objeto y competencias; es la base legal que luego desarrolla el Gobierno nacional." />
            <TimelineItem year="Mayo 2023" title="Ley 2294: PND 2022-2026" description="Incorpora macrometas sectoriales (Jóvenes en Paz, Mujeres autónomas, Una sociedad para el cuidado)." />
            <TimelineItem year="Junio 2023" title="Decreto 1075: Estructura Orgánica" description="Define despachos, 5 viceministerios, 20 direcciones, oficinas y Secretaría General." />
            <TimelineItem year="Junio 2023" title="Decreto 1076: Planta de personal (P1)" description="Establece los componentes iniciales de la planta de personal del Ministerio." />
            <TimelineItem year="Julio 2023" title="Decreto 1220: Planta de personal (P2)" description="Complementa y ajusta la planta de personal establecida en el Decreto 1076." />
            <TimelineItem year="Agosto 2023" title="Resolución 003: Manual v1" description="Adopta la primera versión del Manual Específico de Funciones y Competencias Laborales." />
            <TimelineItem year="Octubre 2023" title="Resolución 22: Manual v2" description="Actualiza y precisa el Manual de Funciones conforme a la estructura y planta ya definidas." />
            <TimelineItem year="2023-2024" title="Portafolio programático" description="Se elaboran los Documentos Técnicos (DT) de los 24 programas estratégicos sectoriales." />
            <TimelineItem year="Septiembre 2024" title="Resolución 668: Enfoques" description="Institucionaliza los 8 enfoques como eje articulador de toda la política pública del sector." />
            <TimelineItem year="Septiembre 2024" title="Resolución 669: Estrategias" description="Establece las 11 estrategias programáticas para materializar objetivos y medir impacto." />
            <TimelineItem year="Octubre 2024" title="Aprobación PEI v2" description="Formaliza la plataforma estratégica y despliegue estratégico alineado al PND y ODS." />
          </div>
        )}

        {activeTab === 'procesos' && (
          <div className="space-y-12 animate-fade-in">
            <div className="p-10 bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-700 rounded-[2.5rem] text-center shadow-sm">
              <h4 className="font-bold text-brand-700 dark:text-brand-400 text-xs uppercase tracking-widest mb-4">Enfoques transversales</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium italic">Derechos, Territorial, Diferencial, Étnico-Racial, Género, Interseccional, Justicia Ambiental y Curso de Vida.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              <div className="space-y-4">
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b-2 border-slate-100 dark:border-slate-700 pb-4 text-center tracking-widest uppercase">Procesos estratégicos</h5>
                {PROCESOS_DEFS.estratégicos.map(p => (
                  <button 
                    key={p.n} 
                    onClick={() => setActiveDef({ n: p.n, d: p.def })}
                    className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:shadow-xl transition-all text-left"
                  >
                    <p.icon size={20} className="text-brand-500 shrink-0" /> {p.n}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-brand-600 dark:text-brand-400 text-xs border-b-2 border-brand-100 dark:border-brand-700 pb-4 text-center tracking-widest uppercase">Procesos misionales</h5>
                {PROCESOS_DEFS.misionales.map(p => (
                  <button 
                    key={p.n} 
                    onClick={() => setActiveDef({ n: p.n, d: p.def })}
                    className={`w-full p-5 rounded-3xl shadow-lg text-xs font-black text-left leading-tight transition-transform hover:scale-[1.02] ${p.isCore ? 'bg-brand-50 dark:bg-brand-900/30 border-2 border-brand-300 dark:border-brand-600 text-brand-800 dark:text-brand-200 animate-pulse' : 'bg-brand-600 text-white'}`}
                  >
                    {p.n}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs border-b-2 border-slate-100 dark:border-slate-700 pb-4 text-center tracking-widest uppercase">Procesos de apoyo</h5>
                {PROCESOS_DEFS.apoyo.map(p => (
                  <button 
                    key={p.n} 
                    onClick={() => setActiveDef({ n: p.n, d: p.def })}
                    className="w-full flex items-center gap-4 p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:shadow-xl transition-all text-left"
                  >
                    <p.icon size={20} className="text-slate-400 shrink-0" /> {p.n}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-10">
              {PROCESOS_DEFS.evaluacion.map(p => (
                <button 
                  key={p.n} 
                  onClick={() => setActiveDef({ n: p.n, d: p.def })}
                  className="p-10 bg-slate-900 dark:bg-slate-800 text-white rounded-[2.5rem] flex flex-col items-center hover:bg-slate-800 transition-colors shadow-2xl"
                >
                  <p.icon size={40} className="text-brand-400 mb-4" />
                  <h5 className="font-bold text-xs tracking-widest uppercase text-center">{p.n}</h5>
                </button>
              ))}
            </div>
            <p className="text-center text-slate-400 text-[10px] font-bold tracking-widest uppercase">Haga clic en cualquier proceso para ver su definición completa</p>
          </div>
        )}

        {activeTab === 'organica' && (
          <div className="space-y-12">
            <div className="bg-slate-900 dark:bg-slate-800 p-12 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter">{ORGANIGRAMA.nombre}</h3>
                    <p className="text-brand-400 font-bold tracking-widest text-xs mt-2 uppercase">Nivel directivo superior</p>
                  </div>
                  <button 
                    onClick={() => setExpandedOrg(ORGANIGRAMA.children.map(c => c.id))}
                    className="px-8 py-4 bg-white text-slate-900 rounded-2xl text-xs font-black tracking-widest shadow-lg hover:bg-brand-50 transition-colors"
                  >
                    Expandir todo
                  </button>
               </div>
               <Users size={150} className="absolute right-[-30px] bottom-[-30px] opacity-10 rotate-12" />
            </div>

            <div className="space-y-6">
              {ORGANIGRAMA.children.map(group => (
                <div key={group.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl overflow-hidden">
                  <button 
                    onClick={() => setExpandedOrg(prev => prev.includes(group.id) ? prev.filter(i => i !== group.id) : [...prev, group.id])}
                    className="w-full p-8 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-xl font-black text-slate-800 dark:text-slate-200 tracking-tight">{group.nombre}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.items.length} dependencias</span>
                      {expandedOrg.includes(group.id) ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                    </div>
                  </button>
                  {expandedOrg.includes(group.id) && (
                    <div className="px-8 pb-8 animate-slide-up grid md:grid-cols-2 gap-4 border-t pt-6 border-slate-50 dark:border-slate-700">
                      {group.items.map(item => (
                        <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                          <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'enfoques' && (
          <div className="space-y-12">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl w-fit mx-auto shadow-inner">
               <button onClick={() => setSubTab('enfoques')} className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${subTab === 'enfoques' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xl' : 'text-slate-500'}`}>Enfoques</button>
               <button onClick={() => setSubTab('estrategias')} className={`px-8 py-3 rounded-xl text-xs font-black tracking-widest transition-all ${subTab === 'estrategias' ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xl' : 'text-slate-500'}`}>Estrategias</button>
            </div>

            {subTab === 'enfoques' ? (
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { n: '01', t: 'Derechos', d: 'Personas como titulares de derechos.' },
                  { n: '02', t: 'Territorial', d: 'Territorio como ecosistema social.' },
                  { n: '03', t: 'Diferencial', d: 'Superación de barreras específicas.' },
                  { n: '04', t: 'Étnico-Racial', d: 'Supera el racismo estructural.' },
                  { n: '05', t: 'Género', d: 'Elimina desigualdades de mujeres y LGBTIQ+.' },
                  { n: '06', t: 'Interseccional', d: 'Cruces de múltiples discriminaciones.' },
                  { n: '07', t: 'Justicia Ambiental', d: 'Respuesta justa a crisis climática.' },
                  { n: '08', t: 'Curso de Vida', d: 'Desarrollo humano continuo.' }
                ].map(e => (
                  <div key={e.n} className="text-center space-y-4 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 shadow-xl">
                    <div className="w-14 h-14 bg-brand-500 text-white rounded-full flex items-center justify-center font-black mx-auto shadow-lg text-lg">{e.n}</div>
                    <h5 className="font-black text-slate-800 dark:text-slate-200 text-base tracking-tighter">{e.t}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-snug">{e.d}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                   'Alianzas público-populares', 'Iniciativas productivas', 'Infraestructura para cerrar brechas',
                   'Espacios para la juntanza', 'Cambio cultural y erradicación', 'Abordaje psicosocial y bienestar',
                   'Transmisión de saberes', 'Ecosistema institucional', 'Gobernanza interna',
                   'Condiciones para vida digna', 'Restablecimiento de derechos'
                 ].map(es => (
                   <div key={es} className="p-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-xl hover:border-brand-500 transition-colors flex items-center gap-4">
                      <Zap size={22} className="text-brand-500 shrink-0" />
                      <h5 className="font-black text-slate-800 dark:text-slate-200 text-sm tracking-tight">{es}</h5>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'programas' && (
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700">
               <div className="relative flex-1">
                  <Search size={24} className="absolute left-6 top-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre, población..." 
                    className="w-full pl-16 pr-6 py-4 bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] text-lg font-medium focus:ring-4 focus:ring-brand-500/10 outline-none dark:text-white transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex gap-2 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                  {['*', 'Mujeres', 'Juventud', 'Pobreza', 'Diversidades', 'Étnicos', 'Saberes'].map(f => (
                    <button 
                      key={f} 
                      onClick={() => setFilter(f)}
                      className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${filter === f ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                    >
                      {f === '*' ? 'Todos' : f}
                    </button>
                  ))}
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {filteredProgramas.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl space-y-6 hover:shadow-2xl transition-all">
                   <div className="flex justify-between items-start">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{p.nombre}</h4>
                      <Badge type="brand">{p.viceministerio}</Badge>
                   </div>
                   <p className="text-base text-slate-500 dark:text-slate-400 font-medium italic">"{p.breve}"</p>
                   <Accordion title="Detalle técnico">
                      <div className="space-y-5 pt-4">
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Población objetivo</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-black">{p.poblacion}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dependencia responsable</p>
                          <p className="text-sm text-slate-700 dark:text-slate-300 font-black">{p.dependencia}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estrategia vinculada</p>
                          <p className="text-sm text-brand-600 font-black uppercase tracking-tight">{p.estrategia}</p>
                        </div>
                      </div>
                   </Accordion>
                </div>
              ))}
              {filteredProgramas.length === 0 && (
                <div className="col-span-full py-20 text-center">
                   <Info size={80} className="mx-auto text-slate-200 dark:text-slate-700 mb-6" />
                   <p className="text-slate-400 font-black tracking-widest text-xs uppercase">No se encontraron programas que coincidan con su búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
            <Quiz 
            questions={[
                { id: 1, question: "¿Cuál es el instrumento que formaliza la plataforma estratégica y despliegue del Ministerio?", options: ["Resolución 668 de 2024", "PEI v2", "Manual de funciones"], correctAnswer: 1 },
                { id: 2, question: "¿Cuántos programas estratégicos componen el portafolio programático oficial?", options: ["12 programas", "20 programas", "24 programas"], correctAnswer: 2 },
                { id: 3, question: "¿Qué proceso se encarga de coordinar acciones para una respuesta institucional transformadora?", options: ["Gestión contractual", "Articulación intersectorial", "Gestión de proyectos"], correctAnswer: 1 }
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
