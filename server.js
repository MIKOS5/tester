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
    // SAFE fallback (no crashing)
    res.json({
      station: "Radiowave",
      nowPlaying: "Stream connected (ICY upgrade in next version)",
      stream: streamUrl
    });
  } catch (err) {
    res.json({
      error: "server error",
      details: err.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Radiowave API running on port", PORT);
});
