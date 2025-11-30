import React from 'react';
import { Card, Badge, Accordion, Quiz } from '../components/UI';
import { Target, Users, Map } from 'lucide-react';

export const StrategicModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <Badge type="brand">Módulo 1</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Plataforma Estratégica</h1>
        <p className="text-lg text-slate-600 mt-2">Estructura, misión y portafolio programático del Ministerio de Igualdad y Equidad.</p>
      </div>

      {/* Mission/Vision Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-brand-500">
            <div className="flex items-center gap-3 mb-4">
                <Target className="text-brand-600" size={24} />
                <h3 className="text-xl font-bold">Misión</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
                Formular, implementar, coordinar y evaluar políticas, planes, programas y proyectos para avanzar en la garantía del derecho a la igualdad y la equidad, con enfoque de derechos, de género, diferencial, étnico-antirracista, interseccional y territorial.
            </p>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3 mb-4">
                <Map className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold">Visión</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
                Tiene raíces en la historia de Colombia como un hito permanente en la garantía de derechos que transforma, de forma concreta, la vida de poblaciones y territorios históricamente excluidos.
            </p>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
            { n: '5', l: 'Viceministerios' },
            { n: '20', l: 'Direcciones Técnicas' },
            { n: '24', l: 'Programas' },
            { n: '8', l: 'Enfoques' }
        ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm">
                <span className="block text-3xl font-extrabold text-brand-600">{s.n}</span>
                <span className="text-xs font-bold text-slate-500 uppercase">{s.l}</span>
            </div>
        ))}
      </div>

      <Card title="Estructura Organizacional (Simplificada)">
        <p className="mb-4 text-slate-600">El Ministerio se organiza en un esquema descentralizado y poblacional.</p>
        <div className="space-y-2">
            <Accordion title="Despacho de la Ministra">
                <ul className="list-disc pl-5 space-y-1">
                    <li>Oficina de Control Interno (Tercera Línea)</li>
                    <li>Oficina de Planeación</li>
                    <li>Oficina Jurídica</li>
                    <li>Oficina de Relacionamiento Ciudadano</li>
                </ul>
            </Accordion>
            <Accordion title="Viceministerio de las Mujeres">
                <p>Enfoque en prevención de violencias, autonomía económica y garantía de derechos.</p>
            </Accordion>
            <Accordion title="Viceministerio de la Juventud">
                <p>Programa Jóvenes en Paz, Barrismo Social y Oportunidades.</p>
            </Accordion>
            <Accordion title="Viceministerio para Poblaciones y Territorios Excluidos">
                <p>Superación de la pobreza, Cuidado y Población Migrante.</p>
            </Accordion>
            <Accordion title="Viceministerio de las Diversidades">
                <p>Población LGBTIQ+ y Personas con Discapacidad.</p>
            </Accordion>
            <Accordion title="Viceministerio de Pueblos Étnicos">
                <p>Comunidades Negras, Indígenas, Rrom y Campesinado.</p>
            </Accordion>
        </div>
      </Card>

      <Quiz 
        questions={[
            { id: 1, question: "¿Cuál es el enfoque principal de la Misión del Ministerio?", options: ["Desarrollo de infraestructura vial", "Garantía del derecho a la igualdad y equidad", "Seguridad Nacional"], correctAnswer: 1 },
            { id: 2, question: "¿Cuántos Viceministerios componen la estructura?", options: ["3", "5", "7"], correctAnswer: 1 },
            { id: 3, question: "¿Qué oficina lidera la Tercera Línea de Defensa?", options: ["Planeación", "Jurídica", "Control Interno"], correctAnswer: 2 }
        ]}
        onComplete={onComplete}
      />
    </div>
  );
};