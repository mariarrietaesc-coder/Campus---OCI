import React, { useState } from 'react';
import { Card, Badge } from '../components/UI';
import { Calculator, RefreshCw } from 'lucide-react';

export const ToolsModule: React.FC = () => {
    const [population, setPopulation] = useState<string>('');
    const [confidence, setConfidence] = useState<number>(95);
    const [marginError, setMarginError] = useState<number>(5);
    const [result, setResult] = useState<number | null>(null);

    const calculateSample = () => {
        const N = parseInt(population);
        if (!N) return;
        
        // Z values for 90%, 95%, 99%
        const Z_map: Record<number, number> = { 90: 1.645, 95: 1.96, 99: 2.576 };
        const Z = Z_map[confidence];
        const p = 0.5; // Heterogeneity (50% is safest max sample)
        const e = marginError / 100;

        // Formula: (Z^2 * p * (1-p) * N) / ((e^2 * (N-1)) + (Z^2 * p * (1-p)))
        const numerator = Math.pow(Z, 2) * p * (1 - p) * N;
        const denominator = (Math.pow(e, 2) * (N - 1)) + (Math.pow(Z, 2) * p * (1 - p));
        
        setResult(Math.ceil(numerator / denominator));
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="mb-6">
                <Badge type="brand">Herramientas</Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Calculadora de Muestreo</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Determinación del tamaño de muestra para auditoría (Muestreo Aleatorio Simple).</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card title="Parámetros de Entrada">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Población Total (N)</label>
                            <input 
                                type="number" 
                                value={population}
                                onChange={(e) => setPopulation(e.target.value)}
                                placeholder="Ej: 5000 contratos"
                                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-white"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nivel de Confianza</label>
                            <div className="flex gap-2">
                                {[90, 95, 99].map(val => (
                                    <button
                                        key={val}
                                        onClick={() => setConfidence(val)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                                            confidence === val 
                                            ? 'bg-brand-600 text-white border-brand-600' 
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-gray-300 dark:border-slate-600'
                                        }`}
                                    >
                                        {val}%
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Estándar auditoría: 95%</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Margen de Error (%)</label>
                            <input 
                                type="range" 
                                min="1" max="10" 
                                value={marginError}
                                onChange={(e) => setMarginError(parseInt(e.target.value))}
                                className="w-full accent-brand-600"
                            />
                            <div className="text-right font-bold text-brand-600 dark:text-brand-400">{marginError}%</div>
                        </div>

                        <button 
                            onClick={calculateSample}
                            className="w-full bg-slate-800 dark:bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-slate-700 dark:hover:bg-brand-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Calculator size={20} /> Calcular Muestra
                        </button>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="bg-slate-900 text-white border-none h-full flex flex-col justify-center items-center text-center">
                        <h3 className="text-slate-400 font-medium mb-2 uppercase tracking-widest text-sm">Tamaño de Muestra Sugerido</h3>
                        {result !== null ? (
                            <div className="animate-scale-up">
                                <span className="text-8xl font-extrabold text-brand-400">{result}</span>
                                <span className="block text-xl text-slate-300 mt-2">Registros a auditar</span>
                            </div>
                        ) : (
                            <div className="text-slate-600">
                                <RefreshCw size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Ingresa los datos para calcular</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200">
                <p><b>Nota Técnica:</b> Esta calculadora utiliza la fórmula para poblaciones finitas asumiendo máxima variabilidad (p=0.5). Si el resultado es mayor que la población, revisa los parámetros.</p>
            </div>
        </div>
    );
};