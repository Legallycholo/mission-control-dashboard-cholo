'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type EventType = 'Campaña' | 'Email' | 'Pauta' | 'Feriado' | 'Lanzamiento';

interface CalEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  color: string;
}

const EVENT_COLORS: Record<EventType, string> = {
  Campaña: 'bg-blue-500',
  Email: 'bg-violet-500',
  Pauta: 'bg-emerald-500',
  Feriado: 'bg-zinc-400',
  Lanzamiento: 'bg-amber-500',
};

const EVENT_TEXT: Record<EventType, string> = {
  Campaña: 'text-blue-700 bg-blue-50 border-blue-200',
  Email: 'text-violet-700 bg-violet-50 border-violet-200',
  Pauta: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Feriado: 'text-zinc-600 bg-zinc-100 border-zinc-200',
  Lanzamiento: 'text-amber-700 bg-amber-50 border-amber-200',
};

const MOCK_EVENTS: CalEvent[] = [
  { id: '1', title: 'Día de la Madre', date: '2026-05-10', type: 'Feriado', color: 'bg-zinc-400' },
  { id: '2', title: 'Campaña Día Madre Email', date: '2026-05-08', type: 'Email', color: 'bg-violet-500' },
  { id: '3', title: 'Pauta Google Día Madre', date: '2026-05-05', type: 'Pauta', color: 'bg-emerald-500' },
  { id: '4', title: 'Hot Sale', date: '2026-05-20', type: 'Campaña', color: 'bg-blue-500' },
  { id: '5', title: 'Lanzamiento iPhone 17', date: '2026-05-23', type: 'Lanzamiento', color: 'bg-amber-500' },
  { id: '6', title: 'Email Post-Hot Sale', date: '2026-05-22', type: 'Email', color: 'bg-violet-500' },
  { id: '7', title: 'Pauta Meta Hot Sale', date: '2026-05-18', type: 'Pauta', color: 'bg-emerald-500' },
  { id: '8', title: 'Cyber Monday Prep', date: '2026-06-01', type: 'Campaña', color: 'bg-blue-500' },
];

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function buildCalendarDays(month: Date): Date[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(year, m, 1);
  const lastDay = new Date(year, m + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun
  const days: Date[] = [];
  // Fill prev month days
  for (let i = startDow - 1; i >= 0; i--) {
    days.push(new Date(year, m, -i));
  }
  // Fill current month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, m, d));
  }
  // Fill next month to complete grid (multiple of 7)
  const remaining = 7 - (days.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      days.push(new Date(year, m + 1, d));
    }
  }
  return days;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-');
  return `${parseInt(d)} ${MONTH_NAMES[parseInt(m) - 1].slice(0, 3)}`;
}

export default function CalendarioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1));
  const today = toDateStr(new Date(2026, 4, 16)); // fixed "today" for mock

  const calDays = buildCalendarDays(currentMonth);
  const curYear = currentMonth.getFullYear();
  const curMonthIdx = currentMonth.getMonth();

  const eventsByDate: Record<string, CalEvent[]> = {};
  for (const ev of MOCK_EVENTS) {
    if (!eventsByDate[ev.date]) eventsByDate[ev.date] = [];
    eventsByDate[ev.date].push(ev);
  }

  const upcomingEvents = [...MOCK_EVENTS]
    .filter((ev) => ev.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const prevMonth = () => setCurrentMonth(new Date(curYear, curMonthIdx - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(curYear, curMonthIdx + 1, 1));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900">Marketing: Calendario Comercial</h1>
          <p className="text-sm text-zinc-500 mt-1">Planificación de campañas, eventos y fechas clave</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="w-8 h-8 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <ChevronLeft className="w-4 h-4 text-zinc-600" />
          </button>
          <span className="text-sm font-semibold text-zinc-800 min-w-[130px] text-center">
            {MONTH_NAMES[curMonthIdx]} {curYear}
          </span>
          <button onClick={nextMonth} className="w-8 h-8 rounded-xl border border-zinc-200 bg-white flex items-center justify-center hover:bg-zinc-50 transition-colors">
            <ChevronRight className="w-4 h-4 text-zinc-600" />
          </button>
        </div>
      </div>

      {/* Event Type Legend */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(EVENT_COLORS) as EventType[]).map((type) => (
          <span key={type} className={cn('text-xs font-medium px-3 py-1 rounded-full border', EVENT_TEXT[type])}>
            {type}
          </span>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-zinc-100">
            {DAY_NAMES.map((d) => (
              <div key={d} className="px-1.5 py-2 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7">
            {calDays.map((day, idx) => {
              const dateStr = toDateStr(day);
              const isCurrentMonth = day.getMonth() === curMonthIdx;
              const isToday = dateStr === today;
              const events = eventsByDate[dateStr] ?? [];

              return (
                <div
                  key={idx}
                  className={cn(
                    'min-h-[80px] p-1.5 border border-zinc-100/60 rounded-xl relative',
                    isToday && 'bg-blue-50/60',
                    !isCurrentMonth && 'bg-zinc-50/40 opacity-50'
                  )}
                >
                  <span className={cn(
                    'text-xs font-semibold text-zinc-600 block text-right mb-1',
                    isToday && 'text-blue-600'
                  )}>
                    {day.getDate()}
                  </span>
                  <div className="space-y-0.5">
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white truncate', ev.color)}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Events */}
          <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <h2 className="font-semibold text-zinc-800">Próximos Eventos</h2>
            </div>
            <div className="divide-y divide-zinc-100">
              {upcomingEvents.length === 0 ? (
                <p className="px-6 py-6 text-sm text-zinc-400 text-center">No hay eventos próximos.</p>
              ) : (
                upcomingEvents.map((ev) => (
                  <div key={ev.id} className="px-5 py-3.5 flex items-start gap-3">
                    <span className="text-xs font-semibold text-zinc-500 bg-zinc-100 rounded-lg px-2 py-1 shrink-0 mt-0.5">
                      {formatShortDate(ev.date)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full border block mb-1 truncate', EVENT_TEXT[ev.type])}>
                        {ev.type}
                      </span>
                      <p className="text-sm font-medium text-zinc-800 truncate">{ev.title}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Type Legend detail */}
          <div className="rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl p-5">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">Tipos de Evento</h3>
            <div className="space-y-2">
              {(Object.entries(EVENT_COLORS) as [EventType, string][]).map(([type, colorClass]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={cn('w-3 h-3 rounded-full shrink-0', colorClass)} />
                  <span className="text-sm text-zinc-600">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Suggested Strip */}
      <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 flex gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800">
          GSM Pro AI sugiere: <strong>Activar campaña de re-engagement</strong> el 15 de junio para clientes inactivos más de 60 días. Ventana óptima antes del Cyber Monday de julio.
        </p>
      </div>
    </div>
  );
}
