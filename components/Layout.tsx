
import React, { useState } from 'react';
import { Menu, X, BookOpen, ShieldCheck, Target, Search, BarChart2, Calculator, Sun, Moon, LogOut, ChevronRight } from 'lucide-react';
import { ModuleId, ModuleConfig, ProgressMap, User } from '../types';
import { MinistryLogo } from './UI';

interface LayoutProps {
  currentModule: ModuleId;
  onModuleChange: (id: ModuleId) => void;
  progress: ProgressMap;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  darkMode: boolean;
  toggleTheme: () => void;
}

const MODULES: ModuleConfig[] = [
  { id: 'dashboard', title: 'Inicio / Dashboard', icon: BarChart2, description: 'Resumen y Novedades', duration: '-' },
  { id: 'strategic', title: 'Plataforma Estratégica', icon: Target, description: 'Misión, Visión y Organigrama', duration: '30 min' },
  { id: 'mipg', title: 'MIPG - SIG', icon: BookOpen, description: 'Modelo Integrado de Planeación', duration: '45 min' },
  { id: 'standards', title: 'Normas Globales 2024', icon: ShieldCheck, description: 'Marco Internacional IIA', duration: '60 min' },
  { id: 'forensic', title: 'Auditoría Forense', icon: Search, description: 'Detección de fraude', duration: '50 min' },
  { id: 'tools', title: 'Calculadora de Muestreo', icon: Calculator, description: 'Herramienta Técnica', duration: '-' },
];

export const Layout: React.FC<LayoutProps> = ({ currentModule, onModuleChange, progress, user, onLogout, children, darkMode, toggleTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getProgressColor = (id: ModuleId) => {
    const mod = progress[id];
    if (mod?.completed) return 'bg-green-500';
    if (id === currentModule) return 'bg-brand-500';
    return 'bg-gray-200 dark:bg-slate-700';
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
            <MinistryLogo variant="horizontal" className="scale-90 origin-left" />
        </div>
        <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-gray-100">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setSidebarOpen(true)} className="p-3 rounded-lg bg-gray-100">
                <Menu size={24} />
            </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div className="flex-1">
             <MinistryLogo variant="horizontal" className="mb-4" />
             <div className="px-1 border-l-4 border-brand-500 pl-3">
                <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Oficina de Control Interno</p>
             </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden p-3 text-slate-400"><X size={24} /></button>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 flex items-center justify-between border-b">
             <div className="min-w-0">
                <p className="text-[10px] uppercase text-slate-400 font-bold">Usuario OCI</p>
                <p className="font-bold text-sm text-slate-700 truncate">{user.name}</p>
             </div>
             <button onClick={onLogout} title="Cerrar Sesión" className="p-2 text-slate-400 hover:text-red-600"><LogOut size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Plan de Formación</div>
          {MODULES.map((module) => {
             const Icon = module.icon;
             const isActive = currentModule === module.id;
             const isDone = progress[module.id]?.completed;
             
             return (
              <button
                key={module.id}
                onClick={() => { onModuleChange(module.id); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-3 py-4 md:py-3.5 rounded-xl transition-all ${isActive ? 'bg-brand-50 text-brand-800 font-semibold ring-1 ring-brand-100' : 'text-slate-600 hover:bg-gray-100'}`}
              >
                <div className={`relative p-1.5 rounded-lg ${isActive ? 'bg-white text-brand-600' : 'text-slate-400'}`}>
                    <Icon size={20} />
                    {isDone && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>}
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm leading-tight">{module.title}</p>
                    {module.duration !== '-' && <p className="text-[10px] opacity-70 mt-0.5 font-normal">{module.duration}</p>}
                </div>
                {isActive && <ChevronRight size={16} className="text-brand-500 opacity-50" />}
              </button>
             );
          })}
        </nav>

        <div className="p-4 border-t bg-gray-50/50">
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="font-bold text-xs mb-1.5">Progreso Global</p>
                    <div className="flex gap-1 h-1.5 mb-2 bg-black/20 rounded-full overflow-hidden p-0.5">
                        {MODULES.filter(m => ['strategic', 'mipg', 'standards', 'forensic'].includes(m.id)).map(m => (
                            <div key={m.id} className={`flex-1 rounded-full h-full ${getProgressColor(m.id as ModuleId)}`}></div>
                        ))}
                    </div>
                    <p className="text-[10px] opacity-90">Completa los 4 módulos para certificar.</p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-gray-50 dark:bg-slate-900">
        <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
           {children}
        </div>
        <footer className="mt-auto text-center text-slate-400 text-xs py-8 border-t mx-8">
            <p className="font-semibold">Ministerio de Igualdad y Equidad</p>
            <p>Oficina de Control Interno &bull; Campus Virtual v2.0</p>
        </footer>
      </main>
    </div>
  );
};
