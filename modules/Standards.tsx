
import React, { useState, useEffect, useRef } from 'react';
import { Card, Badge, Quiz, Accordion } from '../components/UI';
import { IIA_LOGO_BASE64 } from '../components/LogoData';
import { 
  ArrowLeft, ArrowRight, CheckCircle, 
  BookOpen, Scale, Landmark, Settings, 
  Activity, FileCheck, Lock, LayoutGrid, Clock,
  AlertCircle, ShieldAlert, Zap
} from 'lucide-react';
import { QuizState } from '../types';

// --- GEOMETRÍA PARA EL DIAGRAMA DEL MARCO (EL "TRIÁNGULO" CIRCULAR) ---
const OUTER_R = 150;
const INNER_R = 92;
const RING_GREEN_R = 170;
const RING_BLUE_R = 205;
const CORNER_RADIUS = 8;
const GAP_DEG = 5.2;
const START_OFFSET = -126;
const RAD = Math.PI / 180;

function arcPath(R: number, a0: number, a1: number, reverse = false) {
  const largeArc = (a1 - a0) > Math.PI ? 1 : 0;
  const x0 = R * Math.cos(a0), y0 = R * Math.sin(a0);
  const x1 = R * Math.cos(a1), y1 = R * Math.sin(a1);
  return reverse 
    ? `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 0 ${x0} ${y0}`
    : `M ${x0} ${y0} A ${R} ${R} 0 ${largeArc} 1 ${x1} ${y1}`;
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
    `M ${p_bl_line_start.x} ${p_bl_line_start.y} L ${p_tl_line_end.x} ${p_tl_line_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_tl_arc_start.x} ${p_tl_arc_start.y}`,
    `A ${Ro} ${Ro} 0 ${largeArc} 1 ${p_tr_arc_end.x} ${p_tr_arc_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_tr_line_start.x} ${p_tr_line_start.y} L ${p_br_line_end.x} ${p_br_line_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_br_arc_start.x} ${p_br_arc_start.y}`,
    `A ${Ri} ${Ri} 0 ${largeArc} 0 ${p_bl_arc_end.x} ${p_bl_arc_end.y}`,
    `A ${cr} ${cr} 0 0 1 ${p_bl_line_start.x} ${p_bl_line_start.y} Z`
  ].join(' ');
}

// --- SECCIONES ---
const SECTIONS = [
  { id: 'introduccion', label: 'Mandala Global', icon: BookOpen, desc: 'Visualización integral del Marco 2024.' },
  { id: 'dominio-i', label: 'Dominio I', icon: Landmark, desc: 'Propósito y Mandato Legal.' },
  { id: 'dominio-ii', label: 'Dominio II', icon: Scale, desc: 'Ética y Conducta del Auditor.' },
  { id: 'dominio-iii', label: 'Dominio III', icon: Settings, desc: 'Gobierno y CICCI.' },
  { id: 'dominio-iv', label: 'Dominio IV', icon: Activity, desc: 'Gestión de la OCI.' },
  { id: 'dominio-v', label: 'Dominio V', icon: FileCheck, desc: 'Ejecución de Auditorías.' },
  { id: 'evaluacion', label: 'Examen Técnico', icon: CheckCircle, desc: 'Certificación del Módulo.' }
];

const DOMAINS_GRAPHIC = [
  { id: 'dominio-iii', color: '#1E3A8A', lines: ["de Auditoría Interna", "de la Función", "GOBIERNO"], reverse: false },
  { id: 'dominio-iv', color: '#3B82F6', lines: ["de Auditoría Interna", "de la Función", "GESTIÓN"], reverse: false },
  { id: 'dominio-v', color: '#1E3A8A', lines: ["de Auditoría Interna", "de los Servicios", "DESEMPEÑO"], reverse: true },
  { id: 'dominio-i', color: '#1E40AF', lines: ["", "de la Auditoría Interna", "PROPÓSITO"], reverse: true },
  { id: 'dominio-ii', color: '#1D4ED8', lines: ["", "PROFESIONALIDAD", "ÉTICA Y"], reverse: false },
];

export const StandardsModule: React.FC<{ onComplete: any, onTimeUpdate: any, saveProgress: any, data: QuizState }> = ({ onComplete, onTimeUpdate, saveProgress, data }) => {
  const [activeTab, setActiveTab] = useState('menu');
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

  const currentIndex = SECTIONS.findIndex(s => s.id === activeTab);
  const nextSection = SECTIONS[currentIndex + 1];
  const prevSection = SECTIONS[currentIndex - 1];

  const navigateTo = (id: string) => {
    if (id === 'evaluacion' && isLocked) return;
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const RenderComplianceTable = ({ rows }: { rows: { item: string, support: string }[] }) => (
    <div className="overflow-x-auto rounded-xl border border-brand-100 bg-white shadow-sm my-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-brand-50 text-brand-700 font-bold uppercase tracking-wider text-[10px]">
          <tr>
            <th className="p-3 border-b border-brand-100">Elemento Normativo</th>
            <th className="p-3 border-b border-brand-100">Evidencia en OCI-MinIgualdad</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="p-3 font-bold text-slate-800 align-top w-1/3 leading-tight">{row.item}</td>
              <td className="p-3 text-slate-600 align-top text-xs font-medium">{row.support}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const AuditCase = ({ title, caseText, solution }: { title: string, caseText: string, solution: string }) => (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl my-6">
        <div className="flex items-center gap-2 mb-3 text-amber-800">
            <ShieldAlert size={20} />
            <h4 className="font-black uppercase text-sm tracking-tighter">Reto para el Auditor: {title}</h4>
        </div>
        <p className="text-slate-700 text-sm mb-4 italic">"{caseText}"</p>
        <Accordion title="¿Cómo proceder según la Norma?">
            <div className="text-sm font-medium text-slate-700">{solution}</div>
        </Accordion>
    </div>
  );

  if (activeTab === 'menu') {
    return (
      <div className="space-y-8 animate-fade-in pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Badge type="brand">Módulo 3</Badge>
            <h1 className="text-4xl font-black text-slate-900 mt-2 tracking-tighter uppercase">Normas Globales 2024</h1>
            <p className="text-slate-500 font-medium">Dominio técnico para el equipo de la OCI.</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 text-brand-600">
            <Clock size={24}/>
            <p className="font-mono font-black text-lg">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const locked = section.id === 'evaluacion' && isLocked;
            return (
              <button
                key={section.id}
                onClick={() => !locked && navigateTo(section.id)}
                className={`group p-8 bg-white rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden ${locked ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-brand-500 border-transparent shadow-xl shadow-slate-200/50'}`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${locked ? 'bg-slate-100 text-slate-400' : 'bg-brand-50 text-brand-600'}`}>
                    {locked ? <Lock size={28}/> : <section.icon size={28}/>}
                </div>
                <h3 className="font-black text-xl text-slate-900 mb-2 leading-tight">{section.label}</h3>
                <p className="text-sm text-slate-500 font-medium">{section.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-32 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md py-4 z-20 border-b border-slate-200 px-2">
        <div className="flex items-center gap-4">
            <button onClick={() => setActiveTab('menu')} className="p-2 hover:bg-brand-50 rounded-xl text-brand-600 transition-colors">
                <LayoutGrid size={24} />
            </button>
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Módulo 3 - {SECTIONS[currentIndex].label}</h2>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {SECTIONS.length}</div>
      </div>

      <main className="min-h-[50vh] px-2 md:px-0">
        {activeTab === 'introduccion' && (
          <div className="space-y-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge type="brand">IPPF 2024</Badge>
                <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tighter uppercase">El Mandala del Marco Internacional</h2>
                <p className="text-lg text-slate-600 font-medium leading-relaxed">Las Normas Globales se estructuran en este diagrama circular. Haz clic en el siguiente dominio para profundizar.</p>
                
                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="bg-brand-500 text-white p-2 rounded-lg font-black text-xs">1</div>
                        <p className="text-sm font-bold text-slate-700"><strong>5 Dominios:</strong> Organizan los requisitos para las distintas partes interesadas.</p>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="bg-brand-500 text-white p-2 rounded-lg font-black text-xs">2</div>
                        <p className="text-sm font-bold text-slate-700"><strong>15 Principios:</strong> El "qué" debemos lograr como auditores.</p>
                    </div>
                </div>
              </div>
              <div className="flex justify-center py-10 bg-white rounded-[4rem] shadow-2xl border border-slate-100">
                <svg viewBox="0 0 450 450" className="w-full h-auto max-w-[400px] overflow-visible drop-shadow-2xl">
                  <g transform="translate(225, 225)">
                    <circle r={RING_BLUE_R} fill="none" stroke="#3B82F6" strokeWidth="26" className="opacity-20" />
                    <text className="fill-blue-700 font-black text-[12px] uppercase"><textPath href="#p1" startOffset="50%" textAnchor="middle">Orientación Global</textPath></text>
                    <path id="p1" d={arcPath(RING_BLUE_R, -150 * RAD, -30 * RAD)} fill="none" />
                    <circle r={RING_GREEN_R} fill="none" stroke="#A9D34A" strokeWidth="24" className="opacity-30" />
                    <text className="fill-green-800 font-black text-[10px] uppercase"><textPath href="#p2" startOffset="50%" textAnchor="middle">Requisitos Temáticos</textPath></text>
                    <path id="p2" d={arcPath(RING_GREEN_R, -135 * RAD, 45 * RAD)} fill="none" />
                    {DOMAINS_GRAPHIC.map((d, i) => {
                      const full = 360 / 5;
                      const span = full - GAP_DEG;
                      const start = START_OFFSET + i * full + GAP_DEG / 2;
                      const a0 = start * RAD, a1 = (start + span) * RAD;
                      return (
                        <g key={d.id} className="cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigateTo(d.id)}>
                          <path d={roundedRingSegmentPath(OUTER_R, INNER_R, a0, a1, CORNER_RADIUS)} fill={d.color} />
                          {d.lines.map((line, idx) => {
                            const rPos = d.reverse ? INNER_R + 25 + (idx * 14) : OUTER_R - 26 - (idx * 14);
                            return line && (
                              <React.Fragment key={idx}>
                                <path id={`pt-${d.id}-${idx}`} d={arcPath(rPos, a0 + 0.1, a1 - 0.1, d.reverse)} fill="none" />
                                <text className="fill-white text-[9px] font-black uppercase pointer-events-none">
                                  <textPath href={`#pt-${d.id}-${idx}`} startOffset="50%" textAnchor="middle">{line}</textPath>
                                </text>
                              </React.Fragment>
                            );
                          })}
                        </g>
                      );
                    })}
                    <circle r="65" fill="white" />
                    <image href={IIA_LOGO_BASE64} x="-42" y="-55" height="85" width="85" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* DOMINIO I: PROPÓSITO */}
        {activeTab === 'dominio-i' && (
          <div className="space-y-6">
            <div className="p-8 bg-brand-50 border-l-8 border-brand-500 rounded-[2.5rem] shadow-sm">
               <h3 className="text-2xl font-black text-brand-700 mb-4 uppercase tracking-tighter">Propósito del Auditor Interno</h3>
               <p className="text-slate-700 leading-relaxed font-bold text-lg">"Fortalecer la capacidad de la organización para crear, proteger y sostener valor".</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card title="Conceptos Clave" className="bg-white rounded-3xl">
                    <ul className="space-y-3 text-sm font-medium text-slate-600">
                        <li className="flex gap-2"><Zap size={16} className="text-brand-500 shrink-0"/> Mandato: Autoridad legal para auditar.</li>
                        <li className="flex gap-2"><Zap size={16} className="text-brand-500 shrink-0"/> Valor añadido: No solo hallazgos, sino mejoras estratégicas.</li>
                    </ul>
                </Card>
                <div className="p-6 bg-slate-900 rounded-3xl text-white">
                    <h4 className="font-black uppercase text-xs text-brand-400 mb-2">Base Legal MinIgualdad</h4>
                    <p className="text-xs leading-relaxed opacity-80">El Estatuto de Auditoría (Res. 944/2024) es nuestra 'Constitución'. Sin esto, el auditor no tiene dientes para pedir información.</p>
                </div>
            </div>

            <RenderComplianceTable rows={[
              { item: "Mandato y Autoridad", support: "Estatuto de Auditoría Interna (Res. 944/2024, cap. 8.2)." },
              { item: "Independencia de Reporte", support: "Dependencia administrativa de la Ministra y técnica del CICCI." }
            ]} />

            <AuditCase 
                title="Mandato Irrestricto"
                caseText="Un directivo del Ministerio se niega a entregar las claves de acceso a un software de gestión alegando que contiene 'datos sensibles' de la población vulnerable."
                solution="Según el Dominio I y el Estatuto de Auditoría (Art 8.2), la OCI tiene acceso irrestricto a datos, personas y activos. Se debe recordar el mandato legal y, si persiste, reportar al CICCI como una limitación al alcance."
            />
          </div>
        )}

        {/* DOMINIO II: ÉTICA */}
        {activeTab === 'dominio-ii' && (
          <div className="space-y-6">
            <div className="p-8 bg-brand-50 border-l-8 border-brand-500 rounded-[2.5rem]">
               <h3 className="text-2xl font-black text-brand-700 mb-4 uppercase tracking-tighter">Ética y Profesionalismo</h3>
               <p className="text-slate-700 font-medium leading-relaxed">No basta con ser un buen técnico; hay que ser íntegro. El cuidado profesional es el nivel de rigor que cualquier otro auditor diligente aplicaría.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card title="Los 5 Innegociables" className="rounded-3xl">
                    <div className="grid grid-cols-1 gap-2">
                        {['Integridad', 'Objetividad', 'Competencia', 'Cuidado Profesional', 'Confidencialidad'].map(e => (
                            <div key={e} className="p-2 bg-slate-50 border rounded-xl text-xs font-black text-slate-600 text-center uppercase tracking-widest">{e}</div>
                        ))}
                    </div>
                </Card>
                <Card title="Evidencia OCI" className="rounded-3xl">
                    <p className="text-xs text-slate-500 mb-4 font-medium">Cada auditor debe firmar individualmente su independencia.</p>
                    <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl">
                        <span className="font-black text-brand-700 text-xs uppercase block mb-1">Formato Clave:</span>
                        <code className="text-brand-900 font-mono text-sm">ACI_P-FO-003</code>
                    </div>
                </Card>
            </div>

            <AuditCase 
                title="Conflicto de Interés"
                caseText="Te asignan auditar el proceso de contratación donde tu mejor amigo es el líder técnico de la licitación."
                solution="El Dominio II exige objetividad. Debes declarar el conflicto de interés mediante el formato ACI_P-FO-003 antes de iniciar el encargo y solicitar que otro compañero realice la prueba sobre ese ítem específico."
            />
          </div>
        )}

        {/* DOMINIO III: GOBIERNO */}
        {activeTab === 'dominio-iii' && (
          <div className="space-y-6">
            <div className="p-8 bg-brand-50 border-l-8 border-brand-500 rounded-[2.5rem]">
               <h3 className="text-2xl font-black text-brand-700 mb-4 uppercase tracking-tighter">Gobierno de la Función</h3>
               <p className="text-slate-700 font-medium leading-relaxed">El Jefe de la OCI no es una isla. Su relación con el **CICCI** y la **Ministra** garantiza que las recomendaciones se cumplan.</p>
            </div>

            <RenderComplianceTable rows={[
              { item: "Supervisión del CICCI", support: "Resolución 829/2024 (Reglamentación del Comité)." },
              { item: "Comunicación Directa", support: "Estatuto de Auditoría (Cap. 8.8) - Comunicación sin filtros con la Dirección." }
            ]} />

            <div className="p-6 bg-slate-900 rounded-3xl text-white">
                <h4 className="font-black text-brand-400 uppercase text-xs mb-4">Métricas de Gobierno</h4>
                <p className="text-sm leading-relaxed mb-4">¿Cómo sabe el CICCI que la OCI funciona bien?</p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-white/20 p-3 rounded-xl text-center"><span className="block font-black text-lg">PAMC</span><span className="text-[10px] uppercase opacity-60">Calidad Continua</span></div>
                    <div className="border border-white/20 p-3 rounded-xl text-center"><span className="block font-black text-lg">QAIP</span><span className="text-[10px] uppercase opacity-60">Mejora Externa</span></div>
                </div>
            </div>
          </div>
        )}

        {/* DOMINIO IV: GESTIÓN */}
        {activeTab === 'dominio-iv' && (
          <div className="space-y-6">
            <div className="p-8 bg-brand-50 border-l-8 border-brand-500 rounded-[2.5rem]">
               <h3 className="text-2xl font-black text-brand-700 mb-4 uppercase tracking-tighter">Gestión Estratégica (OCI)</h3>
               <p className="text-slate-700 font-medium leading-relaxed">La OCI debe gestionarse como una pequeña empresa dentro del Ministerio: con presupuesto, recursos humanos y un plan anual basado en **RIESGOS**.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { h: 'Humano', t: 'ACI_P-FO-012 PDI', d: 'Planes de Desarrollo Individual.' },
                    { h: 'Financiero', t: 'Presupuesto OCI', d: 'Rubros asignados para capacitación.' },
                    { h: 'Tecnológico', t: 'Software/Nube', d: 'Herramientas de análisis de datos.' }
                ].map(r => (
                    <div key={r.h} className="bg-white p-6 rounded-3xl border shadow-sm">
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">{r.h}</span>
                        <h4 className="font-bold text-slate-800 text-sm my-1">{r.t}</h4>
                        <p className="text-xs text-slate-500">{r.d}</p>
                    </div>
                ))}
            </div>

            <RenderComplianceTable rows={[
              { item: "Plan Anual de Auditoría", support: "ACI_P-PR-001 (Procedimiento) y ACI_P-FO-011 (Formato aprobado)." },
              { item: "Comunicación Estratégica", support: "Presentación trimestral de indicadores al CICCI." }
            ]} />
          </div>
        )}

        {/* DOMINIO V: DESEMPEÑO */}
        {activeTab === 'dominio-v' && (
          <div className="space-y-6">
            <div className="p-8 bg-brand-50 border-l-8 border-brand-500 rounded-[2.5rem]">
               <h3 className="text-2xl font-black text-brand-700 mb-4 uppercase tracking-tighter">Desempeño de los Servicios</h3>
               <p className="text-slate-700 font-medium leading-relaxed">Aquí es donde "la carne" se cocina. Son los pasos reales de una auditoría: Planear, Ejecutar, Comunicar y Seguir.</p>
            </div>

            <div className="space-y-4">
                <Accordion title="Paso 1: Planificación (Memorando)">
                    <p className="text-xs">Uso obligatorio del <strong>ACI_P-FO-004</strong>. No se puede auditar 'todo'; el alcance debe ser preciso.</p>
                </Accordion>
                <Accordion title="Paso 2: Ejecución (Papeles de Trabajo)">
                    <p className="text-xs">La evidencia debe ser autosuficiente. Si un auditor externo lee tu papel de trabajo, debe llegar a la misma conclusión sin preguntarte.</p>
                </Accordion>
                <Accordion title="Paso 3: Informe y Cierre">
                    <p className="text-xs">Uso del <strong>ACI_R-FO-003</strong>. Los hallazgos deben tener: Condición, Criterio, Causa y Efecto.</p>
                </Accordion>
                <Accordion title="Paso 4: Seguimiento (La Matriz)">
                    <p className="text-xs">Seguimiento constante vía <strong>ACI_R-FO-004</strong>. Una auditoría sin seguimiento es solo papel desperdiciado.</p>
                </Accordion>
            </div>

            <AuditCase 
                title="Hallazgo sin Causa"
                caseText="Encuentras que el 30% de las cajas menores no tienen facturas originales, pero en el informe solo pones 'no hay facturas'. El auditado dice que no sabe por qué pasó."
                solution="El Dominio V exige identificar la CAUSA. Si no investigas la causa (ej. falta de capacitación o dolo), la acción de mejora fallará. No cierres el informe hasta tener la causa raíz."
            />
          </div>
        )}

        {activeTab === 'evaluacion' && (
          <Quiz 
            questions={[
              { id: 1, question: "Si un directivo niega información al auditor, ¿qué principio del Dominio I se está vulnerando?", options: ["Objetividad", "Mandato y Autoridad", "Mejora Continua"], correctAnswer: 1 },
              { id: 2, question: "¿Cuál es el formato institucional de MinIgualdad para declarar independencia antes de un encargo?", options: ["ACI_P-FO-011", "ACI_P-FO-003", "ACI_R-FO-004"], correctAnswer: 1 },
              { id: 3, question: "Según el Dominio V, ¿qué componente es vital para que una acción de mejora sea efectiva?", options: ["El Efecto", "La Causa Raíz", "La Condición"], correctAnswer: 1 }
            ]}
            onComplete={onComplete}
          />
        )}
      </main>

      {/* BARRA DE NAVEGACIÓN FLUIDA (FOOTER) */}
      {activeTab !== 'evaluacion' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-30">
          <div className="bg-slate-900 text-white p-2 rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/10">
            {prevSection ? (
              <button 
                onClick={() => navigateTo(prevSection.id)}
                className="p-4 hover:bg-white/10 rounded-full transition-colors flex items-center gap-2"
                title="Anterior"
              >
                <ArrowLeft size={20} />
              </button>
            ) : <div className="w-12"></div>}

            <button 
                onClick={() => navigateTo('menu')} 
                className="p-4 hover:bg-white/10 rounded-full transition-colors"
                title="Menú del Módulo"
            >
                <LayoutGrid size={20} />
            </button>

            {nextSection && (
              <button 
                onClick={() => navigateTo(nextSection.id)}
                className={`p-4 pl-6 pr-6 bg-brand-600 hover:bg-brand-500 rounded-full transition-all flex items-center gap-3 text-sm font-black uppercase tracking-tighter ${nextSection.id === 'evaluacion' && isLocked ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
              >
                <span className="hidden sm:inline">{nextSection.id === 'evaluacion' ? 'Finalizar' : nextSection.label}</span>
                <ArrowRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
