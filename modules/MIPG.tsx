import React from 'react';
import { Card, Badge, TimelineItem, Quiz } from '../components/UI';

export const MIPGModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <Badge type="brand">Módulo 2</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">MIPG - Sistema Integrado de Gestión</h1>
        <p className="text-lg text-slate-600 mt-2">Marco de referencia para dirigir, planear, ejecutar, hacer seguimiento, evaluar y controlar la gestión.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-brand-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Las 7 Dimensiones del MIPG</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                "1. Talento Humano",
                "2. Direccionamiento Estratégico",
                "3. Gestión con Valores",
                "4. Evaluación de Resultados",
                "5. Información y Comunicación",
                "6. Gestión del Conocimiento",
                "7. Control Interno"
            ].map((d, i) => (
                <div key={i} className={`p-4 rounded-xl border ${i === 6 ? 'bg-brand-50 border-brand-200 text-brand-800 font-bold' : 'bg-gray-50 border-gray-100 text-slate-600'}`}>
                    {d}
                </div>
            ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
         <Card title="Hitos en el Ministerio">
            <div className="mt-4">
                <TimelineItem year="2023" title="Creación (Ley 2281)" description="Nace el Ministerio con la obligación de adoptar marcos de gestión pública." />
                <TimelineItem year="2024" title="Resolución 1022" description="Adopción formal del MIPG y constitución del SIG-MIPG." />
                <TimelineItem year="2025" title="Manual Operativo" description="Implementación de documentos internos (ES_A-MS-001)." />
            </div>
         </Card>

         <Card title="Líneas de Defensa">
            <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <span className="text-xs font-bold text-blue-600 uppercase">Estratégica</span>
                    <p className="font-bold text-slate-800">Alta Dirección</p>
                    <p className="text-sm text-slate-600">Define marco general y supervisa.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 ml-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">1ra Línea</span>
                    <p className="font-bold text-slate-800">Gerentes y Líderes</p>
                    <p className="text-sm text-slate-600">Autocontrol en la operación diaria.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 ml-4">
                    <span className="text-xs font-bold text-gray-500 uppercase">2da Línea</span>
                    <p className="font-bold text-slate-800">Planeación / Riesgos</p>
                    <p className="text-sm text-slate-600">Autoevaluación y monitoreo transversal.</p>
                </div>
                <div className="p-4 bg-brand-50 rounded-xl border border-brand-200 ml-4">
                    <span className="text-xs font-bold text-brand-600 uppercase">3ra Línea</span>
                    <p className="font-bold text-slate-800">Oficina Control Interno</p>
                    <p className="text-sm text-slate-600">Evaluación independiente y objetiva.</p>
                </div>
            </div>
         </Card>
      </div>

      <Quiz 
        questions={[
            { id: 1, question: "¿Qué instrumento mide el desempeño institucional (MIPG)?", options: ["PAI", "FURAG", "SIGEP"], correctAnswer: 1 },
            { id: 2, question: "¿Quién es responsable de la 3ra Línea de Defensa?", options: ["Planeación", "Todos los servidores", "Oficina de Control Interno"], correctAnswer: 2 },
            { id: 3, question: "¿Qué dimensión es el corazón del MIPG?", options: ["Talento Humano", "Control Interno", "Gestión con Valores"], correctAnswer: 0 }
        ]}
        onComplete={onComplete}
      />
    </div>
  );
};