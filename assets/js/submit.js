import { db, collection, addDoc, getDocs, updateDoc, doc } from "./firebase.js";

// Main submit function (called from HTML button)
window.submitLink = async function () {
  const link = document.getElementById("link").value;
  const status = document.getElementById("status");

  // Basic validation
  if (!link || !link.includes("youtube.com/watch")) {
    status.innerText = "❌ Invalid YouTube link";
    return;
  }

  try {
    status.innerText = "Submitting...";

    // 1. Create new entry
    const newEntryRef = await addDoc(collection(db, "entries"), {
      videoUrl: link,
      status: "pending",
      createdAt: Date.now()
    });

    const newEntryId = newEntryRef.id;

    status.innerText = "Submitted ✔ Auto-matching...";

    // 2. Try auto-match
    await tryAutoMatch(newEntryId);

    status.innerText = "🔥 Submitted & matched (if opponent found)";

  } catch (err) {
    console.error(err);
    status.innerText = "❌ Error submitting";
  }
};

// AUTO MATCH SYSTEM
async function tryAutoMatch(newEntryId) {

  const snapshot = await getDocs(collection(db, "entries"));

  const pending = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(e => e.status === "pending");

  // Need at least 2 players
  if (pending.length < 2) {
    console.log("Waiting for opponent...");
    return;
  }

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
    endTime: now + (3 * 60 * 1000), // 3 minutes
    status: "active"
  });

  // 4. Mark both entries as in battle
  await updateDoc(doc(db, "entries", newEntryId), {
    status: "in_battle"
  });

  await updateDoc(doc(db, "entries", opponent.id), {
    status: "in_battle"
  });

  console.log("🔥 Auto-battle created!");
}
