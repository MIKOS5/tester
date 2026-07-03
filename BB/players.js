async function loadPlayers(){
  const res = await fetch(API_BASE + "/sports/1/players?season=2026");
  const data = await res.json();
  render("<h2>Players</h2>" + JSON.stringify(data, null, 2));
}
