import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { StrategicModule } from './modules/Strategic';
import { MIPGModule } from './modules/MIPG';
import { StandardsModule } from './modules/Standards';
import { ForensicModule } from './modules/Forensic';
import { ModuleId, ProgressMap, QuizState } from './types';
import { Card } from './components/UI';
import { Award, CheckCircle } from 'lucide-react';

// Competencies is merged into Standards for simplicity in this demo structure, 
// but logically handled as a view.
const CompetenciesView: React.FC<{onComplete: any}> = ({onComplete}) => (
    <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Competencias del Auditor</h2>
        <p className="mb-6">Este contenido ha sido integrado en el Módulo de Normas Globales para una mejor experiencia de aprendizaje unificada.</p>
        <button onClick={() => onComplete(100)} className="bg-brand-600 text-white px-6 py-2 rounded-lg">Marcar como visto</button>
    </div>
);

function App() {
  const [currentModule, setCurrentModule] = useState<ModuleId>('dashboard');
  const [progress, setProgress] = useState<ProgressMap>({
    dashboard: { completed: true, score: 0 },
    strategic: { completed: false, score: 0 },
    mipg: { completed: false, score: 0 },
    competencies: { completed: false, score: 0 },
    standards: { completed: false, score: 0 },
    forensic: { completed: false, score: 0 },
  });

  const handleModuleComplete = (moduleId: ModuleId, score: number) => {
    setProgress(prev => ({
      ...prev,
      [moduleId]: { completed: true, score }
    }));
  };

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardView progress={progress} onChange={setCurrentModule} />;
      case 'strategic':
        return <StrategicModule onComplete={(s) => handleModuleComplete('strategic', s)} />;
      case 'mipg':
        return <MIPGModule onComplete={(s) => handleModuleComplete('mipg', s)} />;
      case 'standards':
        return <StandardsModule onComplete={(s) => handleModuleComplete('standards', s)} />;
      case 'competencies':
        return <CompetenciesView onComplete={(s: number) => handleModuleComplete('competencies', s)} />;
      case 'forensic':
        return <ForensicModule onComplete={(s) => handleModuleComplete('forensic', s)} />;
      default:
        return <div>Módulo no encontrado</div>;
    }
  };

  return (
    <Layout currentModule={currentModule} onModuleChange={setCurrentModule} progress={progress}>
      {renderModule()}
    </Layout>
  );
}

const DashboardView: React.FC<{ progress: ProgressMap, onChange: (id: ModuleId) => void }> = ({ progress, onChange }) => {
    const totalModules = 5; // Excluding dashboard
    const completed = Object.values(progress).filter((p: QuizState) => p.completed).length - 1; // Subtract dashboard
    const percentage = Math.max(0, Math.round((completed / totalModules) * 100));

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 border border-brand-100 shadow-sm text-center">
                <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={40} />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">Bienvenido al Campus OCI</h1>
                <p className="text-slate-600 mt-2 max-w-lg mx-auto">
                    Espacio de formación para el fortalecimiento de capacidades del equipo de la Oficina de Control Interno del Ministerio de Igualdad y Equidad.
                </p>
                
                <div className="mt-8 max-w-md mx-auto">
                    <div className="flex justify-between text-sm font-bold mb-2">
                        <span className="text-brand-700">Progreso General</span>
                        <span className="text-brand-700">{percentage}%</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-brand-500 transition-all duration-1000 ease-out"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card title="Ruta de Aprendizaje">
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
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all border border-gray-100"
                            >
                                <span className="font-semibold text-slate-700 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                    {m.l}
                                </span>
                                {progress[m.id as ModuleId]?.completed 
                                    ? <CheckCircle className="text-green-500" size={20} />
                                    : <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                                }
                            </button>
                        ))}
                    </div>
                </Card>
                
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-bold mb-2">¿Listo para comenzar?</h3>
                    <p className="text-slate-300 mb-6 text-sm">
                        Completa todos los módulos y evaluaciones para certificar tu conocimiento en los procesos clave de la OCI.
                    </p>
                    <button 
                        onClick={() => onChange('strategic')}
                        className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-brand-900/50"
                    >
                        Iniciar Módulo 1
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;