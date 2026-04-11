import { db, collection, addDoc } from "./firebase.js";

window.submitLink = async function () {
  const link = document.getElementById("link").value;
  const status = document.getElementById("status");

  if (!link.includes("youtube.com/watch")) {
    status.innerText = "❌ Invalid YouTube link";
    return;
  }

  try {
    await addDoc(collection(db, "entries"), {
      videoUrl: link,
      wins: 0,
      losses: 0,
      createdAt: Date.now()
    });

    status.innerText = "✅ Submitted to database!";
  } catch (err) {
    console.error(err);
    status.innerText = "❌ Error saving";
  }
};
