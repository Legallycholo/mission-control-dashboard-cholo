"use client";

import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  MessageCircle, 
  Star, 
  CalendarDays, 
  Download,
  Smile,
  Frown,
  Meh,
  Clock,
  UserCheck
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

interface KpiData {
  totalConversations: number;
  resolvedConversations: number;
  avgCsat: number;
}

interface SentimentData {
  date: string;
  avg_score: number;
  negative_tickets: number;
  neutral_tickets: number;
  positive_tickets: number;
}

interface AgentData {
  operator_name: string;
  total_tickets: number;
  resolved_tickets: number;
  avg_ttfr: number | null;
  avg_csat: number | null;
}

export default function SupportPage() {
  const [mounted, setMounted] = useState(false);
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDay.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(now.toISOString().split('T')[0]);
  
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // API Calls en paralelo
      const [kpiRes, sentimentRes, agentsRes] = await Promise.all([
        fetch(`/api/kpis/crisp?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`),
        fetch(`/api/support/sentiment?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`),
        fetch(`/api/support/agents?startDate=${startDate}T00:00:00Z&endDate=${endDate}T23:59:59Z`)
      ]);

      const [kpiJson, sentimentJson, agentsJson] = await Promise.all([
        kpiRes.json(),
        sentimentRes.json(),
        agentsRes.json()
      ]);

      setKpiData(kpiJson);
      if (sentimentJson.success) setSentimentData(sentimentJson.data);
      if (agentsJson.success) setAgentData(agentsJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleExportCSV = () => {
    if (!agentData || agentData.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Operador,Tickets Totales,Tickets Resueltos,TTFR Promedio (min),CSAT Promedio\n"
      + agentData.map(a => `${a.operator_name},${a.total_tickets},${a.resolved_tickets},${a.avg_ttfr?.toFixed(1) || 0},${a.avg_csat?.toFixed(1) || 0}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rendimiento_soporte_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Customer Services (SLA)</h1>
          <p className="text-zinc-600 mt-1">Análisis de rendimiento, tiempos de respuesta e inteligencia emocional.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 p-1.5 rounded-xl backdrop-blur-md">
            <CalendarDays className="w-4 h-4 text-zinc-600 ml-2" />
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-sm text-zinc-900 focus:outline-none px-2 "
            />
            <span className="text-zinc-600">-</span>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-sm text-zinc-900 focus:outline-none px-2 "
            />
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-zinc-100 hover:bg-zinc-200/90 text-zinc-900 px-4 py-2 rounded-xl transition-colors text-sm font-medium border border-zinc-200/70"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard 
          title="Total Conversaciones" 
          value={loading ? "..." : kpiData?.totalConversations || 0} 
          icon={MessageSquare} 
          color="blue"
        />
        <KpiCard 
          title="Conversaciones Resueltas" 
          value={loading ? "..." : kpiData?.resolvedConversations || 0} 
          icon={MessageCircle} 
          color="emerald"
        />
        <KpiCard 
          title="CSAT Promedio" 
          value={loading ? "..." : (kpiData && kpiData.avgCsat > 0) ? `${kpiData.avgCsat.toFixed(1)}/5` : "N/A"} 
          icon={Star} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sentiment Chart */}
        <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Inteligencia Emocional (NLP)</h2>
              <p className="text-xs text-zinc-600">Análisis de sentimiento diario de los usuarios</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full relative z-10">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : sentimentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="date" 
                    stroke="#52525b" 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()}/${d.getMonth()+1}`;
                    }}
                  />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" vertical={false} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '1rem', color: '#18181b' }}
                    itemStyle={{ color: '#18181b' }}
                    labelFormatter={(label) => `Fecha: ${label}`}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="positive_tickets" name="Positivo" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="neutral_tickets" name="Neutral" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="negative_tickets" name="Negativo" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">No hay datos suficientes para el análisis NLP</div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>

        {/* Leaderboard Chart (TTFR) */}
        <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-6 relative z-10">
            <div className="p-2 bg-cyan-500/20 rounded-lg text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Tiempos de Respuesta (TTFR)</h2>
              <p className="text-xs text-zinc-600">Promedio de minutos en responder al cliente (SLA)</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full relative z-10">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              </div>
            ) : agentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}m`} />
                  <YAxis type="category" dataKey="operator_name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" horizontal={true} vertical={false} />
                  <RechartsTooltip 
                    cursor={{fill: '#e4e4e7', opacity: 0.4}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '1rem', color: '#18181b' }}
                    formatter={(value: any) => [`${Number(value).toFixed(1)} mins`, 'TTFR Promedio']}
                  />
                  <Bar dataKey="avg_ttfr" fill="#06b6d4" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">No hay datos de operadores</div>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>
      </div>

      {/* Agents Table */}
      <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <div className="p-2 bg-rose-500/20 rounded-lg text-rose-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-zinc-900">Rendimiento por Operador</h2>
        </div>
        
        <div className="relative z-10 overflow-x-auto">
          {loading ? (
            <div className="w-full h-32 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
            </div>
          ) : agentData.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-600 uppercase bg-zinc-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Operador</th>
                  <th className="px-4 py-3 text-right">Tickets Atendidos</th>
                  <th className="px-4 py-3 text-right">Resueltos</th>
                  <th className="px-4 py-3 text-right">Tiempo de Rpta. (TTFR)</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">CSAT</th>
                </tr>
              </thead>
              <tbody>
                {agentData.map((agent, i) => (
                  <tr key={i} className="border-b border-zinc-200/70 hover:bg-zinc-100/70 transition-colors">
                    <td className="px-4 py-3 font-medium text-zinc-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center text-[10px] font-bold">
                        {agent.operator_name.substring(0, 2).toUpperCase()}
                      </div>
                      {agent.operator_name}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600">
                      {agent.total_tickets}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                      {agent.resolved_tickets} ({((agent.resolved_tickets / agent.total_tickets) * 100).toFixed(0)}%)
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-cyan-400">
                      {agent.avg_ttfr ? `${agent.avg_ttfr.toFixed(1)} min` : '-'}
                    </td>
                    <td className="px-4 py-3 text-right text-amber-400 font-medium flex items-center justify-end gap-1">
                      {agent.avg_csat ? agent.avg_csat.toFixed(1) : '-'} <Star className="w-3 h-3" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="w-full h-32 flex items-center justify-center text-zinc-600">No hay datos de SLA en este período.</div>
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl" />
      </div>

    </div>
  );
}

// Reusable KPI Card Component
function KpiCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: 'blue' | 'emerald' | 'amber' }) {
  const colorStyles = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="p-6 rounded-3xl border border-zinc-200 bg-white/85 backdrop-blur-xl flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start relative z-10">
        <p className="text-sm font-medium text-zinc-600">{title}</p>
        <div className={cn("p-2 rounded-xl border", colorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 relative z-10 flex items-baseline gap-2">
        <h3 className="text-4xl font-bold text-zinc-900 tracking-tight">{value}</h3>
      </div>
      {/* Background glow effect */}
      <div className={cn("absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500", colorStyles[color].split(' ')[1])} />
    </div>
  );
}
