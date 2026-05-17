'use client';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Plus,
  Search,
  ChevronRight,
  Send,
  Sparkles,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Users,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string for JSON serialization
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface GSMAIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  if (diff < 7) return `Hace ${diff} días`;
  return date.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
}

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase();

  if (/venta|ingreso|shopify|aov|orden/.test(lower)) {
    return `**Análisis de Ventas — GSM PRO**\n\n• Las ventas netas del período actual muestran tendencia positiva vs período anterior\n• El AOV (Ticket Promedio) se mantiene dentro del rango objetivo mensual\n• Categoría con mayor crecimiento: Smartphones & Accesorios\n• Tasa de conversión en Shopify: 2.4% (benchmark sector: 1.8%)\n\n_Conectando con Vertex AI para proyección del cierre mensual..._\n\n> **Recomendación:** Incrementar inversión en Google Shopping para categorías de alto margen.`;
  }

  if (/tráfico|trafico|seo|search console|orgánico|organico|google ads|meta ads|roas/.test(lower)) {
    return `**Resumen de Tráfico — GSM PRO**\n\n• Tráfico orgánico: 38% del total de sesiones (↑4% vs período anterior)\n• Posición promedio en Google: mejoró 1.4 puntos este mes\n• ROAS Google Ads: 4.2x | ROAS Meta: 2.8x\n• CTR orgánico: 3.1% (keywords de marca: 8.4%)\n\n> **Oportunidad SEO:** 12 keywords en posición 4-10 con alto volumen de búsqueda — candidatas a optimización.`;
  }

  if (/cliente|ltv|retención|retencion|segmento|cohorte/.test(lower)) {
    return `**Análisis de Clientes — GSM PRO**\n\n• LTV promedio (12 meses): $187,500 CLP\n• Tasa de recompra: 23% (objetivo: 28%)\n• Segmento VIP (>3 compras): 12% de la base genera 41% del ingreso\n• Clientes en riesgo de fuga: 234 (último ciclo >90 días)\n\n> **Insight IA:** Clientes adquiridos por SEO orgánico tienen LTV 34% superior a los de pauta pagada.`;
  }

  if (/marketing|klaviyo|email|campaña|campana/.test(lower)) {
    return `**Marketing & Email — GSM PRO**\n\n• Open rate promedio campañas Klaviyo: 28.4% (benchmark: 21%)\n• Click rate: 4.1% | Conversión post-email: 1.8%\n• Revenue atribuido a email este mes: $2.3M CLP\n• Flujo de abandono de carrito: 67 recuperaciones (↑12%)\n\n> **Recomendación:** Activar segmento de "Compradores frecuentes inactivos" con campaña de re-engagement.`;
  }

  if (/finanza|costo|margen|pnl|opex|gasto/.test(lower)) {
    return `**Finanzas — GSM PRO**\n\n• Margen bruto estimado: 34.2% (ajustado por COGS)\n• OPEX como % de ingresos: 18.7% (threshold de alerta: >35%)\n• Pasarela de pago (Webpay/MP): 2.1% del GMV en comisiones\n• Proyección de margen operacional al cierre del mes: 15.5%\n\n_Para análisis más preciso, completa la configuración de costos en P&L._`;
  }

  return `**GSM Pro AI — Analizando dashboard...**\n\n• ✓ Shopify (Ventas & Órdenes) — conectado\n• ✓ Google Analytics 4 (Tráfico) — conectado\n• ✓ Google Search Console (SEO) — conectado\n• ✓ Crisp CRM (Soporte) — conectado\n• ○ Vertex AI (Gemini 2.0) — pendiente de credenciales\n\nLas métricas generales del período están **dentro del rango esperado**. Para análisis más específicos, configura la Google Cloud API Key en los ajustes del dashboard.\n\n> Escríbeme sobre ventas, tráfico, clientes, marketing o finanzas para un análisis detallado.`;
}

function renderMarkdown(text: string): { __html: string } {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm, '<li style="margin-left:12px;list-style:disc">$1</li>')
    .replace(
      /^> (.+)$/gm,
      '<div style="border-left:2px solid #93c5fd;padding-left:10px;color:#6b7280;margin:6px 0;font-style:italic">$1</div>'
    )
    .replace(/\n/g, '<br/>');
  return { __html: html };
}

// ─── Suggested prompts data ───────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  {
    icon: TrendingUp,
    text: 'Analiza ventas del mes actual y dame 3 insights clave',
  },
  {
    icon: BarChart3,
    text: 'Compara ROAS de Google Ads vs Meta esta semana',
  },
  {
    icon: ShoppingCart,
    text: '¿Qué productos tienen el mejor margen de rentabilidad?',
  },
  {
    icon: Users,
    text: 'Identifica clientes con mayor LTV esta cohorte',
  },
];

const QUICK_CHIPS = ['Analizar datos', 'Ver tendencias', 'Comparar períodos', 'Alertas de KPIs'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-zinc-200/70 rounded-3xl rounded-bl-[4px] px-4 py-3 shadow-sm flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-zinc-400"
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Input Box ────────────────────────────────────────────────────────────────

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  disabled: boolean;
  placeholder?: string;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  compact?: boolean;
}

function InputBox({
  value,
  onChange,
  onSend,
  disabled,
  placeholder = 'Escribe tu consulta al dashboard...',
  textareaRef,
  compact = false,
}: InputBoxProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={compact ? 1 : 2}
        className={cn(
          'w-full resize-none outline-none text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent',
          compact ? 'px-4 pt-2.5 pb-1.5' : 'px-4 pt-3 pb-2'
        )}
        style={{ minHeight: compact ? 40 : 52, maxHeight: 120 }}
      />
      <div className="px-3 py-2 flex items-center justify-between border-t border-zinc-100">
        <button
          type="button"
          className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="w-8 h-8 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function GSMAIDrawer({ isOpen, onClose }: GSMAIDrawerProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gsm-ai-chats');
      if (stored) {
        const parsed: Chat[] = JSON.parse(stored);
        setChats(parsed);
      }
    } catch {
      // ignore malformed data
    }
  }, []);

  // Persist chats to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('gsm-ai-chats', JSON.stringify(chats));
    } catch {
      // ignore storage errors
    }
  }, [chats]);

  // Scroll to bottom when messages update or typing indicator appears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, isTyping]);

  const currentChat = chats.find((c) => c.id === currentChatId) ?? null;

  const filteredChats = chats.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleNewChat() {
    setCurrentChatId(null);
    setInput('');
    setIsTyping(false);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const now = new Date().toISOString();
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: now,
    };

    let targetChatId = currentChatId;

    if (!targetChatId) {
      const newChat: Chat = {
        id: generateId(),
        title: trimmed.slice(0, 40),
        messages: [userMessage],
        createdAt: now,
        updatedAt: now,
      };
      targetChatId = newChat.id;
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(targetChatId);
    } else {
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetChatId
            ? { ...c, messages: [...c.messages, userMessage], updatedAt: now }
            : c
        )
      );
    }

    setInput('');
    setIsTyping(true);

    const chatIdForResponse = targetChatId;
    setTimeout(() => {
      const responseContent = generateMockResponse(trimmed);
      const aiMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString(),
      };

      setChats((prev) =>
        prev.map((c) =>
          c.id === chatIdForResponse
            ? {
                ...c,
                messages: [...c.messages, aiMessage],
                updatedAt: new Date().toISOString(),
              }
            : c
        )
      );
      setIsTyping(false);
    }, 1200);
  }

  function handleChipClick(chip: string) {
    setInput(chip);
    textareaRef.current?.focus();
  }

  function handlePromptClick(text: string) {
    setInput(text);
    textareaRef.current?.focus();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300, mass: 0.8 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[820px]"
            style={{
              backdropFilter: 'saturate(180%) blur(48px)',
              WebkitBackdropFilter: 'saturate(180%) blur(48px)',
              backgroundColor: 'rgba(255,255,255,0.88)',
              boxShadow: '-24px 0 80px -12px rgba(0,0,0,0.14)',
            }}
          >
            <div className="flex flex-row h-full">
              {/* ── Left Sidebar ── */}
              <div className="w-56 flex-shrink-0 flex flex-col bg-zinc-50/50">
                {/* Header */}
                <div className="p-4 border-b border-zinc-100/80">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-zinc-900 leading-none">GSM Pro AI</p>
                        <p className="text-[10px] text-zinc-400 font-medium mt-0.5">
                          Powered by Vertex AI
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* New chat button */}
                <div className="mx-3 mt-3">
                  <button
                    type="button"
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />
                      Nueva conversación
                    </span>
                    <span className="text-[10px] text-zinc-400">⌘N</span>
                  </button>
                </div>

                {/* Search */}
                <div className="mx-3 mt-2 relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar conversaciones..."
                    className="w-full bg-zinc-100/80 border border-zinc-200/60 rounded-xl pl-8 pr-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-blue-300 transition-colors"
                  />
                </div>

                {/* History */}
                <div className="flex-1 overflow-y-auto mt-3 px-3">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2 px-1">
                    HISTORIAL
                  </p>
                  {filteredChats.length === 0 ? (
                    <p className="text-[11px] text-zinc-400 text-center py-4">
                      Sin conversaciones aún
                    </p>
                  ) : (
                    filteredChats.map((chat) => (
                      <button
                        key={chat.id}
                        type="button"
                        onClick={() => setCurrentChatId(chat.id)}
                        className={cn(
                          'w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group flex flex-col gap-0.5 mb-0.5',
                          chat.id === currentChatId
                            ? 'bg-blue-50/80 border border-blue-100'
                            : 'hover:bg-zinc-100/70 border border-transparent'
                        )}
                      >
                        <span className="text-xs font-medium text-zinc-800 truncate block max-w-full">
                          {chat.title.length > 28
                            ? chat.title.slice(0, 28) + '…'
                            : chat.title}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {formatDate(chat.updatedAt)}
                        </span>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-zinc-100/60 shrink-0">
                  <p className="text-[10px] text-zinc-400 text-center">GSM PRO © 2026</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-r border-zinc-200/50" />

              {/* ── Right Chat Area ── */}
              <div className="flex-1 flex flex-col min-w-0">
                {!currentChat || currentChat.messages.length === 0 ? (
                  /* Empty / Welcome State */
                  <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8 gap-8 overflow-y-auto">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.08 } },
                      }}
                      className="w-full flex flex-col items-center gap-8"
                    >
                      {/* Heading */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="text-center"
                      >
                        <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
                          ¿En qué puedo ayudarte?
                        </h2>
                        <p className="text-sm text-zinc-400 mt-2 max-w-sm leading-relaxed">
                          Analizo datos en tiempo real de Shopify, Google Ads, Analytics y más
                          para darte insights accionables.
                        </p>
                      </motion.div>

                      {/* Input box */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="w-full max-w-xl"
                      >
                        <InputBox
                          value={input}
                          onChange={setInput}
                          onSend={handleSend}
                          disabled={isTyping}
                          placeholder="Pregúntame sobre ventas, tráfico, clientes..."
                          textareaRef={textareaRef}
                          compact={false}
                        />
                      </motion.div>

                      {/* Quick chips */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="flex flex-wrap justify-center gap-2"
                      >
                        {QUICK_CHIPS.map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleChipClick(chip)}
                            className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-100 hover:bg-zinc-200 text-zinc-600 border border-zinc-200/60 transition-colors cursor-pointer"
                          >
                            {chip}
                          </button>
                        ))}
                      </motion.div>

                      {/* Suggested prompts */}
                      <motion.div
                        variants={{
                          hidden: { opacity: 0, y: 16 },
                          visible: { opacity: 1, y: 0 },
                        }}
                        className="w-full max-w-xl rounded-2xl border border-zinc-200/60 bg-white/70 overflow-hidden"
                      >
                        {SUGGESTED_PROMPTS.map(({ icon: Icon, text }, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handlePromptClick(text)}
                            className={cn(
                              'w-full flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-50/80 cursor-pointer transition-colors group text-left',
                              idx < SUGGESTED_PROMPTS.length - 1
                                ? 'border-b border-zinc-100/80'
                                : ''
                            )}
                          >
                            <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                              <Icon className="w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <span className="flex-1 text-sm text-zinc-700">{text}</span>
                            <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors shrink-0" />
                          </button>
                        ))}
                      </motion.div>
                    </motion.div>
                  </div>
                ) : (
                  /* Active Chat State */
                  <>
                    {/* Chat header */}
                    <div className="px-5 py-3 border-b border-zinc-100/80 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-zinc-900 leading-none">
                            GSM Pro AI
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">gemini-2.0-flash</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleNewChat}
                        className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-zinc-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Nueva conversación
                      </button>
                    </div>

                    {/* Message thread */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                      {currentChat.messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {msg.role === 'user' ? (
                            <div className="flex justify-end">
                              <div className="max-w-[75%] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl rounded-br-[4px] px-4 py-3 text-sm shadow-sm whitespace-pre-wrap">
                                {msg.content}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                              </div>
                              <div
                                className="flex-1 max-w-[80%] bg-white border border-zinc-200/70 rounded-3xl rounded-bl-[4px] px-4 py-3 text-sm text-zinc-800 shadow-sm"
                                dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                              />
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <TypingIndicator />
                        </motion.div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Sticky input */}
                    <div className="border-t border-zinc-100 bg-white/60 backdrop-blur-xl p-4 shrink-0">
                      <InputBox
                        value={input}
                        onChange={setInput}
                        onSend={handleSend}
                        disabled={isTyping}
                        placeholder="Escribe tu consulta al dashboard..."
                        textareaRef={textareaRef}
                        compact={true}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
