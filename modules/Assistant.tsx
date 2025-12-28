
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, User, Bot, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, Badge } from '../components/UI';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export const AssistantModule: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Hola. Soy tu Asistente de Auditoría (IA). Puedo ayudarte con consultas sobre MIPG, Normas Globales o Procesos de Control Interno. Por favor, sé específico en tu pregunta y **no incluyas datos confidenciales**.' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            /* Create a new GoogleGenAI instance right before making an API call to ensure it uses up-to-date API key */
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            /* Use gemini-3-flash-preview for basic text tasks as per guidelines */
            const modelName = "gemini-3-flash-preview";
            
            const systemPrompt = `
                Actúa como un Auditor Senior de la Oficina de Control Interno del Ministerio de Igualdad y Equidad de Colombia.
                Tu tono debe ser profesional, objetivo, conservador y basado en evidencia.
                Tus respuestas deben estar fundamentadas en la normatividad colombiana (MIPG, Ley 87 de 1993, Decretos relevantes) y las Normas Globales de Auditoría Interna (IIA).
                
                REGLAS CRÍTICAS:
                1. Siempre cita la fuente normativa cuando sea posible (ej: "Según el Decreto 1499 de 2017...").
                2. Si la pregunta implica una decisión de alto riesgo, recomienda escalar al Comité Institucional de Coordinación de Control Interno (CICCI).
                3. NO inventes normas. Si no sabes, di que requiere investigación jurídica.
                4. Advierte si el usuario parece estar compartiendo nombres propios o datos sensibles.
                5. Sé conciso y estructurado.
            `;

            /* Call generateContent with model name and prompt directly */
            const response = await ai.models.generateContent({
                model: modelName,
                contents: [
                    { role: 'user', parts: [{ text: systemPrompt + "\n\nConsulta del usuario: " + userMsg }] }
                ]
            });

            /* Access the .text property directly as per guidelines */
            const text = response.text || "Lo siento, no pude generar una respuesta en este momento.";
            setMessages(prev => [...prev, { role: 'model', text: text }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "Error de conexión con el servicio de IA. Por favor intenta más tarde." }]);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col animate-fade-in">
            <div className="flex-none">
                <Badge type="warning">Experimental</Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">Asistente Técnico OCI</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Consulta normas, procedimientos y conceptos de auditoría en tiempo real.</p>
                
                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-xl flex gap-3 items-start">
                    <AlertTriangle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                    <p className="text-xs text-amber-800 dark:text-amber-200">
                        <b>Aviso de Privacidad:</b> Este chat utiliza Inteligencia Artificial. No ingreses nombres de funcionarios, números de identificación, hallazgos confidenciales no publicados ni contraseñas.
                    </p>
                </div>
            </div>

            <Card className="flex-1 flex flex-col min-h-0 !p-0 overflow-hidden bg-white dark:bg-slate-800">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-brand-600 text-white'}`}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-4 text-sm whitespace-pre-wrap ${
                                msg.role === 'user' 
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tr-none' 
                                : 'bg-brand-50 dark:bg-brand-900/20 text-slate-800 dark:text-slate-200 rounded-tl-none border border-brand-100 dark:border-brand-800'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                             <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                                <Bot size={16} />
                            </div>
                            <div className="bg-brand-50 dark:bg-brand-900/20 rounded-2xl p-4 rounded-tl-none">
                                <Loader2 className="animate-spin text-brand-600" size={20} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ej: ¿Cuáles son las tres líneas de defensa según MIPG?"
                            className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:text-white"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-xl px-4 py-2 transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2">El asistente puede cometer errores. Verifica siempre con la norma original.</p>
                </div>
            </Card>
        </div>
    );
};
