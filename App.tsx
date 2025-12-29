
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StrategicModule } from './modules/Strategic';
import { MIPGModule } from './modules/MIPG';
import { StandardsModule } from './modules/Standards';
import { ForensicModule } from './modules/Forensic';
import { ToolsModule } from './modules/Tools';
import { Certificate } from './components/Certificate';
import { ModuleId, ProgressMap, QuizState, User } from './types';
import { Card, MinistryLogo } from './components/UI';
import { Award, CheckCircle, ArrowRight, ShieldCheck, FileCheck, Trash2, Lock, AlertCircle, Eye, EyeOff, Info, X, Laptop } from 'lucide-react';
import { UserStore } from './data/store'; 

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentModule, setCurrentModule] = useState<ModuleId>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  
  const emptyProgress: ProgressMap = {
    dashboard: { completed: true, score: 0, timeSpentSeconds: 0 },
    strategic: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 0 },
    mipg: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 0 },
    competencies: { completed: false, score: 0, timeSpentSeconds: 0 },
    standards: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 0 },
    forensic: { completed: false, score: 0, timeSpentSeconds: 0, minTimeSeconds: 0 },
    tools: { completed: true, score: 0, timeSpentSeconds: 0 },
  };

  const [progress, setProgress] = useState<ProgressMap>(emptyProgress);

  useEffect(() => {
    UserStore.init();
    const savedUserStr = sessionStorage.getItem('oci_user');
    if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        setUser(savedUser);
        const userProgress = UserStore.getProgress(savedUser.email);
        const mergedProgress = { ...emptyProgress, ...userProgress };
        setProgress(mergedProgress);
    }
  }, []);

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

  const handleTimeUpdate = (moduleId: ModuleId, additionalSeconds: number) => {
      // Temporizador desactivado
      return;
  };

  const saveCurrentProgressToDB = () => {
      if(user) UserStore.saveProgress(user.email, progress);
  };

  const handleResetProgress = () => {
    if(!user) return;
    if(confirm('¿Estás seguro de reiniciar todo el progreso?')) {
        setProgress(emptyProgress);
        UserStore.saveProgress(user.email, emptyProgress);
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  if (!user) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  const modProps = (id: ModuleId) => ({
      onComplete: (s: number) => handleModuleComplete(id, s),
      onTimeUpdate: (secs: number) => {},
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
      case 'tools':
        return <ToolsModule />;
      default:
        return <div>Módulo no encontrado</div>;
    }
  };

  return (
    <>
        <Layout 
        currentModule={currentModule} 
        onModuleChange={(id) => {
            saveCurrentProgressToDB(); 
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
                <div className="mb-8 flex justify-center">
                    <MinistryLogo variant="vertical" />
                </div>
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight px-2">Campus Virtual Oficina de Control Interno</h2>
                    <div className="h-1 w-16 bg-brand-500 mx-auto rounded-full mb-3"></div>
                    <p className="text-brand-600 text-xs font-bold uppercase tracking-[0.2em]">Plataforma de Sensibilización</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correo Institucional</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                            <input 
                                type="email" 
                                required 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all text-slate-900 font-medium" 
                                placeholder="usuario@minigualdad.gov.co" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Contraseña (Identificación)</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-4 text-slate-400" size={18} />
                            <input 
                                type={showPassword ? "text" : "password"}
                                required 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 outline-none transition-all text-slate-900 font-medium" 
                                placeholder="••••••••" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-400 hover:text-brand-600 transition-colors">
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {error && <div className="text-red-600 text-xs font-bold bg-red-50 p-4 rounded-xl border border-red-100 flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                    </div>}
                    <button type="submit" disabled={isChecking} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-100 transition-all hover:translate-y-[-2px] active:translate-y-[0px] disabled:bg-slate-300 disabled:shadow-none">
                        {isChecking ? 'AUTENTICANDO...' : 'INGRESAR AL CAMPUS'}
                    </button>
                </form>
                <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Acceso Restringido - Equipo OCI</p>
                </div>
            </div>
        </div>
    );
}

const DashboardView: React.FC<{ progress: ProgressMap, onChange: (id: ModuleId) => void, user: User, onShowCertificate: () => void, onReset: () => void }> = ({ progress, onChange, user, onShowCertificate, onReset }) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const coreModules: ModuleId[] = ['strategic', 'mipg', 'standards', 'forensic'];
    const completedCount = coreModules.filter(id => progress[id]?.completed).length;
    const totalModules = coreModules.length;
    const percentage = Math.round((completedCount / totalModules) * 100);
    const isFinished = percentage === 100;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 border border-brand-50 dark:border-slate-700 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-20"></div>
                <div className="w-24 h-24 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Award size={48} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">¡Hola, {user.name}!</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                    {isFinished ? 'Has completado exitosamente tu plan de formación institucional.' : 'Continúa fortaleciendo tus conocimientos técnicos para la excelencia en el Control Interno.'}
                </p>
                
                <button 
                  onClick={() => setShowInstructions(true)}
                  className="mt-6 inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  <Info size={14} /> Ver Instructivo de Uso
                </button>

                <div className="mt-10 max-w-md mx-auto">
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                        <span className="text-slate-400">Progreso de Formación</span>
                        <span className="text-brand-600 dark:text-brand-400">{percentage}%</span>
                    </div>
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-1 shadow-inner">
                        <div className="h-full bg-brand-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-brand-200" style={{ width: `${percentage}%` }}></div>
                    </div>
                    {isFinished && (
                        <button onClick={onShowCertificate} className="mt-8 flex items-center justify-center gap-3 w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-green-100 transition-all hover:scale-105 active:scale-100">
                            <FileCheck size={20} /> Generar Constancia de Culminación
                        </button>
                    )}
                </div>
            </div>

            {showInstructions && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in">
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] max-w-2xl w-full p-8 shadow-2xl relative border border-slate-100 dark:border-slate-700 overflow-y-auto max-h-[90vh]">
                  <button onClick={() => setShowInstructions(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400 transition-colors">
                    <X size={24} />
                  </button>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
                      <Laptop size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Instrucciones de Uso</h3>
                  </div>

                  <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/50">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-black uppercase text-xs mb-2">
                        <AlertCircle size={14} /> Nota Crítica de Persistencia
                      </div>
                      <p className="font-medium leading-relaxed">
                        Este campus funciona de manera <strong>LOCAL</strong>. Su progreso se guarda únicamente en el navegador de este computador. 
                      </p>
                      <ul className="list-disc ml-5 mt-2 space-y-1 opacity-90">
                        <li>No use el modo incógnito.</li>
                        <li>No borre el historial/caché si desea mantener su progreso.</li>
                        <li>Si cambia de equipo, deberá iniciar los módulos nuevamente.</li>
                      </ul>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex gap-4">
                        <span className="w-6 h-6 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">1</span>
                        <p><strong>Acceso:</strong> Su usuario es el correo institucional y su contraseña es su número de identificación.</p>
                      </div>
                      <div className="flex gap-4">
                        <span className="w-6 h-6 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">2</span>
                        <p><strong>Módulos:</strong> Debe completar los 4 módulos técnicos. Cada uno requiere un tiempo mínimo de revisión de contenido antes de habilitar el examen.</p>
                      </div>
                      <div className="flex gap-4">
                        <span className="w-6 h-6 shrink-0 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">3</span>
                        <p><strong>Certificación:</strong> Al llegar al 100%, el botón de descarga se habilitará en este Dashboard.</p>
                      </div>
                    </div>
                  </div>
                  
                  <button onClick={() => setShowInstructions(false)} className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800">Entendido</button>
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                <Card title="Plan de Estudios">
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
                                className="w-full flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 hover:bg-white dark:hover:bg-slate-700 border border-transparent hover:border-brand-200 dark:hover:border-slate-500 shadow-sm transition-all group"
                            >
                                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-4">
                                    <span className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-brand-500 group-hover:text-white transition-colors">{i + 1}</span>
                                    {m.l}
                                </span>
                                {progress[m.id as ModuleId]?.completed 
                                    ? <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full"><CheckCircle className="text-green-500" size={24} /></div>
                                    : <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                                }
                            </button>
                        ))}
                    </div>
                </Card>
                
                <div className="space-y-8">
                    {!isFinished && (
                        <div className="bg-slate-900 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-500 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-xl font-black mb-2 relative z-10">Siguiente Paso</h3>
                            <p className="text-slate-400 mb-8 text-sm leading-relaxed relative z-10">Continúa con tu proceso de aprendizaje para obtener la certificación institucional.</p>
                            <button onClick={() => onChange('strategic')} className="bg-brand-500 hover:bg-brand-600 text-white font-black py-4 px-10 rounded-2xl flex items-center gap-3 mx-auto transition-all shadow-lg shadow-brand-900/50 hover:px-12">
                                CONTINUAR <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 flex justify-center">
                        <button onClick={onReset} className="flex items-center gap-2 px-6 py-2 text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                            <Trash2 size={14} /> Reiniciar Progreso
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
