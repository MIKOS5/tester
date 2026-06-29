const API_BASE = "https://script.google.com/macros/s/AKfycbzcjIipaNkV_TbzV7XswF8J-JvO6PJX6cDkV3rk-I1INVMF71ZYk41OyQXJtoXgUGHziw/exec";

async function api(action, payload = {}) {
  try {
    const res = await fetch(`${API_BASE}?action=${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("HTTP " + res.status);

    return await res.json();

  } catch (err) {
    console.error("API ERROR:", err);
    throw err;
  }
}
