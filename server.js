import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({ status: "Radiowave API running" });
});

app.get("/nowplaying", async (req, res) => {
  const streamUrl = req.query.url;

  if (!streamUrl) {
    return res.json({ error: "missing url" });
  }

  try {
    // Simple fallback approach (safe + no crashing)
    const response = await fetch(streamUrl, {
      headers: {
        "Icy-MetaData": "1"
      }
    });

    const contentType = response.headers.get("content-type") || "";

    res.json({
      station: "Radiowave",
      nowPlaying: "Metadata not parsed yet (safe mode)",
      stream: streamUrl,
      contentType
    });

  } catch (err) {
    res.json({
      error: "stream error",
      details: err.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Radiowave API running on", PORT);
});
