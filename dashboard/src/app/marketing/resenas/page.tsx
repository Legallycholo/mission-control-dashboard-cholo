import { ComingSoon } from '@/components/ui/ComingSoon';
import { Star } from 'lucide-react';

export default function MarketingResenasPage() {
  return (
    <ComingSoon
      title="Monitor de Reseñas"
      subtitle="Reputación y Social Proof — Marketing"
      description="Panel centralizado de reseñas de productos para filtrado rápido, respuesta y gestión del Social Proof. Monitorea Google Reviews, la plataforma de reseñas de Shopify y menciones en redes."
      icon={Star}
      accentColor="bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-600/30"
      features={[
        {
          label: 'Monitor de Reseñas de Productos',
          description: 'Nuevas reseñas centralizadas con filtro por estrella, producto y plataforma.',
          area: 'Visualizacion',
        },
        {
          label: 'Calificación Promedio por Producto',
          description: 'KPI de rating promedio con evolución temporal para detectar productos problemáticos.',
          area: 'KPI',
        },
        {
          label: 'Monitoreo de Google Reviews',
          description: 'Calificación promedio del negocio en Google para cuidar la imagen en el ecosistema.',
          area: 'KPI',
        },
        {
          label: 'Cola de Respuesta',
          description: 'Interfaz para responder reseñas directamente sin salir del dashboard.',
          area: 'UX/UI',
        },
        {
          label: 'Análisis de Sentimiento NLP',
          description: 'Clasificación automática (Positivo/Neutral/Negativo) del texto de cada reseña.',
          area: 'IA',
        },
        {
          label: 'Alertas de Reseñas Negativas',
          description: 'Notificación inmediata cuando un producto recibe una reseña de 1-2 estrellas.',
          area: 'Backend',
        },
      ]}
      apiNote="Requiere API key de plataforma de reseñas (Yotpo, Judge.me u Okendo) y Google Business Profile API para el monitor de Google Reviews."
    />
  );
}
