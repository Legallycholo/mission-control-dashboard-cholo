'use client';

import { useState } from 'react';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

type Preset = { label: string; getValue: () => { startDate: string; endDate: string } };

const PRESETS: Preset[] = [
  { label: 'Hoy', getValue: () => { const d = toDateStr(new Date()); return { startDate: d, endDate: d }; } },
  {
    label: 'Ayer', getValue: () => {
      const d = new Date(); d.setDate(d.getDate() - 1); const s = toDateStr(d);
      return { startDate: s, endDate: s };
    },
  },
  {
    label: 'Últimos 7d', getValue: () => {
      const end = new Date(); const start = new Date(); start.setDate(start.getDate() - 6);
      return { startDate: toDateStr(start), endDate: toDateStr(end) };
    },
  },
  {
    label: 'Últimos 30d', getValue: () => {
      const end = new Date(); const start = new Date(); start.setDate(start.getDate() - 29);
      return { startDate: toDateStr(start), endDate: toDateStr(end) };
    },
  },
  {
    label: 'Este mes', getValue: () => {
      const now = new Date();
      return { startDate: toDateStr(new Date(now.getFullYear(), now.getMonth(), 1)), endDate: toDateStr(now) };
    },
  },
  {
    label: 'Mes anterior', getValue: () => {
      const now = new Date();
      return {
        startDate: toDateStr(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
        endDate: toDateStr(new Date(now.getFullYear(), now.getMonth(), 0)),
      };
    },
  },
  {
    label: 'Este trimestre', getValue: () => {
      const now = new Date();
      const q = Math.floor(now.getMonth() / 3);
      return { startDate: toDateStr(new Date(now.getFullYear(), q * 3, 1)), endDate: toDateStr(now) };
    },
  },
];

interface Props {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  className?: string;
}

export function DateRangePicker({ startDate, endDate, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const applyPreset = (preset: Preset) => {
    const { startDate: s, endDate: e } = preset.getValue();
    onChange(s, e);
    setOpen(false);
    setShowCustom(false);
  };

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-2 rounded-xl text-sm text-zinc-900 hover:bg-zinc-100 transition-all"
      >
        <CalendarDays className="w-4 h-4 text-zinc-500" />
        <span className="font-medium">{startDate} — {endDate}</span>
        <ChevronDown className={cn('w-4 h-4 text-zinc-500 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 left-0 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl p-3 min-w-[256px]">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1 mb-2">Presets</p>
            <div className="grid grid-cols-2 gap-1">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className="px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCustom(!showCustom)}
              className="mt-1 w-full px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors text-left border-t border-zinc-100 pt-2"
            >
              Personalizado...
            </button>

            {showCustom && (
              <div className="mt-2 space-y-2 border-t border-zinc-100 pt-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500 font-medium">Desde</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onChange(e.target.value, endDate)}
                    className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-sm text-zinc-900 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-zinc-500 font-medium">Hasta</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onChange(startDate, e.target.value)}
                    className="bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1.5 text-sm text-zinc-900 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-full py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                >
                  Aplicar
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
