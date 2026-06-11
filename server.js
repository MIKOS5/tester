import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// simple test route
app.get("/", (req, res) => {
  res.json({ status: "Radiowave API running" });
});

// Now Playing endpoint (basic version for now)
app.get("/nowplaying", async (req, res) => {
  const stream = req.query.url;

  if (!stream) {
    return res.json({ error: "missing url" });
  }

  try {
    // simple fallback (we'll improve later)
    res.json({
      station: "Radiowave",
      nowPlaying: "Live stream active (metadata upgrade next step)",
      stream: stream
    });

  } catch (err) {
    res.json({
      error: "server error",
      details: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Radiowave API running on port", PORT);
});