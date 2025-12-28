
import React, { useState } from 'react';
import { Menu, X, BookOpen, ShieldCheck, Target, Search, BarChart2, Calculator, Sun, Moon, LogOut, ChevronRight, CheckCircle } from 'lucide-react';
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
  { id: 'dashboard', title: 'Panel principal', icon: BarChart2, description: 'Resumen y novedades', duration: '-' },
  { id: 'strategic', title: 'Plataforma estratégica', icon: Target, description: 'Misión y organigrama', duration: '30 min' },
  { id: 'mipg', title: 'MIPG y SIG', icon: BookOpen, description: 'Modelo integrado', duration: '45 min' },
  { id: 'standards', title: 'Normas globales 2024', icon: ShieldCheck, description: 'Estándares IIA', duration: '60 min' },
  { id: 'forensic', title: 'Auditoría forense', icon: Search, description: 'Detección de fraude', duration: '50 min' },
  { id: 'tools', title: 'Herramientas técnicas', icon: Calculator, description: 'Muestreo técnico', duration: '-' },
];

export const Layout: React.FC<LayoutProps> = ({ currentModule, onModuleChange, progress, user, onLogout, children, darkMode, toggleTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getProgressColor = (id: ModuleId) => {
    const mod = progress[id];
    if (mod?.completed) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    if (id === currentModule) return 'bg-brand-500 shadow-[0_0_10px_rgba(210,59,120,0.3)]';
    return 'bg-slate-200 dark:bg-slate-700';
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans transition-colors duration-500 ${darkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <MinistryLogo variant="horizontal" className="scale-90" />
        <div className="flex items-center gap-1">
            <button onClick={toggleTheme} className="p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setSidebarOpen(true)} className="p-3 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                <Menu size={24} />
            </button>
        </div>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-fade-in" onClick={closeSidebar} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 transform transition-transform duration-500 ease-in-out md:relative md:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-slate-50 dark:border-slate-700">
          <MinistryLogo variant="vertical" className="mb-6" />
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-full border border-slate-100 dark:border-slate-700">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500">Control interno</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {MODULES.map((module) => {
             const Icon = module.icon;
             const isActive = currentModule === module.id;
             const isDone = progress[module.id]?.completed;
             
             return (
              <button
                key={module.id}
                onClick={() => { onModuleChange(module.id); closeSidebar(); }}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${isActive ? 'bg-slate-900 text-white shadow-2xl shadow-slate-900/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
              >
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-400 group-hover:text-brand-500'}`}>
                    <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-bold tracking-tight ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{module.title}</p>
                    {module.duration !== '-' && <p className="text-[9px] font-medium opacity-60 mt-0.5">{module.duration}</p>}
                </div>
                {isDone && <CheckCircle size={16} className="text-emerald-500" />}
                {isActive && <ChevronRight size={14} className="text-white opacity-40" />}
              </button>
             );
          })}
        </nav>

        <div className="p-6">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black rounded-3xl p-6 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10">
                    <p className="font-bold text-[10px] mb-4 text-brand-400">Progreso de formación</p>
                    <div className="flex gap-1.5 h-1.5 mb-4 bg-white/10 rounded-full overflow-hidden">
                        {MODULES.filter(m => ['strategic', 'mipg', 'standards', 'forensic'].includes(m.id)).map(m => (
                            <div key={m.id} className={`flex-1 rounded-full h-full transition-all duration-700 ${getProgressColor(m.id as ModuleId)}`}></div>
                        ))}
                    </div>
                    <p className="text-[10px] font-medium text-white/50 leading-tight">Completa los pilares técnicos para certificar tu excelencia.</p>
                </div>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>
            </div>
            
            <div className="mt-6 flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-black text-xs text-brand-500">
                  {user.name[0]}
                </div>
                <p className="text-[10px] font-bold text-slate-400 truncate max-w-[100px]">{user.name.split(' ')[0]}</p>
              </div>
              <button onClick={onLogout} title="Cerrar sesión" className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <LogOut size={18} />
              </button>
            </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen bg-slate-50 dark:bg-slate-900 scroll-smooth">
        <div className="p-6 md:p-10 lg:p-16 max-w-7xl mx-auto">
           {children}
        </div>
        <footer className="mt-20 py-12 border-t border-slate-100 dark:border-slate-800 text-center space-y-2 opacity-50">
            <p className="text-[10px] font-bold">Ministerio de Igualdad y Equidad</p>
            <p className="text-[9px] font-medium">Oficina de Control Interno &bull; Plataforma de excelencia v2.1</p>
        </footer>
      </main>
    </div>
  );
};
