import express from "express";

const app = express();
const PORT = process.env.PORT || 10000;

// simple in-memory cache
const cache = new Map();

/**
 * SMART resolver:
 * - tries ICY later (future upgrade hook)
 * - always returns something useful
 * - caches last known result per stream
 */
async function resolveNowPlaying(streamUrl) {
  try {
    // STEP 1: check cache first
    if (cache.has(streamUrl)) {
      return {
        nowPlaying: cache.get(streamUrl),
        source: "cache"
      };
    }

    // STEP 2: lightweight probe (no blocking stream parsing)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(streamUrl, {
      headers: {
        "Icy-MetaData": "1",
        "User-Agent": "Radiowave"
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    const contentType = res.headers.get("content-type") || "";
    const icyMetaInt = res.headers.get("icy-metaint");

    // STEP 3: no metadata support detected
    if (!icyMetaInt) {
      return {
        nowPlaying: "Live stream (no metadata available)",
        source: "fallback",
        contentType
      };
    }

    // STEP 4: we DO NOT fully stream (prevents Render hang)
    // Instead we return partial intelligence
    const result = "Live stream active (metadata detected but not parsed)";

    cache.set(streamUrl, result);

    return {
      nowPlaying: result,
      source: "probe",
      contentType
    };

  } catch (err) {
    return {
      nowPlaying: cache.get(streamUrl) || "Stream unavailable",
      source: "error-fallback",
      error: err.message
    };
  }
}

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.json({ status: "Radiowave API running (smart resolver)" });
});

app.get("/nowplaying", async (req, res) => {
  const streamUrl = req.query.url;

  if (!streamUrl) {
    return res.json({ error: "missing url" });
  }

  const result = await resolveNowPlaying(streamUrl);

  res.json({
    station: "Radiowave",
    stream: streamUrl,
    ...result
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Radiowave Smart Resolver running on", PORT);
});
