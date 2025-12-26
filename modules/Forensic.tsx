
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, Accordion } from '../components/UI';
import { 
  Search, AlertTriangle, Lock, Eye, BookOpen, Clock, 
  CheckCircle, ArrowLeft, ArrowRight, LayoutGrid, 
  ShieldAlert, BarChart3, Microscope, Zap, FileWarning,
  Scale, Info, ChevronRight, History, Fingerprint, 
  FileSearch, MessageSquare, HardHat, Gavel, Landmark, Factory
} from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'historia', label: 'Evolución Histórica', icon: History, desc: 'Explora el origen del control y el fraude.' },
  { id: 'conceptos', label: 'Naturaleza del Fraude', icon: Fingerprint, desc: 'Diferencia vital entre Error y Fraude.' },
  { id: 'tecnicas', label: 'Técnicas Forenses', icon: Search, desc: 'Ocular, Verbal, Escrita, Documental y Física.' },
  { id: 'triangulo', label: 'Triángulo del Fraude', icon: Delta, desc: 'Factores psicológicos del defraudador.' },
  { id: 'interes', label: 'Conflicto de Intereses', icon: Scale, desc: 'Art. 40 Código Único Disciplinario.' },
  { id: 'casos', label: 'Casos Reales', icon: FileWarning, desc: 'Análisis de maniobras y hallazgos.' },
  { id: 'evaluacion', label: 'Certificación', icon: CheckCircle, desc: 'Examen de suficiencia técnica.' }
];

function Delta({ size }: { size: number }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 22h20L12 2z"/></svg>; }

const HISTORIA_DETALLE = [
  { 
    era: 'Antigüedad', 
    title: 'Código de Hammurabi', 
    icon: Gavel,
    year: '1750 a.C.',
    contexto: 'En Mesopotamia, los legisladores identificaron los primeros medios fraudulentos para adquirir bienes ajenos.',
    maniobra: 'Alteración de pesas y medidas, y la venta de objetos robados.',
    sancion: 'Penas severas proporcionales al daño (Ley del Talión) para proteger el comercio incipiente.',
    color: 'amber'
  },
  { 
    era: 'India Antigua', 
    title: 'Leyes de Manu', 
    icon: BookOpen,
    year: 'Siglo II a.C.',
    contexto: 'La normativa védica ya castigaba el engaño comercial como una falta grave a la armonía social.',
    maniobra: 'Vender grano de mala calidad por bueno, o cristal de roca teñido como piedra preciosa.',
    sancion: 'Multas y castigos físicos para quienes engañaran con hilos de algodón por seda o hierro por plata.',
    color: 'orange'
  },
  { 
    era: 'Imperio Romano', 
    title: 'Actio Doli y Stellionatus', 
    icon: Landmark,
    year: 'Siglo III d.C.',
    contexto: 'Aparece el "Estelionato" como un crimen extraordinario, separando por primera vez el fraude del simple hurto.',
    maniobra: 'La "Actio Doli" perseguía la astucia o maquinación empleada para alucinar o engañar a otros.',
    sancion: 'Trabajo en las minas para los "humiliores" (clase baja) y destierro temporal para los "honestiores".',
    color: 'red'
  },
  { 
    era: 'Era Industrial', 
    title: 'Codificación Moderna', 
    icon: Factory,
    year: 'Siglo XIX',
    contexto: 'Con la industrialización, el fraude se tipifica como un delito contra el patrimonio y la fe pública.',
    maniobra: 'El Código Francés (1810) destaca el uso de nombres falsos y maniobras fraudulentas complejas.',
    sancion: 'Penas de prisión y responsabilidad civil por daños y perjuicios económicos.',
    color: 'slate'
  }
];

const TECNICAS_DETALLE = [
  { id: 'ocular', name: 'Técnica Ocular', icon: Eye, sub: 'Observación y Comparación', desc: 'Consiste en el examen visual de procesos o activos.', ejemplo: 'Verificar físicamente la existencia de inventarios o comparar firmas.' },
  { id: 'verbal', name: 'Técnica Verbal', icon: MessageSquare, sub: 'Indagación y Entrevista', desc: 'Obtención de información oral mediante entrevistas.', ejemplo: 'Realizar una entrevista forense a un supervisor de contrato.' },
  { id: 'escrita', name: 'Técnica Escrita', icon: FileSearch, sub: 'Análisis de Informes', desc: 'Refleja los hallazgos mediante actas y certificaciones.', ejemplo: 'Documentar pruebas de cumplimiento en actas de visita.' },
  { id: 'documental', name: 'Técnica Documental', icon: BookOpen, sub: 'Análisis de Indicadores', desc: 'Revisión técnica de documentos contables y financieros.', ejemplo: 'Detectar alteraciones en facturas de caja menor.' },
  { id: 'fisica', name: 'Inspección Física', icon: HardHat, sub: 'Reconocimiento de Hechos', desc: 'Constatación directa y material de la situación.', ejemplo: 'Visita técnica a territorio para verificar entrega de kits.' }
];

export const ForensicModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedEra, setSelectedEra] = useState<number | null>(null);
  const [selectedTecnica, setSelectedTecnica] = useState<string | null>(null);
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
    if (id === 'evaluacion' && isLocked) return;
    setActiveTab(id);
    setSelectedEra(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTab === 'menu') {
    return (
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge type="brand">Módulo 4</Badge>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter uppercase">Auditoría Forense</h1>
            <p className="text-slate-500 font-medium text-lg">Criminología aplicada al Control Interno.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 text-brand-600">
            <Clock size={24}/>
            <p className="font-mono font-black text-lg">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const locked = section.id === 'evaluacion' && isLocked;
            return (
              <button
                key={section.id}
                onClick={() => !locked && navigateTo(section.id)}
                className={`group p-8 bg-white rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden ${locked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-brand-500 border-transparent shadow-xl shadow-slate-200/50'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                    {locked ? <Lock size={28}/> : <section.icon size={28}/>}
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
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md py-4 z-20 border-b border-slate-200 px-2">
        <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors">
                <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 uppercase">Módulo 4 - {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS.length}</div>
      </div>

      <main className="min-h-[50vh] px-4">
        
        {/* SECCIÓN 1: HISTORIA INTERACTIVA */}
        {activeTab === 'historia' && (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Línea del Tiempo del Fraude</h3>
                <p className="text-slate-500 font-medium text-lg italic">"Tan pronto como el hombre poseyó un bien, otro lo codició y trató de obtenerlo mediante engaño."</p>
                <p className="text-xs text-brand-600 font-bold uppercase tracking-widest">Haz clic en cada hito para explorar detalles forenses</p>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-slate-200">
                {HISTORIA_DETALLE.map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        {/* Dot Icon */}
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-${item.color}-500 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110`}>
                            <item.icon size={20} />
                        </div>
                        
                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[45%]">
                            <button 
                                onClick={() => setSelectedEra(selectedEra === i ? null : i)}
                                className={`w-full p-6 rounded-[2rem] bg-white border-2 text-left transition-all shadow-sm hover:shadow-xl ${selectedEra === i ? 'border-brand-500 ring-4 ring-brand-50' : 'border-slate-100'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-2 py-0.5 rounded-md">{item.year}</span>
                                    <ChevronRight className={`text-slate-300 transition-transform ${selectedEra === i ? 'rotate-90 text-brand-500' : ''}`} size={20} />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 uppercase leading-none">{item.title}</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{item.era}</p>
                                
                                {selectedEra === i && (
                                    <div className="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-slide-up">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Contexto Histórico</p>
                                            <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.contexto}</p>
                                        </div>
                                        <div className="p-3 bg-brand-50 rounded-xl space-y-1 border border-brand-100">
                                            <p className="text-[10px] font-black text-brand-700 uppercase">Maniobra (M.O.)</p>
                                            <p className="text-xs text-brand-900 italic font-medium">"{item.maniobra}"</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">Consecuencia / Sanción</p>
                                            <p className="text-xs text-slate-700 font-bold">{item.sancion}</p>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <Card className="bg-slate-900 text-white rounded-[2.5rem] p-8 mt-12 overflow-hidden relative">
                <div className="relative z-10 space-y-4">
                    <h4 className="text-2xl font-black uppercase tracking-tighter">¿Sabías qué?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        En el derecho germánico y canónico, el fraude no solo era un delito legal, sino una <strong>ofensa moral profunda</strong> que atentaba contra la fe pública, lo que sentó las bases para el concepto moderno de transparencia en el Estado.
                    </p>
                </div>
                <Info size={120} className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12" />
            </Card>
          </div>
        )}

        {/* SECCIÓN 2: CONCEPTOS (ERROR VS FRAUDE) */}
        {activeTab === 'conceptos' && (
          <div className="space-y-8">
            <Card title="La Clave: Intencionalidad" className="rounded-3xl border-t-8 border-brand-500">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <p className="text-slate-600 text-sm leading-relaxed">Según la <strong>NIA 240</strong>, la diferencia fundamental radica en la <strong>intención reflexionada</strong> del sujeto.</p>
                        <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-100">
                            <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[10px]">
                                <Info size={14}/> Error (Falla involuntaria)
                            </div>
                            <p className="text-xs text-slate-500">Omisión accidental, mal cálculo o interpretación errada de la norma sin ánimo de lucro.</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-2xl space-y-2 border border-red-100">
                            <div className="flex items-center gap-2 text-red-600 font-black uppercase text-[10px]">
                                <ShieldAlert size={14}/> Fraude (Delito de engaño)
                            </div>
                            <p className="text-xs text-slate-500">Acción deliberada para obtener una ventaja injusta o ilegal mediante el uso del engaño.</p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Scale size={120} className="text-brand-100" />
                    </div>
                </div>
            </Card>
          </div>
        )}

        {/* SECCIÓN 3: TÉCNICAS */}
        {activeTab === 'tecnicas' && (
          <div className="space-y-8">
            <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-2">
                    <Badge type="brand">Técnicas de Campo</Badge>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Instrumentos de Investigación</h3>
                    <p className="text-slate-400 text-sm max-w-lg">El auditor forense utiliza métodos científicos para que la evidencia sea aceptada por un juez.</p>
                </div>
                <Search size={120} className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12" />
            </div>

            <div className="grid gap-4">
                {TECNICAS_DETALLE.map((t) => (
                    <div key={t.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden transition-all shadow-sm hover:shadow-lg">
                        <button 
                            onClick={() => setSelectedTecnica(selectedTecnica === t.id ? null : t.id)}
                            className="w-full p-6 text-left flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <t.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{t.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{t.sub}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className={`text-slate-300 transition-transform ${selectedTecnica === t.id ? 'rotate-90 text-brand-500' : ''}`} />
                        </button>
                        {selectedTecnica === t.id && (
                            <div className="px-6 pb-6 animate-slide-up space-y-4">
                                <p className="text-sm text-slate-600 leading-relaxed border-t pt-4 border-slate-50">{t.desc}</p>
                                <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
                                    <span className="font-black text-brand-700 text-[10px] uppercase block mb-1">Aplicación en MinIgualdad:</span>
                                    <p className="text-xs text-slate-700 italic">"{t.ejemplo}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        )}

        {/* SECCIÓN 4: CONFLICTO DE INTERESES */}
        {activeTab === 'interes' && (
          <div className="space-y-8">
            <div className="p-8 bg-amber-50 rounded-[3rem] border border-amber-100 shadow-sm relative overflow-hidden">
                <h3 className="text-2xl font-black text-amber-800 uppercase tracking-tighter mb-4 text-center">El Conflicto de Intereses</h3>
                <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
                    <Card className="rounded-2xl border-l-8 border-amber-500 bg-white shadow-xl">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                            "Existe conflicto de intereses cuando el interés general propio de la función pública entra en conflicto con el interés particular y directo del servidor público."
                        </p>
                        <p className="mt-4 text-[10px] font-black text-amber-600 uppercase tracking-widest">Art. 40 - Código Único Disciplinario (Ley 1952 de 2019)</p>
                    </Card>
                    <div className="grid md:grid-cols-2 gap-4 text-xs font-medium text-slate-600 pt-4">
                        <div className="flex gap-3 items-start bg-white/50 p-3 rounded-xl"><Zap size={18} className="text-amber-500 shrink-0"/> Son inevitables pero deben ser declarados formalmente antes de cualquier actuación.</div>
                        <div className="flex gap-3 items-start bg-white/50 p-3 rounded-xl"><Zap size={18} className="text-amber-500 shrink-0"/> Ponen en riesgo la imparcialidad y la independencia de criterio del equipo de la OCI.</div>
                    </div>
                </div>
                <Scale size={200} className="absolute right-[-40px] bottom-[-40px] text-amber-200 opacity-20" />
            </div>
          </div>
        )}

        {activeTab === 'triangulo' && (
           <div className="space-y-10">
           <div className="text-center max-w-2xl mx-auto">
               <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">¿Por qué alguien defrauda?</h3>
               <p className="text-slate-500 font-medium mt-2">La teoría de Donald Cressey explica los factores psicológicos del fraude.</p>
           </div>
           
           <div className="relative flex justify-center py-10">
               <div className="grid lg:grid-cols-3 gap-8 relative z-10">
                   {[
                       { title: 'Presión', icon: AlertTriangle, desc: 'Necesidades financieras (deudas, adicciones) o presión de jefes por cumplir metas ficticias.', color: 'red' },
                       { title: 'Oportunidad', icon: Lock, desc: 'Fallas en el control interno. La debilidad en la supervisión permite la maniobra sin riesgo.', color: 'brand' },
                       { title: 'Racionalización', icon: Scale, desc: 'Mecanismo de defensa moral: "Es solo un préstamo", "El Estado me paga mal", "Todos lo hacen".', color: 'blue' }
                   ].map((item, i) => (
                       <div key={i} className={`bg-white border-2 border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all group`}>
                           <div className={`w-16 h-16 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                               <item.icon size={32} />
                           </div>
                           <h4 className={`text-xl font-black uppercase text-slate-800 mb-3`}>{item.title}</h4>
                           <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                       </div>
                   ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                   <Delta size={500} />
               </div>
           </div>
         </div>
        )}

        {activeTab === 'casos' && (
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Análisis de Casos Emblemáticos</h3>
                <p className="text-slate-500 font-medium">Haga clic en cada tarjeta para profundizar en el <strong>enfoque forense</strong> del caso.</p>
            </div>

            <div className="grid gap-6">
                {[
                  { name: 'Saludcoop', cifra: '$1.4 Billones', tags: ['Salud', 'Desvío de Recursos'], desc: 'Desvío de recursos de la salud para inversiones privadas.', operandi: 'Se desviaron recursos de la UPC para comprar bienes raíces y patrocinar clubes deportivos, mezclando parafiscales con capital privado.', leccion: 'La OCI debe verificar que los recursos de destinación específica no se mezclen con gasto administrativo.' },
                  { name: 'Cartel de la Hemofilia', cifra: '$86.000 Millones', tags: ['Fraude IPC', 'Población'], desc: 'Cobro de medicamentos para pacientes inexistentes.', operandi: 'Falsificación de bases de datos de pacientes con hemofilia para cobrar a la ADRES medicamentos de alto costo nunca entregados.', leccion: 'La OCI debe validar la existencia física y real de los beneficiarios de programas sociales.' }
                ].map((c, i) => (
                    <div key={i} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
                        <button 
                            onClick={() => setSelectedEra(selectedEra === i ? null : i)}
                            className="w-full p-8 text-left flex justify-between items-center group"
                        >
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-brand-400">
                                    <FileWarning size={32}/>
                                </div>
                                <div>
                                    <div className="flex gap-2 mb-1">
                                        {c.tags.map(t => <span key={t} className="text-[8px] font-black uppercase px-2 py-0.5 bg-brand-50 text-brand-700 rounded-md tracking-wider">{t}</span>)}
                                    </div>
                                    <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{c.name}</h4>
                                    <p className="text-brand-600 font-black text-sm">Daño: {c.cifra}</p>
                                </div>
                            </div>
                            <div className={`p-4 rounded-full bg-slate-50 text-slate-400 transition-transform ${selectedEra === i ? 'rotate-90 text-brand-600 bg-brand-50' : 'group-hover:translate-x-2'}`}>
                                <ChevronRight size={24}/>
                            </div>
                        </button>
                        
                        {selectedEra === i && (
                            <div className="px-8 pb-8 animate-slide-up">
                                <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-slate-800">
                                            <Search size={18} className="text-brand-600"/>
                                            <h5 className="font-black uppercase text-xs">Modus Operandi</h5>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-relaxed font-medium">{c.operandi}</p>
                                    </div>
                                    <div className="space-y-4 bg-brand-50/50 p-6 rounded-2xl">
                                        <div className="flex items-center gap-2 text-brand-800">
                                            <ShieldAlert size={18}/>
                                            <h5 className="font-black uppercase text-xs">Rol de la OCI</h5>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed italic">{c.leccion}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'evaluacion' && (
          <Quiz 
            questions={[
              { id: 1, question: "¿Cuál es la diferencia fundamental entre el error y el fraude según la NIA 240?", options: ["La cuantía del dinero involucrado", "La intención reflexionada del sujeto", "La duración del evento"], correctAnswer: 1 },
              { id: 2, question: "¿Qué técnica forense consiste en la indagación oral con funcionarios o terceros?", options: ["Técnica Ocular", "Técnica Verbal", "Técnica Documental"], correctAnswer: 1 },
              { id: 3, question: "Según el Art. 40 del Código Único Disciplinario, el conflicto de intereses surge cuando:", options: ["El auditor no tiene experiencia técnica", "El interés general choca con un interés particular directo", "La entidad no tiene presupuesto"], correctAnswer: 1 },
              { id: 4, question: "En el Código de Hammurabi, ¿qué conducta fraudulenta ya era sancionada?", options: ["La falsificación de criptomonedas", "La alteración de pesas y medidas", "El espionaje industrial"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
          />
        )}
      </main>

      {/* FOOTER NAVEGACIÓN */}
      {activeTab !== 'evaluacion' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
          <div className="bg-slate-900 text-white p-2 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
            {prevSection ? (
              <button onClick={() => navigateTo(prevSection.id)} className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2" title="Anterior">
                <ArrowLeft size={20} />
              </button>
            ) : <div className="w-12"></div>}
            <button onClick={() => navigateTo('menu')} className="p-4 hover:bg-white/10 rounded-full transition-colors" title="Menú del Módulo">
                <LayoutGrid size={20} />
            </button>
            {nextSection && (
              <button 
                onClick={() => navigateTo(nextSection.id)}
                className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-black uppercase tracking-tighter ${nextSection.id === 'evaluacion' && isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <span className="hidden sm:inline">{nextSection.id === 'evaluacion' ? 'Finalizar' : nextSection.label}</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
