/**
 * Proxy Netlify Function — contourne CORS en relayant les formulaires diagnostic vers n8n.
 * Le front poste sur /.netlify/functions/submit-diagnostic (same-origin, pas de CORS).
 */
const N8N_WEBHOOK = "https://shortcut-formation.app.n8n.cloud/webhook/lead-diagnostic";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = typeof event.body === "string" ? event.body : JSON.stringify(event.body || {});
    const res = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const text = await res.text();
    return {
      statusCode: res.ok ? 200 : res.status,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: res.ok, status: res.status }),
    };
  } catch (err) {
    console.error("submit-diagnostic:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: String(err.message) }),
    };
  }
};
