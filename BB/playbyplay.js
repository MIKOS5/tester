async function loadPlayByPlay(){
  const gamePk = prompt("Enter gamePk");
  if(!gamePk) return;
  const res = await fetch(API_BASE + `/game/${gamePk}/playByPlay`);
  const data = await res.json();
  render("<h2>Play By Play</h2><pre>" + JSON.stringify(data, null, 2) + "</pre>");
}
