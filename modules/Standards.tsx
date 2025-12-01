import React, { useState } from 'react';
import { Card, Badge, Quiz } from '../components/UI';
import { Shield, Grid, ArrowLeft, ArrowRight, ChevronDown, X, MousePointerClick, CheckCircle } from 'lucide-react';

// --- MATH & SVG HELPERS ---
const outerR = 150, innerR = 92, n = 5;
const cornerRadius = 8;
const gapDeg = 5.2; 
const full = 360/n;
const span = full - gapDeg;
const startOffset = -126;
const rad = Math.PI/180;
const outerGapDeg = 2.0;
const radioAnilloVerde = 170;
const radioAnilloExterno = 205;

// Base colors
const COLORS = ["#2563EB", "#3B82F6", "#1E3A8A", "#1E40AF", "#1D4ED8"];

function arcPath(R: number, a0: number, a1: number, reverse = false) {
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
}

function roundedRingSegmentPath(Ro: number, Ri: number, a0: number, a1: number, cr: number) {
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
}

function fitFontSize(text: string, arcLen: number, maxSize: number) {
    const minSize = 9;
    const charW = 0.56;
    const needed = text.length * charW;
    let size = Math.min(maxSize, Math.floor(arcLen / needed));
    return Math.max(size, minSize);
}

// --- DATA ---
const SEGMENTS_DATA = [
    { 
      title:"GOBIERNO de la Función de Auditoría Interna", 
      reverse:false, color:COLORS[0], top:true, 
      lines:[ { text:"de Auditoría Interna", size:10, r: outerR - 54 }, { text:"de la Función", size:10, r: outerR - 40 }, { text:"GOBIERNO", size:14, bold:true, r: outerR - 26 }, ],
      details: {
        title: "Dominio III – Gobierno de la Función de Auditoría Interna",
        body: (
           <>
            <h3 className="text-brand-600 font-bold mt-4 mb-2">Propósito:</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Asegurar que la función de auditoría interna cuente con respaldo, independencia, recursos y supervisión adecuados por parte del máximo órgano de gobierno (Consejo, Junta, Comité o CICCI en el sector público).</p>
            <h3 className="text-brand-600 font-bold mb-2">Principios:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>6. Autorización del Consejo</strong> → Definir mandato y estatuto formal que otorguen autoridad y rol.</li>
                <li><strong>7. Independencia</strong> → Posicionar la función libre de interferencias; asegurar cualificación del Director de Auditoría Interna.</li>
                <li><strong>8. Supervisión</strong> → Que el Consejo supervise recursos, calidad y resultados; incluyendo evaluaciones externas de calidad al menos cada 5 años.</li>
            </ul>
           </>
        )
      }
    },
    { 
      title:"GESTIÓN de la Función de Auditoría Interna", 
      reverse:false, color:COLORS[1], top:true, 
      lines:[ { text:"de Auditoría Interna", size:10, r: outerR - 54 }, { text:"de la Función", size:10, r: outerR - 40 }, { text:"GESTIÓN", size:14, bold:true, r: outerR - 26 }, ],
      details: {
        title: "Dominio IV – Gestión de la Función de Auditoría Interna",
        body: (
            <>
            <h3 className="text-brand-600 font-bold mt-4 mb-2">Propósito:</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Asegurar que la función se planifique, organice y gestione de manera estratégica, con recursos adecuados, comunicación efectiva y compromiso con la mejora continua.</p>
            <h3 className="text-brand-600 font-bold mb-2">Principios:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>9. Planificación estratégica</strong> → Definir estrategia, objetivos y planes basados en riesgos y alineados con los objetivos institucionales.</li>
                <li><strong>10. Gestión de recursos</strong> → Garantizar suficiencia y pertinencia de recursos financieros, humanos y tecnológicos.</li>
                <li><strong>11. Comunicación eficaz</strong> → Mantener relaciones constructivas con stakeholders, comunicar resultados, errores, omisiones y aceptación de riesgos.</li>
                <li><strong>12. Mejora de calidad</strong> → Implementar programa de aseguramiento y mejora continua (PAMC), evaluaciones internas y externas.</li>
            </ul>
            </>
        )
      }
    },
    { 
      title:"DESEMPEÑO de los Servicios de Auditoría Interna", 
      reverse:true, color:COLORS[2], top:false, 
      lines:[ { text:"DESEMPEÑO", size:14, bold:true, r: innerR + 20 }, { text:"de los Servicios", size:10, r: innerR + 33 }, { text:"de Auditoría Interna", size:10, r: innerR + 46 }, ],
      details: {
        title: "Dominio V – Desempeño de los Servicios de Auditoría Interna",
        body: (
            <>
            <h3 className="text-brand-600 font-bold mt-4 mb-2">Propósito:</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Garantizar que cada trabajo de auditoría se planifique, ejecute y comunique con rigor técnico, independencia y enfoque en la mejora organizacional.</p>
            <h3 className="text-brand-600 font-bold mb-2">Principios:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>13. Planificación de los trabajos</strong> → Definir objetivos, alcance, criterios, riesgos y recursos; preparar programa de trabajo.</li>
                <li><strong>14. Ejecución de los trabajos</strong> → Recopilar información, analizar, evaluar hallazgos, formular recomendaciones y documentar evidencia.</li>
                <li><strong>15. Comunicación y seguimiento</strong> → Emitir informes claros, confirmar implementación de planes de acción y monitorear resultados.</li>
            </ul>
            </>
        )
      }
    },
    { 
      title:"PROPÓSITO de la Auditoría Interna", 
      reverse:true, color:COLORS[3], top:false, 
      lines:[ { text:"PROPÓSITO", size:16, bold:true, r: innerR + 27 }, { text:"de la Auditoría Interna", size:10, r: innerR + 42 }, ],
      details: {
        title: "Dominio I – Propósito de la Auditoría Interna",
        body: (
            <>
            <h3 className="text-brand-600 font-bold mt-4 mb-2">Propósito:</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Asegurar que la auditoría interna agregue valor, proteja y fortalezca la capacidad de la organización para crear y sostener valor, a través de aseguramiento, asesoría, perspectivas y previsiones independientes y objetivas.</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li>Fomentar la confianza pública y la credibilidad institucional.</li>
                <li>Contribuir al logro de objetivos estratégicos.</li>
                <li>Fortalecer gobierno, gestión de riesgos y control.</li>
                <li>Respaldar la toma de decisiones con evidencia.</li>
            </ul>
            </>
        )
      }
    },
    { 
      title:"ÉTICA Y PROFESIONALIDAD", 
      reverse:false, color:COLORS[4], top:true, 
      lines:[ { text:"PROFESIONALIDAD", size:10, r: outerR - 46 }, { text:"ÉTICA Y", size:14, bold:true, r: outerR - 30 }, ],
      details: {
        title: "Dominio II – Ética y Profesionalidad",
        body: (
            <>
            <h3 className="text-brand-600 font-bold mt-4 mb-2">Propósito:</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">Garantizar que los auditores internos actúen conforme a principios éticos y profesionales que sustenten la confianza, imparcialidad y la calidad de los trabajos.</p>
            <h3 className="text-brand-600 font-bold mb-2">Principios:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Integridad</strong> → Actuar con honestidad, valentía profesional y respeto.</li>
                <li><strong>Objetividad</strong> → Emitir juicios libres de intereses indebidos.</li>
                <li><strong>Competencia</strong> → Mantener conocimientos y habilidades.</li>
                <li><strong>Debido cuidado profesional</strong> → Ejercer escepticismo y rigor.</li>
                <li><strong>Confidencialidad</strong> → Proteger la información obtenida.</li>
            </ul>
            </>
        )
      }
    }
];

const EXTRA_SEGMENTS = [
    {
        index: 5,
        title: "Orientación Global",
        details: {
            title: "Orientación Global",
            body: (
                <>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Conjunto de guías, consejos prácticos y herramientas emitidas por el IIA. No son obligatorias, pero sirven de referencia autorizada.</p>
                <h3 className="text-brand-600 font-bold mb-2">Finalidad:</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                    <li>Facilitar la interpretación de Normas Globales.</li>
                    <li>Proveer lineamientos aplicables a distintos contextos.</li>
                    <li>Promover consistencia en la práctica profesional.</li>
                </ul>
                </>
            )
        }
    },
    {
        index: 6,
        title: "Requisitos Temáticos",
        details: {
            title: "Requisitos Temáticos",
            body: (
                <>
                <p className="mb-4 text-slate-700 dark:text-slate-300">Disposiciones obligatorias en áreas de riesgo específicas (ej. ciberseguridad). Complementan las Normas Globales.</p>
                <h3 className="text-brand-600 font-bold mb-2">Aspectos clave:</h3>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                    <li><strong>Enfoque basado en riesgos:</strong> Depende de la evaluación de riesgos.</li>
                    <li><strong>Carácter obligatorio:</strong> Deben cumplirse en aseguramiento.</li>
                    <li><strong>Juicio profesional:</strong> Principio de "cumplir o explicar".</li>
                </ul>
                </>
            )
        }
    }
];


// --- COMPONENT: Interactive SVG Diagram ---
const InteractiveStandardsDiagram = ({ onSelect }: { onSelect: (idx: number) => void }) => {
    return (
        <div className="w-full max-w-[400px] mx-auto relative group">
            <svg viewBox="0 0 360 360" className="w-full h-auto overflow-visible drop-shadow-lg">
                {/* 
                   Correction: All SVG content is now wrapped in the main transformation group (180,180).
                   This ensures that paths generated with arcPath (which assumes 0,0 center) are correctly positioned.
                   Outer elements like circles now use cx=0 cy=0 relative to this group.
                */}
                <g transform="translate(180,180)">
                    <defs>
                        <path id="texto-cian-path" d={arcPath(radioAnilloVerde, (startOffset + 4 * full + outerGapDeg / 2) * rad, (startOffset + 4 * full + outerGapDeg / 2 + span) * rad)} fill="none" />
                        <path id="texto-externo-path" d={arcPath(radioAnilloExterno, -150 * rad, -30 * rad)} fill="none" />
                    </defs>

                    {/* Outer Rings - Now centered at 0,0 relative to group */}
                    <circle cx="0" cy="0" r="205" fill="none" stroke="#3B82F6" strokeWidth="26" className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onSelect(5)} />
                    <text className="pointer-events-none fill-white text-[14px] font-bold tracking-widest uppercase" dy="5">
                        <textPath href="#texto-externo-path" startOffset="50%" textAnchor="middle">Orientación Global</textPath>
                    </text>

                    {/* Thematic Requirements Segment (Cyan/Teal) */}
                    <path 
                        d={arcPath(radioAnilloVerde, (startOffset + 4 * full + outerGapDeg / 2) * rad, (startOffset + 4 * full + outerGapDeg / 2 + span) * rad)}
                        fill="none" stroke="#28a9d9" strokeWidth="26" 
                        className="cursor-pointer hover:scale-105 transition-transform origin-center"
                        onClick={() => onSelect(6)}
                    />
                    <text className="pointer-events-none fill-white text-[14px] font-bold tracking-widest uppercase" dy="5">
                        <textPath href="#texto-cian-path" startOffset="50%" textAnchor="middle">Requisitos Temáticos</textPath>
                    </text>

                    {/* Inner Green Ring Base */}
                    <path 
                        d={arcPath(radioAnilloVerde, (startOffset + 0 * full + outerGapDeg / 2) * rad, (startOffset + 3 * full + outerGapDeg / 2 + span) * rad)}
                        fill="none" stroke="#A9D34A" strokeWidth="26" className="pointer-events-none"
                    />

                    {/* Segments */}
                    {SEGMENTS_DATA.map((seg, i) => {
                        const startDeg = startOffset + i * full + gapDeg / 2;
                        const endDeg = startOffset + i * full + gapDeg / 2 + span;
                        const a0 = startDeg * rad;
                        const a1 = endDeg * rad;
                        const padTopDeg = 4.0;
                        const padBottomDeg = 3.2;
                        const pad = (seg.top ? padTopDeg : padBottomDeg) * rad;
                        const ta0 = a0 + pad;
                        const ta1 = a1 - pad;
                        const delta = ta1 - ta0;

                        return (
                            <g key={i} className="cursor-pointer hover:opacity-90 transition-opacity hover:scale-[1.02]" onClick={() => onSelect(i)}>
                                <path 
                                    fill={seg.color} 
                                    d={roundedRingSegmentPath(outerR, innerR, a0, a1, cornerRadius)} 
                                />
                                <g className="pointer-events-none select-none">
                                    {seg.lines.map((line, lIdx) => {
                                        const Rt = Math.min(Math.max(line.r, innerR + 8), outerR - 8);
                                        const arcId = `arc-${i}-${lIdx}`;
                                        const arcLen = Rt * delta;
                                        const fs = fitFontSize(line.text, arcLen * 0.94, line.size);
                                        
                                        return (
                                            <React.Fragment key={lIdx}>
                                                <defs>
                                                    <path id={arcId} d={arcPath(Rt, ta0, ta1, !!seg.reverse)} />
                                                </defs>
                                                <text fontSize={fs} fontWeight={line.bold ? '700' : '400'} fill="white" className="drop-shadow-sm">
                                                    <textPath href={`#${arcId}`} startOffset="50%" textAnchor="middle">{line.text}</textPath>
                                                </text>
                                            </React.Fragment>
                                        );
                                    })}
                                </g>
                            </g>
                        );
                    })}
                    
                    {/* Central Logo Area */}
                    <circle r="62" fill="white" />
                     <foreignObject x="-30" y="-30" width="60" height="60">
                        <div className="w-full h-full flex items-center justify-center text-brand-700">
                             <Shield size={40} strokeWidth={1.5} />
                        </div>
                     </foreignObject>
                    <text y="42" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E3A8A">Normas Globales</text>
                    <text y="54" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1E3A8A">de Auditoría Interna™</text>
                </g>
            </svg>
            <div className="absolute top-0 right-0 bg-white/90 backdrop-blur rounded-lg p-2 text-xs text-slate-500 shadow-sm border border-slate-100 flex items-center gap-1">
                <MousePointerClick size={14} /> Interactúa con el gráfico
            </div>
        </div>
    );
};

// --- COMPONENT: Compliance Table ---
const ComplianceTable = ({ rows }: { rows: { req: string, sup: string }[] }) => (
    <div className="overflow-x-auto rounded-lg border border-brand-200 dark:border-brand-900/50 mt-4">
        <table className="w-full text-sm text-left">
            <thead className="bg-brand-50 dark:bg-brand-900/30 text-brand-800 dark:text-brand-200 font-bold uppercase text-xs">
                <tr>
                    <th className="px-4 py-3 border-b border-brand-100 dark:border-brand-800 w-1/3">Elemento Requerido</th>
                    <th className="px-4 py-3 border-b border-brand-100 dark:border-brand-800">Soporte Normativo/Documental en el MIE</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-brand-50 dark:divide-slate-700 bg-white dark:bg-slate-800">
                {rows.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300 align-top">{r.req}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400 align-top">{r.sup}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// --- MAIN MODULE ---
const SECTIONS = [
    { id: 'intro', label: 'Introducción' },
    { id: 'domain1', label: 'Dominio I' },
    { id: 'domain2', label: 'Dominio II' },
    { id: 'domain3', label: 'Dominio III' },
    { id: 'domain4', label: 'Dominio IV' },
    { id: 'domain5', label: 'Dominio V' },
    { id: 'quiz', label: 'Evaluación' }
];

export const StandardsModule: React.FC<{ onComplete: (s: number) => void }> = ({ onComplete }) => {
    const [activeTab, setActiveTab] = useState('intro');
    const [selectedSegment, setSelectedSegment] = useState<any>(null);

    const currentSectionIndex = SECTIONS.findIndex(s => s.id === activeTab);
    const progressPercentage = Math.round(((currentSectionIndex + 1) / SECTIONS.length) * 100);

    const handleNext = () => {
        if (currentSectionIndex < SECTIONS.length - 1) {
            setActiveTab(SECTIONS[currentSectionIndex + 1].id);
            window.scrollTo(0,0);
        }
    };
    const handlePrev = () => {
        if (currentSectionIndex > 0) {
            setActiveTab(SECTIONS[currentSectionIndex - 1].id);
            window.scrollTo(0,0);
        }
    };

    const handleSegmentClick = (idx: number) => {
        let data = SEGMENTS_DATA[idx];
        if (!data) {
            data = EXTRA_SEGMENTS.find(e => e.index === idx) as any;
        }
        if (data) setSelectedSegment(data.details);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-24">
            
             {/* Header Navigation */}
             <div className="sticky top-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur z-30 pt-4 pb-2 border-b border-gray-200 dark:border-slate-700 mb-6">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button 
                            onClick={() => setActiveTab('intro')} 
                            className="flex items-center gap-2 p-2 px-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-brand-600 transition-colors shadow-sm"
                        >
                            <Grid size={18} />
                        </button>

                        <div className="relative group flex-1 md:flex-none">
                            <select 
                                value={activeTab} 
                                onChange={(e) => { setActiveTab(e.target.value); window.scrollTo(0,0); }}
                                className="appearance-none w-full md:w-64 pl-4 pr-8 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer shadow-sm"
                            >
                                {SECTIONS.map(s => (
                                    <option key={s.id} value={s.id}>{s.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={16} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div className="hidden md:flex items-center text-xs text-slate-400">
                        Normas Globales 2024 &bull; {SECTIONS[currentSectionIndex].label}
                    </div>
                </div>
                <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                
                {/* INTRODUCCIÓN */}
                {activeTab === 'intro' && (
                    <div className="animate-fade-in space-y-6">
                        <Card className="border-t-4 border-t-brand-500">
                            {/* Top Section: Text + SVG */}
                            <div className="grid md:grid-cols-2 gap-8 items-center mb-8">
                                <div className="space-y-4">
                                     <Badge type="brand">IIA Global</Badge>
                                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Marco Internacional de Prácticas Profesionales</h2>
                                     <p className="text-slate-600 dark:text-slate-300">El Marco Internacional de Prácticas Profesionales (MIPP®) organiza el cuerpo de conocimientos del IIA. Su actualización en 2024 define los tres componentes que guían nuestra práctica profesional:</p>
                                     
                                     <div className="bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 p-3 rounded-r-lg">
                                        <p className="font-bold text-brand-800 dark:text-brand-300 text-sm">Normas Globales &bull; Requisitos Temáticos &bull; Orientación Global</p>
                                     </div>

                                     <h3 className="font-bold text-brand-700 dark:text-brand-400 mt-4">MIPP 2017 (Sustituido)</h3>
                                     <p className="text-sm text-slate-500">El marco conceptual anterior, que incluía las Normas y Guías vigentes hasta enero de 2025.</p>

                                     <h3 className="font-bold text-brand-700 dark:text-brand-400">Normas Globales 2024</h3>
                                     <p className="text-sm text-slate-600 dark:text-slate-300">Las nuevas normas son el pilar del marco, consolidando 15 principios a través de 5 dominios clave que establecen los requisitos mínimos para la auditoría interna a nivel global.</p>
                                </div>
                                <div className="flex justify-center">
                                     <InteractiveStandardsDiagram onSelect={handleSegmentClick} />
                                </div>
                            </div>

                            {/* Bottom Section: Info Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-slate-700">
                                {[
                                    {t: 'Requisitos Obligatorios', d: 'Los principios se respaldan con prácticas obligatorias para la conformidad.'},
                                    {t: 'Evaluación Periódica', d: 'Obligación de evaluaciones internas y externas (cada 5 años) para asegurar calidad.'},
                                    {t: 'Aplicación Transversal', d: 'Cobija a toda la función de auditoría interna y su personal.'}
                                ].map((item, i) => (
                                    <div key={i} className="bg-brand-50 dark:bg-brand-900/10 p-4 rounded-xl border border-brand-100 dark:border-slate-600">
                                        <h3 className="font-bold text-brand-700 dark:text-brand-400 text-sm mb-2">{item.t}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.d}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* DOMINIOS I - V */}
                {activeTab.startsWith('domain') && (
                    <div className="animate-fade-in">
                        {/* Domain I */}
                        {activeTab === 'domain1' && (
                            <Card title="Dominio I: Propósito de la Auditoría Interna">
                                <div className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-brand-500 pl-4 bg-brand-50 dark:bg-brand-900/20 py-3 rounded-r-lg">
                                    <strong className="block text-brand-700 dark:text-brand-400 mb-1 text-lg">Propósito</strong>
                                    Asegurar que la función de auditoría interna tenga un mandato claro, aprobado y respaldado por la Alta Dirección y el CICCI, con un propósito definido, sustentado en principios éticos, independencia organizacional y orientado a fortalecer la gobernanza, la gestión de riesgos y el control.
                                </div>
                                
                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Principios y Elementos de Cumplimiento</h3>
                                <ul className="list-decimal pl-5 space-y-2 mb-8 text-slate-700 dark:text-slate-300 marker:text-brand-600 marker:font-bold">
                                    <li>Definir formalmente el propósito de la auditoría interna.</li>
                                    <li>Contar con un mandato aprobado y respaldado por el máximo órgano de gobierno.</li>
                                    <li>Adoptar un Código de Ética que asegure integridad, objetividad, competencia y confidencialidad.</li>
                                    <li>Incorporar un marco normativo integral (leyes nacionales y Normas Globales).</li>
                                    <li>Garantizar independencia y posición organizacional adecuada.</li>
                                    <li>Orientar la función a crear, proteger y mantener valor, fortaleciendo GRC e interés público.</li>
                                </ul>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Evidencia de Cumplimiento (MIE)</h3>
                                <ComplianceTable rows={[
                                    { req: 'Propósito definido formalmente', sup: 'Estatuto de Auditoría Interna (Res. 944/2024, art. 8.1).' },
                                    { req: 'Mandato aprobado y respaldado', sup: 'Estatuto (cap. 8.2) y Resolución 944/2024 que lo adopta con aprobación del CICCI (Res. 829/2024).' },
                                    { req: 'Código de Ética', sup: 'Código de Ética de Auditoría Interna (Res. 944/2024), principios: Integridad, Objetividad, Competencia y Confidencialidad.' },
                                    { req: 'Marco normativo integral', sup: 'Estatuto (cap. 5) establece cumplimiento de Ley 87/1993, Decretos y Normas Globales.' },
                                    { req: 'Independencia y posición', sup: 'Estatuto (art. 8.4): Jefatura OCI depende administrativamente de la Ministra y funcionalmente del Presidente.' },
                                    { req: 'Responsabilidad GRC', sup: 'Estatuto (arts. 8.1 y 8.2) orienta la función a objetivos estratégicos, gobernanza y riesgos.' }
                                ]} />
                                
                                <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 rounded-r-lg text-sm text-slate-700 dark:text-slate-300">
                                    <strong>📌 Conclusión práctica:</strong> El MIE cumple con el Dominio I: el propósito y mandato de la auditoría interna están definidos y formalizados mediante la Resolución 944/2024, respaldados por el CICCI.
                                </div>
                            </Card>
                        )}

                        {/* Domain II */}
                        {activeTab === 'domain2' && (
                            <Card title="Dominio II: Ética y Profesionalismo">
                                <div className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-brand-500 pl-4 bg-brand-50 dark:bg-brand-900/20 py-3 rounded-r-lg">
                                    <strong className="block text-brand-700 dark:text-brand-400 mb-1 text-lg">Propósito</strong>
                                    Asegurar que la función de auditoría interna se ejerza con integridad, objetividad, confidencialidad y competencia, con un compromiso individual y colectivo hacia la ética y el debido cuidado profesional.
                                </div>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Principios y Elementos</h3>
                                <ul className="list-decimal pl-5 space-y-2 mb-8 text-slate-700 dark:text-slate-300 marker:text-brand-600 marker:font-bold">
                                    <li>Aplicar los principios del Código de Ética.</li>
                                    <li>Mantener independencia y objetividad individual en cada encargo.</li>
                                    <li>Desarrollar y actualizar competencias de manera continua.</li>
                                    <li>Ejercer con debido cuidado profesional.</li>
                                </ul>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Evidencia de Cumplimiento (MIE)</h3>
                                <ComplianceTable rows={[
                                    { req: 'Principios éticos aplicados', sup: 'Código de Ética de Auditoría Interna (Res. 944/2024).' },
                                    { req: 'Independencia individual', sup: 'Formato ACI_P-FO-003 “Certificación de Independencia y Objetividad”.' },
                                    { req: 'Desarrollo de competencias', sup: 'ACI_P-FO-012 Plan de Desarrollo Individual y ACI_P-GU-002 Guía Administración de Personal.' },
                                    { req: 'Debido cuidado profesional', sup: 'ACI_P-MN-001 Manual de Auditoría Interna define lineamientos técnicos y criterios de calidad.' },
                                    { req: 'Manifestación de aceptación', sup: 'Anexo 1 al Código de Ética: Acta de compromiso de aplicación.' }
                                ]} />
                                
                                <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 rounded-r-lg text-sm text-slate-700 dark:text-slate-300">
                                    <strong>📌 Conclusión práctica:</strong> El MIE cumple con el Dominio II mediante la adopción de un Código de Ética, soportado en formatos de compromiso y planes de desarrollo de competencias.
                                </div>
                            </Card>
                        )}

                        {/* Domain III */}
                        {activeTab === 'domain3' && (
                            <Card title="Dominio III: Gobierno de la Función">
                                <div className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-brand-500 pl-4 bg-brand-50 dark:bg-brand-900/20 py-3 rounded-r-lg">
                                    <strong className="block text-brand-700 dark:text-brand-400 mb-1 text-lg">Propósito</strong>
                                    Garantizar que la función de auditoría interna cuente con un marco de gobierno sólido, aprobado por el máximo órgano de gobierno, con supervisión efectiva, acceso irrestricto, recursos suficientes y mecanismos de calidad.
                                </div>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Principios y Elementos</h3>
                                <ul className="list-decimal pl-5 space-y-2 mb-8 text-slate-700 dark:text-slate-300 marker:text-brand-600 marker:font-bold">
                                    <li>Aprobar y revisar periódicamente el Estatuto de Auditoría Interna.</li>
                                    <li>Respaldar la función desde el CICCI y la Alta Dirección.</li>
                                    <li>Garantizar acceso irrestricto a información, personal y activos.</li>
                                    <li>Asegurar recursos financieros, humanos y tecnológicos adecuados.</li>
                                    <li>Establecer programa de calidad con evaluaciones internas y externas.</li>
                                    <li>Facilitar relación directa entre Jefatura OCI y CICCI.</li>
                                </ul>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Evidencia de Cumplimiento (MIE)</h3>
                                <ComplianceTable rows={[
                                    { req: 'Estatuto aprobado/adoptado', sup: 'Estatuto de Auditoría Interna, adoptado por Resolución 944/2024.' },
                                    { req: 'Respaldo del CICCI', sup: 'Resolución 829/2024 que reglamenta y aprueba el CICCI, incluyendo su rol de supervisión.' },
                                    { req: 'Acceso irrestricto', sup: 'Estatuto (cap. 8.2) otorga acceso total a datos, personas y activos.' },
                                    { req: 'Recursos suficientes', sup: 'Estatuto (cap. 8.7) compromete al Ministerio a proveer recursos humanos, técnicos y financieros.' },
                                    { req: 'Evaluación externa de calidad', sup: 'Estatuto (cap. 8.6) establece obligación de evaluaciones externas del PAMC.' },
                                    { req: 'Relación directa con Consejo', sup: 'Estatuto (cap. 8.8) garantiza comunicación directa con el CICCI.' }
                                ]} />
                                
                                <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 rounded-r-lg text-sm text-slate-700 dark:text-slate-300">
                                    <strong>📌 Conclusión práctica:</strong> El MIE cumple con el Dominio III: el Estatuto está aprobado, el CICCI supervisa y respalda la función, y se garantiza acceso y recursos.
                                </div>
                            </Card>
                        )}

                        {/* Domain IV */}
                        {activeTab === 'domain4' && (
                            <Card title="Dominio IV: Gestión de la Función">
                                <div className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-brand-500 pl-4 bg-brand-50 dark:bg-brand-900/20 py-3 rounded-r-lg">
                                    <strong className="block text-brand-700 dark:text-brand-400 mb-1 text-lg">Propósito</strong>
                                    Asegurar que la función de auditoría interna se planifique, organice y gestione estratégicamente, con los recursos adecuados, comunicación efectiva y un compromiso constante con la calidad y la mejora continua.
                                </div>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Principios y Elementos</h3>
                                <ul className="list-decimal pl-5 space-y-2 mb-8 text-slate-700 dark:text-slate-300 marker:text-brand-600 marker:font-bold">
                                    <li>Planificar estratégicamente: estrategia y plan anual basados en riesgos, alineados a objetivos.</li>
                                    <li>Gestionar los recursos: suficiencia y pertinencia de recursos financieros, humanos y tecnológicos.</li>
                                    <li>Comunicar eficazmente: relaciones constructivas y comunicación clara.</li>
                                    <li>Mejorar la calidad: implementar un Programa de Aseguramiento y Mejora Continua (PAMC).</li>
                                </ul>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Evidencia de Cumplimiento (MIE)</h3>
                                <ComplianceTable rows={[
                                    { req: 'Estrategia y plan anual', sup: 'ACI_P-MN-001 Manual de Auditoría Interna, ACI_P-PR-001 Procedimiento Plan Anual y ACI_P-FO-011 Plan Anual.' },
                                    { req: 'Gestión de recursos y competencias', sup: 'ACI_P-GU-002 Guía Administración de Personal y ACI_P-FO-012 Plan de Desarrollo Individual.' },
                                    { req: 'Comunicación estratégica', sup: 'ACI_P-PO-001 Política de Comunicaciones y presentaciones periódicas de desempeño.' },
                                    { req: 'Programa de Calidad (PAMC)', sup: 'ACI_P-GU-001 Guía del PAMC, ACI_A-FO-005 Autoevaluación y ACI_R-FO-005 Informe Autoevaluación.' },
                                    { req: 'Medición de desempeño', sup: 'ACI_S-FO-002 Seguimiento Indicadores de Desempeño de la Función.' }
                                ]} />
                                
                                <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 rounded-r-lg text-sm text-slate-700 dark:text-slate-300">
                                    <strong>📌 Conclusión práctica:</strong> El MIE cumple con el Dominio IV a través de un marco estratégico: Manual y Plan Anual definen la estrategia; y la Guía del PAMC garantiza la calidad.
                                </div>
                            </Card>
                        )}

                        {/* Domain V */}
                        {activeTab === 'domain5' && (
                            <Card title="Dominio V: Desempeño de los Servicios">
                                <div className="mb-6 text-slate-600 dark:text-slate-300 leading-relaxed border-l-4 border-brand-500 pl-4 bg-brand-50 dark:bg-brand-900/20 py-3 rounded-r-lg">
                                    <strong className="block text-brand-700 dark:text-brand-400 mb-1 text-lg">Propósito</strong>
                                    Asegurar que los trabajos de auditoría interna se planifiquen, ejecuten, documenten y comuniquen de manera sistemática, con base en riesgos y evidencia suficiente, aportando valor a través de conclusiones claras.
                                </div>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Principios y Elementos</h3>
                                <ul className="list-decimal pl-5 space-y-2 mb-8 text-slate-700 dark:text-slate-300 marker:text-brand-600 marker:font-bold">
                                    <li>Planificación de trabajos de aseguramiento y consultoría.</li>
                                    <li>Ejecución de pruebas y análisis con evidencia suficiente.</li>
                                    <li>Documentación de papeles de trabajo que respalde conclusiones.</li>
                                    <li>Comunicación de resultados clara y oportuna.</li>
                                    <li>Seguimiento a planes de mejoramiento.</li>
                                </ul>

                                <h3 className="font-bold text-lg text-brand-700 dark:text-brand-400 mb-4 border-l-4 border-brand-500 pl-3">Evidencia de Cumplimiento (MIE)</h3>
                                <ComplianceTable rows={[
                                    { req: 'Planificación de trabajos', sup: 'ACI_P-FO-004 Memorando de Planificación, ACI_P-FO-009 Planificación Responsable.' },
                                    { req: 'Ejecución de programas', sup: 'ACI_A-PR-001 Procedimiento Trabajos de Aseguramiento, ACI_A-PR-002 Procedimiento Consultoría.' },
                                    { req: 'Documentación de evidencias', sup: 'ACI_P-FO-001 Memorando, ACI_P-FO-007 Carta de Representación, Papeles de Trabajo.' },
                                    { req: 'Comunicación de resultados', sup: 'ACI_R-FO-001 Presentación, ACI_R-FO-002 Informe Cierre, ACI_R-FO-003 Informe Final.' },
                                    { req: 'Seguimiento', sup: 'ACI_S-PR-001 Procedimiento Planes de Mejoramiento, ACI_S-IN-001 Instructivo SIRECI.' }
                                ]} />
                                
                                <div className="mt-6 p-4 bg-brand-50 dark:bg-brand-900/20 border-l-4 border-brand-500 rounded-r-lg text-sm text-slate-700 dark:text-slate-300">
                                    <strong>📌 Conclusión práctica:</strong> El MIE cumple con el Dominio V: los procedimientos y formatos aseguran que los trabajos se planifican, ejecutan, documentan y comunican según las Normas.
                                </div>
                            </Card>
                        )}
                    </div>
                )}

                {/* EVALUACIÓN */}
                {activeTab === 'quiz' && (
                    <div className="animate-fade-in">
                        <Quiz 
                            questions={[
                                { id: 1, question: "¿Cuántos dominios tienen las Normas Globales 2024?", options: ["3", "5", "10"], correctAnswer: 1 },
                                { id: 2, question: "El principio de 'Debido Cuidado Profesional' pertenece al dominio:", options: ["Propósito", "Ética y Profesionalismo", "Gestión"], correctAnswer: 1 },
                                { id: 3, question: "¿Cuál es el propósito del Dominio III?", options: ["Gobierno de la Función", "Ejecución de Trabajos", "Planificación Anual"], correctAnswer: 0 },
                                { id: 4, question: "Según el MIE, ¿qué documento soporta el propósito formal de la OCI?", options: ["Manual de Funciones", "Estatuto de Auditoría Interna (Res. 944)", "Plan Nacional de Desarrollo"], correctAnswer: 1 },
                                { id: 5, question: "¿Qué dominio exige un programa de calidad (PAMC)?", options: ["Dominio IV", "Dominio II", "Dominio V"], correctAnswer: 0 }
                            ]}
                            onComplete={onComplete}
                        />
                    </div>
                )}

            </div>

             {/* Footer Navigation */}
             <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="flex gap-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 pointer-events-auto">
                    <button 
                        onClick={handlePrev} 
                        disabled={currentSectionIndex <= 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        <ArrowLeft size={16} /> Anterior
                    </button>
                    <div className="w-px bg-gray-300 dark:bg-slate-600"></div>
                    <button 
                        onClick={handleNext}
                        disabled={currentSectionIndex >= SECTIONS.length - 1}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/30 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        Siguiente <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* SEGMENT DETAILS MODAL */}
            {selectedSegment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in" onClick={() => setSelectedSegment(null)}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors" onClick={() => setSelectedSegment(null)}>
                            <X size={24} />
                        </button>
                        <h3 className="text-xl font-bold text-brand-700 dark:text-brand-400 mb-4 pr-8 border-b border-gray-100 dark:border-slate-700 pb-2">{selectedSegment.title}</h3>
                        <div className="overflow-y-auto max-h-[60vh] text-sm">
                            {selectedSegment.body}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};