import { db, collection, getDocs, updateDoc, doc } from "./firebase.js";

let battles = {};
let finishedBattles = new Set();

function getVideoId(url) {
  if (!url) return null;
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

function embed(url) {
  const id = getVideoId(url);
  if (!id) return "<p>Invalid video</p>";

  return `<iframe width="280" height="180"
    src="https://www.youtube.com/embed/${id}"
    allowfullscreen></iframe>`;
}

function getTimeLeft(endTime) {
  const diff = endTime - Date.now();
  if (diff <= 0) return 0;
  return Math.floor(diff / 1000);
}

async function loadBattles() {
  const snapshot = await getDocs(collection(db, "battles"));

  battles = {};
  snapshot.docs.forEach(d => {
    const b = { id: d.id, ...d.data() };
    if (b.status === "active") {
      battles[b.id] = b;
    }
  });

  render();
}

function render() {
  const container = document.getElementById("battles");
  container.innerHTML = "";

  Object.values(battles).forEach(b => {
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
  const battle = battles[battleId];
  if (!battle) return;

  if (side === "A") battle.votesA++;
  if (side === "B") battle.votesB++;

  await updateDoc(doc(db, "battles", battleId), {
    votesA: battle.votesA,
    votesB: battle.votesB
  });

  // no full reload (faster UI)
  render();
};

function startTimers() {
  setInterval(async () => {
    Object.values(battles).forEach(async b => {
      const el = document.getElementById(`timer-${b.id}`);
      if (!el) return;

      const left = getTimeLeft(b.endTime);

      if (left <= 0) {
        el.innerText = "ENDED";

        // prevent multiple writes
        if (!finishedBattles.has(b.id)) {
          finishedBattles.add(b.id);

          await updateDoc(doc(db, "battles", b.id), {
            status: "finished"
          });
        }

        return;
      }

      el.innerText = left + "s";
    });
  }, 1000);
}

loadBattles().then(startTimers);
