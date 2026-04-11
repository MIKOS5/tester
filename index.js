import { db, collection, getDocs, doc, updateDoc } from "./firebase.js";

let battles = [];

function getVideoId(url) {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

function embed(url) {
  const id = getVideoId(url);
  return `<iframe width="300" height="200"
    src="https://www.youtube.com/embed/${id}">
  </iframe>`;
}

// ⏱ Timer system
function getTimeLeft(endTime) {
  const diff = endTime - Date.now();
  if (diff <= 0) return "ENDED";

  return Math.floor(diff / 1000) + "s";
}

// 🔥 Load battles
async function loadBattles() {
  const snapshot = await getDocs(collection(db, "battles"));

  battles = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => b.status === "active");

  render();
}

// 🧱 Render UI
function render() {
  const container = document.getElementById("battles");
  container.innerHTML = "";

  battles.forEach(battle => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>⚔️ Battle</h3>

      <div style="display:flex;gap:20px;">
        <div>
          ${embed(battle.playerA)}
          <button onclick="vote('${battle.id}', 'A')">Vote A</button>
          <p>Votes: ${battle.votesA}</p>
        </div>

        <div>
          ${embed(battle.playerB)}
          <button onclick="vote('${battle.id}', 'B')">Vote B</button>
          <p>Votes: ${battle.votesB}</p>
        </div>
      </div>

      <h4 class="timer" id="timer-${battle.id}">
        ⏱ Loading...
      </h4>
      <hr>
    `;

    container.appendChild(div);
  });
}

// 🗳 Voting system
window.vote = async function(battleId, side) {
  const battle = battles.find(b => b.id === battleId);

  if (!battle) return;

  const ref = doc(db, "battles", battleId);

  if (side === "A") battle.votesA++;
  if (side === "B") battle.votesB++;

  await updateDoc(ref, {
    votesA: battle.votesA,
    votesB: battle.votesB
  });

  loadBattles();
};

// ⏱ Live timers
function startTimers() {
  setInterval(() => {
    battles.forEach(battle => {
      const el = document.getElementById(`timer-${battle.id}`);
      if (!el) return;

      const timeLeft = getTimeLeft(battle.endTime);

      el.innerText = timeLeft;

      // Auto-finish battle
      if (timeLeft === "ENDED") {
        updateDoc(doc(db, "battles", battle.id), {
          status: "finished"
        });
      }
    });
  }, 1000);
}

// 🚀 Init
loadBattles().then(startTimers);
