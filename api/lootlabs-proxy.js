const LOOTLABS_API_TOKEN = "93f905beb1e1f6bffee13f868bdbb51ea281f20a16b0d9bab873f35369a114bf";
const CONTENT_LOCKER_URL = "https://creators.lootlabs.gg/api/public/content_locker";
const URL_ENCRYPTOR_URL = "https://creators.lootlabs.gg/api/public/url_encryptor";

const extractMessage = (data) => {
  if (!data || typeof data !== "object") return null;
  const msg = data.message;
  if (Array.isArray(msg)) return msg[0] || null;
  if (msg && typeof msg === "object") return msg;
  return null;
};

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Client-Info, Apikey");
    return res.status(200).end();
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const { action } = req.query;

    if (action === "create_link") {
      const { title, destinationUrl, tierId, numberOfTasks, theme, thumbnail } = req.body;

      if (!title || !destinationUrl || !tierId || !numberOfTasks) {
        return res.status(400).json({ error: "Missing required fields: title, destinationUrl, tierId, numberOfTasks" });
      }

      const apiResponse = await fetch(CONTENT_LOCKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOOTLABS_API_TOKEN}`,
        },
        body: JSON.stringify({
          title: title.substring(0, 30),
          url: destinationUrl,
          tier_id: tierId,
          number_of_tasks: numberOfTasks,
          theme: theme ?? 3,
          thumbnail: thumbnail ?? undefined,
        }),
      });

      const apiData = await apiResponse.json();

      if (apiData.type === "error") {
        const msg = extractMessage(apiData);
        return res.status(502).json({ error: msg || apiData.message || "LootLabs API error" });
      }

      const msg = extractMessage(apiData);
      return res.status(200).json({
        lootUrl: msg?.loot_url || null,
        short: msg?.short || null,
      });
    }

    if (action === "encrypt_url") {
      const { destinationUrl } = req.body;

      if (!destinationUrl) {
        return res.status(400).json({ error: "Missing required field: destinationUrl" });
      }

      const apiResponse = await fetch(URL_ENCRYPTOR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOOTLABS_API_TOKEN}`,
        },
        body: JSON.stringify({ destination_url: destinationUrl }),
      });

      const apiData = await apiResponse.json();

      if (apiData.type === "error") {
        const msg = extractMessage(apiData);
        return res.status(502).json({ error: msg || apiData.message || "LootLabs encryption error" });
      }

      const msg = extractMessage(apiData);
      const encrypted = msg?.encrypted_data || msg?.destination_url || apiData.message || null;
      return res.status(200).json({ encryptedData: encrypted });
    }

    return res.status(400).json({ error: "Unknown action. Use ?action=create_link or ?action=encrypt_url" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal server error" });
  }
}
