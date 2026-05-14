export function getPreviousPeriod(start: Date, end: Date): { prevStart: Date; prevEnd: Date } {
  const diffMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 1);
  const prevStart = new Date(prevEnd.getTime() - diffMs);
  return { prevStart, prevEnd };
}

export function calcDelta(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
