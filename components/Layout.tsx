import React, { useState } from 'react';
import { Menu, X, BookOpen, UserCheck, ShieldCheck, Target, Search, BarChart2 } from 'lucide-react';
import { ModuleId, ModuleConfig, ProgressMap } from '../types';

interface LayoutProps {
  currentModule: ModuleId;
  onModuleChange: (id: ModuleId) => void;
  progress: ProgressMap;
  children: React.ReactNode;
}

const MODULES: ModuleConfig[] = [
  { id: 'dashboard', title: 'Inicio / Progreso', icon: BarChart2, description: 'Resumen de avance', duration: '-' },
  { id: 'strategic', title: 'Plataforma Estratégica', icon: Target, description: 'Misión, Visión y Organigrama', duration: '30 min' },
  { id: 'mipg', title: 'MIPG - SIG', icon: BookOpen, description: 'Modelo Integrado de Planeación', duration: '45 min' },
  { id: 'standards', title: 'Normas Globales 2024', icon: ShieldCheck, description: 'Marco Internacional IIA', duration: '60 min' },
  { id: 'competencies', title: 'Competencias Auditor', icon: UserCheck, description: 'Habilidades clave', duration: '40 min' },
  { id: 'forensic', title: 'Auditoría Forense', icon: Search, description: 'Detección de fraude', duration: '50 min' },
];

export const Layout: React.FC<LayoutProps> = ({ currentModule, onModuleChange, progress, children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getProgressColor = (id: ModuleId) => {
    const mod = progress[id];
    if (mod?.completed) return 'bg-green-500';
    if (id === currentModule) return 'bg-brand-500';
    return 'bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-slate-800">Campus OCI</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 hover:bg-gray-100 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-200">
                <ShieldCheck size={20} />
             </div>
             <div>
                <h1 className="font-bold text-lg leading-tight">MinIgualdad</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">OFICINA CONTROL INTERNO</p>
             </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-88px)]">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Módulos de Formación</div>
          {MODULES.map((module) => {
             const Icon = module.icon;
             const isActive = currentModule === module.id;
             const isDone = progress[module.id]?.completed;
             
             return (
              <button
                key={module.id}
                onClick={() => { onModuleChange(module.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left
                  ${isActive 
                    ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-100' 
                    : 'text-slate-600 hover:bg-gray-50 hover:text-brand-600'}
                `}
              >
                <div className={`relative p-2 rounded-lg transition-colors ${isActive ? 'bg-white' : 'bg-gray-100 group-hover:bg-white'}`}>
                    <Icon size={18} className={isActive ? 'text-brand-600' : 'text-slate-500'} />
                    {isDone && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm">{module.title}</p>
                    <p className="text-xs opacity-70 truncate">{module.description}</p>
                </div>
              </button>
             );
          })}
          
          <div className="mt-8 px-4">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 text-white shadow-lg shadow-brand-200">
                <p className="font-bold text-sm mb-1">Tu Progreso</p>
                <div className="flex gap-1 h-2 mb-2">
                    {MODULES.filter(m => m.id !== 'dashboard').map(m => (
                        <div key={m.id} className={`flex-1 rounded-full ${getProgressColor(m.id)}`}></div>
                    ))}
                </div>
                <p className="text-xs opacity-80">Continúa tu aprendizaje para certificar tus conocimientos.</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
           {children}
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-sm py-8 border-t border-gray-100">
            <p>Ministerio de Igualdad y Equidad - Oficina de Control Interno</p>
            <p className="text-xs mt-1">Material educativo para uso interno.</p>
        </footer>
      </main>
    </div>
  );
};