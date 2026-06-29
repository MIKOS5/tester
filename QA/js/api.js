const API_BASE = "https://script.google.com/macros/s/AKfycbzcjIipaNkV_TbzV7XswF8J-JvO6PJX6cDkV3rk-I1INVMF71ZYk41OyQXJtoXgUGHziw/exec";

async function api(action, payload = {}) {
  try {
    const url = `${API_BASE}?action=${encodeURIComponent(action)}`;

    const res = await fetch(url, {
      method: "POST",

      // IMPORTANT: avoids Google Apps Script CORS preflight issues
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },

      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status}: ${text}`);
    }

    return await res.json();

  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
}
