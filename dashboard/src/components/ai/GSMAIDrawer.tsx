'use client';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import {
  X,
  Plus,
  Send,
  Sparkles,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  Users,
  RotateCcw,
  ArrowUpRight,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface GSMAIDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function generateId() { return Math.random().toString(36).substring(2, 11); }

function generateMockResponse(input: string): string {
  const lower = input.toLowerCase();
  if (/venta|ingreso|shopify|aov|orden/.test(lower))
    return `**Análisis de Ventas — GSM PRO**\n\n• Ventas netas con tendencia positiva vs período anterior\n• AOV dentro del rango objetivo mensual\n• Mayor crecimiento: Smartphones & Accesorios\n• Tasa de conversión Shopify: 2.4% (benchmark: 1.8%)\n\n> **Recomendación:** Incrementar inversión en Google Shopping para categorías de alto margen.`;
  if (/tráfico|trafico|seo|google ads|meta|roas/.test(lower))
    return `**Tráfico — GSM PRO**\n\n• Orgánico: 38% del total (↑4% vs anterior)\n• Posición promedio Google: mejoró 1.4 pts este mes\n• ROAS Google Ads: 4.2x | ROAS Meta: 2.8x\n\n> **Oportunidad SEO:** 12 keywords en posición 4–10 con alto volumen.`;
  if (/cliente|ltv|retención|retencion/.test(lower))
    return `**Clientes — GSM PRO**\n\n• LTV promedio (12m): $187,500 CLP\n• Tasa de recompra: 23% (objetivo: 28%)\n• Clientes en riesgo de fuga: 234 (>90 días sin compra)\n\n> **Insight:** Clientes vía SEO orgánico tienen LTV 34% superior a pauta pagada.`;
  if (/marketing|klaviyo|email|campaña/.test(lower))
    return `**Marketing — GSM PRO**\n\n• Open rate Klaviyo: 28.4% (benchmark: 21%)\n• Revenue email este mes: $2.3M CLP\n• Flujo abandono carrito: 67 recuperaciones (↑12%)\n\n> **Acción:** Activar re-engagement a "Compradores frecuentes inactivos".`;
  if (/finanza|margen|pnl|opex|costo/.test(lower))
    return `**Finanzas — GSM PRO**\n\n• Margen bruto estimado: 34.2%\n• OPEX como % de ingresos: 18.7%\n• Proyección margen operacional al cierre: 15.5%\n\n_Completa la configuración de costos en P&L para mayor precisión._`;
  return `**GSM Pro AI — Listo para analizar**\n\n• ✓ Shopify · ✓ Google Analytics 4 · ✓ Search Console · ✓ Crisp\n\nMétricas generales dentro del rango esperado. Pregúntame sobre ventas, tráfico, clientes, marketing o finanzas.`;
}

function renderMarkdown(text: string) {
  return {
    __html: text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^• (.+)$/gm, '<li style="margin-left:12px;list-style:disc">$1</li>')
      .replace(/^> (.+)$/gm, '<div style="border-left:2px solid #93c5fd;padding-left:10px;color:#6b7280;margin:6px 0;font-style:italic">$1</div>')
      .replace(/\n/g, '<br/>'),
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="bg-white border border-zinc-200/70 rounded-3xl rounded-bl-[4px] px-4 py-3 shadow-sm flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-400"
            animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.55, delay: i * 0.12 }} />
        ))}
      </div>
    </div>
  );
}

const QUICK_PROMPTS = [
  { icon: TrendingUp,  text: 'Analiza ventas del mes' },
  { icon: BarChart3,   text: 'ROAS Google vs Meta' },
  { icon: ShoppingCart, text: 'Productos mayor margen' },
  { icon: Users,       text: 'Clientes con mayor LTV' },
];

// ─── Main Panel ───────────────────────────────────────────────────────────────

export function GSMAIDrawer({ isOpen, onClose }: GSMAIDrawerProps) {
  const [chats, setChats]               = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput]               = useState('');
  const [isTyping, setIsTyping]         = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gsm-ai-chats');
      if (stored) setChats(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('gsm-ai-chats', JSON.stringify(chats)); } catch {}
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, isTyping]);

  // Focus textarea when panel opens
  useEffect(() => {
    if (isOpen) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [isOpen]);

  const currentChat = chats.find(c => c.id === currentChatId) ?? null;

  function handleNewChat() {
    setCurrentChatId(null);
    setInput('');
    setIsTyping(false);
    textareaRef.current?.focus();
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    const now = new Date().toISOString();
    const userMsg: Message = { id: generateId(), role: 'user', content: trimmed, timestamp: now };
    let targetId = currentChatId;

    if (!targetId) {
      const newChat: Chat = { id: generateId(), title: trimmed.slice(0, 38), messages: [userMsg], createdAt: now, updatedAt: now };
      targetId = newChat.id;
      setChats(prev => [newChat, ...prev]);
      setCurrentChatId(targetId);
    } else {
      setChats(prev => prev.map(c => c.id === targetId ? { ...c, messages: [...c.messages, userMsg], updatedAt: now } : c));
    }

    setInput('');
    setIsTyping(true);

    const chatId = targetId;
    setTimeout(() => {
      const aiMsg: Message = { id: generateId(), role: 'assistant', content: generateMockResponse(trimmed), timestamp: new Date().toISOString() };
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, aiMsg], updatedAt: new Date().toISOString() } : c));
      setIsTyping(false);
    }, 1100);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="ai-panel"
          initial={{ x: '100%', opacity: 0.6 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 280, mass: 0.75 }}
          className="fixed top-16 right-0 bottom-0 z-30 w-full sm:w-[380px] flex flex-col"
          style={{
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'saturate(180%) blur(40px)',
            WebkitBackdropFilter: 'saturate(180%) blur(40px)',
            boxShadow: '-16px 0 48px -8px rgba(0,0,0,0.10), -1px 0 0 rgba(0,0,0,0.06)',
          }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 leading-none">GSM Pro AI</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">gemini-2.0-flash</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* History / new chat button */}
              {currentChat && (
                <button
                  type="button"
                  onClick={handleNewChat}
                  title="Nueva conversación"
                  className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Full page link */}
              <Link
                href="/vendor-intelligence"
                onClick={onClose}
                title="Abrir página completa"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-100 hover:border-blue-200 transition-all"
              >
                <span>Ver todo</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          {!currentChat ? (
            /* Welcome state */
            <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto">
              <div className="flex flex-col items-center justify-center flex-1 gap-5 py-6">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/25">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-zinc-900 tracking-tight">¿En qué puedo ayudarte?</h2>
                  <p className="text-xs text-zinc-500 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                    Analizo datos en tiempo real de Shopify, Google Ads, Analytics y más.
                  </p>
                </div>

                {/* Quick prompts grid */}
                <div className="grid grid-cols-2 gap-2 w-full">
                  {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
                    <button
                      key={text}
                      type="button"
                      onClick={() => { setInput(text); textareaRef.current?.focus(); }}
                      className="flex flex-col items-start gap-2 p-3 rounded-2xl border border-zinc-200/80 bg-white/70 hover:bg-zinc-50 hover:border-zinc-300 transition-all text-left group"
                    >
                      <div className="w-7 h-7 rounded-xl bg-zinc-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
                        <Icon className="w-3.5 h-3.5 text-zinc-500 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <span className="text-xs text-zinc-700 leading-snug font-medium">{text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat history hint */}
              {chats.length > 0 && (
                <Link
                  href="/vendor-intelligence"
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-2xl border border-zinc-200/80 hover:bg-zinc-50 transition-colors group"
                >
                  <History className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-700">Ver historial completo</p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      {chats.length} conversación{chats.length !== 1 ? 'es' : ''} guardada{chats.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 shrink-0 transition-colors" />
                </Link>
              )}
            </div>
          ) : (
            /* Active chat */
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
              {currentChat.messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[82%] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl rounded-br-[4px] px-4 py-2.5 text-sm shadow-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div
                        className="flex-1 bg-white border border-zinc-200/70 rounded-3xl rounded-bl-[4px] px-4 py-3 text-sm text-zinc-800 shadow-sm leading-relaxed"
                        dangerouslySetInnerHTML={renderMarkdown(msg.content)}
                      />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <TypingIndicator />
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* ── Input Footer ── */}
          <div className="border-t border-zinc-100/80 p-3 shrink-0 bg-white/60">
            <div className="bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentChat ? 'Escribe tu consulta...' : 'Pregúntame sobre ventas, tráfico, clientes...'}
                rows={2}
                className="w-full resize-none outline-none text-sm text-zinc-900 placeholder:text-zinc-400 bg-transparent px-4 pt-3 pb-2"
                style={{ maxHeight: 100 }}
              />
              <div className="px-3 py-2 flex items-center justify-between border-t border-zinc-100">
                <button
                  type="button"
                  onClick={handleNewChat}
                  className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100"
                >
                  <Plus className="w-3 h-3" />
                  Nuevo chat
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="w-8 h-8 rounded-xl bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-md hover:shadow-blue-500/30"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
