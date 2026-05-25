const { BigQuery } = require('@google-cloud/bigquery');
const bq = new BigQuery({ projectId: process.env.GCP_PROJECT_ID || 'YOUR_GCP_PROJECT_ID' });

async function run() {
  try {
    const [rows] = await bq.query(`
      SELECT action, count(*) as count
      FROM \`YOUR_GCP_PROJECT_ID.raw_layer.shopify_audit_log\`
      GROUP BY action
      ORDER BY count DESC
    `);
    console.log("Acciones registradas:");
    console.log(rows);
  } catch (e) {
    console.error(e);
  }
}
run();
