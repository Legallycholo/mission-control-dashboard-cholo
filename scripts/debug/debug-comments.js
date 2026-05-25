const { BigQuery } = require('@google-cloud/bigquery');
const bq = new BigQuery({ projectId: process.env.GCP_PROJECT_ID || 'YOUR_GCP_PROJECT_ID' });

async function run() {
  try {
    const [rows] = await bq.query(`
      SELECT 
        IFNULL(s.first_name, a.staff_id) as empleado,
        COUNT(*) as cantidad_comentarios
      FROM \`YOUR_GCP_PROJECT_ID.raw_layer.shopify_audit_log\` a
      LEFT JOIN \`YOUR_GCP_PROJECT_ID.raw_layer.shopify_staff\` s 
        ON CAST(a.staff_id AS STRING) = CAST(s.staff_id AS STRING)
      WHERE a.action = 'comment'
      GROUP BY empleado
      ORDER BY cantidad_comentarios DESC
    `);
    console.log("=== COMENTARIOS POR EMPLEADO ===");
    console.table(rows);
  } catch (e) {
    console.error(e);
  }
}
run();
