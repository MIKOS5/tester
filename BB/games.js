async function loadGames(){
  const res = await fetch(API_BASE + "/schedule?sportId=1&date=2026-07-01");
  const data = await res.json();
  render("<h2>Games</h2>" + JSON.stringify(data, null, 2));
}
