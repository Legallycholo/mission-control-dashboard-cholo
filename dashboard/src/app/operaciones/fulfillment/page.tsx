import { ComingSoon } from '@/components/ui/ComingSoon';
import { Zap } from 'lucide-react';

export default function OperacionesFulfillmentPage() {
  return (
    <ComingSoon
      title="Fulfillment"
      subtitle="Eficiencia operacional de despacho — Operaciones"
      description="Métricas de velocidad y calidad de fulfillment: tiempo de procesamiento en bodega, tasa de pedido perfecto y mapa de incidencias logísticas por región."
      icon={Zap}
      accentColor="bg-gradient-to-br from-orange-500 to-red-600 border-orange-600/30"
      features={[
        {
          label: 'Eficiencia Logística (Tiempo de Despacho)',
          description: 'Tiempo promedio desde creación de orden hasta despacho por el equipo de bodega.',
          area: 'KPI',
        },
        {
          label: 'Tasa de Pedido Perfecto',
          description: '% de órdenes despachadas a tiempo, con producto correcto y sin daños.',
          area: 'KPI',
        },
        {
          label: 'Mapa de Calor de Incidencias Logísticas',
          description: 'Google Maps API para regiones con mayor concentración de retrasos y robos de courier.',
          area: 'Visualizacion',
        },
        {
          label: 'Rendimiento por Courier',
          description: 'Comparación de tasa de entrega exitosa y tiempo promedio por empresa de despacho.',
          area: 'Visualizacion',
        },
        {
          label: 'Panel de Alertas Operacionales',
          description: 'Pedidos con más de X horas sin movimiento en el proceso de fulfillment.',
          area: 'Backend',
        },
      ]}
      apiNote="Requiere Google Maps API key para el mapa geoespacial de incidencias. El resto puede construirse con datos de Shopify existentes."
    />
  );
}
