import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Mapa2() {
  useEffect(() => {
    const map = L.map("map", { zoomControl: true }).setView([6.23, -75.57], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // ===== Pines SVG (sin assets) =====
    const TYPE = {
      sushi: { color: "#ff8fab", emoji: "🍣" },
      gimnasio: { color: "#7aa2ff", emoji: "🏋️" },
      cine: { color: "#ffd166", emoji: "🎬" },
      centro_comercial: { color: "#6ee7b7", emoji: "🛍️" },
      comida_rapida: { color: "#fca5a5", emoji: "🍔" },
      restaurante: { color: "#f59e0b", emoji: "🍽️" },
      pasteleria: { color: "#d8b4fe", emoji: "🧁" },
      deporte: { color: "#60a5fa", emoji: "🏟️" },
      default: { color: "#a3a3a3", emoji: "📍" }
    };
    const makePrettyIcon = (t = "default", label = "") => {
      const { color, emoji } = TYPE[t] || TYPE.default;
      const svg = `
        <svg width="60" height="78" viewBox="0 0 60 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/>
            </filter>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="${color}"/><stop offset="100%" stop-color="${color}" stop-opacity="0.85"/>
            </linearGradient>
          </defs>
          <path d="M30 76 C30 76 6 50 6 32 A24 24 0 1 1 54 32 C54 50 30 76 30 76Z" fill="url(#g)" filter="url(#shadow)"/>
          <circle cx="30" cy="30" r="16" fill="white"/>
          <foreignObject x="18" y="18" width="24" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px;line-height:24px;text-align:center">${emoji}</div>
          </foreignObject>
        </svg>`;
      const html = `<div class="marker-badge">${svg}<div class="marker-label">${label}</div></div>`;
      return L.divIcon({
        className: "svg-marker",
        html,
        iconSize: [60, 78],
        iconAnchor: [30, 76],
        popupAnchor: [0, -70]
      });
    };

    const style = document.createElement("style");
    style.innerHTML = `
      .svg-marker{position:relative}
      .marker-badge{position:relative;transform-origin:bottom center}
      .marker-badge:hover{transform:scale(1.06)}
      .marker-label{position:absolute;left:50%;transform:translateX(-50%);bottom:-18px;background:#111;color:#fff;font-size:12px;padding:2px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.25)}
    `;
    document.head.appendChild(style);

    // ===== Lugares (fijos en lat/lng) =====
    const lugares = [
      // ——— existentes ———
      { nombre: "Takamar Sushi - Mall San Lucas", tipo: "sushi", lat: 6.1755, lng: -75.5668 },
      { nombre: "Smart Fit - La Intermedia", tipo: "gimnasio", lat: 6.1707, lng: -75.5845 },
      { nombre: "Cinépolis City Plaza", tipo: "cine", lat: 6.1692, lng: -75.5849 },
      { nombre: "Viva Envigado", tipo: "centro_comercial", lat: 6.1757, lng: -75.5919 },
      { nombre: "Sushi Gama (Manila)", tipo: "sushi", lat: 6.2107, lng: -75.5699 },
      { nombre: "Sr. Buñuelo (La 10)", tipo: "comida_rapida", lat: 6.2097, lng: -75.5674 }, // Cl 10 #43C-35
      { nombre: "El Bosque Era Rosado", tipo: "restaurante", lat: 6.1862, lng: -75.5555 },
      { nombre: "Gitana en las Nubes", tipo: "restaurante", lat: 6.1657, lng: -75.5488 },
      { nombre: "Tierra Alta (El Tesoro)", tipo: "restaurante", lat: 6.2002, lng: -75.5531 },
      { nombre: "Biela Bakery (Manila)", tipo: "pasteleria", lat: 6.2109, lng: -75.5696 },
      { nombre: "Estadio Atanasio Girardot", tipo: "deporte", lat: 6.2566, lng: -75.5906 },

      // ——— nuevos ———
      { nombre: "Arepepa (Envigado)", tipo: "restaurante", lat: 6.166389, lng: -75.581111 },
      { nombre: "Los Perritos del Mono (Las Palmas)", tipo: "comida_rapida", lat: 6.2148, lng: -75.5406 }, // aprox. Mirador Las Palmas
      { nombre: "ISAGEN – Transversal Inferior", tipo: "deporte", lat: 6.2061, lng: -75.5667 }, // oficinas (aprox.)
      { nombre: "Urb. Saltamonte Grand (Envigado)", tipo: "default", lat: 6.1750, lng: -75.5826 }, // aprox. 27G con 35 Sur
      { nombre: "Urb. Balsos de Oviedo (Medellín)", tipo: "default", lat: 6.19533, lng: -75.57349 },
      { nombre: "Hasta la Pizza Baby (Poblado)", tipo: "restaurante", lat: 6.2103, lng: -75.5708 }, // aprox. Manila
      { nombre: "Las Chachas (Envigado)", tipo: "restaurante", lat: 6.1773, lng: -75.5848 }, // Cra. 43 #36 Sur-17 (aprox.)
      { nombre: "Calle de la Buena Mesa (Sushi World)", tipo: "sushi", lat: 6.177557, lng: -75.586216 },
      { nombre: "Farmatodo – La Intermedia (La Sebastiana)", tipo: "default", lat: 6.1719, lng: -75.5860 },
      { nombre: "Trapani Pizza Estofada (Envigado)", tipo: "restaurante", lat: 6.1708, lng: -75.5830 }, // cerca Parque San José
      { nombre: "Pizza Loca (Sabaneta)", tipo: "restaurante", lat: 6.1519, lng: -75.6161 },
      { nombre: "Bramante (UVA El Tesoro)", tipo: "restaurante", lat: 6.2047, lng: -75.5617 },
      { nombre: "Casa Verde Miel (Llanogrande, Rionegro)", tipo: "restaurante", lat: 6.1410, lng: -75.4230 }, // aprox. Km 1 Llanogrande-Rionegro
      { nombre: "El Coctelazo (La Nubia)", tipo: "restaurante", lat: 6.1988, lng: -75.5853 }, // aprox.
      { nombre: "Tres Trigos – La Frontera", tipo: "pasteleria", lat: 6.1763, lng: -75.5840 },
      { nombre: "Capira Papitas (Poblado)", tipo: "comida_rapida", lat: 6.2089, lng: -75.5685 }
    ];

    // ——— separador para que marcadores en mismas coords no se tapen ———
    const used = new Map();
    const nudge = (lat, lng) => {
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const c = (used.get(key) || 0) + 1;
      used.set(key, c);
      if (c === 1) return [lat, lng];
      const r = 0.00012 * c;
      const ang = (c * 137.508 * Math.PI) / 180;
      return [lat + r * Math.sin(ang), lng + r * Math.cos(ang)];
    };

    const bounds = L.latLngBounds([]);
    for (const l of lugares) {
      const [lat, lng] = nudge(l.lat, l.lng);
      L.marker([lat, lng], { icon: makePrettyIcon(l.tipo, l.nombre) })
        .addTo(map)
        .bindPopup(`<b>${l.nombre}</b>`)
        .bindTooltip(l.nombre, { direction: "top" });
      bounds.extend([lat, lng]);
    }
    if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      id="map"
      style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }}
    />
  );
}

export default Mapa2;
