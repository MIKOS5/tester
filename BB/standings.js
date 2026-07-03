async function loadStandings(){
  const res = await fetch(API_BASE + "/standings?leagueId=103");
  const data = await res.json();
  render("<h2>Standings</h2>" + JSON.stringify(data, null, 2));
}
