import React from 'react';
import { Card, Badge, Accordion, Quiz, FeedbackForm } from '../components/UI';
import { Shield, Book, Globe } from 'lucide-react';

export const StandardsModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <Badge type="brand">Módulo 3</Badge>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mt-2">Normas Globales 2024 (IIA)</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Nuevo marco internacional para la práctica profesional de la auditoría interna.</p>
      </div>

      {/* Intro Cards */}
      <div className="grid md:grid-cols-3 gap-4">
         <Card className="text-center">
            <Globe className="mx-auto text-brand-500 mb-2" size={32}/>
            <h3 className="font-bold text-lg dark:text-white">Globales</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Aplicables a cualquier función de auditoría.</p>
         </Card>
         <Card className="text-center">
            <Shield className="mx-auto text-brand-500 mb-2" size={32}/>
            <h3 className="font-bold text-lg dark:text-white">Obligatorias</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Principios y normas de cumplimiento.</p>
         </Card>
         <Card className="text-center">
            <Book className="mx-auto text-brand-500 mb-2" size={32}/>
            <h3 className="font-bold text-lg dark:text-white">Temáticas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Requisitos específicos (Ciberseguridad, etc).</p>
         </Card>
      </div>

      <Card title="Los 5 Dominios de las Normas 2024">
        <div className="space-y-3">
            <Accordion title="I. Propósito de la Auditoría Interna">
                <p>Asegurar que la función tenga un mandato claro, aprobado por el CICCI, con un propósito definido orientado a fortalecer la gobernanza, gestión de riesgos y control.</p>
            </Accordion>
            <Accordion title="II. Ética y Profesionalismo">
                <p>Integridad, Objetividad, Competencia, Debido Cuidado Profesional y Confidencialidad. Base del comportamiento del auditor.</p>
            </Accordion>
            <Accordion title="III. Gobierno de la Función">
                <p>Relación con la Alta Dirección y el Consejo (CICCI). Independencia, recursos suficientes y supervisión de calidad.</p>
            </Accordion>
            <Accordion title="IV. Gestión de la Función">
                <p>Planificación estratégica, gestión de recursos, comunicación eficaz y mejora continua (PAMC).</p>
            </Accordion>
            <Accordion title="V. Desempeño de los Servicios">
                <p>Planificación, ejecución y comunicación de trabajos de aseguramiento y consultoría. Evidencia suficiente y relevante.</p>
            </Accordion>
        </div>
      </Card>

      <div className="bg-slate-900 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Competencias Clave del Auditor</h3>
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-bold text-brand-300 mb-2">Técnicas</h4>
                <ul className="text-slate-300 text-sm space-y-2 list-disc pl-5">
                    <li>Conocimiento del IPPF / Normas Globales.</li>
                    <li>Análisis de datos y herramientas digitales.</li>
                    <li>Redacción de informes de alto impacto.</li>
                    <li>Evaluación de riesgos y controles.</li>
                </ul>
            </div>
            <div>
                <h4 className="font-bold text-brand-300 mb-2">Blandas (Soft Skills)</h4>
                <ul className="text-slate-300 text-sm space-y-2 list-disc pl-5">
                    <li>Pensamiento crítico y escepticismo.</li>
                    <li>Comunicación asertiva y negociación.</li>
                    <li>Ética e integridad inquebrantable.</li>
                    <li>Adaptabilidad al cambio.</li>
                </ul>
            </div>
        </div>
      </div>

      <Quiz 
        questions={[
            { id: 1, question: "¿Cuántos dominios tienen las Normas Globales 2024?", options: ["3", "5", "10"], correctAnswer: 1 },
            { id: 2, question: "El principio de 'Debido Cuidado Profesional' pertenece al dominio:", options: ["Propósito", "Ética y Profesionalismo", "Gestión"], correctAnswer: 1 },
            { id: 3, question: "¿Qué competencia es técnica?", options: ["Liderazgo", "Análisis de Datos", "Empatía"], correctAnswer: 1 }
        ]}
        onComplete={onComplete}
      />
      
      <FeedbackForm moduleName="Normas Globales IIA" />
    </div>
  );
};