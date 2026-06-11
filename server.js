import express from "express";
import net from "net";
import http from "http";
import https from "https";

const app = express();
const PORT = process.env.PORT || 10000;

/**
 * Extract ICY metadata from a radio stream
 */
function getNowPlaying(streamUrl) {
  return new Promise((resolve) => {
    try {
      const client = streamUrl.startsWith("https") ? https : http;

      const req = client.get(streamUrl, {
        headers: {
          "Icy-MetaData": "1",
          "User-Agent": "Mozilla/5.0"
        }
      }, (res) => {
        const metaInt = parseInt(res.headers["icy-metaint"] || "0");

        if (!metaInt) {
          resolve("No ICY metadata");
          res.destroy();
          return;
        }

        let streamData = Buffer.alloc(0);
        let metaData = Buffer.alloc(0);
        let bytesRead = 0;

        res.on("data", (chunk) => {
          streamData = Buffer.concat([streamData, chunk]);
          bytesRead += chunk.length;

          // Once we reach metadata interval, extract it
          if (bytesRead >= metaInt) {
            const metaStart = metaInt;
            const metaLength = res.readUInt8(metaStart) * 16;

            if (metaLength > 0) {
              metaData = streamData.slice(metaStart + 1, metaStart + 1 + metaLength);
              const metaString = metaData.toString("utf8");

              const match = metaString.match(/StreamTitle='([^']*)'/);

              resolve(match ? match[1] : "Unknown");
            } else {
              resolve("No metadata found");
            }

            res.destroy();
          }
        });

        res.on("error", () => {
          resolve("Stream error");
        });
      });

      req.on("error", () => {
        resolve("Connection failed");
      });

    } catch (err) {
      resolve("Error parsing stream");
    }
  });
}

/**
 * Routes
 */
app.get("/", (req, res) => {
  res.json({ status: "Radiowave API running" });
});

app.get("/nowplaying", async (req, res) => {
  const streamUrl = req.query.url;

  if (!streamUrl) {
    return res.json({ error: "missing url" });
  }

  const nowPlaying = await getNowPlaying(streamUrl);

  res.json({
    station: "Radiowave",
    nowPlaying,
    stream: streamUrl
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Radiowave API running on port", PORT);
});
