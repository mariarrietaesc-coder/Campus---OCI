import React from 'react';
import { Card, Badge, TimelineItem, Quiz } from '../components/UI';
import { Users, Compass, Heart, BarChart, MessageSquare, Brain, Shield, CheckCircle2 } from 'lucide-react';

export const MIPGModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  
  const dimensions = [
    { id: 1, title: "Talento Humano", icon: Users, color: "text-blue-500", bg: "bg-blue-50", desc: "El activo más importante." },
    { id: 2, title: "Direccionamiento", icon: Compass, color: "text-indigo-500", bg: "bg-indigo-50", desc: "Planeación estratégica." },
    { id: 3, title: "Gestión con Valores", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", desc: "Integridad y ética." },
    { id: 4, title: "Evaluación", icon: BarChart, color: "text-amber-500", bg: "bg-amber-50", desc: "Medición de resultados." },
    { id: 5, title: "Información", icon: MessageSquare, color: "text-cyan-500", bg: "bg-cyan-50", desc: "Transparencia y datos." },
    { id: 6, title: "Conocimiento", icon: Brain, color: "text-violet-500", bg: "bg-violet-50", desc: "Aprendizaje institucional." },
    { id: 7, title: "Control Interno", icon: Shield, color: "text-brand-600", bg: "bg-brand-50", desc: "MECI y líneas de defensa." },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <Badge type="brand">Módulo 2</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">MIPG - Sistema Integrado</h1>
        <p className="text-lg text-slate-600 mt-2">No es solo burocracia. Es el marco que nos permite operar de manera ordenada, ética y eficiente.</p>
      </div>

      {/* Visual Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {dimensions.map((d) => {
            const Icon = d.icon;
            return (
                <div key={d.id} className={`${d.id === 7 ? 'col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-1 border-brand-200 ring-1 ring-brand-100' : 'border-gray-100'} bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all group`}>
                    <div className={`${d.bg} ${d.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon size={20} />
                    </div>
                    <h3 className="font-bold text-slate-800">{d.id}. {d.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{d.desc}</p>
                </div>
            )
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <Card title="Líneas de Defensa (Modelo COSO)">
            <p className="text-sm text-slate-500 mb-4">¿Quién hace qué en el control?</p>
            <div className="space-y-4 relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200"></div>

                <div className="relative pl-14">
                    <div className="absolute left-2 top-0 w-8 h-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center font-bold text-xs text-slate-500 z-10">E</div>
                    <h4 className="font-bold text-slate-800 text-sm">Estratégica (Alta Dirección)</h4>
                    <p className="text-xs text-slate-500">Define políticas y supervisa.</p>
                </div>
                
                <div className="relative pl-14">
                    <div className="absolute left-2 top-0 w-8 h-8 bg-blue-100 border-2 border-blue-500 rounded-full flex items-center justify-center font-bold text-xs text-blue-700 z-10">1</div>
                    <h4 className="font-bold text-slate-800 text-sm">1ra Línea (Gerentes)</h4>
                    <p className="text-xs text-slate-500">Autocontrol. "Yo ejecuto, yo controlo".</p>
                </div>

                <div className="relative pl-14">
                    <div className="absolute left-2 top-0 w-8 h-8 bg-indigo-100 border-2 border-indigo-500 rounded-full flex items-center justify-center font-bold text-xs text-indigo-700 z-10">2</div>
                    <h4 className="font-bold text-slate-800 text-sm">2da Línea (Planeación)</h4>
                    <p className="text-xs text-slate-500">Monitoreo y gestión de riesgos.</p>
                </div>

                <div className="relative pl-14">
                    <div className="absolute left-2 top-0 w-8 h-8 bg-brand-100 border-2 border-brand-500 rounded-full flex items-center justify-center font-bold text-xs text-brand-700 z-10">3</div>
                    <h4 className="font-bold text-brand-800 text-sm">3ra Línea (OCI)</h4>
                    <p className="text-xs text-slate-500">Aseguramiento independiente.</p>
                </div>
            </div>
         </Card>

         <Card title="Hitos Normativos">
             <TimelineItem year="2023" title="Ley 2281" description="Nacimiento del Ministerio." />
             <TimelineItem year="2024" title="Resolución 1022" description="Adopción formal del MIPG." />
             <TimelineItem year="2025" title="Implementación" description="Operación plena del sistema." />
         </Card>
      </div>

      <Quiz 
        questions={[
            { id: 1, question: "¿Qué instrumento mide el desempeño institucional?", options: ["PAI", "FURAG", "SIGEP"], correctAnswer: 1 },
            { id: 2, question: "¿Quién es la 3ra Línea de Defensa?", options: ["Alta Dirección", "Oficina de Planeación", "Oficina de Control Interno"], correctAnswer: 2 },
            { id: 3, question: "¿Cuál dimensión se considera el 'corazón' del MIPG?", options: ["Talento Humano", "Control Interno", "Información"], correctAnswer: 0 }
        ]}
        onComplete={onComplete}
      />
    </div>
  );
};