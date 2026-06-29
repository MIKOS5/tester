const API_BASE="https://script.google.com/macros/s/AKfycbzcjIipaNkV_TbzV7XswF8J-JvO6PJX6cDkV3rk-I1INVMF71ZYk41OyQXJtoXgUGHziw/exec";

let inspectorsData = [];

async function loadInspectors() {
  const res = await api("getInspectors");
  inspectorsData = res || [];
  renderInspectors(inspectorsData);
}

function renderInspectors(data) {
  const body = document.getElementById("inspectorsBody");
  const empty = document.getElementById("emptyState");

  body.innerHTML = "";

  if (!data.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";

  data.forEach(i => {
    body.innerHTML += `
      <tr>
        <td><b>${i.name}</b></td>
        <td>${i.inspector_id}</td>
        <td>${i.brand || "-"}</td>

        <td>
          <span class="status ${i.status}">
            ${i.status}
          </span>
        </td>

        <td>${i.last_inspection || "Never"}</td>

        <td class="actions">
          <button onclick="viewInspector('${i.inspector_id}')">View</button>
          <button onclick="editInspector('${i.inspector_id}')">Edit</button>
          <button onclick="toggleInspector('${i.inspector_id}')">Toggle</button>
        </td>
      </tr>
    `;
  });
}

function filterInspectors() {
  const q = document.getElementById("searchInspector").value.toLowerCase();

  const filtered = inspectorsData.filter(i =>
    (i.name || "").toLowerCase().includes(q) ||
    (i.inspector_id || "").toLowerCase().includes(q) ||
    (i.brand || "").toLowerCase().includes(q)
  );

  renderInspectors(filtered);
}
