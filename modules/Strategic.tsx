import React, { useState } from 'react';
import { Card, Badge, Quiz, FeedbackForm, TimelineItem } from '../components/UI';
import { Target, Map, Layout, Scale, Users, FileText, ChevronRight } from 'lucide-react';

export const StrategicModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'structure' | 'normative' | 'programs'>('identity');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-4">
        <Badge type="brand">Módulo 1</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Plataforma Estratégica</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Identidad, estructura y portafolio programático del Ministerio.</p>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-slate-700">
        {[
            { id: 'identity', label: 'Identidad', icon: Target },
            { id: 'structure', label: 'Estructura', icon: Layout },
            { id: 'normative', label: 'Normatividad', icon: Scale },
            { id: 'programs', label: 'Programas (24)', icon: FileText },
        ].map((tab) => {
            const Icon = tab.icon;
            return (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-brand-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                >
                    <Icon size={16} /> {tab.label}
                </button>
            )
        })}
      </div>

      <div className="min-h-[400px]">
        
        {/* TAB 1: IDENTIDAD */}
        {activeTab === 'identity' && (
            <div className="space-y-6 animate-fade-in">
                <div className="bg-brand-50 dark:bg-brand-900/20 p-6 rounded-2xl border border-brand-100 dark:border-brand-800">
                    <h3 className="text-brand-800 dark:text-brand-300 font-bold uppercase tracking-wide text-sm mb-2">Contexto</h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        El Ministerio de Igualdad y Equidad es la entidad encargada de diseñar, formular, adoptar, dirigir, coordinar y ejecutar las políticas, planes y programas para 
                        <span className="font-bold"> eliminar las desigualdades económicas, políticas y sociales</span>.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Target size={100} className="text-brand-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Misión</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
                            Formular, implementar, coordinar y evaluar políticas, planes, programas y proyectos para avanzar en la garantía del derecho a la igualdad y la equidad, 
                            con enfoque de derechos, de género, diferencial, étnico-antirracista, interseccional y territorial, enfocándose en los "nadie" y en territorios históricamente excluidos.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Map size={100} className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 relative z-10">Visión</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed relative z-10">
                            Ser un hito permanente en la historia de Colombia que transforma, de forma concreta, la vida de poblaciones y territorios históricamente excluidos, 
                            haciendo tangible la igualdad y la equidad mediante la garantía de derechos.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Enfoque de Derechos', 'Territorial', 'Diferencial', 'Étnico-Racial', 'Género', 'Interseccional', 'Justicia Ambiental', 'Curso de Vida'].map((item, i) => (
                        <div key={i} className="bg-gray-50 dark:bg-slate-800/50 p-3 rounded-xl text-center border border-gray-200 dark:border-slate-700">
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* TAB 2: ESTRUCTURA */}
        {activeTab === 'structure' && (
            <div className="animate-fade-in space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-brand-200 dark:border-brand-800 text-center">
                        <span className="block text-3xl font-extrabold text-brand-600 dark:text-brand-400">5</span>
                        <span className="text-xs uppercase text-slate-500 font-bold">Viceministerios</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
                        <span className="block text-3xl font-extrabold text-slate-700 dark:text-white">20</span>
                        <span className="text-xs uppercase text-slate-500 font-bold">Direcciones Técnicas</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
                        <span className="block text-3xl font-extrabold text-slate-700 dark:text-white">32</span>
                        <span className="text-xs uppercase text-slate-500 font-bold">Direcciones Territoriales</span>
                    </div>
                </div>

                <Card title="Organigrama Misional (Decreto 1075)">
                    <div className="flex flex-col gap-4">
                        <div className="p-4 bg-brand-600 text-white font-bold rounded-xl text-center shadow-lg mx-auto w-full md:w-1/2">
                            Despacho de la Ministra
                        </div>
                        <div className="h-6 w-0.5 bg-gray-300 dark:bg-slate-600 mx-auto"></div>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                             {[
                                { t: "Viceministerio de las Mujeres", c: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
                                { t: "Viceministerio de la Juventud", c: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
                                { t: "Viceministerio Poblaciones Excluidas", c: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
                                { t: "Viceministerio de Diversidades", c: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
                                { t: "Viceministerio Pueblos Étnicos", c: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
                             ].map((vm, i) => (
                                 <div key={i} className={`p-3 rounded-lg font-bold text-center border ${vm.c} flex items-center justify-center`}>
                                     {vm.t}
                                 </div>
                             ))}
                        </div>
                        
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                            <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">Órganos de Asesoría y Control</h4>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <Badge>Oficina de Control Interno</Badge>
                                <span className="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">Planeación</span>
                                <span className="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">Jurídica</span>
                                <span className="text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded border border-gray-200 dark:border-slate-600">Control Disciplinario</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        )}

        {/* TAB 3: NORMATIVIDAD */}
        {activeTab === 'normative' && (
            <div className="animate-fade-in space-y-4">
                 <TimelineItem year="Ene 2023" title="Ley 2281" description="Creación del Ministerio. Define objeto y competencias." />
                 <TimelineItem year="May 2023" title="Ley 2294 (PND)" description="Plan Nacional de Desarrollo: Colombia potencia mundial de la vida." />
                 <TimelineItem year="Jun 2023" title="Decreto 1075" description="Estructura Orgánica: Define funciones de despachos y direcciones." />
                 <TimelineItem year="Jun 2023" title="Decreto 1076" description="Planta de Personal (Fase 1)." />
                 <TimelineItem year="Ago 2023" title="Resolución 003" description="Adopción del Manual de Funciones." />
                 <TimelineItem year="Sep 2024" title="Resolución 668" description="Adopción de los 8 Enfoques Transversales." />
                 <TimelineItem year="Sep 2024" title="Resolución 669" description="Estrategias transformadoras (Alianzas, Iniciativas productivas, etc)." />
            </div>
        )}

        {/* TAB 4: PROGRAMAS */}
        {activeTab === 'programs' && (
            <div className="animate-fade-in">
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800 mb-4 flex gap-3">
                     <FileText className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                     <div>
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">Portafolio Programático</h4>
                        <p className="text-indigo-800 dark:text-indigo-200 text-xs">24 programas estratégicos diseñados para cerrar brechas de desigualdad.</p>
                     </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 h-96 overflow-y-auto pr-2">
                    {[
                        {n: "Hambre Cero", v: "Pobreza"}, {n: "Agua es Vida", v: "Pobreza"},
                        {n: "Jóvenes en Paz", v: "Juventud"}, {n: "Casas de la Dignidad", v: "Mujeres"},
                        {n: "Autonomía Económica", v: "Mujeres"}, {n: "Colombia sin Barreras", v: "Diversidades"},
                        {n: "Herencia Viva (NARP)", v: "Étnicos"}, {n: "Saberes Ancestrales", v: "Étnicos"},
                        {n: "Tierra Campesina", v: "Étnicos"}, {n: "Pactos Territoriales", v: "Pobreza"}
                    ].map((p, i) => (
                        <div key={i} className="p-3 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg flex justify-between items-center group hover:border-brand-200 transition-colors">
                            <span className="font-medium text-sm text-slate-700 dark:text-slate-300">{p.n}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">{p.v}</span>
                        </div>
                    ))}
                    <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg text-center text-xs text-slate-500 flex items-center justify-center italic">
                        + 14 programas adicionales...
                    </div>
                </div>
            </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700">
        <Quiz 
            questions={[
                { id: 1, question: "¿Cuál ley creó el Ministerio de Igualdad y Equidad?", options: ["Ley 100", "Ley 2281 de 2023", "Ley 87 de 1993"], correctAnswer: 1 },
                { id: 2, question: "¿Cuántos programas estratégicos conforman el portafolio actual?", options: ["10", "24", "32"], correctAnswer: 1 },
                { id: 3, question: "¿Qué decreto define la estructura orgánica del Ministerio?", options: ["Decreto 1075 de 2023", "Decreto 1499", "Decreto 1600"], correctAnswer: 0 }
            ]}
            onComplete={onComplete}
        />
      </div>
      
      <FeedbackForm moduleName="Plataforma Estratégica" />
    </div>
  );
};