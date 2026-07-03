async function loadSearch(){
  const q = prompt("Search team or player");
  if(!q) return;
  render("<h2>Search</h2><p>Use /people or /teams endpoints manually extend.</p>");
}
