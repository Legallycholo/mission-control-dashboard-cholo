import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  value: number;
  /** Set true for metrics where lower is better (e.g. bounce rate, discounts) */
  inverse?: boolean;
  className?: string;
}

export function DeltaBadge({ value, inverse = false, className }: Props) {
  const isNeutral = Math.abs(value) < 0.05;
  const isPositive = isNeutral ? false : inverse ? value < 0 : value > 0;
  const absVal = Math.abs(value);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
        isNeutral && 'bg-zinc-100 text-zinc-500',
        !isNeutral && isPositive && 'bg-emerald-50 text-emerald-700',
        !isNeutral && !isPositive && 'bg-rose-50 text-rose-700',
        className
      )}
    >
      {isNeutral ? (
        <Minus className="w-3 h-3" />
      ) : isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {absVal.toFixed(1)}%
    </span>
  );
}
