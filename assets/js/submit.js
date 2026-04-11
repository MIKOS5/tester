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

async function tryAutoMatch(newEntryId) {

  const snapshot = await getDocs(collection(db, "entries"));

  const pending = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(e => e.status === "pending");

  // Need at least 2 players
  if (pending.length < 2) return;

  // Find opponent (not self)
  const opponent = pending.find(p => p.id !== newEntryId);

  if (!opponent) return;

  const now = Date.now();

  // 3. Create battle
  await addDoc(collection(db, "battles"), {
    playerA: newEntryId,
    playerB: opponent.id,
    votesA: 0,
    votesB: 0,
    startTime: now,
    endTime: now + 180000,
    status: "active"
  });

  // 4. Mark both as in battle
  await updateDoc(doc(db, "entries", newEntryId), {
    status: "in_battle"
  });

  await updateDoc(doc(db, "entries", opponent.id), {
    status: "in_battle"
  });

  console.log("🔥 Auto-battle created!");
}
