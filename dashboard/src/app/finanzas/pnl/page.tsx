import { ComingSoon } from '@/components/ui/ComingSoon';
import { Wallet } from 'lucide-react';

export default function FinanzasPnlPage() {
  return (
    <ComingSoon
      title="P&L y Rentabilidad"
      subtitle="Estado de resultados dinámico — Finanzas"
      description="Módulo de Profit & Loss que deduce de las ventas netas de Shopify el COGS, comisiones bancarias, inversión en Ads y gastos fijos para obtener el margen neto real de cada periodo."
      icon={Wallet}
      accentColor="bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-700/30"
      features={[
        {
          label: 'Cálculo Automático de Rentabilidad Neta',
          description: 'Ingresos netos − COGS − comisiones − envíos − Ads − fijos = margen neto real.',
          area: 'Backend',
        },
        {
          label: 'Gráfico de Cascada (Waterfall P&L)',
          description: 'Visualización interactiva de cómo los ingresos brutos se reducen por cada centro de costo.',
          area: 'Visualizacion',
        },
        {
          label: 'Punto de Equilibrio (Break-even)',
          description: 'Meta de ventas diaria/mensual necesaria para cubrir la totalidad de costos fijos.',
          area: 'KPI',
        },
        {
          label: 'POAS (Profit On Ad Spend)',
          description: 'Google Ads × COGS = rentabilidad real de campañas, no solo ROAS sobre ingresos brutos.',
          area: 'KPI',
        },
        {
          label: 'Prorrateo de Gastos Fijos (OPEX)',
          description: 'Distribución de nómina, arriendo y licencias sobre el volumen de ventas por unidad.',
          area: 'Backend',
        },
        {
          label: 'Conciliación de Pasarelas de Pago',
          description: 'Comisiones de Webpay, MercadoPago, VentiPay deducidas automáticamente del P&L.',
          area: 'Backend',
        },
        {
          label: 'Impacto Financiero de Garantías (RMA)',
          description: 'Pérdidas por garantías y logística inversa descontadas del P&L en tiempo real.',
          area: 'KPI',
        },
        {
          label: 'Impacto de Variación Cambiaria (USD/CLP)',
          description: 'Efecto del dólar sobre el COGS del stock importado y el margen neto proyectado.',
          area: 'Backend',
        },
        {
          label: 'Provisión por Obsolescencia de Inventario',
          description: 'Alerta de depreciación de productos inmovilizados >90 días en bodega.',
          area: 'KPI',
        },
        {
          label: 'Simulador de Escenarios (What-If)',
          description: 'Deslizadores para proyectar el impacto de CyberDay, subida de CPC o costos fijos.',
          area: 'UX/UI',
        },
      ]}
      apiNote="Requiere ingresar manualmente COGS por categoría y gastos fijos mensuales. La integración con pasarelas de pago (Webpay, MercadoPago) necesita sus respectivos API keys para el cálculo automático de comisiones."
    />
  );
}
