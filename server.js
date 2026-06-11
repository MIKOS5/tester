import express from "express";
import icy from "icy";

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.json({ status: "Radiowave API running" });
});

app.get("/nowplaying", (req, res) => {
  const streamUrl = req.query.url;

  if (!streamUrl) {
    return res.json({ error: "missing url" });
  }

  try {
    icy.get(streamUrl, (stream) => {
      let timeout = setTimeout(() => {
        res.json({
          station: "Radiowave",
          nowPlaying: "No metadata (timeout)",
          stream: streamUrl
        });
      }, 5000);

      stream.on("metadata", (metadata) => {
        clearTimeout(timeout);

        const parsed = icy.parse(metadata);

        res.json({
          station: "Radiowave",
          nowPlaying: parsed.StreamTitle || "Unknown",
          stream: streamUrl
        });

        stream.destroy();
      });
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
