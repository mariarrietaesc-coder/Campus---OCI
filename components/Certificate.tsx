import React, { useRef } from 'react';
import { MinistryLogo } from './UI';
import { User } from '../types';
import { Download, X } from 'lucide-react';

interface CertificateProps {
  user: User;
  date: string;
  onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ user, date, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="certificate-view" className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative bg-white shadow-2xl rounded-xl max-w-4xl w-full overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none print:border-none">
        
        {/* Toolbar (Hidden when printing) */}
        <div className="bg-slate-100 p-4 flex justify-between items-center border-b border-gray-200 print:hidden">
            <h3 className="font-bold text-slate-700">Vista Previa de Constancia</h3>
            <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700 transition-colors">
                    <Download size={18} /> Guardar como PDF
                </button>
                <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    <X size={24} />
                </button>
            </div>
        </div>

        {/* Certificate Content */}
        <div ref={printRef} className="p-12 md:p-16 text-center relative bg-white min-h-[600px] flex flex-col justify-between border-[12px] border-double border-brand-50 print:border-4 print:border-brand-500 print:h-screen print:flex print:flex-col print:justify-between">
            
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <MinistryLogo variant="vertical" className="scale-[3]" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-center mb-8">
                    <MinistryLogo variant="vertical" />
                </div>
                
                <div className="mb-12">
                    <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 uppercase tracking-wide">Constancia de Culminación</h1>
                    <div className="h-1 w-32 bg-brand-500 mx-auto rounded-full"></div>
                </div>

                <div className="text-lg text-slate-700 leading-relaxed mb-8">
                    <p>La Oficina de Control Interno del</p>
                    <p className="font-bold text-xl uppercase text-slate-900 mb-6">Ministerio de Igualdad y Equidad</p>
                    
                    <p className="mb-2">Hace constar que:</p>
                    <h2 className="text-3xl font-bold text-brand-700 mb-2 uppercase">{user.name}</h2>
                    <p className="text-slate-500 font-medium mb-8">{user.role}</p>

                    <p className="max-w-2xl mx-auto">
                        Ha completado satisfactoriamente los módulos de formación de la plataforma 
                        <span className="font-bold text-slate-900"> Campus Virtual OCI</span>, 
                        abarcando los temas de Plataforma Estratégica, MIPG, Normas Globales de Auditoría y Auditoría Forense.
                    </p>
                </div>

                <div className="mt-12">
                    <p className="text-slate-600">Dado en Bogotá D.C., a los {date}</p>
                </div>
            </div>

            {/* Signature Area */}
            <div className="mt-16 flex flex-col items-center relative z-10 page-break-inside-avoid">
                <div className="w-64 border-b border-slate-400 mb-4"></div>
                <p className="font-bold text-slate-900 text-lg">RAÚL GONZÁLEZ</p>
                <p className="text-slate-600 text-sm uppercase">Jefe de la Oficina de Control Interno</p>
                <p className="text-slate-500 text-xs mt-1">Ministerio de Igualdad y Equidad</p>
            </div>

            {/* Footer */}
            <div className="mt-12 text-[10px] text-slate-400 uppercase tracking-widest">
                Documento generado electrónicamente a través del Campus Virtual OCI
            </div>
        </div>
      </div>
      
      {/* Print Styles Injection */}
      <style>{`
        @media print {
            body * {
                visibility: hidden;
            }
            #certificate-view, #certificate-view * {
                visibility: visible;
            }
            #certificate-view {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                background: white;
                z-index: 9999;
            }
            #certificate-view > div {
                box-shadow: none;
                max-width: none;
                width: 100%;
                border-radius: 0;
            }
            .print\\:hidden {
                display: none !important;
            }
            @page {
                size: landscape;
                margin: 0;
            }
        }
      `}</style>
    </div>
  );
};