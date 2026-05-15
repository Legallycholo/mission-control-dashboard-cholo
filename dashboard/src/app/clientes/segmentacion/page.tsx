import { ComingSoon } from '@/components/ui/ComingSoon';
import { PieChart } from 'lucide-react';

export default function ClientesSegmentacionPage() {
  return (
    <ComingSoon
      title="Segmentación de Clientes"
      subtitle="Audiencias inteligentes — Clientes"
      description="Segmentación automática de clientes por comportamiento de compra, ecosistema tecnológico preferido y nivel de riesgo para hiper-personalizar campañas y reducir el CAC."
      icon={PieChart}
      accentColor="bg-gradient-to-br from-indigo-600 to-violet-700 border-indigo-700/30"
      features={[
        {
          label: 'Afinidad por Ecosistema (Device Affinity)',
          description: 'Auto-etiquetado: "Apple Lover", "Android Fan", "Gamer" basado en historial de compras.',
          area: 'IA',
        },
        {
          label: 'Segmentos RFM (Recency, Frequency, Monetary)',
          description: 'Clasificación automática de Champions, Leales, En Riesgo, Perdidos.',
          area: 'Backend',
        },
        {
          label: 'Distribución Geográfica de Clientes',
          description: 'Mapa de calor de clientes por región/comuna para optimizar logística y Ads.',
          area: 'Visualizacion',
        },
        {
          label: 'Audiencias para Klaviyo y Google Ads',
          description: 'Exportación directa de segmentos a Klaviyo y Google Ads Customer Match.',
          area: 'Backend',
        },
        {
          label: 'Evolución de Segmentos en el Tiempo',
          description: 'Gráfico de Sankey mostrando cómo los clientes migran entre segmentos cada mes.',
          area: 'Visualizacion',
        },
      ]}
      apiNote="Device Affinity y el modelo RFM se construyen con BigQuery sobre datos de Shopify ya integrados. La exportación a Google Ads Customer Match requiere Google Ads API (ya configurada)."
    />
  );
}
