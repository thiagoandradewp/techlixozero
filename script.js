// Tech Lixo Zero — dados dos pontos de coleta
// Para cadastrar novos pontos, adicione objetos ao array abaixo.
// O filtro de cidades é montado automaticamente a partir deste array.

const collectionPoints = [
  {
    name: "VISA Magazine",
    city: "Serra Talhada",
    state: "PE",
    address: "Rua Enock Ignácio de Oliveira, Nossa Sra. da Penha, Serra Talhada - PE",
    accepted: ["Pilhas", "Baterias pequenas"],
    // Coordenadas aproximadas da região do endereço.
    lat: -7.9909,
    lng: -38.2984
  },
  {
    name: "Magazine Luiza",
    city: "Serra Talhada",
    state: "PE",
    address: "Rua Enock Ignácio de Oliveira, Nossa Sra. da Penha, Serra Talhada - PE",
    accepted: ["Pilhas", "Baterias pequenas"],
    // Coordenadas aproximadas da região do endereço.
    lat: -7.9913,
    lng: -38.2984
  },
  {
    name: "Ponto Prefeitura ST",
    city: "Serra Talhada",
    state: "PE",
    address: "R. Vila Ferroviária, São Cristovao, Serra Talhada - PE, 56903-170",
    accepted: [
      "Computadores",
      "Notebooks",
      "Impressoras",
      "Smartphones e celulares",
      "Pilhas",
      "Baterias pequenas",
      "Televisores (TVs)",
      "Micro-ondas",
      "Geláguas",
      "Outros eletrodomésticos e eletroportáteis em geral"
    ],
    lat: -7.9832551,
    lng: -38.2963957
  },
  {
    name: "UAST – UFRPE",
    city: "Serra Talhada",
    state: "PE",
    address: "Av. Gregório Ferraz Nogueira, s/n, Serra Talhada, PE, 56909-535",
    accepted: ["Pilhas", "Baterias pequenas"],
    lat: -7.9558858,
    lng: -38.2959700
  }
];

let map;
let markersLayer;
let markers = [];

const mapElement = document.getElementById("map");
const pointsList = document.getElementById("pointsList");
const pointsCount = document.getElementById("pointsCount");
const searchInput = document.getElementById("pointSearch");
const cityFilter = document.getElementById("cityFilter");
const filterSummary = document.getElementById("filterSummary");

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getAcceptedItems(point) {
  if (Array.isArray(point.accepted)) return point.accepted;
  if (!point.accepted) return [];
  return String(point.accepted).split(",").map(item => item.trim()).filter(Boolean);
}

function getSearchText(point) {
  return normalize([
    point.name,
    point.city,
    point.state,
    point.address,
    ...getAcceptedItems(point)
  ].filter(Boolean).join(" "));
}

function initMap() {
  map = L.map("map", { scrollWheelZoom: false }).setView([-7.9915, -38.2980], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
  populateCityFilter();
  renderPoints(collectionPoints);
}

function populateCityFilter() {
  const currentCity = cityFilter.value;
  const cities = [...new Set(collectionPoints
    .map(point => point.city)
    .filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  cityFilter.innerHTML = '<option value="">Todas as cidades</option>';

  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    cityFilter.appendChild(option);
  });

  if (cities.includes(currentCity)) cityFilter.value = currentCity;
}

function acceptedMarkup(point) {
  const items = getAcceptedItems(point);
  if (!items.length) return "<span class=\"no-accepted\">Consulte o ponto para confirmar os materiais.</span>";

  return items.map(item => `<li>${escapeHtml(item)}</li>`).join("");
}

function popupAcceptedMarkup(point) {
  const items = getAcceptedItems(point);
  if (!items.length) return "";

  return `
    <div class="popup-subtitle">Recebe:</div>
    <ul class="popup-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  `;
}

function renderPoints(points) {
  markersLayer.clearLayers();
  markers = [];
  pointsList.innerHTML = "";
  pointsCount.textContent = points.length;

  const selectedCity = cityFilter.value;
  const term = searchInput.value.trim();
  if (selectedCity || term) {
    const filters = [selectedCity, term ? `busca: “${term}”` : ""].filter(Boolean).join(" • ");
    filterSummary.textContent = `${filters} — ${points.length} ponto(s) encontrado(s).`;
  } else {
    filterSummary.textContent = "O filtro de cidades é atualizado automaticamente quando novos pontos são cadastrados.";
  }

  if (!points.length) {
    pointsList.innerHTML = `
      <div class="empty">
        <strong>Nenhum ponto encontrado.</strong><br><br>
        Tente outra cidade, nome de ponto ou material aceito.
      </div>`;
    return;
  }

  const bounds = [];

  points.forEach((point, index) => {
    const marker = L.marker([point.lat, point.lng], { title: point.name }).addTo(markersLayer);

    marker.bindPopup(`
      <div class="popup-title">${escapeHtml(point.name)}</div>
      <div class="popup-text">${escapeHtml(point.address || point.city)}</div>
      ${popupAcceptedMarkup(point)}
    `);

    markers.push(marker);
    bounds.push([point.lat, point.lng]);

    const item = document.createElement("button");
    item.type = "button";
    item.className = "point-item";
    item.setAttribute("aria-label", `Ver detalhes de ${point.name}`);
    item.innerHTML = `
      <div class="point-item-head">
        <h3>${escapeHtml(point.name)}</h3>
        <span class="point-tag">${escapeHtml(point.city)}</span>
      </div>
      <p>${escapeHtml(point.address || point.city)}</p>
      <div class="accepted-heading">Recebe:</div>
      <ul class="accepted-list">${acceptedMarkup(point)}</ul>
    `;

    item.addEventListener("click", () => {
      map.setView([point.lat, point.lng], 16, { animate: true });
      marker.openPopup();
      document.querySelectorAll(".point-item").forEach(el => el.classList.remove("selected"));
      item.classList.add("selected");
    });

    pointsList.appendChild(item);

    if (index === 0) item.classList.add("selected");
  });

  if (bounds.length === 1) map.setView(bounds[0], 15);
  if (bounds.length > 1) map.fitBounds(bounds, { padding: [35, 35] });
}

function filterPoints() {
  const term = normalize(searchInput.value.trim());
  const selectedCity = cityFilter.value;

  const filtered = collectionPoints.filter(point => {
    const matchesCity = !selectedCity || point.city === selectedCity;
    const matchesTerm = !term || getSearchText(point).includes(term);
    return matchesCity && matchesTerm;
  });

  renderPoints(filtered);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

searchInput.addEventListener("input", filterPoints);
cityFilter.addEventListener("change", filterPoints);

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
  menuToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  });
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

