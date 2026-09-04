// Tech Lixo Zero — dados dos pontos de coleta
// Para cadastrar seus pontos, substitua/adicone objetos no array abaixo.
// latitude e longitude podem ser obtidas no Google Maps/OpenStreetMap.

const collectionPoints = [
  // EXEMPLO:
  // {
  //   name: "Nome do ponto",
  //   city: "Serra Talhada",
  //   address: "Rua Exemplo, 100",
  //   accepted: "Celulares, computadores, cabos e periféricos",
  //   lat: -7.9915,
  //   lng: -38.2980
  // }
];

let map;
let markersLayer;
let markers = [];

const mapElement = document.getElementById("map");
const pointsList = document.getElementById("pointsList");
const pointsCount = document.getElementById("pointsCount");
const searchInput = document.getElementById("pointSearch");

function initMap() {
  map = L.map("map", { scrollWheelZoom: false }).setView([-7.9915, -38.2980], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  renderPoints(collectionPoints);
}

function renderPoints(points) {
  markersLayer.clearLayers();
  markers = [];
  pointsList.innerHTML = "";
  pointsCount.textContent = points.length;

  if (!points.length) {
    pointsList.innerHTML = `
      <div class="empty">
        <strong>Nenhum ponto cadastrado ainda.</strong><br><br>
        Cadastre os pontos no array <code>collectionPoints</code> do arquivo <code>script.js</code>.
      </div>`;
    return;
  }

  const bounds = [];

  points.forEach((point, index) => {
    const marker = L.marker([point.lat, point.lng]).addTo(markersLayer);

    marker.bindPopup(`
      <div class="popup-title">${escapeHtml(point.name)}</div>
      <div class="popup-text">${escapeHtml(point.address || point.city)}</div>
      ${point.accepted ? `<div class="popup-text"><b>Aceita:</b> ${escapeHtml(point.accepted)}</div>` : ""}
    `);

    markers.push(marker);
    bounds.push([point.lat, point.lng]);

    const item = document.createElement("button");
    item.type = "button";
    item.className = "point-item";
    item.innerHTML = `
      <h3>${escapeHtml(point.name)}</h3>
      <p>${escapeHtml(point.address || point.city)}</p>
      <span class="point-tag">${escapeHtml(point.city)}</span>
    `;

    item.addEventListener("click", () => {
      map.setView([point.lat, point.lng], 16, { animate: true });
      marker.openPopup();
      document.querySelectorAll(".point-item").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
    });

    pointsList.appendChild(item);
  });

  if (bounds.length === 1) map.setView(bounds[0], 15);
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [35, 35] });
}

function filterPoints() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = collectionPoints.filter(point =>
    [point.name, point.city, point.address, point.accepted]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(term)
  );

  renderPoints(filtered);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

searchInput.addEventListener("input", filterPoints);

document.getElementById("locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Seu navegador não oferece geolocalização.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 14);
      L.circleMarker([latitude, longitude], {
        radius: 8,
        color: "#1f8f55",
        fillColor: "#1f8f55",
        fillOpacity: .85
      }).addTo(map).bindPopup("Você está aqui.").openPopup();
    },
    () => alert("Não foi possível obter sua localização. Verifique a permissão do navegador.")
  );
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => mainNav.classList.remove("open"));
});

const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav a");

window.addEventListener("scroll", () => {
  let current = "inicio";

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });

  document.getElementById("topBtn").classList.toggle("show", window.scrollY > 500);
});

document.getElementById("topBtn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

initMap();
