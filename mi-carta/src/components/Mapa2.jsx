import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Mapa2() {
  useEffect(() => {
    const map = L.map("map", { zoomControl: true }).setView([6.2442, -75.5812], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // ====== Marcador SVG (sin assets) ======
    const TYPE = {
      sushi:           { color: "#ff8fab", emoji: "🍣" },
      gimnasio:        { color: "#7aa2ff", emoji: "🏋️" },
      cine:            { color: "#ffd166", emoji: "🎬" },
      centro_comercial:{ color: "#6ee7b7", emoji: "🛍️" },
      comida_rapida:   { color: "#fca5a5", emoji: "🍔" },
      restaurante:     { color: "#f59e0b", emoji: "🍽️" },
      pasteleria:      { color: "#d8b4fe", emoji: "🧁" },
      deporte:         { color: "#60a5fa", emoji: "🏟️" },
      default:         { color: "#a3a3a3", emoji: "📍" }
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
              <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
          <path d="M30 76 C30 76 6 50 6 32 A24 24 0 1 1 54 32 C54 50 30 76 30 76Z" fill="url(#g)" filter="url(#shadow)"/>
          <circle cx="30" cy="30" r="16" fill="white" />
          <foreignObject x="18" y="18" width="24" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px;line-height:24px;text-align:center">${emoji}</div>
          </foreignObject>
        </svg>
      `;
      const html = `
        <div class="marker-badge">
          ${svg}
          <div class="marker-label">${label}</div>
          <div class="marker-pulse"></div>
        </div>
      `;
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
      .svg-marker { position: relative; }
      .marker-badge { position: relative; transform-origin: bottom center; }
      .marker-badge:hover { transform: scale(1.06); }
      .marker-label{
        position:absolute; left:50%; transform:translateX(-50%);
        bottom:-18px; background:#111; color:#fff; font-size:12px;
        padding:2px 6px; border-radius:999px; white-space:nowrap;
        box-shadow:0 1px 3px rgba(0,0,0,.25);
      }
      .marker-pulse{
        position:absolute; left:50%; bottom:4px; width:8px; height:8px;
        transform:translateX(-50%); border-radius:999px; background:#00000033;
        box-shadow:0 0 0 0 rgba(0,0,0,0.25); animation:pulse 2s infinite;
      }
      @keyframes pulse {
        0%   { box-shadow:0 0 0 0 rgba(0,0,0,0.25); }
        70%  { box-shadow:0 0 0 12px rgba(0,0,0,0); }
        100% { box-shadow:0 0 0 0 rgba(0,0,0,0); }
      }
    `;
    document.head.appendChild(style);

    // ====== Direcciones corregidas y estandarizadas ======
    // (sin repetir “barrio” y siempre “Medellín, Antioquia, Colombia” o Envigado)
    const lugares = [
      { nombre: "Takamar Sushi - Mall San Lucas", direccion: "Calle 20 Sur #27-55, Medellín, Antioquia, Colombia", tipo: "sushi" },
      { nombre: "Smart Fit - La Intermedia", direccion: "Carrera 27 #23 Sur-241, Envigado, Antioquia, Colombia", tipo: "gimnasio" },
      { nombre: "Cinépolis City Plaza", direccion: "Calle 36D Sur #27A, Envigado, Antioquia, Colombia", tipo: "cine" },
      { nombre: "Viva Envigado", direccion: "Carrera 48 #32B Sur-139, Envigado, Antioquia, Colombia", tipo: "centro_comercial" },
      { nombre: "Sushi Gama (Manila)", direccion: "Calle 11A #43F-5, Medellín, Antioquia, Colombia", tipo: "sushi" },
      { nombre: "Sr. Buñuelo (La 10)", direccion: "Calle 10 #43C-35, Medellín, Antioquia, Colombia", tipo: "comida_rapida" },
      { nombre: "El Bosque Era Rosado", direccion: "Calle 16A Sur #9E-150, Medellín, Antioquia, Colombia", tipo: "restaurante" },
      { nombre: "Gitana en las Nubes", direccion: "Transversal de la Montaña Km 0.3, Envigado, Antioquia, Colombia", tipo: "restaurante" },
      { nombre: "Tierra Alta (El Tesoro)", direccion: "Centro Comercial El Tesoro, Carrera 25A #1A Sur-45, Medellín, Antioquia, Colombia", tipo: "restaurante" },
      { nombre: "Biela Bakery (Manila)", direccion: "Calle 11A #43F-5, Medellín, Antioquia, Colombia", tipo: "pasteleria" },
      { nombre: "Estadio Atanasio Girardot", direccion: "Calle 57 #42-1, Medellín, Antioquia, Colombia", tipo: "deporte" }
    ];

    // ====== Geocoder robusto: país, viewbox Medellín, structured-first ======
    const VIEWBOX = {
      // [minLon, minLat, maxLon, maxLat] aprox. Valle de Aburrá central
      minLon: -75.70, minLat: 6.15, maxLon: -75.50, maxLat: 6.39
    };

    const headers = {
      "Accept-Language": "es",
      "User-Agent": "mapita-bonito/1.0 (contacto: email@dominio.com)"
    };

    // intenta “structured” (street/city/state/country) y luego libre
    const geocode = async (dir) => {
      const city = dir.includes("Envigado") ? "Envigado" : "Medellín";
      const street = dir.replace(/,\s*(Medellín|Envigado).*$/i, ""); // toma solo la parte de calle/carrera
      const structured = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent("Antioquia")}&country=${encodeURIComponent("Colombia")}&viewbox=${VIEWBOX.minLon},${VIEWBOX.maxLat},${VIEWBOX.maxLon},${VIEWBOX.minLat}&bounded=1`;
      const free = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&q=${encodeURIComponent(dir)}&viewbox=${VIEWBOX.minLon},${VIEWBOX.maxLat},${VIEWBOX.maxLon},${VIEWBOX.minLat}&bounded=1`;

      // structured first
      for (const url of [structured, free]) {
        const r = await fetch(url, { headers });
        if (!r.ok) continue;
        const j = await r.json();
        if (j && j.length) return [parseFloat(j[0].lat), parseFloat(j[0].lon)];
      }
      return null;
    };

    let cancelled = false;
    const bounds = L.latLngBounds([]);

    (async () => {
      for (const l of lugares) {
        if (cancelled) break;
        const coords = await geocode(l.direccion).catch(() => null);
        if (coords) {
          L.marker(coords, { icon: makePrettyIcon(l.tipo, l.nombre) })
            .addTo(map)
            .bindPopup(
              `<b>${l.nombre}</b><br/><small>${l.direccion}</small><br/>
               <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                 `${l.nombre} ${l.direccion}`
               )}" target="_blank" rel="noopener">Ver en Google Maps</a>`
            )
            .bindTooltip(l.nombre, { direction: "top" });
          bounds.extend(coords);
        } else {
          console.warn("Sin coordenadas:", l.nombre, "-", l.direccion);
        }
        // respeta Nominatim
        await new Promise((r) => setTimeout(r, 1100));
      }
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
      setTimeout(() => map.invalidateSize(), 0);
    })();

    return () => {
      cancelled = true;
      map.remove();
      document.head.removeChild(style);
    };
  }, []);

  return <div id="map" style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }} />;
}

export default Mapa2;
