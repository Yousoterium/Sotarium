const POLAR_API_URL = "https://api.polar.sh/v1/checkout_sessions";
const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
const POLAR_SUCCESS_URL = process.env.POLAR_SUCCESS_URL;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!POLAR_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing POLAR_ACCESS_TOKEN environment variable" });
  }

  if (!POLAR_SUCCESS_URL) {
    return res.status(500).json({ error: "Missing POLAR_SUCCESS_URL environment variable" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const productId = body?.productId || body?.product_id;
  const successUrl = body?.successUrl || POLAR_SUCCESS_URL;

  if (!productId || typeof productId !== "string") {
    return res.status(400).json({ error: "Missing productId" });
  }

  try {
    const response = await fetch(POLAR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${POLAR_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        product_id: productId,
        success_url: successUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error || data?.message || "Polar checkout creation failed",
      });
    }

    if (!data?.url) {
      return res.status(502).json({ error: "Polar checkout did not return a URL" });
    }

    return res.status(200).json({ url: data.url });
  } catch (error) {
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
}
