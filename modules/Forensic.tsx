
import React, { useState } from 'react';
import { Card, Badge, Quiz } from '../components/UI';
import { 
  Search, Eye, BookOpen, 
  CheckCircle, ArrowLeft, ArrowRight, LayoutGrid, 
  ShieldAlert, FileWarning,
  Scale, Info, ChevronRight, History, Fingerprint, 
  FileSearch, MessageSquare, HardHat, Gavel, Landmark, Factory, Zap
} from 'lucide-react';
import { QuizState } from '../types';

const SECTIONS = [
  { id: 'historia', label: 'Evolución histórica', icon: History, desc: 'Explora el origen del control y el fraude.' },
  { id: 'conceptos', label: 'Naturaleza del fraude', icon: Fingerprint, desc: 'Diferencia vital entre error y fraude.' },
  { id: 'tecnicas', label: 'Técnicas forenses', icon: Search, desc: 'Ocular, verbal, escrita, documental y física.' },
  { id: 'triangulo', label: 'Triángulo del fraude', icon: Delta, desc: 'Factores psicológicos del defraudador.' },
  { id: 'interes', label: 'Conflicto de intereses', icon: Scale, desc: 'Art. 40 Código Único Disciplinario.' },
  { id: 'casos', label: 'Casos reales', icon: FileWarning, desc: 'Análisis de maniobras y hallazgos.' },
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
    era: 'India antigua', 
    title: 'Leyes de Manu', 
    icon: BookOpen,
    year: 'Siglo II a.C.',
    contexto: 'La normativa védica ya castigaba el engaño comercial como una falta grave a la armonía social.',
    maniobra: 'Vender grano de mala calidad por bueno, o cristal de roca teñido como piedra preciosa.',
    sancion: 'Multas y castigos físicos para quienes engañaran con hilos de algodón por seda o hierro por plata.',
    color: 'orange'
  },
  { 
    era: 'Imperio romano', 
    title: 'Actio Doli y Stellionatus', 
    icon: Landmark,
    year: 'Siglo III d.C.',
    contexto: 'Aparece el "Estelionato" como un crimen extraordinario, separando por primera vez el fraude del simple hurto.',
    maniobra: 'La "Actio Doli" perseguía la astucia o maquinación empleada para alucinar o engañar a otros.',
    sancion: 'Trabajo en las minas para los "humiliores" (clase baja) y destierro temporal para los "honestiores".',
    color: 'red'
  },
  { 
    era: 'Era industrial', 
    title: 'Codificación moderna', 
    icon: Factory,
    year: 'Siglo XIX',
    contexto: 'Con la industrialización, el fraude se tipifica como un delito contra el patrimonio y la fe pública.',
    maniobra: 'El Código Francés (1810) destaca el uso de nombres falsos y maniobras fraudulentas complejas.',
    sancion: 'Penas de prisión y responsabilidad civil por daños y perjuicios económicos.',
    color: 'slate'
  }
];

const TECNICAS_DETALLE = [
  { id: 'ocular', name: 'Técnica ocular', icon: Eye, sub: 'Observación y comparación', desc: 'Consiste en el examen visual de procesos o activos.', ejemplo: 'Verificar físicamente la existencia de inventarios o comparar firmas.' },
  { id: 'verbal', name: 'Técnica verbal', icon: MessageSquare, sub: 'Indagación y entrevista', desc: 'Obtención de información oral mediante entrevistas.', ejemplo: 'Realizar una entrevista forense a un supervisor de contrato.' },
  { id: 'escrita', name: 'Técnica escrita', icon: FileSearch, sub: 'Análisis de informes', desc: 'Refleja los hallazgos mediante actas y certificaciones.', ejemplo: 'Documentar pruebas de cumplimiento en actas de visita.' },
  { id: 'documental', name: 'Técnica documental', icon: BookOpen, sub: 'Análisis de indicadores', desc: 'Revisión técnica de documentos contables y financieros.', ejemplo: 'Detectar alteraciones en facturas de caja menor.' },
  { id: 'fisica', name: 'Inspección física', icon: HardHat, sub: 'Reconocimiento de hechos', desc: 'Constatación directa y material de la situación.', ejemplo: 'Visita técnica a territorio para verificar entrega de kits.' }
];

export const ForensicModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [selectedEra, setSelectedEra] = useState<number | null>(null);
  const [selectedTecnica, setSelectedTecnica] = useState<string | null>(null);
  
  // Temporizador desactivado
  const isLocked = false;

  const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);
  const nextSection = SECTIONS[currentIndex + 1];
  const prevSection = SECTIONS[currentIndex - 1];

  const navigateTo = (id: string) => {
    setActiveTab(id);
    setSelectedEra(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTab === 'menu') {
    return (
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-700 pb-12">
          <div>
            <Badge type="brand" className="mb-4">Módulo 4</Badge>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Auditoría forense</h1>
            <p className="text-slate-500 font-medium text-lg mt-4">Criminología aplicada al control interno.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((section, i) => {
            return (
              <button
                key={section.id}
                onClick={() => navigateTo(section.id)}
                className={`group p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 transition-all text-left shadow-xl hover:border-brand-500 border-transparent active:scale-95`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 bg-brand-50 text-brand-600`}>
                    <section.icon size={26}/>
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
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Módulo 4 - {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS.length}</div>
      </div>

      <main className="min-h-[50vh] px-2 md:px-0">
        
        {activeTab === 'historia' && (
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Línea del tiempo del fraude</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-lg italic">"Tan pronto como el hombre poseyó un bien, otro lo codició y trató de obtenerlo mediante engaño."</p>
                <p className="text-xs text-brand-600 font-bold tracking-widest uppercase">Haz clic en cada hito para explorar detalles forenses</p>
            </div>

            <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-slate-200">
                {HISTORIA_DETALLE.map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-${item.color}-500 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform group-hover:scale-110`}>
                            <item.icon size={20} />
                        </div>
                        
                        <div className="w-[calc(100%-4rem)] md:w-[45%]">
                            <button 
                                onClick={() => setSelectedEra(selectedEra === i ? null : i)}
                                className={`w-full p-6 rounded-[2rem] bg-white dark:bg-slate-800 border-2 text-left transition-all shadow-sm hover:shadow-xl ${selectedEra === i ? 'border-brand-500 ring-4 ring-brand-50 dark:ring-brand-900/20' : 'border-slate-100 dark:border-slate-700'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold text-brand-600 tracking-wider bg-brand-50 dark:bg-brand-900/30 px-2 py-0.5 rounded-md">{item.year}</span>
                                    <ChevronRight className={`text-slate-300 transition-transform ${selectedEra === i ? 'rotate-90 text-brand-500' : ''}`} size={20} />
                                </div>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white leading-none">{item.title}</h4>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{item.era}</p>
                                
                                {selectedEra === i && (
                                    <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-700 space-y-4 animate-slide-up">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contexto histórico</p>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.contexto}</p>
                                        </div>
                                        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-xl space-y-1 border border-brand-100 dark:border-brand-800">
                                            <p className="text-[10px] font-bold text-brand-700 uppercase tracking-widest">Maniobra (M.O.)</p>
                                            <p className="text-xs text-brand-900 dark:text-brand-400 italic font-medium">"{item.maniobra}"</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Consecuencia / sanción</p>
                                            <p className="text-xs text-slate-700 dark:text-slate-300 font-bold">{item.sancion}</p>
                                        </div>
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <Card className="bg-slate-900 dark:bg-black text-white rounded-[2.5rem] p-8 mt-12 overflow-hidden relative">
                <div className="relative z-10 space-y-4">
                    <h4 className="text-2xl font-black tracking-tighter">¿Sabías qué?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                        En el derecho germánico y canónico, el fraude no solo era un delito legal, sino una <b>ofensa moral profunda</b> que atentaba contra la fe pública, lo que sentó las bases para el concepto moderno de transparencia en el Estado.
                    </p>
                </div>
                <Info size={120} className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12" />
            </Card>
          </div>
        )}

        {activeTab === 'conceptos' && (
          <div className="space-y-8">
            <Card title="La clave: intencionalidad" className="rounded-3xl border-t-8 border-brand-500">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Según la <strong>NIA 240</strong>, la diferencia fundamental radica en la <strong>intención reflexionada</strong> del sujeto.</p>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-2 border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">
                                <Info size={14}/> Error (falla involuntaria)
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Omisión accidental, mal cálculo o interpretación errada de la norma sin ánimo de lucro.</p>
                        </div>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl space-y-2 border border-red-100 dark:border-red-900/30">
                            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-[10px] uppercase tracking-widest">
                                <ShieldAlert size={14}/> Fraude (delito de engaño)
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Acción deliberada para obtener una ventaja injusta o ilegal mediante el uso del engaño.</p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Scale size={120} className="text-brand-100 dark:text-brand-900/20" />
                    </div>
                </div>
            </Card>
          </div>
        )}

        {activeTab === 'tecnicas' && (
          <div className="space-y-8">
            <div className="bg-slate-900 dark:bg-black p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 space-y-2">
                    <Badge type="brand">Técnicas de campo</Badge>
                    <h3 className="text-3xl font-black tracking-tighter">Instrumentos de investigación</h3>
                    <p className="text-slate-400 text-sm max-w-lg">El auditor forense utiliza métodos científicos para que la evidencia sea aceptada por un juez.</p>
                </div>
                <Search size={120} className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12" />
            </div>

            <div className="grid gap-4">
                {TECNICAS_DETALLE.map((t) => (
                    <div key={t.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden transition-all shadow-sm hover:shadow-lg">
                        <button 
                            onClick={() => setSelectedTecnica(selectedTecnica === t.id ? null : t.id)}
                            className="w-full p-6 text-left flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <t.icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight">{t.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.sub}</p>
                                </div>
                            </div>
                            <ChevronRight size={20} className={`text-slate-300 transition-transform ${selectedTecnica === t.id ? 'rotate-90 text-brand-500' : ''}`} />
                        </button>
                        {selectedTecnica === t.id && (
                            <div className="px-6 pb-6 animate-slide-up space-y-4">
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t pt-4 border-slate-50 dark:border-slate-700">{t.desc}</p>
                                <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-2xl border border-brand-100 dark:border-brand-800">
                                    <span className="font-bold text-brand-700 dark:text-brand-400 text-[10px] block mb-1 uppercase tracking-widest">Aplicación en MinIgualdad:</span>
                                    <p className="text-xs text-slate-700 dark:text-slate-300 italic">"{t.ejemplo}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'interes' && (
          <div className="space-y-8">
            <div className="p-8 bg-amber-50 dark:bg-amber-900/20 rounded-[3rem] border border-amber-100 dark:border-amber-900/30 shadow-sm relative overflow-hidden">
                <h3 className="text-2xl font-black text-amber-800 dark:text-amber-400 tracking-tighter mb-4 text-center">El conflicto de intereses</h3>
                <div className="space-y-4 relative z-10 max-w-2xl mx-auto">
                    <Card className="rounded-2xl border-l-8 border-amber-500 bg-white dark:bg-slate-800 shadow-xl">
                        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                            "Existe conflicto de intereses cuando el interés general propio de la función pública entra en conflicto con el interés particular y directo del servidor público."
                        </p>
                        <p className="mt-4 text-[10px] font-bold text-amber-600 tracking-widest uppercase">Art. 40 - Código Único Disciplinario (Ley 1952 de 2019)</p>
                    </Card>
                    <div className="grid md:grid-cols-2 gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-4">
                        <div className="flex gap-3 items-start bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl"><Zap size={18} className="text-amber-500 shrink-0"/> Son inevitables pero deben ser declarados formalmente antes de cualquier actuación.</div>
                        <div className="flex gap-3 items-start bg-white/50 dark:bg-slate-800/50 p-3 rounded-xl"><Zap size={18} className="text-amber-500 shrink-0"/> Ponen en riesgo la imparcialidad y la independencia de criterio del equipo de la OCI.</div>
                    </div>
                </div>
                <Scale size={200} className="absolute right-[-40px] bottom-[-40px] text-amber-200 dark:text-amber-900 opacity-20" />
            </div>
          </div>
        )}

        {activeTab === 'evaluacion' && (
          <Quiz 
            questions={[
              { id: 1, question: "¿Cuál es el diferencia fundamental entre el error y el fraude según la NIA 240?", options: ["La cuantía del dinero involucrado", "La intención reflexionada del sujeto", "La duración del evento"], correctAnswer: 1 },
              { id: 2, question: "¿Qué técnica forense consiste en la indagación oral con funcionarios o terceros?", options: ["Técnica ocular", "Técnica verbal", "Técnica documental"], correctAnswer: 1 },
              { id: 3, question: "Según el Art. 40 del Código Único Disciplinario, el conflicto de intereses surge cuando:", options: ["El auditor no tiene experiencia técnica", "El interés general choca con un interés particular directo", "La entidad no tiene presupuesto"], correctAnswer: 1 },
              { id: 4, question: "En el Código de Hammurabi, ¿qué conducta fraudulenta ya era sancionada?", options: ["La falsificación de criptomonedas", "La alteración de pesas y medidas", "El espionaje industrial"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
          />
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-2 rounded-full shadow-2xl flex items-center justify-between border border-white/10">
          {prevSection ? (
            <button onClick={() => navigateTo(prevSection.id)} className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2" title="Anterior">
              <ArrowLeft size={20} />
            </button>
          ) : <div className="w-12"></div>}
          <button onClick={() => navigateTo('menu')} className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors" title="Menú del módulo">
              <LayoutGrid size={20} />
          </button>
          {nextSection && (
            <button 
              onClick={() => navigateTo(nextSection.id)}
              className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-bold tracking-tighter`}
            >
              <span>{nextSection.id === 'evaluacion' ? 'Finalizar' : 'Siguiente'}</span>
              <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
