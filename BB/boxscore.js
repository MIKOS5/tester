async function loadBoxscore(){
  const gamePk = prompt("Enter gamePk");
  if(!gamePk) return;
  const res = await fetch(API_BASE + `/game/${gamePk}/boxscore`);
  const data = await res.json();
  render("<h2>Boxscore</h2><pre>" + JSON.stringify(data, null, 2) + "</pre>");
}
