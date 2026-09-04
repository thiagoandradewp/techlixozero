document.addEventListener("DOMContentLoaded", () => {

/* =========================
   MENU MOBILE
========================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
    });

    const navLinks = nav.querySelectorAll("a");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
        });
    });
}


/* =========================
   NAVEGAÇÃO ATIVA
========================= */

const sections = document.querySelectorAll("main section[id]");
const links = document.querySelectorAll(".nav a");

const updateActiveLink = () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    links.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }

    });
};

window.addEventListener("scroll", updateActiveLink);

updateActiveLink();


/* =========================
   MAPA LEAFLET
========================= */

const mapElement = document.getElementById("map");

if (mapElement && typeof L !== "undefined") {

    const serraTalhada = [-7.9918, -38.2981];

    const map = L.map("map", {
        scrollWheelZoom: false
    }).setView(serraTalhada, 14);


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
        }
    ).addTo(map);


    /* Ícone dos pontos de coleta */

    const greenIcon = L.divIcon({

        className: "custom-map-marker",

        html: `
            <div style="
                width: 38px;
                height: 38px;
                display: grid;
                place-items: center;
                background: #16a34a;
                color: white;
                border: 4px solid white;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                box-shadow: 0 5px 15px rgba(0,0,0,.25);
            ">
                <span style="
                    transform: rotate(45deg);
                    font-size: 17px;
                ">♻</span>
            </div>
        `,

        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38]

    });


    /*
     * PONTOS DEMONSTRATIVOS
     *
     * Substitua pelas coordenadas oficiais
     * dos pontos de coleta.
     */

    const collectionPoints = [

        {
            name: "Ponto de Coleta — Centro",
            address: "Centro, Serra Talhada - PE",
            coords: [-7.9918, -38.2981]
        },

        {
            name: "Ponto de Coleta — Nossa Senhora da Penha",
            address: "Nossa Senhora da Penha, Serra Talhada - PE",
            coords: [-7.9828, -38.2918]
        },

        {
            name: "Ponto de Coleta — São Cristóvão",
            address: "São Cristóvão, Serra Talhada - PE",
            coords: [-8.0010, -38.2875]
        },

        {
            name: "Ponto de Coleta — Bom Jesus",
            address: "Bom Jesus, Serra Talhada - PE",
            coords: [-7.9990, -38.3100]
        }

    ];


    collectionPoints.forEach(point => {

        const marker = L.marker(
            point.coords,
            {
                icon: greenIcon
            }
        ).addTo(map);


        marker.bindPopup(`
            <div style="
                min-width: 190px;
                font-family: Arial, sans-serif;
            ">

                <strong style="
                    display: block;
                    color: #087f3d;
                    margin-bottom: 6px;
                ">
                    ${point.name}
                </strong>

                <span style="
                    color: #64748b;
                    font-size: 13px;
                ">
                    ${point.address}
                </span>

                <div style="
                    margin-top: 10px;
                    padding: 8px;
                    background: #f0fdf4;
                    border-radius: 8px;
                    color: #166534;
                    font-size: 12px;
                ">
                    ♻️ Receba informações no ponto.
                </div>

            </div>
        `);

    });


    map.on("click", () => {
        map.scrollWheelZoom.enable();
    });

    map.on("mouseout", () => {
        map.scrollWheelZoom.disable();
    });

}


/* =========================
   ANIMAÇÕES AO ROLAR
========================= */

const revealElements = document.querySelectorAll(
    ".info-card, .about-content, .about-visual, .class-card, .teacher-mini"
);


const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach((entry, index) => {

            if (entry.isIntersecting) {

                setTimeout(() => {
                    entry.target.classList.add("reveal");
                }, index * 80);

                revealObserver.unobserve(entry.target);
            }

        });

    },

    {
        threshold: 0.12
    }

);


revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* =========================
   FECHAR MENU AO CLICAR FORA
========================= */

document.addEventListener("click", event => {

    if (!nav || !menuToggle) {
        return;
    }

    const clickedInsideNav = nav.contains(event.target);
    const clickedMenu = menuToggle.contains(event.target);

    if (!clickedInsideNav && !clickedMenu) {
        nav.classList.remove("open");
    }

});


});
