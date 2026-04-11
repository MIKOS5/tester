import { db, collection, getDocs } from "./firebase.js";

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

function getRandomPair(arr) {
  return arr.sort(() => 0.5 - Math.random()).slice(0, 2);
}

async function loadBattle() {
  const snapshot = await getDocs(collection(db, "entries"));
  const entries = snapshot.docs.map(doc => doc.data());

  if (entries.length < 2) {
    document.body.innerHTML += "<p>Not enough entries yet</p>";
    return;
  }

  const [a, b] = getRandomPair(entries);

  document.getElementById("videoA").innerHTML = embed(a.videoUrl);
  document.getElementById("videoB").innerHTML = embed(b.videoUrl);
}

window.vote = function (side) {
  alert("Vote recorded: " + side);
  loadBattle();
};

loadBattle();
