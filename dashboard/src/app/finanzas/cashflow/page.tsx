import { ComingSoon } from '@/components/ui/ComingSoon';
import { TrendingUp } from 'lucide-react';

export default function FinanzasCashflowPage() {
  return (
    <ComingSoon
      title="Flujo de Caja"
      subtitle="Proyección de liquidez — Finanzas"
      description="Panel interactivo que contrasta los ingresos líquidos (considerando días de retención de pasarelas) vs las cuentas por pagar a proveedores, aduanas y plataformas de Ads."
      icon={TrendingUp}
      accentColor="bg-gradient-to-br from-cyan-600 to-blue-700 border-cyan-700/30"
      features={[
        {
          label: 'Calendario de Liquidez',
          description: 'Vista mes a mes de cuándo entra el dinero real vs cuándo salen los pagos.',
          area: 'Visualizacion',
        },
        {
          label: 'Días de Retención de Pasarelas',
          description: 'Webpay y MercadoPago retienen fondos; el cashflow muestra el dinero real disponible.',
          area: 'KPI',
        },
        {
          label: 'Cuentas por Pagar (Proveedores)',
          description: 'Facturas pendientes de pago a distribuidores y fabricantes con fechas de vencimiento.',
          area: 'Backend',
        },
        {
          label: 'Proyección a 30/60/90 días',
          description: 'Estimación de posición de caja basada en ventas históricas y compromisos fijos.',
          area: 'Visualizacion',
        },
        {
          label: 'Simulador de Escenarios',
          description: 'Deslizadores para modelar impacto de CyberDay o demora de importaciones en la caja.',
          area: 'UX/UI',
        },
      ]}
    />
  );
}
