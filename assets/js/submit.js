import { db, collection, addDoc, getDocs, updateDoc, doc } from "./firebase.js";

window.submitLink = async function () {
  const link = document.getElementById("link").value;
  const status = document.getElementById("status");

  if (!link.includes("youtube.com/watch")) {
    status.innerText = "❌ Invalid link";
    return;
  }

  // 1. Save entry
  const newEntry = await addDoc(collection(db, "entries"), {
    videoUrl: link,
    status: "pending"
  });

  status.innerText = "Submitted ✔ Auto-matching...";

  // 2. Try to match immediately
  await tryAutoMatch(newEntry.id);
};
