let API_BASE = "https://statsapi.mlb.com/api/v1";

fetch("config.json")
  .then(r => r.json())
  .then(cfg => API_BASE = cfg.apiBase);

function render(html){
  document.getElementById("content").innerHTML = html;
}
