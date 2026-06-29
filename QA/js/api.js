const BASE_URL = "https://script.google.com/macros/s/AKfycbzcjIipaNkV_TbzV7XswF8J-JvO6PJX6cDkV3rk-I1INVMF71ZYk41OyQXJtoXgUGHziw/exec";

async function api(action, payload = {}) {

  const url = `${BASE_URL}?action=${encodeURIComponent(action)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();

  // HARD GUARD (prevents your crash)
  if (!text || text.trim().startsWith("<")) {
    console.error("RAW RESPONSE:", text);
    throw new Error("Apps Script returned HTML (deployment or permission error)");
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("BAD JSON:", text);
    throw new Error("Invalid JSON from backend");
  }
}
