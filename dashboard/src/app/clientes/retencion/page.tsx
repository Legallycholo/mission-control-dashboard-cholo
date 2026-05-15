import { ComingSoon } from '@/components/ui/ComingSoon';
import { HeartHandshake } from 'lucide-react';

export default function ClientesRetencionPage() {
  return (
    <ComingSoon
      title="Retención y LTV"
      subtitle="Valor de vida del cliente — Clientes"
      description="Análisis de cohortes y retención que cruza la inversión publicitaria de Google Ads con el valor histórico de compra del cliente para garantizar que el CAC sea sostenible frente al LTV."
      icon={HeartHandshake}
      accentColor="bg-gradient-to-br from-pink-600 to-rose-700 border-pink-700/30"
      features={[
        {
          label: 'Rentabilidad de Adquisición (CAC vs LTV)',
          description: 'Inversión Google Ads / nuevo cliente vs valor histórico de compra acumulado.',
          area: 'KPI',
        },
        {
          label: 'Análisis de Cohortes',
          description: 'Agrupación de clientes por mes de primera compra para medir retención en el tiempo.',
          area: 'Visualizacion',
        },
        {
          label: 'Predicción de Fuga (Churn) — BigQuery ML',
          description: 'GA4 + BigQuery ML para alertar clientes que superaron el ciclo de vida esperado de su equipo sin recomprar.',
          area: 'IA',
        },
        {
          label: 'Tasa de Devoluciones por Cliente',
          description: 'Usuarios con alta frecuencia de reclamos para detectar fraude y ajustar políticas.',
          area: 'KPI',
        },
        {
          label: 'Segmentación por Valor (VIP / Recurrente / One-time)',
          description: 'Clasificación automática para personalizar campañas y flujos de email en Klaviyo.',
          area: 'Backend',
        },
      ]}
      apiNote="Churn prediction requiere habilitar BigQuery ML en el proyecto GCP (gratuito hasta cierto volumen). El resto puede construirse con datos de Shopify + Klaviyo ya integrados."
    />
  );
}
