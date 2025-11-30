import React from 'react';
import { Card, Badge, Accordion, Quiz } from '../components/UI';
import { Target, Users, Map, Lightbulb } from 'lucide-react';

export const StrategicModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <Badge type="brand">Módulo 1</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Plataforma Estratégica</h1>
        <p className="text-lg text-slate-600 mt-2">Estructura, misión y portafolio programático del Ministerio de Igualdad y Equidad.</p>
      </div>

      {/* Contexto Educativo: ¿Por qué es importante? */}
      <div className="bg-brand-50 rounded-xl p-5 border border-brand-100 flex gap-4 items-start">
        <div className="bg-white p-2 rounded-full shadow-sm text-brand-600">
            <Lightbulb size={24} />
        </div>
        <div>
            <h3 className="font-bold text-brand-800 text-sm uppercase tracking-wide mb-1">Contexto para el Auditor</h3>
            <p className="text-brand-900 text-sm leading-relaxed">
                Entender la estrategia no es solo teoría. Como auditores, necesitamos conocer el "norte" de la entidad para identificar si los riesgos que evaluamos realmente amenazan el cumplimiento de la misión. Sin estrategia, no hay auditoría basada en riesgos efectiva.
            </p>
        </div>
      </div>

      {/* Mission/Vision Grid Visual */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border-t-4 border-t-brand-500 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-lg">
                    <Target size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Misión</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
                Formular, implementar y evaluar políticas para garantizar el derecho a la igualdad y la equidad, enfocándose en los "nadie" y en territorios históricamente excluidos.
            </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border-t-4 border-t-blue-500 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Map size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Visión</h3>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">
                Ser un hito permanente en la historia de Colombia que transforma, de forma concreta, la vida de poblaciones excluidas mediante la garantía de derechos.
            </p>
        </div>
      </div>

      {/* Visual Org Chart Tree */}
      <Card title="Estructura Organizacional">
        <p className="mb-8 text-slate-600 text-sm">El Ministerio opera bajo un esquema descentralizado y poblacional.</p>
        
        <div className="flex flex-col items-center w-full overflow-x-auto pb-4">
            {/* Level 1 */}
            <div className="border-2 border-brand-600 bg-brand-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg mb-8 relative">
                Despacho de la Ministra
                {/* Connector */}
                <div className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gray-300 -translate-x-1/2"></div>
            </div>

            {/* Level 2: Support Offices */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative w-full max-w-3xl">
                {/* Horizontal Bar */}
                <div className="absolute -top-4 left-10 right-10 h-0.5 bg-gray-300"></div>
                
                {['Control Interno', 'Planeación', 'Jurídica', 'Relacionamiento'].map((off, i) => (
                    <div key={i} className="relative flex flex-col items-center">
                        <div className="absolute -top-4 w-0.5 h-4 bg-gray-300"></div>
                        <div className={`p-3 rounded-lg text-xs font-bold text-center w-full shadow-sm border ${off === 'Control Interno' ? 'bg-brand-50 border-brand-300 text-brand-800 ring-2 ring-brand-200' : 'bg-white border-gray-200 text-slate-600'}`}>
                            {off}
                        </div>
                    </div>
                ))}
            </div>

            {/* Level 3: Viceministerios Title */}
            <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center w-full border-t border-gray-100 pt-4">
                Viceministerios (Misional)
            </div>

            {/* Level 4: Viceministerios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
                {[
                    "Mujeres",
                    "Juventud",
                    "Poblaciones Excluidas",
                    "Diversidades",
                    "Pueblos Étnicos"
                ].map((v, i) => (
                    <div key={i} className="bg-gray-50 hover:bg-white p-4 rounded-xl border border-gray-200 text-center transition-colors">
                        <Users size={20} className="mx-auto text-slate-400 mb-2" />
                        <span className="text-sm font-semibold text-slate-700">{v}</span>
                    </div>
                ))}
            </div>
        </div>
      </Card>

      <Quiz 
        questions={[
            { id: 1, question: "¿Cuál es el enfoque principal de la Misión del Ministerio?", options: ["Infraestructura vial", "Garantía de igualdad y equidad", "Seguridad Nacional"], correctAnswer: 1 },
            { id: 2, question: "¿Cuántos Viceministerios componen la estructura misional?", options: ["3", "5", "7"], correctAnswer: 1 },
            { id: 3, question: "¿A qué nivel pertenece la Oficina de Control Interno?", options: ["Misional", "Apoyo / Estratégico", "Descentralizado"], correctAnswer: 1 }
        ]}
        onComplete={onComplete}
      />
    </div>
  );
};