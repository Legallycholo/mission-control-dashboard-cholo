import { ComingSoon } from '@/components/ui/ComingSoon';
import { Search } from 'lucide-react';

export default function MarketingAuditoriaPage() {
  return (
    <ComingSoon
      title="Auditoría de Colecciones"
      subtitle="Visibilidad de catálogo — Marketing"
      description="Detecta productos activos que no han sido asignados a colecciones en Shopify, afectando su visibilidad en el sitio y su elegibilidad para campañas de Shopping."
      icon={Search}
      accentColor="bg-gradient-to-br from-violet-600 to-purple-700 border-violet-700/30"
      features={[
        {
          label: 'Productos Sin Colección Asignada',
          description: 'Lista de SKUs activos sin colección que no aparecen en la navegación del sitio.',
          area: 'KPI',
        },
        {
          label: 'Productos Reacondicionados No Segmentados',
          description: 'Detecta ítems de segunda mano que deben estar en colecciones específicas.',
          area: 'KPI',
        },
        {
          label: 'Salud del Feed de Google Shopping',
          description: '% del catálogo activo correctamente enviado a Google Merchant Center.',
          area: 'Backend',
        },
        {
          label: 'Productos Sin Descripción o Imágenes',
          description: 'SKUs con datos incompletos que afectan su performance en SEO y en Google Shopping.',
          area: 'Visualizacion',
        },
        {
          label: 'Asignación Masiva de Colecciones',
          description: 'Interfaz para corregir múltiples productos a la vez desde el dashboard.',
          area: 'UX/UI',
        },
      ]}
      apiNote="Se construye 100% con la API de Shopify ya integrada. No requiere servicios externos adicionales."
    />
  );
}
