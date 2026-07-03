async function loadTeams(){
  const res = await fetch(API_BASE + "/teams?sportId=1");
  const data = await res.json();
  render("<h2>Teams</h2>" + data.teams.map(t =>
    `<div class='card'>${t.name}</div>`).join(""));
}
