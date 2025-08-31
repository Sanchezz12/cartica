import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinSvg = (emoji = "📍") =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
      <defs>
        <filter id='shadow' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='0' dy='2' stdDeviation='3' flood-color='rgba(0,0,0,0.35)'/>
        </filter>
      </defs>
      <g filter='url(#shadow)'>
        <path d='M32 6c-10 0-18 8-18 18 0 14 18 32 18 32s18-18 18-32c0-10-8-18-18-18z' fill='#ff7aa2' stroke='#e15b86' stroke-width='2'/>
        <circle cx='32' cy='24' r='9' fill='white'/>
        <text x='32' y='28' text-anchor='middle' font-size='14'>${emoji}</text>
      </g>
    </svg>`
  )}`;

const iconFor = (tipo) =>
  L.icon({
    iconUrl: pinSvg(
      {
        sushi: "🍣",
        gimnasio: "🏋️",
        cine: "🎬",
        centro_comercial: "🛍️",
        comida_rapida: "🌭",
        restaurante: "🍽️",
        pasteleria: "🧁",
        deporte: "🏟️",
        pizza: "🍕",
        farmacia: "💊",
        bar: "🍹",
        edificio: "🏢",
        urbanizacion: "🏠",
      }[tipo] || "📍"
    ),
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -36],
    className: "drop-shadow",
  });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const geocodeOnce = async (q) => {
  const key = `geo:${q}`;
  const cached = localStorage.getItem(key);
  if (cached) return JSON.parse(cached);

  // educado con Nominatim (1–2 req/seg) + bounded a Aburrá/Oriente
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", q);
  // bounding box aprox: oeste/ sur/ este/ norte
  url.searchParams.set("bounded", "1");
  url.searchParams.set("viewbox", "-75.75,6.35,-75.35,6.05");

  await sleep(600); // ser buen ciudadano con el rate limit
  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "es", "User-Agent": "demo-mapita/1.0" },
  });
  const data = await res.json();
  if (Array.isArray(data) && data.length) {
    const hit = { lat: +data[0].lat, lng: +data[0].lon };
    localStorage.setItem(key, JSON.stringify(hit));
    return hit;
  }
  return null;
};

export default function Mapa2() {
  useEffect(() => {
    const map = L.map("map").setView([6.208, -75.567], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    }).addTo(map);

    // 👇 Lugares. Si hay lat/lng, se usa directo; si no, se geocodifica 1 sola vez y se cachea.
    const lugares = [
      // ——— TUS ORIGINALES (ejemplos) ———
      { nombre: "Takamar Sushi - Mall San Lucas", direccion: "Calle 20 Sur #27-55, Medellín", tipo: "sushi" },
      { nombre: "Cinépolis City Plaza", direccion: "Calle 36D Sur #27A, Envigado", tipo: "cine" },
      // ——— NUEVOS QUE PEDISTE ———
      { nombre: "Arepepa (Envigado)", direccion: "Cl. 37 Sur #31-55, Envigado, Antioquia", tipo: "comida_rapida" },
      { nombre: "Los Perritos del Mono (Las Palmas)", direccion: "Vía Las Palmas, sector Mirador Las Palmas, Medellín", tipo: "comida_rapida" },
      { nombre: "Oficinas ISAGEN (Los Balsos)", direccion: "Los Balsos, Medellín (oficinas Isagen)", tipo: "edificio" },
      { nombre: "Urbanización Saltamonte Grand", direccion: "Carrera 27G #35 Sur, Envigado", tipo: "urbanizacion" },
      // Verificado: Balsos de Oviedo (coords directas)
      { nombre: "Urbanización Balsos de Oviedo", lat: 6.19525, lng: -75.57303, tipo: "urbanizacion" }, // Mapcarta
      { nombre: "¡Hasta la Pizza, Baby!", direccion: "Cl. 2 #20-50, Q Office, El Poblado, Medellín", tipo: "pizza" },
      // Verificado: Las Chachas (Envigado) — coord aprox Parque Envigado
      { nombre: "Las Chachas (Envigado)", direccion: "Calle 37 Sur, cerca Parque Envigado", tipo: "comida_rapida" },
      { nombre: "La Buena Mesa (Sushi World)", lat: 6.177557, lng: -75.586216, tipo: "sushi" }, // Waze link directo
      // Verificado aprox por dirección exacta en Intermedia (Yandex house coords)
      { nombre: "Farmatodo (Intermedia)", lat: 6.162858, lng: -75.569794, tipo: "farmacia" },
      { nombre: "Trappani Pizzería (Envigado)", direccion: "Cl. 39B Sur #29A-37, Envigado", tipo: "pizza" },
      { nombre: "Pizza Loca (Sabaneta)", direccion: "Cra. 43B #70 Sur-48, Sabaneta", tipo: "pizza" },
      { nombre: "Bramante", direccion: "Cra. 29C #3B Sur-70, El Poblado, Medellín", tipo: "restaurante" },
      { nombre: "Casa VerdeMiel (Llanogrande, Rionegro)", direccion: "Km 1, Llanogrande - Rionegro (después de los trailers)", tipo: "restaurante" },
      { nombre: "El Coctelazo (Belén La Nubia)", direccion: "Cra. 83 #15A-21, Medellín", tipo: "bar" },
      { nombre: "Tres Trigos", direccion: "Cra. 43A #18 Sur-84, El Poblado, Medellín", tipo: "pasteleria" },
      { nombre: "Capira Papitas (Poblado)", direccion: "Cl. 10 #37-38, El Poblado, Medellín", tipo: "comida_rapida" },
      // Corregido: Sr. Buñuelo — dirección que me diste
      { nombre: "Sr. Buñuelo (Poblado)", direccion: "Cl. 10 #43C-35, El Poblado, Medellín", tipo: "comida_rapida" },
    ];

    const markers = [];
    const addMarker = ({ nombre, lat, lng, tipo, direccion }) => {
      const m = L.marker([lat, lng], { icon: iconFor(tipo) })
        .addTo(map)
        .bindPopup(
          `<b>${nombre}</b><br/>${
            direccion ? `<small>${direccion}</small><br/>` : ""
          }<a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank">Ver en Google Maps</a>`
        );
      markers.push(m);
    };

    // Procesa con concurrencia 3 los que necesiten geocoding
    (async () => {
      const need = lugares.filter((l) => !(l.lat && l.lng));
      const direct = lugares.filter((l) => l.lat && l.lng);

      direct.forEach(addMarker);

      const pool = 3;
      let i = 0;
      const runWorker = async () => {
        while (i < need.length) {
          const idx = i++;
          const l = need[idx];
          const hit = await geocodeOnce(l.direccion || l.nombre);
          if (hit) addMarker({ ...l, ...hit });
          else console.warn("No geocodificó:", l.nombre, l.direccion);
        }
      };
      await Promise.all(Array.from({ length: pool }, runWorker));

      // Fit bounds bonito
      const group = L.featureGroup(markers);
      if (markers.length) map.fitBounds(group.getBounds().pad(0.2));
    })();

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
}
