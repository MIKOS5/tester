import {
  db,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc
} from "./firebase.js";

window.submitLink = async function () {
  const link = document.getElementById("link").value;
  const status = document.getElementById("status");

  if (!link || !link.includes("youtube.com/watch")) {
    status.innerText = "❌ Invalid link";
    return;
  }

  try {
    status.innerText = "Submitting...";

    const newEntry = await addDoc(collection(db, "entries"), {
      videoUrl: link,
      status: "pending",
      createdAt: Date.now()
    });

    status.innerText = "Submitted ✔ Matching...";

    await tryAutoMatch(newEntry.id);

    status.innerText = "🔥 Done (matched if opponent found)";

  } catch (e) {
    console.error(e);
    status.innerText = "❌ Error";
  }
};

async function tryAutoMatch(newId) {
  const snapshot = await getDocs(collection(db, "entries"));

  const pending = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(e => e.status === "pending");

  if (pending.length < 2) return;

  const opponent = pending.find(p => p.id !== newId);
  if (!opponent) return;

  const now = Date.now();

  await addDoc(collection(db, "battles"), {
    playerA: newId,
    playerB: opponent.id,
    votesA: 0,
    votesB: 0,
    startTime: now,
    endTime: now + 180000,
    status: "active"
  });

  await updateDoc(doc(db, "entries", newId), {
    status: "in_battle"
  });

  await updateDoc(doc(db, "entries", opponent.id), {
    status: "in_battle"
  });

  console.log("🔥 Auto battle created");
}
