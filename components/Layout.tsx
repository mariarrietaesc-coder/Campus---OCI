
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
  { id: 'tools', title: 'Herramientas Auditor', icon: Calculator, description: 'Calculadora de Muestreo', duration: '-' },
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
      
      {/* --- Mobile Header --- */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-2">
            <MinistryLogo variant="horizontal" className="scale-90 origin-left" />
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleTheme} 
                className="p-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Alternar tema"
            >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-3 rounded-lg bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-200 dark:hover:bg-slate-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500"
                aria-label="Abrir menú"
            >
                <Menu size={24} />
            </button>
        </div>
      </div>

      {/* --- Mobile Backdrop Overlay --- */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={closeSidebar}
            aria-hidden="true"
        />
      )}

      {/* --- Sidebar --- */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 shadow-2xl md:shadow-none
        transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        md:relative md:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-start">
          <div className="flex-1">
             <MinistryLogo variant="horizontal" className="mb-4" />
             <div className="px-1 border-l-4 border-brand-500 pl-3">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase leading-tight">Oficina de<br/>Control Interno</p>
             </div>
          </div>
          <button 
            onClick={closeSidebar}
            className="md:hidden p-3 -mt-2 -mr-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors active:scale-95"
            aria-label="Cerrar menú"
          >
            <X size={24} />
          </button>
        </div>

        {/* User Info (Compact) */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900/50 flex items-center justify-between border-b border-gray-100 dark:border-slate-700">
             <div className="min-w-0">
                <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Usuario</p>
                <p className="font-bold text-sm text-slate-700 dark:text-slate-200 truncate">{user.name}</p>
             </div>
             <button onClick={onLogout} title="Cerrar Sesión" className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                <LogOut size={18} />
             </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          <div className="px-3 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Módulos de Formación</div>
          {MODULES.map((module) => {
             const Icon = module.icon;
             const isActive = currentModule === module.id;
             const isDone = progress[module.id]?.completed;
             
             return (
              <button
                key={module.id}
                onClick={() => { onModuleChange(module.id); closeSidebar(); }}
                className={`w-full flex items-center gap-3 px-3 py-4 md:py-3.5 rounded-xl transition-all duration-200 group text-left relative overflow-hidden active:scale-[0.98]
                  ${isActive 
                    ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-300 font-semibold shadow-sm ring-1 ring-brand-100 dark:ring-brand-800' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200 active:bg-gray-200 dark:active:bg-slate-700'}
                `}
              >
                <div className={`relative p-1.5 rounded-lg transition-colors shrink-0 ${isActive ? 'bg-white dark:bg-slate-800 text-brand-600' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                    <Icon size={20} />
                    {isDone && (
                        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm leading-tight">{module.title}</p>
                    {module.duration !== '-' && <p className="text-[10px] opacity-70 mt-0.5 font-normal">{module.duration}</p>}
                </div>
                {isActive && <ChevronRight size={16} className="text-brand-500 opacity-50" />}
              </button>
             );
          })}
        </nav>

        {/* Footer / Theme Toggle Desktop */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/30">
             <button 
                onClick={toggleTheme}
                className="w-full mb-4 hidden md:flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:border-brand-300 dark:hover:border-slate-500 transition-all shadow-sm active:scale-95"
             >
                {darkMode ? <><Sun size={16}/> Modo Claro</> : <><Moon size={16}/> Modo Oscuro</>}
             </button>

            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-4 text-white shadow-lg shadow-brand-200/50 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10"><Target size={40}/></div>
                <div className="relative z-10">
                    <p className="font-bold text-xs mb-1.5">Progreso Global</p>
                    <div className="flex gap-1 h-1.5 mb-2 bg-black/20 rounded-full overflow-hidden p-0.5">
                        {MODULES.filter(m => ['strategic', 'mipg', 'standards', 'forensic'].includes(m.id)).map(m => (
                            <div key={m.id} className={`flex-1 rounded-full h-full transition-colors ${getProgressColor(m.id)}`}></div>
                        ))}
                    </div>
                    <p className="text-[10px] opacity-90 leading-tight">Completa los 4 módulos técnicos.</p>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-gray-50 dark:bg-slate-900 transition-colors scroll-smooth">
        <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto">
           {children}
        </div>
        
        <footer className="mt-auto text-center text-slate-400 text-xs py-8 border-t border-gray-100 dark:border-slate-800 mx-8">
            <p className="font-semibold">Ministerio de Igualdad y Equidad</p>
            <p>Oficina de Control Interno &bull; Campus Virtual</p>
        </footer>
      </main>
    </div>
  );
};
