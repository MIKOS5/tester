async function loadStats(){
  const res = await fetch(API_BASE + "/stats?stats=season&group=hitting&season=2026");
  const data = await res.json();
  render("<h2>Stats</h2>" + JSON.stringify(data, null, 2));
}
