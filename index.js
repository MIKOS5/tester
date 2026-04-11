import { db, collection, getDocs, updateDoc, doc } from "./firebase.js";

let battles = [];

function getVideoId(url) {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

function embed(url) {
  const id = getVideoId(url);
  return `<iframe width="280" height="180"
    src="https://www.youtube.com/embed/${id}"
    allowfullscreen></iframe>`;
}

function getTimeLeft(endTime) {
  const diff = endTime - Date.now();
  if (diff <= 0) return "ENDED";
  return Math.floor(diff / 1000) + "s";
}

async function loadBattles() {
  const snapshot = await getDocs(collection(db, "battles"));

  battles = snapshot.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(b => b.status === "active");

  render();
}

function render() {
  const container = document.getElementById("battles");
  container.innerHTML = "";

  battles.forEach(b => {
    const div = document.createElement("div");

    div.innerHTML = `
      <h3>⚔️ Battle</h3>

      <div style="display:flex;gap:20px;">
        <div>
          ${embed(b.playerA)}
          <button onclick="vote('${b.id}','A')">Vote A</button>
          <p>Votes: ${b.votesA}</p>
        </div>

        <div>
          ${embed(b.playerB)}
          <button onclick="vote('${b.id}','B')">Vote B</button>
          <p>Votes: ${b.votesB}</p>
        </div>
      </div>

      <h4 id="timer-${b.id}">⏱ Loading...</h4>
      <hr>
    `;

    container.appendChild(div);
  });
}

window.vote = async function (battleId, side) {
  const battle = battles.find(b => b.id === battleId);
  if (!battle) return;

  if (side === "A") battle.votesA++;
  if (side === "B") battle.votesB++;

  await updateDoc(doc(db, "battles", battleId), {
    votesA: battle.votesA,
    votesB: battle.votesB
  });

  loadBattles();
};

function startTimers() {
  setInterval(() => {
    battles.forEach(b => {
      const el = document.getElementById(`timer-${b.id}`);
      if (!el) return;

      const left = getTimeLeft(b.endTime);
      el.innerText = left;

      if (left === "ENDED") {
        updateDoc(doc(db, "battles", b.id), {
          status: "finished"
        });
      }
    });
  }, 1000);
}

loadBattles().then(startTimers);
