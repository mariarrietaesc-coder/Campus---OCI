
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StrategicModule } from './modules/Strategic';
import { MIPGModule } from './modules/MIPG';
import { StandardsModule } from './modules/Standards';
import { ForensicModule } from './modules/Forensic';
import { AssistantModule } from './modules/Assistant';
import { LibraryModule } from './modules/Library';
import { ToolsModule } from './modules/Tools';
import { Certificate } from './components/Certificate';
import { ModuleId, ProgressMap, QuizState, User } from './types';
import { Card, MinistryLogo } from './components/UI';
import { Award, CheckCircle, ArrowRight, ShieldCheck, FileCheck, RefreshCw, Trash2, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserStore } from './data/store'; 

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
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Default empty state 
  const emptyProgress: ProgressMap = {
    dashboard: { completed: true, score: 0, timeSpentSeconds: 0 },
    strategic: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    mipg: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    competencies: { completed: false, score: 0, timeSpentSeconds: 0 },
    standards: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    forensic: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 60 },
    library: { completed: true, score: 0, timeSpentSeconds: 0 },
    assistant: { completed: true, score: 0, timeSpentSeconds: 0 },
    tools: { completed: true, score: 0, timeSpentSeconds: 0 },
  };

  const [progress, setProgress] = useState<ProgressMap>(emptyProgress);

  // Initialize Store
  useEffect(() => {
    UserStore.init();
    // Check session after init
    const savedUserStr = sessionStorage.getItem('oci_user');
    if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        setUser(savedUser);
        const userProgress = UserStore.getProgress(savedUser.email);
        // Merge with defaults to ensure new fields exist
        const mergedProgress = { ...emptyProgress, ...userProgress };
        setProgress(mergedProgress);
    }
  }, []);

  // Theme Toggle Effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (user: User) => {
    setUser(user);
    const userProgress = UserStore.getProgress(user.email);
    const mergedProgress = { ...emptyProgress, ...userProgress };
    setProgress(mergedProgress);
    sessionStorage.setItem('oci_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('oci_user');
    setCurrentModule('dashboard');
    setProgress(emptyProgress);
  };

  // Called when a Quiz is finished
  const handleModuleComplete = (moduleId: ModuleId, score: number) => {
    if (!user) return;
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('es-CO', { 
        year: 'numeric', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    });

    const currentModProgress = progress[moduleId];

    const newProgress = { 
        ...progress, 
        [moduleId]: { 
            ...currentModProgress,
            completed: true, 
            score, 
            completedAt: timestamp 
        } 
    };
    
    setProgress(newProgress);
    UserStore.saveProgress(user.email, newProgress);
  };

  // Called periodically by the module to update time
  const handleTimeUpdate = (moduleId: ModuleId, additionalSeconds: number) => {
      if (!user) return;
      
      const currentMod = progress[moduleId];
      const newTime = (currentMod.timeSpentSeconds || 0) + additionalSeconds;
      
      const newProgress = {
          ...progress,
          [moduleId]: {
              ...currentMod,
              timeSpentSeconds: newTime
          }
      };
      
      // Update local state immediately for UI
      setProgress(newProgress);
      // Also save to localStorage periodically indirectly via module saves or unmounts,
      // but for robustness we can save periodically here if performance allows.
      // For now, let's rely on the module's unmount/save trigger or simple periodic saves handled by the module component props.
  };

  // Force save to DB (e.g. when leaving a module)
  const saveCurrentProgressToDB = () => {
      if(user) UserStore.saveProgress(user.email, progress);
  };

  const handleResetProgress = () => {
    if(!user) return;
    if(confirm('¿Estás seguro de reiniciar todo el progreso? Esto borrará tus avances actuales.')) {
        setProgress(emptyProgress);
        UserStore.saveProgress(user.email, emptyProgress);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  if (!user) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  // Common props for modules
  const modProps = (id: ModuleId) => ({
      onComplete: (s: number) => handleModuleComplete(id, s),
      onTimeUpdate: (secs: number) => handleTimeUpdate(id, secs),
      saveProgress: saveCurrentProgressToDB,
      data: progress[id]
  });

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardView progress={progress} onChange={setCurrentModule} user={user} onShowCertificate={() => setShowCertificate(true)} onReset={handleResetProgress} />;
      case 'strategic':
        return <StrategicModule {...modProps('strategic')} />;
      case 'mipg':
        return <MIPGModule {...modProps('mipg')} />;
      case 'standards':
        return <StandardsModule {...modProps('standards')} />;
      case 'forensic':
        return <ForensicModule {...modProps('forensic')} />;
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
    <>
        <Layout 
        currentModule={currentModule} 
        onModuleChange={(id) => {
            saveCurrentProgressToDB(); // Save before switching
            setCurrentModule(id);
        }} 
        progress={progress} 
        user={user} 
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        >
        {renderModule()}
        </Layout>
        
        {showCertificate && (
            <Certificate 
                user={user} 
                date={new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
                onClose={() => setShowCertificate(false)}
            />
        )}
    </>
  );
}

// --- Login View (Updated for Async) ---
const LoginView: React.FC<{ onLoginSuccess: (u: User) => void }> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isChecking, setIsChecking] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsChecking(true);

        try {
            const result = await UserStore.authenticate(email, password);
            if (result.success && result.user) {
                onLoginSuccess(result.user);
            } else {
                setError(result.message || 'Error de autenticación');
            }
        } catch (e) {
            setError("Error de conexión local.");
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full border border-gray-100 relative overflow-hidden">
                
                {/* Logo Section */}
                <div className="mb-6 flex justify-center">
                    <MinistryLogo variant="vertical" />
                </div>
                
                {/* Title Section */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Campus Virtual Oficina de Control Interno</h2>
                    <div className="h-1 w-12 bg-brand-500 mx-auto rounded-full mb-2"></div>
                    <p className="text-slate-500 text-sm font-medium">Plataforma de Sensibilización</p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Correo Institucional</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full pl-10 pr-3.5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-900" 
                                placeholder="usuario@minigualdad.gov.co" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Contraseña</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-3 top-3.5 text-slate-400" size={18} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 outline-none transition-all text-slate-900" 
                                placeholder="Ingresa tu contraseña" 
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100 animate-fade-in">
                            <AlertCircle size={16} /> {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={isChecking}
                        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-brand-200 mt-2"
                    >
                        {isChecking ? 'Verificando...' : 'Ingresar al Campus'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-slate-400 leading-tight mb-4">
                        Acceso restringido únicamente al equipo de la OCI.
                    </p>
                    
                    {/* HINT FOR DEMO PURPOSES */}
                    <div className="inline-block text-left bg-slate-50 border border-slate-200 rounded-lg p-3 text-[10px] text-slate-500 mx-auto">
                        <p className="font-bold text-slate-600 mb-1">Datos de prueba (Jefe OCI):</p>
                        <p className="font-mono">User: rgonzalez@minigualdad.gov.co</p>
                        <p className="font-mono">Pass: 79283776</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Dashboard View ---
const DashboardView: React.FC<{ progress: ProgressMap, onChange: (id: ModuleId) => void, user: User, onShowCertificate: () => void, onReset: () => void }> = ({ progress, onChange, user, onShowCertificate, onReset }) => {
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
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Hola, {user.name.split(' ')[0]}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-lg mx-auto">
                    Bienvenido de nuevo a tu espacio de formación. {isFinished ? '¡Has completado todo el plan de estudios!' : 'Continúa donde lo dejaste para fortalecer tus competencias.'}
                </p>
                
                <div className="mt-8 max-w-md mx-auto">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-brand-700 dark:text-brand-400">Progreso de Formación</span>
                        <span className="text-brand-700 dark:text-brand-400">{percentage}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-brand-500 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                    {isFinished && (
                        <button 
                            onClick={onShowCertificate}
                            className="mt-6 flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-green-200 dark:shadow-none animate-bounce transition-all"
                        >
                            <FileCheck size={20} /> Generar Constancia de Culminación
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

                    {/* Utils & Reset */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
                        <h3 className="font-bold text-slate-800 dark:text-white mb-3 text-sm uppercase tracking-wide">Opciones</h3>
                        <div className="flex flex-col gap-2">
                            <button onClick={onReset} className="w-full flex items-center justify-center gap-2 p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs font-bold transition-colors">
                                <Trash2 size={16} /> Reiniciar todo el progreso
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
