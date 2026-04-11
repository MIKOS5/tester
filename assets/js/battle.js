// Placeholder videos (replace later with database)
const videos = [
  "https://www.youtube.com/watch?v=3fumBcKC6RE",
  "https://www.youtube.com/watch?v=L_jWHffIx5E"
];

// Extract YouTube ID
function getVideoId(url) {
  const regExp = /v=([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

// Embed video
function embedVideo(url) {
  const id = getVideoId(url);
  return `<iframe width="300" height="200"
    src="https://www.youtube.com/embed/${id}"
    frameborder="0" allowfullscreen>
  </iframe>`;
}

// Load videos
document.getElementById("videoA").innerHTML = embedVideo(videos[0]);
document.getElementById("videoB").innerHTML = embedVideo(videos[1]);

// Vote function
function vote(side) {
  alert("You voted for Player " + side);

  // Later:
  // - Save vote to database
  // - Load new battle
}
