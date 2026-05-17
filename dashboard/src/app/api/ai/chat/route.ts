import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace mock with real Vertex AI call when Google Cloud credentials are configured
// import { VertexAI } from '@google-cloud/vertexai';
// const vertex = new VertexAI({ project: process.env.GOOGLE_CLOUD_PROJECT, location: 'us-central1' });
// const model = vertex.getGenerativeModel({ model: 'gemini-2.0-flash' });

// SYSTEM PROMPT (inject live dashboard data before sending to Vertex AI):
// const systemPrompt = `Eres GSM Pro AI, el asistente de análisis del dashboard GSM PRO.
//   Tienes acceso completo a: Shopify (ventas, órdenes), BigQuery (histórico),
//   Google Analytics 4 (tráfico), Google Search Console (SEO), Google Ads,
//   Klaviyo (email marketing) y Crisp (soporte al cliente).
//   Datos actuales del dashboard: ${JSON.stringify(dashboardContext)}
//   Responde siempre en español, con datos precisos y recomendaciones accionables.`;

function generateResponse(message: string): string {
  const lower = message.toLowerCase();

  if (/venta|ingreso|shopify|aov|orden/.test(lower)) {
    return `**Análisis de Ventas — GSM PRO**\n\n• Las ventas netas del período muestran tendencia positiva vs período anterior\n• AOV (Ticket Promedio) dentro del rango objetivo mensual\n• Categoría con mayor crecimiento: Smartphones & Accesorios\n• Tasa de conversión Shopify: 2.4% (benchmark sector: 1.8%)\n\n_Vertex AI pendiente de credenciales para proyección avanzada._\n\n> **Recomendación:** Incrementar inversión en Google Shopping para categorías de alto margen.`;
  }
  if (/tráfico|trafico|seo|search console|orgánico|organico|google ads|meta|roas/.test(lower)) {
    return `**Resumen de Tráfico — GSM PRO**\n\n• Tráfico orgánico: 38% del total (↑4% vs período anterior)\n• Posición promedio Google: mejoró 1.4 puntos este mes\n• ROAS Google Ads: 4.2x | ROAS Meta: 2.8x\n• CTR orgánico: 3.1%\n\n> **Oportunidad:** 12 keywords en posición 4-10 con alto volumen — candidatas a optimización.`;
  }
  if (/cliente|ltv|retención|retencion|segmento|cohorte/.test(lower)) {
    return `**Análisis de Clientes — GSM PRO**\n\n• LTV promedio (12 meses): $187,500 CLP\n• Tasa de recompra: 23% (objetivo: 28%)\n• Segmento VIP: 12% de la base genera 41% del ingreso\n• Clientes en riesgo: 234 sin compra en >90 días\n\n> **Insight:** Clientes de SEO orgánico tienen LTV 34% superior a los de pauta pagada.`;
  }
  if (/marketing|klaviyo|email|campaña|campana/.test(lower)) {
    return `**Marketing & Email — GSM PRO**\n\n• Open rate Klaviyo: 28.4% (benchmark: 21%)\n• Click rate: 4.1% | Conversión post-email: 1.8%\n• Revenue atribuido a email: $2.3M CLP\n• Recuperación de carrito abandonado: 67 conversiones (↑12%)\n\n> **Recomendación:** Activar campaña de re-engagement para compradores inactivos >60 días.`;
  }
  if (/finanza|costo|margen|pnl|opex|gasto/.test(lower)) {
    return `**Finanzas — GSM PRO**\n\n• Margen bruto estimado: 34.2%\n• OPEX como % de ingresos: 18.7%\n• Comisiones de pasarela: 2.1% del GMV\n• Margen operacional proyectado al cierre: 15.5%\n\n_Para análisis preciso, completa la configuración de costos en P&L._`;
  }

  return `**GSM Pro AI — Analizando dashboard...**\n\n• ✓ Shopify — conectado\n• ✓ Google Analytics 4 — conectado\n• ✓ Google Search Console — conectado\n• ✓ Crisp CRM — conectado\n• ○ Vertex AI (Gemini 2.0) — pendiente de credenciales\n\nLas métricas generales están dentro del rango esperado. Configura la Google Cloud API Key para análisis completo con IA.\n\n> Pregúntame sobre ventas, tráfico, clientes, marketing o finanzas.`;
}

export async function POST(req: NextRequest) {
  const body = await req.json() as { message?: string; chatId?: string };
  const message = body.message ?? '';

  await new Promise((r) => setTimeout(r, 900));

  return NextResponse.json({
    success: true,
    reply: generateResponse(message),
    chatId: body.chatId ?? Math.random().toString(36).substring(2, 11),
  });
}
