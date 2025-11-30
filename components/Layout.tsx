import React, { useState } from 'react';
import { Menu, X, BookOpen, UserCheck, ShieldCheck, Target, Search, BarChart2, Library, MessageSquare, Calculator, Sun, Moon, LogOut } from 'lucide-react';
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
  { id: 'library', title: 'Biblioteca Normativa', icon: Library, description: 'Repositorio Documental', duration: '-' },
  { id: 'tools', title: 'Herramientas Auditor', icon: Calculator, description: 'Calculadora de Muestreo', duration: '-' },
  { id: 'assistant', title: 'Asistente IA OCI', icon: MessageSquare, description: 'Consultas Técnicas', duration: '-' },
];

export const Layout: React.FC<LayoutProps> = ({ currentModule, onModuleChange, progress, user, onLogout, children, darkMode, toggleTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const getProgressColor = (id: ModuleId) => {
    const mod = progress[id];
    if (mod?.completed) return 'bg-green-500';
    if (id === currentModule) return 'bg-brand-500';
    return 'bg-gray-200 dark:bg-slate-700';
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-100 transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <MinistryLogo variant="horizontal" className="scale-75 origin-left" />
        </div>
        <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-300">
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-100 dark:border-slate-700">
          <MinistryLogo variant="horizontal" className="mb-4" />
          <div className="px-1 border-l-2 border-brand-500 pl-3">
             <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase leading-tight">Oficina de<br/>Control Interno</p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
             <div className="text-xs">
                <p className="text-slate-400">Bienvenido/a,</p>
                <p className="font-bold text-slate-700 dark:text-slate-200 truncate max-w-[140px]">{user.name}</p>
             </div>
             <button onClick={onLogout} title="Cerrar Sesión" className="text-slate-400 hover:text-red-500">
                <LogOut size={16} />
             </button>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-180px)]">
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Módulos de Formación</div>
          {MODULES.map((module) => {
             const Icon = module.icon;
             const isActive = currentModule === module.id;
             const isDone = progress[module.id]?.completed;
             
             return (
              <button
                key={module.id}
                onClick={() => { onModuleChange(module.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left mb-1
                  ${isActive 
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 shadow-sm border border-brand-100 dark:border-brand-800' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-brand-600 dark:hover:text-brand-300'}
                `}
              >
                <div className={`relative p-2 rounded-lg transition-colors ${isActive ? 'bg-white dark:bg-slate-800' : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600'}`}>
                    <Icon size={18} className={isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-500'} />
                    {isDone && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{module.title}</p>
                    {module.duration !== '-' && <p className="text-xs opacity-70 truncate">{module.duration}</p>}
                </div>
              </button>
             );
          })}
          
          <div className="mt-8 px-4 pb-4">
             {/* Theme Toggle in Sidebar for Desktop */}
             <button 
                onClick={toggleTheme}
                className="w-full mb-4 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
             >
                {darkMode ? <><Sun size={14}/> Modo Claro</> : <><Moon size={14}/> Modo Oscuro</>}
             </button>

            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-5 text-white shadow-lg shadow-brand-200 dark:shadow-none">
                <p className="font-bold text-sm mb-1">Tu Progreso</p>
                <div className="flex gap-1 h-2 mb-2">
                    {MODULES.filter(m => ['strategic', 'mipg', 'standards', 'forensic'].includes(m.id)).map(m => (
                        <div key={m.id} className={`flex-1 rounded-full ${getProgressColor(m.id)}`}></div>
                    ))}
                </div>
                <p className="text-xs opacity-80">Completa los 4 módulos principales para certificarte.</p>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 lg:p-12 bg-gray-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-4xl mx-auto">
           {children}
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-sm py-8 border-t border-gray-100 dark:border-slate-800">
            <p>Ministerio de Igualdad y Equidad - Oficina de Control Interno</p>
            <p className="text-xs mt-1">Plataforma de Formación Continua v2.0</p>
        </footer>
      </main>
    </div>
  );
};