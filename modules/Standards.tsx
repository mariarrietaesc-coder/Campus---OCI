import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, Callout, EvidenceItem } from '../components/UI';
import { IIA_LOGO_BASE64 } from '../components/LogoData';
import { 
  ArrowLeft, ArrowRight, BookOpen, Scale, Landmark, Settings, 
  Activity, FileCheck, LayoutGrid, Clock, X, Info, Lock, ShieldCheck
} from 'lucide-react';
import { QuizState } from '../types';

// --- GEOMETRÍA DEL DIAGRAMA ---
const outerR = 150, innerR = 92;
const cornerRadius = 8;
const padTopDeg = 4.0, padBottomDeg = 3.2;
const radioAnilloVerde = 170;
const radioAnilloExterno = 205;
const gapDeg = 5.2; 
const startOffset = -126;
const rad = Math.PI / 180;

const roundedRingSegmentPath = (Ro: number, Ri: number, a0: number, a1: number, cr: number) => {
  cr = Math.min(cr, (Ro - Ri) / 2);
  const ao_outer = Math.asin(cr / Ro);
  const ao_inner = Math.asin(cr / Ri);
  const cos_a0 = Math.cos(a0), sin_a0 = Math.sin(a0);
  const cos_a1 = Math.cos(a1), sin_a1 = Math.sin(a1);
  const p_tl_arc_start = { x: Ro * Math.cos(a0 + ao_outer), y: Ro * Math.sin(a0 + ao_outer) };
  const p_tr_arc_end = { x: Ro * Math.cos(a1 - ao_outer), y: Ro * Math.sin(a1 - ao_outer) };
  const p_br_arc_start = { x: Ri * Math.cos(a1 - ao_inner), y: Ri * Math.sin(a1 - ao_inner) };
  const p_bl_arc_end = { x: Ri * Math.cos(a0 + ao_inner), y: Ri * Math.sin(a0 + ao_inner) };
  const p_tl_line_end = { x: (Ro - cr) * cos_a0, y: (Ro - cr) * sin_a0 };
  const p_tr_line_start = { x: (Ro - cr) * cos_a1, y: (Ro - cr) * sin_a1 };
  const p_br_line_end = { x: (Ri + cr) * cos_a1, y: (Ri + cr) * sin_a1 };
  const p_bl_line_start = { x: (Ri + cr) * cos_a0, y: (Ri + cr) * sin_a0 };
  const largeArc = (a1 - a0) > Math.PI ? 1 : 0;
  return [
    `M ${p_bl_line_start.x} ${p_bl_line_start.y}`,
    `L ${p_tl_line_end.x} ${p_tl_line_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_tl_arc_start.x} ${p_tl_arc_start.y}`,
    `A ${Ro} ${Ro} 0 ${largeArc} 1 ${p_tr_arc_end.x} ${p_tr_arc_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_tr_line_start.x} ${p_tr_line_start.y}`,
    `L ${p_br_line_end.x} ${p_br_line_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_br_arc_start.x} ${p_br_arc_start.y}`,
    `A ${Ri} ${Ri} 0 ${largeArc} 0 ${p_bl_arc_end.x} ${p_bl_arc_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_bl_line_start.x} ${p_bl_line_start.y}`,
    `Z`
  ].join(' ');
};

const arcPath = (R: number, a0: number, a1: number, reverse = false) => {
  const largeArc = (a1 - a0) > Math.PI ? 1 : 0;
  if (!reverse) {
    const x0 = R * Math.cos(a0), y0 = R * Math.sin(a0);
    const x1 = R * Math.cos(a1), y1 = R * Math.sin(a1);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${largeArc} 1 ${x1} ${y1}`;
  } else {
    const x0 = R * Math.cos(a1), y0 = R * Math.sin(a1);
    const x1 = R * Math.cos(a0), y1 = R * Math.sin(a0);
    return `M ${x0} ${y0} A ${R} ${R} 0 ${largeArc} 0 ${x1} ${y1}`;
  }
};

const fitFontSize = (text: string, arcLen: number, maxSize: number) => {
  const minSize = 9;
  const charW = 0.54;
  const needed = text.length * charW;
  let size = Math.min(maxSize, Math.floor(arcLen / needed));
  return Math.max(size, minSize);
};

// --- CONTENIDOS TEÓRICOS GENERALES ---
const MODAL_DATA = {
  'dominio-iii': {
    title: "Dominio III – Gobierno de la Función de Auditoría Interna",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <h3 className="font-bold text-brand-600">Propósito:</h3>
        <p>Asegurar que la función de auditoría interna cuente con respaldo, independencia, recursos y supervisión adecuados por parte del máximo órgano de gobierno (Consejo, Junta, Comité o CICCI en el sector público).</p>
        <h3 className="font-bold text-brand-600">Principios:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>6. Autorización del Consejo</strong> → Definir mandato y estatuto formal que otorguen autoridad y rol.</li>
          <li><strong>7. Independencia</strong> → Posicionar la función libre de interferencias; asegurar cualificación del Director de Auditoría Interna.</li>
          <li><strong>8. Supervisión</strong> → Que el Consejo supervise recursos, calidad y resultados; incluyendo evaluaciones externas de calidad al menos cada 5 años.</li>
        </ul>
      </div>
    )
  },
  'dominio-iv': {
    title: "Dominio IV – Gestión de la Función de Auditoría Interna",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <h3 className="font-bold text-brand-600">Propósito:</h3>
        <p>Asegurar que la función se planifique, organice y gestione de manera estratégica, con recursos adecuados, comunicación efectiva y compromiso con la mejora continua.</p>
        <h3 className="font-bold text-brand-600">Principios:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>9. Planificación estratégica</strong> → Definir estrategia, objetivos y planes basados en riesgos y alineados con los objetivos institucionales.</li>
          <li><strong>10. Gestión de recursos</strong> → Garantizar suficiencia y pertinencia de recursos financieros, humanos y tecnológicos.</li>
          <li><strong>11. Comunicación eficaz</strong> → Mantener relaciones constructivas con stakeholders, comunicar resultados, errores, omisiones y aceptación de riesgos.</li>
          <li><strong>12. Mejora de calidad</strong> → Implementar programa de aseguramiento y mejora continua (PAMC), evaluaciones internas y externas, y métricas de desempeño.</li>
        </ul>
      </div>
    )
  },
  'dominio-v': {
    title: "Dominio V – Desempeño de los Servicios de Auditoría Interna",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <h3 className="font-bold text-brand-600">Propósito:</h3>
        <p>Garantizar que cada trabajo de auditoría se planifique, ejecute y comunique con rigor técnico, independencia y enfoque en la mejora organizacional.</p>
        <h3 className="font-bold text-brand-600">Principios:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>13. Planificación de los trabajos</strong> → Definir objetivos, alcance, criterios, riesgos y recursos; preparar programa de trabajo.</li>
          <li><strong>14. Ejecución de los trabajos</strong> → Recopilar información, analizar, evaluar hallazgos, formular recomendaciones y documentar evidencia.</li>
          <li><strong>15. Comunicación y seguimiento</strong> → Emitir informes claros, confirmar implementación de planes de acción y monitorear resultados.</li>
        </ul>
      </div>
    )
  },
  'dominio-i': {
    title: "Dominio I – Propósito de la Auditoría Interna",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <h3 className="font-bold text-brand-600">Propósito:</h3>
        <p>Asegurar que la auditoría interna agregue valor, proteja y fortalezca la capacidad de la organización para crear y sostener valor, a través de aseguramiento, asesoría, perspectivas y previsiones independientes y objetivas.</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Fomentar la confianza pública y la credibilidad institucional.</li>
          <li>Contribuir al logro de objetivos estratégicos.</li>
          <li>Fortalecer gobierno, gestión de riesgos y control.</li>
          <li>Respaldar la toma de decisiones con evidencia.</li>
          <li>Servir al interés público.</li>
        </ul>
      </div>
    )
  },
  'dominio-ii': {
    title: "Dominio II – Ética y Profesionalidad",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <h3 className="font-bold text-brand-600">Propósito:</h3>
        <p>Garantizar que los auditores internos actúen conforme a principios éticos y profesionales que sustenten la confianza, imparcialidad y la calidad de los trabajos.</p>
        <h3 className="font-bold text-brand-600">Principios:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>1. Integridad</strong> → Actuar con honestidad, valentía profesional y respeto a expectativas éticas y legales.</li>
          <li><strong>2. Objetividad</strong> → Emitir juicios libres de intereses indebidos; declarar y gestionar conflictos de interés.</li>
          <li><strong>3. Competencia</strong> → Mantener conocimientos, habilidades y experiencia para un desempeño eficaz.</li>
          <li><strong>4. Debido cuidado profesional</strong> → Ejercer escepticismo, rigor y cumplimiento de las Normas Globales.</li>
          <li><strong>5. Confidencialidad</strong> → Proteger la información obtenida y garantizar su uso legítimo.</li>
        </ul>
      </div>
    )
  },
  'orientacion': {
    title: "Orientación Global",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>La Orientación Global constituye el conjunto de guías, consejos prácticos y herramientas emitidas por el Instituto de Auditores Internos (IIA) para apoyar la implementación de las Normas Globales. No son de carácter obligatorio, pero sirven como referencia autorizada para fortalecer la práctica profesional de la auditoría interna.</p>
        <h3 className="font-bold text-brand-600">Su finalidad es:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Facilitar la interpretación de los principios y requisitos de las Normas Globales.</li>
          <li>Proveer lineamientos y ejemplos aplicables a distintos contextos organizacionales.</li>
          <li>Promover consistencia en la práctica profesional, sin perder flexibilidad para adaptarse a sectores, riesgos y entornos específicos.</li>
          <li>Servir como material de consulta para auditores internos, juntas directivas y responsables de control.</li>
        </ul>
        <p className="italic text-sm">En síntesis, la Orientación Global es el nivel de guía no vinculante del Marco Internacional para la Práctica Profesional (IPPF), diseñado para traducir la teoría normativa en prácticas útiles que aseguren calidad, valor agregado y alineación con el interés público.</p>
      </div>
    )
  },
  'requisitos': {
    title: "Requisitos Temáticos",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p>Los Requisitos Temáticos son disposiciones obligatorias en áreas de riesgo específicas que complementan a las Normas Globales. Establecen la cobertura mínima que la auditoría interna debe aplicar en compromisos de aseguramiento cuando dichos riesgos se identifican como significativos en la organización.</p>
        <h3 className="font-bold text-brand-600">Aspectos técnicos clave:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Enfoque basado en riesgos:</strong> su aplicación depende de los resultados de la evaluación de riesgos de la entidad.</li>
          <li><strong>Carácter obligatorio:</strong> deben cumplirse en compromisos de aseguramiento; en servicios de asesoría se recomiendan como referencia.</li>
          <li><strong>Cobertura mínima:</strong> fijan una línea base para temas críticos (ejemplo: ciberseguridad, gestión de terceros, cumplimiento normativo).</li>
          <li><strong>Juicio profesional:</strong> requieren documentar decisiones sobre alcance, exclusiones o aplicación parcial, siguiendo el principio de “cumplir o explicar”.</li>
          <li><strong>Integración en el ciclo de auditoría:</strong> deben considerarse en la planificación, ejecución, comunicación de resultados y seguimiento de acciones de mejora.</li>
        </ul>
      </div>
    )
  },
  'iia': {
    title: "Misión de las Normas Globales™",
    content: (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        <p className="font-medium">El IIA es la principal autoridad mundial en certificación, educación e investigación para la profesión de auditoría interna.</p>
        <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100">
          <h4 className="font-bold text-brand-800 text-sm mb-2 uppercase tracking-wider">Compromiso de Excelencia</h4>
          <p className="text-sm text-brand-700 leading-relaxed">Elevar la calidad de la auditoría interna a través de un marco de principios y requisitos obligatorios que aseguren la independencia, la objetividad y el valor agregado en todas las organizaciones del mundo.</p>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
          <li>Establece las <strong>Normas Globales de Auditoría Interna™</strong>.</li>
          <li>Lidera el Marco Internacional para la Práctica Profesional (MIPP).</li>
          <li>Provee certificaciones de excelencia mundial como el CIA® (Certified Internal Auditor).</li>
        </ul>
      </div>
    )
  }
};

// --- CONTENIDOS TÉCNICOS ESPECÍFICOS MIE (MANTENIDOS PARA LAS SECCIONES) ---
const DOMAINS_MIE_TABLES = {
  'dominio-i': {
    title: "Dominio I: Propósito de la Auditoría Interna",
    purpose: "Asegurar que la función de auditoría interna tenga un mandato claro, aprobado y respaldado por la Alta Dirección y el CICCI, con un propósito definido, sustentado en principios éticos, independencia organizacional y orientado a fortalecer la gobernanza, la gestión de riesgos, el control, la reputación institucional y el interés público.",
    principles: [
      "Definir formalmente el propósito de la auditoría interna.",
      "Contar con un mandato aprobado y respaldado por el máximo órgano de gobierno.",
      "Adoptar un Código de Ética que asegure integridad, objetividad, competencia y confidencialidad.",
      "Incorporar un marco normativo integral (leyes nacionales y Normas Globales).",
      "Garantizar independencia y posición organizacional adecuada.",
      "Orientar la función a crear, proteger y mantener valor, fortaleciendo GRC e interés público."
    ],
    table: [
      { item: "Propósito definido formalmente", evidence: "Estatuto de Auditoría Interna (Res. 944/2024, art. 8.1)." },
      { item: "Mandato aprobado y respaldado", evidence: "Estatuto (cap. 8.2) y Resolución 944/2024 que lo adopta con aprobación del CICCI (Res. 829/2024)." },
      { item: "Código de Ética", evidence: "Código de Ética de Auditoría Interna (Res. 944/2024), principios: Integridad, Objetividad, Competencia y Confidencialidad." },
      { item: "Marco normativo integral", evidence: "Estatuto (cap. 5): Ley 87/1993, Ley 1474/2011, Ley 2281/2023, Decretos 648/2017, 1083/2015, 1499/2017, 1075/2023 y Normas Globales IIA 2024." },
      { item: "Independencia y posición organizacional", evidence: "Estatuto (art. 8.4): Jefatura OCI depende administrativamente de la Ministra y funcionalmente del Presidente; rol en CICCI garantiza independencia." },
      { item: "Responsabilidad de fortalecer GRC", evidence: "Estatuto (arts. 8.1 y 8.2) orienta la función a objetivos estratégicos, gobernanza, riesgos, control, reputación e interés público." }
    ]
  },
  'dominio-ii': {
    title: "Dominio II: Ética y Profesionalismo",
    purpose: "Asegurar que la función de auditoría interna se ejerza con integridad, objetividad, confidencialidad y competencia, con un compromiso individual y colectivo hacia la ética y el debido cuidado profesional.",
    principles: [
      "Aplicar los principios del Código de Ética.",
      "Mantener independencia y objetividad individual en cada encargo.",
      "Desarrollar y actualizar competencias de manera continua.",
      "Ejercer con debido cuidado profesional."
    ],
    table: [
      { item: "Principios éticos aplicados", evidence: "Código de Ética de Auditoría Interna (Res. 944/2024)." },
      { item: "Independencia individual", evidence: "Formato ACI_P-FO-003 “Certificación de Independencia y Objetividad”." },
      { item: "Desarrollo de competencias", evidence: "ACI_P-FO-012 Plan de Desarrollo Individual y ACI_P-GU-002 Guía Administración de Personal." },
      { item: "Debido cuidado profesional", evidence: "ACI_P-MN-001 Manual de Auditoría Interna define lineamientos técnicos y criterios de calidad." },
      { item: "Manifestación de aceptación ética", evidence: "Anexo 1 al Código de Ética: Acta de compromiso de aplicación." },
      { item: "Certificación de objetividad", evidence: "Anexo 2 al Código de Ética: formato de certificación de objetividad y debido cuidado por encargo." }
    ]
  },
  'dominio-iii': {
    title: "Dominio III: Gobierno de la Función de Auditoría Interna",
    purpose: "Garantizar que la función de auditoría interna cuente con un marco de gobierno sólido, aprobado por el máximo órgano de gobierno, con supervisión efectiva, acceso irrestricto, recursos suficientes y mecanismos de calidad externa e interna.",
    principles: [
      "Aprobar y revisar periódicamente el Estatuto de Auditoría Interna.",
      "Respaldar la función desde el CICCI y la Alta Dirección.",
      "Garantizar acceso irrestricto a información, personal y activos.",
      "Asegurar recursos financieros, humanos y tecnológicos adecuados.",
      "Establecer programa de calidad con evaluaciones internas y externas.",
      "Facilitar relación directa entre Jefatura OCI y CICCI, incluso sin presencia de la Alta Dirección."
    ],
    table: [
      { item: "Estatuto aprobado/adoptado", evidence: "Estatuto de Auditoría Interna, adoptado por Resolución 944/2024." },
      { item: "Respaldo del CICCI", evidence: "Resolución 829/2024 que reglamenta y aprueba el CICCI, incluyendo su rol de supervisión y apoyo." },
      { item: "Acceso irrestricto", evidence: "Estatuto (cap. 8.2) otorga acceso total a datos, personas y activos." },
      { item: "Recursos suficientes", evidence: "Estatuto (cap. 8.7) compromete al Ministerio a proveer recursos humanos, técnicos y financieros." },
      { item: "Evaluación externa de calidad", evidence: "Estatuto (cap. 8.6) establece obligación de realizar evaluaciones externas del Programa de Aseguramiento y Mejora de la Calidad (PAMC)." },
      { item: "Relación directa con Consejo", evidence: "Estatuto (cap. 8.8) garantiza comunicación directa con el CICCI." }
    ]
  },
  'dominio-iv': {
    title: "Dominio IV: Gestión de la Función de Auditoría Interna",
    purpose: "Asegurar que la función de auditoría interna se planifique, organice y gestione estratégicamente, con los recursos adecuados, comunicación efectiva y un compromiso constante con la calidad y la mejora continua.",
    principles: [
      "Planificar estratégicamente: estrategia y plan anual basados en riesgos.",
      "Gestionar los recursos: suficiencia y pertinencia de recursos financieros, humanos y tecnológicos.",
      "Comunicar eficazmente: relaciones constructivas y comunicación clara.",
      "Mejorar la calidad: implementar un Programa de Aseguramiento y Mejora Continua (PAMC)."
    ],
    table: [
      { item: "Estrategia y plan de auditoría interna", evidence: "ACI_P-MN-001 Manual de Auditoría Interna, ACI_P-PR-001 Procedimiento Plan Anual de Auditoría y ACI_P-FO-011 Plan Anual de Auditoría." },
      { item: "Gestión de recursos y competencias", evidence: "ACI_P-GU-002 Guía Administración de Personal y ACI_P-FO-012 Plan de Desarrollo Individual." },
      { item: "Comunicación estratégica de la función", evidence: "ACI_P-PO-001 Política de Comunicaciones y presentaciones periódicas de desempeño." },
      { item: "Programa de Aseguramiento (PAMC)", evidence: "ACI_P-GU-001 Guía del PAMC, ACI_A-FO-005 Autoevaluación y ACI_R-FO-005 Informe Autoevaluación Periódica." },
      { item: "Medición de desempeño", evidence: "ACI_S-FO-002 Seguimiento Indicadores de Desempeño de la Función." }
    ]
  },
  'dominio-v': {
    title: "Dominio V: Desempeño de los Servicios de Auditoría Interna",
    purpose: "Asegurar que los trabajos de auditoría interna se planifiquen, ejecuten, documenten y comuniquen de manera sistemática, con base en riesgos y evidencia suficiente, aportando valor mediante recomendaciones viables.",
    principles: [
      "Planificación de los trabajos: definir objetivos, alcance, riesgos y recursos.",
      "Ejecución de los trabajos: recopilar información, analizar, evaluar hallazgos y documentar evidencia.",
      "Comunicación y seguimiento: emitir informes claros y monitorear resultados."
    ],
    table: [
      { item: "Planificación de trabajos", evidence: "ACI_P-FO-004 Memorando de Planificación, ACI_P-FO-009 Planificación Responsable de Aseguramiento, ACI_P-FO-010 Planificación Trabajos de Aseguramiento." },
      { item: "Ejecución de programas", evidence: "ACI_A-PR-001 Procedimiento Trabajos de Aseguramiento, ACI_A-PR-002 Procedimiento Trabajos de Consultoría, ACI_A-FO-003 Ejecución Programa de Trabajo." },
      { item: "Documentación de evidencias", evidence: "ACI_P-FO-001 Memorando Notificación Equipo de Trabajo, ACI_P-FO-002 Notificación de Trabajos, ACI_P-FO-007 Carta de Representación, papeles de trabajo." },
      { item: "Comunicación de resultados", evidence: "ACI_R-FO-001 Presentación de Cierre, ACI_R-FO-002 Informe de Cierre, ACI_R-FO-003 Informe Final, ACI_R-FO-004 Informe de Cumplimiento y Ley, ACI_R-FO-006 Informe de Consultoría." },
      { item: "Seguimiento a planes de acción", evidence: "ACI_S-PR-001 Procedimiento Planes de Mejoramiento, ACI_S-IN-001 Instructivo SIRECI, ACI_S-FO-001 Seguimiento continuo, ACI_S-FO-002 Seguimiento indicadores." }
    ]
  }
};

const SCHEME_SEGMENTS = [
  { id: 'dominio-iii', lines:[ { text:"de Auditoría Interna", size:10, r: outerR - 54 }, { text:"de la Función", size:10, r: outerR - 40 }, { text:"GOBIERNO", size:14, bold:true, r: outerR - 26 } ], reverse: false, top: true, color: "#2563EB" },
  { id: 'dominio-iv', lines:[ { text:"de Auditoría Interna", size:10, r: outerR - 54 }, { text:"de la Función", size:10, r: outerR - 40 }, { text:"GESTIÓN", size:14, bold:true, r: outerR - 26 } ], reverse: false, top: true, color: "#3B82F6" },
  { id: 'dominio-v', lines:[ { text:"DESEMPEÑO", size:14, bold:true, r: innerR + 20 }, { text:"de los Servicios", size:10, r: innerR + 33 }, { text:"de Auditoría Interna", size:10, r: innerR + 46 } ], reverse: true, top: false, color: "#1E3A8A" },
  { id: 'dominio-i', lines:[ { text:"PROPÓSITO", size:16, bold:true, r: innerR + 27 }, { text:"de la Auditoría Interna", size:10, r: innerR + 42 } ], reverse: true, top: false, color: "#1E40AF" },
  { id: 'dominio-ii', lines:[ { text:"PROFESIONALIDAD", size:10, r: outerR - 46 }, { text:"ÉTICA Y", size:14, bold:true, r: outerR - 30 } ], reverse: false, top: true, color: "#1D4ED8" }
];

const SECTIONS_LIST = [
  { id: 'introduccion', label: 'Marco global / intro', icon: BookOpen, desc: 'Arquitectura y componentes obligatorios.' },
  { id: 'dominio-i', label: 'Dominio I', icon: Landmark, desc: 'Propósito y valor de la auditoría interna.' },
  { id: 'dominio-ii', label: 'Dominio II', icon: Scale, desc: 'Principios de ética y profesionalismo.' },
  { id: 'dominio-iii', label: 'Dominio III', icon: Settings, desc: 'Gobernanza y supervisión técnica.' },
  { id: 'dominio-iv', label: 'Dominio IV', icon: Activity, desc: 'Gestión estratégica de la función.' },
  { id: 'dominio-v', label: 'Dominio V', icon: FileCheck, desc: 'Planificación y comunicación de resultados.' },
  { id: 'evaluacion', label: 'Examen final', icon: FileCheck, desc: 'Cierre del Módulo 3.' }
];

export const StandardsModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState('menu');
  const [modal, setModal] = useState<{title: string, content: React.ReactNode} | null>(null);
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
  const currentIndex = SECTIONS_LIST.findIndex(s => s.id === activeTab);

  const navigateTo = (id: string) => {
    if (id === 'evaluacion' && isLocked) return;
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (activeTab === 'menu') {
    return (
      <div className="space-y-12 animate-fade-in pb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 dark:border-slate-700 pb-12">
          <div>
            <Badge type="brand" className="mb-4">Módulo 3</Badge>
            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Normas globales 2024</h1>
            <p className="text-slate-500 font-medium text-lg mt-4">Actualización del Marco Internacional de Prácticas Profesionales.</p>
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
          {SECTIONS_LIST.map((section, i) => {
            const Icon = section.icon;
            const locked = section.id === 'evaluacion' && isLocked;
            return (
              <button
                key={section.id}
                onClick={() => !locked && navigateTo(section.id)}
                className={`group p-10 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 transition-all text-left shadow-xl ${locked ? 'opacity-40 grayscale cursor-not-allowed border-transparent' : 'hover:border-brand-500 border-transparent active:scale-95'}`}
              >
                <div className="flex justify-between items-start mb-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
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
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] max-w-2xl w-full p-12 shadow-2xl relative border border-brand-100 dark:border-slate-700" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModal(null)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <Info size={30} className="text-brand-500" />
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{modal.title}</h3>
            </div>
            <div className="text-slate-700 dark:text-slate-300 font-medium text-lg leading-relaxed">
              {modal.content}
            </div>
            <button onClick={() => setModal(null)} className="mt-10 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] tracking-widest hover:bg-brand-600 transition-colors shadow-lg uppercase">Cerrar</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md py-4 z-40 border-b border-slate-200 dark:border-slate-700 px-2">
        <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors">
                <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Módulo 3 - {SECTIONS_LIST[currentIndex]?.label}</h2>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS_LIST.length}</div>
      </div>

      <main className="min-h-[60vh] px-2 md:px-0">
        
        {activeTab === 'introduccion' && (
          <div className="space-y-16">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-6 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-brand-700 font-bold text-sm uppercase tracking-wider">MIPP 2024 - Arquitectura Global</h3>
                  <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-l-4 border-brand-500 pl-6">
                    "El Marco Internacional de Prácticas Profesionales organiza el cuerpo de conocimientos del IIA. Su actualización define los tres pilares que guían nuestra práctica profesional."
                  </p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100 flex items-center gap-4 group hover:bg-brand-100 transition-colors shadow-sm">
                      <ShieldCheck className="text-brand-600" />
                      <p className="text-xs font-bold text-brand-800 uppercase tracking-tight">Normas Globales: Requisitos obligatorios.</p>
                    </div>
                    <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100 flex items-center gap-4 group hover:bg-brand-100 transition-colors shadow-sm">
                      <Lock className="text-brand-600" />
                      <p className="text-xs font-bold text-brand-800 uppercase tracking-tight">Requisitos Temáticos: Riesgos específicos críticos.</p>
                    </div>
                    <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-100 flex items-center gap-4 group hover:bg-brand-100 transition-colors shadow-sm">
                      <BookOpen className="text-brand-600" />
                      <p className="text-xs font-bold text-brand-800 uppercase tracking-tight">Orientación Global: Guías y consejos prácticos.</p>
                    </div>
                  </div>
                </div>
                <Callout type="info">Haz clic en <strong>cualquier parte del diagrama</strong> (dominios, anillos o logo central) para ver la información teórica y aspectos generales del Marco Global.</Callout>
              </div>

              <div className="lg:col-span-6 flex justify-center items-center">
                <div className="relative w-full max-w-[450px] animate-fade-in">
                   <div className="absolute inset-0 bg-brand-500/5 blur-[100px] rounded-full"></div>
                   <svg viewBox="0 0 450 450" className="drop-shadow-2xl overflow-visible select-none relative z-10 mx-auto">
                     <defs>
                        <path id="path-og" d={arcPath(radioAnilloExterno, -150 * rad, -30 * rad)} />
                        <path id="path-rt" d={arcPath(radioAnilloVerde, (startOffset + 4 * (360/5) + 1.5) * rad, (startOffset + 5 * (360/5) - 1.5) * rad)} />
                        {SCHEME_SEGMENTS.map((s, idx) => (
                           s.lines.map((line, lidx) => {
                             const full = 360 / 5;
                             const startDeg = startOffset + idx * full + gapDeg / 2;
                             const endDeg = startDeg + (full - gapDeg);
                             const pad = (s.top ? padTopDeg : padBottomDeg) * rad;
                             return (
                               <path 
                                 key={`${idx}-${lidx}`} 
                                 id={`arc-${idx}-${lidx}`} 
                                 d={arcPath(line.r, (startDeg * rad) + pad, (endDeg * rad) - pad, s.reverse)} 
                               />
                             );
                           })
                        ))}
                     </defs>

                     <g transform="translate(225, 225)">
                        {/* DOMINIOS CENTRALES - AHORA ABREN MODAL DE ASPECTOS GENERALES */}
                        {SCHEME_SEGMENTS.map((s, idx) => {
                          const full = 360 / 5;
                          const span = full - gapDeg;
                          const startDeg = startOffset + idx * full + gapDeg / 2;
                          const a0 = startDeg * rad, a1 = (startDeg + span) * rad;

                          return (
                            <g key={s.id} className="cursor-pointer group origin-center transition-all" onClick={(e) => { e.stopPropagation(); setModal(MODAL_DATA[s.id as keyof typeof MODAL_DATA]); }}>
                              <path d={roundedRingSegmentPath(outerR, innerR, a0, a1, cornerRadius)} fill={s.color} className="group-hover:brightness-110 transition-all" />
                              {s.lines.map((line: any, lidx: number) => (
                                <text key={lidx} className="fill-white pointer-events-none font-bold" style={{ fontSize: `${fitFontSize(line.text, line.r * (span * rad), line.size) - 1}px` }}>
                                  <textPath href={`#arc-${idx}-${lidx}`} startOffset="50%" textAnchor="middle">{line.text}</textPath>
                                </text>
                              ))}
                            </g>
                          );
                        })}

                        {/* ANILLO REQUISITOS TEMÁTICOS (VERDE) - MODAL */}
                        <circle cx="0" cy="0" r={radioAnilloVerde} className="fill-none stroke-slate-100 dark:stroke-slate-700 stroke-[26px]" />
                        <path 
                          onClick={(e) => { e.stopPropagation(); setModal(MODAL_DATA.requisitos); }}
                          className="cursor-pointer hover:stroke-green-600 transition-all duration-300 fill-none stroke-[#A9D34A] stroke-[26px]"
                          d={arcPath(radioAnilloVerde, (startOffset + 4 * (360/5) + 1) * rad, (startOffset + 5 * (360/5) - 1) * rad)} 
                        />
                        <text className="fill-white font-bold text-[10px] pointer-events-none tracking-tight">
                          <textPath href="#path-rt" startOffset="50%" textAnchor="middle">Requisitos temáticos</textPath>
                        </text>

                        {/* ANILLO ORIENTACIÓN GLOBAL (AZUL) - MODAL */}
                        <circle cx="0" cy="0" r={radioAnilloExterno} className="fill-none stroke-blue-500/10 stroke-[28px]" />
                        <path 
                          onClick={(e) => { e.stopPropagation(); setModal(MODAL_DATA.orientacion); }}
                          className="cursor-pointer hover:stroke-blue-600 transition-all duration-300 fill-none stroke-blue-500 stroke-[28px]"
                          d={arcPath(radioAnilloExterno, -150 * rad, -30 * rad)} 
                        />
                        <text className="fill-white font-black text-[13px] pointer-events-none tracking-tight">
                          <textPath href="#path-og" startOffset="50%" textAnchor="middle">Orientación global</textPath>
                        </text>
                        
                        {/* CENTRO LOGO - POPUP INSTITUCIONAL */}
                        <g 
                          className="cursor-pointer group" 
                          onClick={(e) => { e.stopPropagation(); setModal(MODAL_DATA.iia); }}
                        >
                          <circle r="68" className="fill-white dark:fill-slate-900 group-hover:fill-slate-50 transition-colors duration-300 shadow-xl" />
                          <image href={IIA_LOGO_BASE64} x="-42" y="-55" height="85" width="85" className="group-hover:scale-105 transition-transform duration-300" />
                          <text className="fill-blue-900 dark:fill-blue-400 font-black text-[12px] tracking-tight pointer-events-none uppercase" y="24" textAnchor="middle">Normas Globales™</text>
                        </g>
                      </g>
                    </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab.startsWith('dominio-') && (
          <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{DOMAINS_MIE_TABLES[activeTab as keyof typeof DOMAINS_MIE_TABLES].title}</h2>
            
            {/* Caja de Propósito Fucsia */}
            <section className="bg-white dark:bg-slate-800 border-l-[8px] border-brand-500 p-10 rounded-r-[2.5rem] shadow-xl">
               <h4 className="text-brand-600 font-black text-xs uppercase tracking-widest mb-4">Propósito del Dominio</h4>
               <p className="text-xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">{DOMAINS_MIE_TABLES[activeTab as keyof typeof DOMAINS_MIE_TABLES].purpose}</p>
            </section>

            {/* Principios */}
            <section className="space-y-8">
               <h3 className="text-2xl font-black text-slate-800 dark:text-white border-l-4 border-brand-500 pl-6">Principios y Elementos de Cumplimiento</h3>
               <ul className="grid gap-4 pl-6 list-disc text-slate-600 dark:text-slate-400 font-bold text-lg">
                  {DOMAINS_MIE_TABLES[activeTab as keyof typeof DOMAINS_MIE_TABLES].principles.map((p, i) => (
                    <li key={i} className="pl-2 leading-snug">{p}</li>
                  ))}
               </ul>
            </section>

            {/* Tabla de Evidencia MIE */}
            <section className="space-y-8 overflow-hidden">
               <div className="bg-slate-900 text-white px-8 py-4 rounded-t-3xl inline-block shadow-lg">
                  <h3 className="font-black text-xs uppercase tracking-[0.3em]">Evidencia de Cumplimiento – Ministerio de Igualdad y Equidad</h3>
               </div>
               <div className="grid md:grid-cols-2 gap-6">
                  {DOMAINS_MIE_TABLES[activeTab as keyof typeof DOMAINS_MIE_TABLES].table.map((row, idx) => (
                    <EvidenceItem key={idx} item={row.item} support={row.evidence} />
                  ))}
               </div>
            </section>
          </div>
        )}

        {activeTab === 'evaluacion' && (
          <Quiz 
            questions={[
              { id: 1, question: "¿Cuántos principios fundamentales consolidan las nuevas Normas Globales de Auditoría Interna 2024?", options: ["10 principios", "15 principios", "20 principios"], correctAnswer: 1 },
              { id: 2, question: "¿Cuál es el instrumento que el Ministerio de Igualdad y Equidad utiliza para certificar la independencia individual previo a un encargo?", options: ["Estatuto de auditoría", "Formato ACI_P-FO-011", "Formato ACI_P-FO-003"], correctAnswer: 2 },
              { id: 3, question: "¿Qué resolución del Ministerio de Igualdad y Equidad adoptó formalmente el Estatuto de auditoría interna y el Código de ética?", options: ["Resolución 829/2024", "Resolución 944/2024", "Decreto 1499/2017"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
          />
        )}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40">
        <div className="bg-slate-900 dark:bg-slate-800 text-white p-2 rounded-full shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => currentIndex > 0 && navigateTo(SECTIONS_LIST[currentIndex-1].id)}
            disabled={currentIndex === 0}
            className="p-4 hover:bg-white/10 rounded-full transition-colors disabled:opacity-20"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button onClick={() => navigateTo('menu')} className="p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <LayoutGrid size={20} />
          </button>

          <button 
            onClick={() => currentIndex < SECTIONS_LIST.length - 1 && navigateTo(SECTIONS_LIST[currentIndex+1].id)}
            className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-bold tracking-tighter ${SECTIONS_LIST[currentIndex+1]?.id === 'evaluacion' && isLocked ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <span>{SECTIONS_LIST[currentIndex+1]?.id === 'evaluacion' ? 'Finalizar' : 'Siguiente'}</span>
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
