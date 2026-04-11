function submitLink() {
  const link = document.getElementById("link").value;
  const status = document.getElementById("status");

  if (!link.includes("youtube.com/watch")) {
    status.innerText = "❌ Invalid YouTube link";
    return;
  }

  // Placeholder behavior
  console.log("Submitted:", link);

  status.innerText = "✅ Submitted! (not saved yet)";
}
