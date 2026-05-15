import { Sparkles, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  label: string;
  description: string;
  area: 'KPI' | 'Visualizacion' | 'UX/UI' | 'Backend' | 'IA';
}

interface ComingSoonProps {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  features: Feature[];
  apiNote?: string;
}

const areaColors: Record<Feature['area'], string> = {
  KPI: 'bg-blue-50 text-blue-600 border-blue-200/60',
  Visualizacion: 'bg-purple-50 text-purple-600 border-purple-200/60',
  'UX/UI': 'bg-emerald-50 text-emerald-600 border-emerald-200/60',
  Backend: 'bg-amber-50 text-amber-600 border-amber-200/60',
  IA: 'bg-rose-50 text-rose-600 border-rose-200/60',
};

export function ComingSoon({
  title,
  subtitle,
  description,
  icon: Icon,
  accentColor,
  features,
  apiNote,
}: ComingSoonProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">{title}</h1>
        <p className="text-zinc-500 mt-1">{subtitle}</p>
      </div>

      {/* Hero card */}
      <div
        className={cn(
          'relative rounded-3xl border overflow-hidden p-10 flex flex-col items-center text-center',
          accentColor,
        )}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-current opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl bg-current opacity-10" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-5 max-w-lg">
          <div className="w-16 h-16 rounded-2xl bg-white/90 flex items-center justify-center shadow-xl">
            <Icon className="w-8 h-8 text-zinc-700" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3 h-3" />
              Módulo en desarrollo
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{description}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/70 bg-white/10 border border-white/20 px-4 py-2 rounded-xl">
            <Clock className="w-3.5 h-3.5" />
            Disponible próximamente — arquitectura en diseño
          </div>
        </div>
      </div>

      {/* Feature preview grid */}
      <div>
        <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">
          Funcionalidades planeadas ({features.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200 bg-white/85 backdrop-blur-xl"
            >
              <div className="mt-0.5 shrink-0">
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                    areaColors[f.area],
                  )}
                >
                  {f.area}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-800">{f.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API note */}
      {apiNote && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 flex gap-3">
          <div className="text-amber-500 mt-0.5 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800">Prerequisito de integración</p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">{apiNote}</p>
          </div>
        </div>
      )}
    </div>
  );
}
