import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';

let aiClient: GoogleGenAI | null = null;
const getAiClient = () => {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.warn("Failed to initialize Gemini Client", e);
    }
  }
  return aiClient;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [
      { role: 'model', text: '¡Hola! Soy el asistente virtual de Robert Terán. ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre sus servicios ISO, coaching, o agendar una consulta.' }
    ];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const ai = getAiClient();
    if (!ai) return;

    chatRef.current = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `Eres el asistente virtual de Robert Terán, un Auditor Líder ISO y Coach Ejecutivo. 
        Tu objetivo es responder preguntas sobre sus servicios y animar a los usuarios a agendar una consulta. Sé profesional, conciso y amable. 
        
        PERFIL DE ROBERT TERÁN:
        - Más de 30 años de experiencia en la industria.
        - Certificado como IBM 2025 Coach.
        - Auditor Líder en ISO 9001, ISO 14001, Lean Manufacturing y Six Sigma Green Belt.
        - Amplia trayectoria en Dirección Ejecutiva y Comercial (Corporate Executive Director, Commercial Director, Market Manager).
        - Amplia trayectoria en Gestión de Calidad y Operaciones (Quality & Production Manager, Quality Analyst).
        
        Conoces las siguientes certificaciones que son el estándar de oro:
        - ISO 9001:2015 (Gestión de Calidad)
        - ISO 14001:2015 (Gestión Ambiental)
        - ISO 45001:2018 (Seguridad y Salud en el Trabajo)
        - ISO 27001:2022 (Seguridad de la Información)
        - ISO 22000 (Seguridad Alimentaria)
        - ISO/IEC 42001:2023 (Inteligencia Artificial)
        - CIA, CISA, CPA, CRMA.

        Sobre Estructuración Empresarial y Procesos, Robert se especializa en:
        - Estructuración Organizacional (organigramas, roles, OKRs)
        - Mapeo y Optimización (As-Is/To-Be, BPMN, Lean)
        - Estandarización SGC (SOPs, manuales, KPIs)
        - Gestión de Riesgos y Mejora (PDCA, auditorías internas)

        Si el usuario quiere agendar una consulta, indícale que puede hacerlo directamente en la página de agendamiento: /agendar (o haciendo clic en "Agendar Consulta" en el menú superior). Puedes usar formato Markdown para crear el enlace: [Agendar Consulta](/agendar).`,
      }
    });

    // Load history into the chat session if it exists
    if (messages.length > 1) {
      // We don't have a direct way to set history on the genai SDK chat session after creation in this specific preview version easily without passing it to create,
      // but we can pass history to create. Let's recreate it with history.
      const history = messages.slice(1).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      
      chatRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: history,
        config: {
          systemInstruction: `Eres el asistente virtual de Robert Terán, un Auditor Líder ISO y Coach Ejecutivo. 
          Tu objetivo es responder preguntas sobre sus servicios y animar a los usuarios a agendar una consulta. Sé profesional, conciso y amable. 
          
          PERFIL DE ROBERT TERÁN:
          - Más de 30 años de experiencia en la industria.
          - Certificado como IBM 2025 Coach.
          - Auditor Líder en ISO 9001, ISO 14001, Lean Manufacturing y Six Sigma Green Belt.
          - Amplia trayectoria en Dirección Ejecutiva y Comercial (Corporate Executive Director, Commercial Director, Market Manager).
          - Amplia trayectoria en Gestión de Calidad y Operaciones (Quality & Production Manager, Quality Analyst).
          
          Conoces las siguientes certificaciones que son el estándar de oro:
          - ISO 9001:2015 (Gestión de Calidad)
          - ISO 14001:2015 (Gestión Ambiental)
          - ISO 45001:2018 (Seguridad y Salud en el Trabajo)
          - ISO 27001:2022 (Seguridad de la Información)
          - ISO 22000 (Seguridad Alimentaria)
          - ISO/IEC 42001:2023 (Inteligencia Artificial)
          - CIA, CISA, CPA, CRMA.

          Sobre Estructuración Empresarial y Procesos, Robert se especializa en:
          - Estructuración Organizacional (organigramas, roles, OKRs)
          - Mapeo y Optimización (As-Is/To-Be, BPMN, Lean)
          - Estandarización SGC (SOPs, manuales, KPIs)
          - Gestión de Riesgos y Mejora (PDCA, auditorías internas)

          Si el usuario quiere agendar una consulta, indícale que puede hacerlo directamente en la página de agendamiento: /agendar (o haciendo clic en "Agendar Consulta" en el menú superior). Puedes usar formato Markdown para crear el enlace: [Agendar Consulta](/agendar).`,
        }
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: response.text }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, hubo un error al procesar tu mensaje.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[400px] h-[500px] max-h-[80vh] glass rounded-2xl border border-white/10 shadow-2xl flex flex-col z-50 overflow-hidden bg-[#0a0a0a]"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">IA</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Asistente Virtual</h3>
                  <p className="text-[10px] text-green-400">En línea</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-red-600 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-gray-200 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-2xl bg-white/10 text-gray-200 rounded-tl-sm flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-4 py-2 flex flex-wrap gap-2 mb-2">
                <button onClick={() => { setInput("¿Qué es la ISO 9001?"); }} className="text-xs bg-white/5 border border-white/10 hover:border-red-500 text-gray-300 rounded-full px-3 py-1.5 transition-colors">¿Qué es la ISO 9001?</button>
                <button onClick={() => { setInput("¿En qué consiste el Coaching Ejecutivo?"); }} className="text-xs bg-white/5 border border-white/10 hover:border-red-500 text-gray-300 rounded-full px-3 py-1.5 transition-colors">¿Qué es Coaching IBM 2025?</button>
                <button onClick={() => { setInput("Quiero agendar una consulta"); }} className="text-xs bg-white/5 border border-white/10 hover:border-red-500 text-gray-300 rounded-full px-3 py-1.5 transition-colors">Agendar consulta</button>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition"
                />
                <button 
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
