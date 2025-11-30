import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StrategicModule } from './modules/Strategic';
import { MIPGModule } from './modules/MIPG';
import { StandardsModule } from './modules/Standards';
import { ForensicModule } from './modules/Forensic';
import { AssistantModule } from './modules/Assistant';
import { LibraryModule } from './modules/Library';
import { ToolsModule } from './modules/Tools';
import { ModuleId, ProgressMap, QuizState, User } from './types';
import { Card, MinistryLogo } from './components/UI';
import { Award, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const CompetenciesView: React.FC<{onComplete: any}> = ({onComplete}) => (
    <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Competencias del Auditor</h2>
        <p className="mb-6 dark:text-slate-300">Este contenido ha sido integrado en el Módulo de Normas Globales para una mejor experiencia de aprendizaje unificada.</p>
        <button onClick={() => onComplete(100)} className="bg-brand-600 text-white px-6 py-2 rounded-lg">Marcar como visto</button>
    </div>
);

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleId>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [progress, setProgress] = useState<ProgressMap>({
    dashboard: { completed: true, score: 0 },
    strategic: { completed: false, score: 0 },
    mipg: { completed: false, score: 0 },
    competencies: { completed: false, score: 0 },
    standards: { completed: false, score: 0 },
    forensic: { completed: false, score: 0 },
    library: { completed: true, score: 0 },
    assistant: { completed: true, score: 0 },
    tools: { completed: true, score: 0 },
  });

  // Load user and progress from local storage
  useEffect(() => {
    const savedUser = localStorage.getItem('oci_user');
    const savedProgress = localStorage.getItem('oci_progress');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedProgress) setProgress(JSON.parse(savedProgress));
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (name: string, role: string, email: string) => {
    const newUser = { name, role, email };
    setUser(newUser);
    localStorage.setItem('oci_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('oci_user');
    setCurrentModule('dashboard');
  };

  const handleModuleComplete = (moduleId: ModuleId, score: number) => {
    const newProgress = { ...progress, [moduleId]: { completed: true, score } };
    setProgress(newProgress);
    localStorage.setItem('oci_progress', JSON.stringify(newProgress));
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardView progress={progress} onChange={setCurrentModule} user={user} />;
      case 'strategic':
        return <StrategicModule onComplete={(s) => handleModuleComplete('strategic', s)} />;
      case 'mipg':
        return <MIPGModule onComplete={(s) => handleModuleComplete('mipg', s)} />;
      case 'standards':
        return <StandardsModule onComplete={(s) => handleModuleComplete('standards', s)} />;
      case 'forensic':
        return <ForensicModule onComplete={(s) => handleModuleComplete('forensic', s)} />;
      case 'assistant':
        return <AssistantModule />;
      case 'library':
        return <LibraryModule />;
      case 'tools':
        return <ToolsModule />;
      case 'competencies':
        return <CompetenciesView onComplete={(s: number) => handleModuleComplete('competencies', s)} />;
      default:
        return <div>Módulo no encontrado</div>;
    }
  };

  return (
    <Layout 
      currentModule={currentModule} 
      onModuleChange={setCurrentModule} 
      progress={progress} 
      user={user} 
      onLogout={handleLogout}
      darkMode={darkMode}
      toggleTheme={toggleTheme}
    >
      {renderModule()}
    </Layout>
  );
}

// --- Login View ---
const LoginView: React.FC<{ onLogin: (n: string, r: string, e: string) => void }> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && role && email) onLogin(name, role, email);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
                <div className="mb-8 flex justify-center">
                    <MinistryLogo variant="vertical" />
                </div>
                
                <h2 className="text-xl font-bold text-center text-slate-900 mb-1">Campus Virtual OCI</h2>
                <p className="text-center text-slate-500 text-sm mb-8">Plataforma de Formación y Control</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nombre Completo</label>
                        <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Ej. Juan Pérez" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Cargo / Rol</label>
                        <input type="text" required value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Ej. Auditor Junior" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Correo Institucional</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="usuario@minigualdad.gov.co" />
                    </div>
                    <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-colors mt-4 shadow-lg shadow-brand-200">
                        Ingresar al Campus
                    </button>
                </form>
                <p className="text-xs text-center text-slate-400 mt-6">
                    Sus datos se utilizarán para la generación del certificado de formación.
                </p>
            </div>
        </div>
    );
}

// --- Dashboard View ---
const DashboardView: React.FC<{ progress: ProgressMap, onChange: (id: ModuleId) => void, user: User }> = ({ progress, onChange, user }) => {
    const coreModules: ModuleId[] = ['strategic', 'mipg', 'standards', 'forensic'];
    const completedCount = coreModules.filter(id => progress[id]?.completed).length;
    const totalModules = coreModules.length;
    const percentage = Math.round((completedCount / totalModules) * 100);
    const isFinished = percentage === 100;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-brand-100 dark:border-slate-700 shadow-sm text-center">
                <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={40} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Hola, {user.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
                    Bienvenido de nuevo a tu espacio de formación. {isFinished ? '¡Has completado todo el plan de estudios!' : 'Continúa donde lo dejaste para fortalecer tus competencias.'}
                </p>
                
                <div className="mt-8 max-w-md mx-auto">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-brand-700 dark:text-brand-400">Progreso de Certificación</span>
                        <span className="text-brand-700 dark:text-brand-400">{percentage}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-brand-500 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    {isFinished && (
                        <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-green-200 dark:shadow-none animate-bounce">
                            Descargar Certificado de Formación
                        </button>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card title="Plan de Estudios (Módulos)">
                    <div className="space-y-4">
                        {[
                            { id: 'strategic', l: 'Plataforma Estratégica' },
                            { id: 'mipg', l: 'MIPG y SIG' },
                            { id: 'standards', l: 'Normas Globales 2024' },
                            { id: 'forensic', l: 'Auditoría Forense' }
                        ].map((m, i) => (
                            <button 
                                key={m.id}
                                onClick={() => onChange(m.id as ModuleId)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-md transition-all border border-gray-100 dark:border-slate-600"
                            >
                                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                    {m.l}
                                </span>
                                {progress[m.id as ModuleId]?.completed 
                                    ? <CheckCircle className="text-green-500" size={20} />
                                    : <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-slate-500"></div>
                                }
                            </button>
                        ))}
                    </div>
                </Card>
                
                <div className="space-y-6">
                     {/* Call to Action */}
                    {!isFinished && (
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Siguiente Paso</h3>
                            <p className="text-slate-300 mb-6 text-sm">
                                Retoma tu aprendizaje en el módulo de Plataforma Estratégica.
                            </p>
                            <button 
                                onClick={() => onChange('strategic')}
                                className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-brand-900/50 flex items-center gap-2"
                            >
                                Continuar <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Latest News Widget */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
                        <h3 className="text-blue-900 dark:text-blue-200 font-bold mb-3 text-sm uppercase tracking-wide">Novedades Normativas</h3>
                        <ul className="space-y-3">
                            <li className="text-sm text-blue-800 dark:text-blue-300 pb-2 border-b border-blue-200 dark:border-blue-800">
                                <span className="font-bold block">Circular 005 - 2024</span>
                                Lineamientos cierre fiscal vigencia 2024.
                            </li>
                            <li className="text-sm text-blue-800 dark:text-blue-300">
                                <span className="font-bold block">Decreto 1600 - Auditoría</span>
                                Recordatorio de cumplimiento auditorías forenses.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;