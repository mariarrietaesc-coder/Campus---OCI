import React from 'react';
import { Card, Badge, Accordion, Quiz } from '../components/UI';
import { Search, AlertTriangle, FileText } from 'lucide-react';

export const ForensicModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <Badge type="brand">Módulo 4</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-2">Auditoría Forense</h1>
        <p className="text-lg text-slate-600 mt-2">Integración de técnicas de investigación para la detección de fraude y corrupción en el sector público.</p>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6">
        <h3 className="text-amber-800 font-bold flex items-center gap-2">
            <AlertTriangle size={20} />
            Importante: Decreto 1600 de 2024
        </h3>
        <p className="text-amber-700 text-sm mt-1">
            Las entidades deben generar procesos de auditoría forense <b>cada dos (2) años</b> e integrarlos al Plan General de Auditoría.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="¿Qué es?">
            <p className="text-slate-600 mb-4">Disciplina especializada que integra contabilidad, derecho y tecnología para <b>prevenir, detectar e investigar</b> hechos de corrupción.</p>
            <div className="flex gap-2">
                <Badge type="success">Preventiva</Badge>
                <Badge type="warning">Detectiva</Badge>
            </div>
        </Card>
        <Card title="Triángulo del Fraude">
            <ul className="space-y-3">
                <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                        <span className="font-bold text-slate-800">Presión</span>
                        <p className="text-xs text-slate-500">Necesidad financiera o incentivo.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">2</div>
                    <div>
                        <span className="font-bold text-slate-800">Oportunidad</span>
                        <p className="text-xs text-slate-500">Controles débiles o ausencia de supervisión.</p>
                    </div>
                </li>
                <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">3</div>
                    <div>
                        <span className="font-bold text-slate-800">Racionalización</span>
                        <p className="text-xs text-slate-500">Justificación interna del acto.</p>
                    </div>
                </li>
            </ul>
        </Card>
      </div>

      <Card title="Etapas de la Auditoría Forense">
        <div className="space-y-2">
            <Accordion title="1. Planeación">
                <p>Definición de objetivos, alcance, riesgos de fraude y equipo multidisciplinario.</p>
            </Accordion>
            <Accordion title="2. Ejecución (Campo)">
                <p>Obtención de evidencia (documental, digital, testimonial). Aplicación de Cadena de Custodia si hay hallazgos con incidencia penal.</p>
            </Accordion>
            <Accordion title="3. Comunicación">
                <p>Informe técnico, objetivo y soportado. Traslado a entes competentes (Fiscalía, Contraloría) cuando aplique.</p>
            </Accordion>
            <Accordion title="4. Seguimiento">
                <p>Verificación de planes de mejora y apoyo en procesos externos.</p>
            </Accordion>
        </div>
      </Card>
      
      <Card title="Rol de la OCI">
        <div className="flex items-start gap-4">
            <Search className="text-brand-600 shrink-0 mt-1" size={24} />
            <div>
                <p className="text-slate-600 text-sm">
                    La OCI <b>no es autoridad penal ni policía judicial</b>. Su rol es evaluar controles, detectar banderas rojas, asegurar evidencia y dar traslado competente. No tipifica delitos ni captura personas.
                </p>
            </div>
        </div>
      </Card>

      <Quiz 
        questions={[
            { id: 1, question: "¿Cuál es la frecuencia mínima de auditorías forenses según D. 1600/2024?", options: ["Anual", "Bienal (cada 2 años)", "Cuando ocurra un fraude"], correctAnswer: 1 },
            { id: 2, question: "Si la OCI encuentra un posible delito, debe:", options: ["Sancionar disciplinariamente", "Archivar el caso", "Documentar y trasladar a entes competentes"], correctAnswer: 2 },
            { id: 3, question: "Elemento del triángulo del fraude referido a controles débiles:", options: ["Presión", "Oportunidad", "Racionalización"], correctAnswer: 1 }
        ]}
        onComplete={onComplete}
      />
    </div>
  );
};