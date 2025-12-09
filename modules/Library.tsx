
import React, { useState } from 'react';
import { Card, Badge } from '../components/UI';
import { Search, FileText, Download, Eye, Filter } from 'lucide-react';

const DOCUMENTS = [
    { id: 1, type: 'Ley', code: '87 de 1993', title: 'Normas para el ejercicio del Control Interno', tags: ['Fundamentos', 'Legal'] },
    { id: 2, type: 'Decreto', code: '1499 de 2017', title: 'Actualización del Modelo Integrado de Planeación y Gestión (MIPG)', tags: ['MIPG', 'Gestión'] },
    { id: 3, type: 'Circular', code: '004 de 2024', title: 'Lineamientos para la Auditoría Basada en Riesgos', tags: ['Interno', 'Metodología'] },
    { id: 4, type: 'Guía', code: 'DAFP-2023', title: 'Guía de Auditoría para Entidades Públicas', tags: ['DAFP', 'Guía'] },
    { id: 5, type: 'Decreto', code: '1600 de 2024', title: 'Lineamientos de Auditoría Forense', tags: ['Forense', 'Fraude'] },
    { id: 6, type: 'Formato', code: 'F-OCI-01', title: 'Acta de Inicio de Auditoría', tags: ['Plantilla', 'Calidad'] },
];

export const LibraryModule: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<any>(null);

    const filteredDocs = DOCUMENTS.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 animate-fade-in h-[calc(100vh-140px)] flex flex-col">
            <div className="flex-none">
                <Badge type="brand">Biblioteca</Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Normatividad y Documentos</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Repositorio centralizado de consulta para el equipo auditor.</p>
            </div>

            <div className="flex gap-4 flex-1 min-h-0">
                {/* Search and List Column */}
                <div className="w-1/3 flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre, ley o tema..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white"
                        />
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                        {filteredDocs.map(doc => (
                            <div 
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    selectedDoc?.id === doc.id 
                                    ? 'bg-brand-50 border-brand-500 dark:bg-brand-900/30 dark:border-brand-500' 
                                    : 'bg-white border-gray-100 hover:border-brand-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:border-slate-600'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                        doc.type === 'Ley' ? 'bg-blue-100 text-blue-700' : 
                                        doc.type === 'Decreto' ? 'bg-purple-100 text-purple-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {doc.type}
                                    </span>
                                    <span className="text-xs text-slate-400">{doc.code}</span>
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-tight mb-2">{doc.title}</h4>
                                <div className="flex gap-1 flex-wrap">
                                    {doc.tags.map(tag => (
                                        <span key={tag} className="text-[10px] text-slate-500 bg-gray-50 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-600">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Document Viewer Column */}
                <div className="w-2/3 bg-gray-100 dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    {selectedDoc ? (
                        <div className="w-full h-full flex flex-col animate-fade-in">
                            <div className="flex justify-between items-center mb-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
                                <div>
                                    <h3 className="font-bold text-lg dark:text-white">{selectedDoc.title}</h3>
                                    <p className="text-sm text-slate-500">{selectedDoc.type} {selectedDoc.code}</p>
                                </div>
                                <button className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-brand-700">
                                    <Download size={16} /> Descargar
                                </button>
                            </div>
                            
                            {/* Simulated PDF Viewer */}
                            <div className="flex-1 bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 overflow-y-auto border border-gray-200 dark:border-slate-700">
                                <div className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4 w-3/4"></div>
                                <div className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                                <div className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                                <div className="w-full h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4 w-5/6"></div>
                                <br/>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-300 mb-4 uppercase text-center">{selectedDoc.type} {selectedDoc.code}</h2>
                                <p className="text-justify text-slate-600 dark:text-slate-400 leading-8 mb-4">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                                <p className="text-justify text-slate-600 dark:text-slate-400 leading-8 mb-4">
                                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                                </p>
                                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 my-6">
                                    <p className="font-bold text-yellow-800 dark:text-yellow-200">Artículo 1. Objeto.</p>
                                    <p className="text-yellow-900 dark:text-yellow-300 text-sm mt-1">La presente normativa tiene por objeto establecer los lineamientos técnicos para...</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-slate-400">
                            <FileText size={64} className="mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Selecciona un documento para visualizar</p>
                            <p className="text-sm">Puedes buscar por palabra clave en el panel izquierdo.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
