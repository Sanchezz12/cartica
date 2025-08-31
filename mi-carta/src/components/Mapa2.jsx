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

    // ===== Pines SVG sin assets =====
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
              <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
              <stop offset="100%" stop-color="${color}" stop-opacity="0.8"/>
            </linearGradient>
          </defs>
          <path d="M30 76 C30 76 6 50 6 32 A24 24 0 1 1 54 32 C54 50 30 76 30 76Z" fill="url(#g)" filter="url(#shadow)"/>
          <circle cx="30" cy="30" r="16" fill="white"/>
          <foreignObject x="18" y="18" width="24" height="24">
            <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px;line-height:24px;text-align:center">${emoji}</div>
          </foreignObject>
        </svg>`;
      const html = `
        <div class="marker-badge">
          ${svg}
          <div class="marker-label">${label}</div>
          <div class="marker-pulse"></div>
        </div>`;
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
      }`;
    document.head.appendChild(style);

    // ===== Lugares (direcciones afinadas) =====
    const lugares = [
      { nombre: "Takamar Sushi - Mall San Lucas", tipo: "sushi", dir: "Calle 20 Sur #27-55, Medellín, Antioquia, Colombia", poi: "Takamar Sushi Mall San Lucas Medellín" },
      { nombre: "Smart Fit - La Intermedia", tipo: "gimnasio", dir: "Carrera 27 #23 Sur-241, Envigado, Antioquia, Colombia", poi: "Smart Fit La Intermedia Envigado" },
      { nombre: "Cinépolis City Plaza", tipo: "cine", dir: "Calle 36D Sur #27A, Envigado, Antioquia, Colombia", poi: "Cinépolis City Plaza Envigado" },
      { nombre: "Viva Envigado", tipo: "centro_comercial", dir: "Carrera 48 #32B Sur-139, Envigado, Antioquia, Colombia", poi: "Centro Comercial Viva Envigado" },
      { nombre: "Sushi Gama (Manila)", tipo: "sushi", dir: "Calle 11A #43F-5, Medellín, Antioquia, Colombia", poi: "Sushi Gama Manila Medellín" },
      { nombre: "Sr. Buñuelo (La 10)", tipo: "comida_rapida", dir: "Calle 10 #43C-35, Medellín, Antioquia, Colombia", poi: "Sr Buñuelo Calle 10 43C-35 Medellín" },
      { nombre: "El Bosque Era Rosado", tipo: "restaurante", dir: "Calle 16A Sur #9E-150, Medellín, Antioquia, Colombia", poi: "El Bosque Era Rosado Medellín Los Balsos" },
      { nombre: "Gitana en las Nubes", tipo: "restaurante", dir: "Transversal de la Montaña Km 0.3, Envigado, Antioquia, Colombia", poi: "Gitana en las Nubes Envigado" },
      { nombre: "Tierra Alta (El Tesoro)", tipo: "restaurante", dir: "Centro Comercial El Tesoro, Carrera 25A #1A Sur-45, Medellín, Antioquia, Colombia", poi: "Tierra Alta Restaurante El Tesoro Medellín" },
      { nombre: "Biela Bakery (Manila)", tipo: "pasteleria", dir: "Calle 11A #43F-5, Medellín, Antioquia, Colombia", poi: "Biela Bakery Manila Medellín" },
      { nombre: "Estadio Atanasio Girardot", tipo: "deporte", dir: "Calle 57 #42-1, Medellín, Antioquia, Colombia", poi: "Estadio Atanasio Girardot" }
    ];

    // ===== Geocoder con throttle + cache =====
    const VIEWBOX = { left: -75.70, top: 6.39, right: -75.50, bottom: 6.15 };
    const HEADERS = {
      "Accept-Language": "es",
      "User-Agent": "mapita-bonito/1.0 (contacto: email@dominio.com)"
    };
    const BIAS = { lon: -75.57, lat: 6.23 }; // Poblado/Envigado
    const NOMINATIM_GAP = 1200;              // separación mínima global
    let lastNominatim = 0;

    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const withinViewbox = ([lat, lon]) =>
      lon >= VIEWBOX.left && lon <= VIEWBOX.right && lat >= VIEWBOX.bottom && lat <= VIEWBOX.top;

    // Cache localStorage con TTL (30 días)
    const CACHE_KEY = "geo_cache_v1";
    const TTL_MS = 30 * 24 * 60 * 60 * 1000;
    const cache = (() => {
      try { return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch { return {}; }
    })();
    const saveCache = () => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch {} };
    const getFromCache = (key) => {
      const item = cache[key];
      if (!item) return null;
      if (Date.now() - item.t > TTL_MS) return null;
      return item.v;
    };
    const setInCache = (key, value) => { cache[key] = { v: value, t: Date.now() }; saveCache(); };

    async function throttledNominatim(url) {
      const now = Date.now();
      const wait = Math.max(0, NOMINATIM_GAP - (now - lastNominatim));
      if (wait) await sleep(wait);
      lastNominatim = Date.now();

      const r = await fetch(url, { headers: HEADERS });
      if (!r.ok) return null;
      const j = await r.json();
      if (!j || !j.length) return null;
      return [parseFloat(j[0].lat), parseFloat(j[0].lon)];
    }

    async function hitNominatimPOI(q) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1&q=${encodeURIComponent(q)}`;
      return throttledNominatim(url);
    }

    async function hitNominatimStructured(dir) {
      const city = /Envigado/i.test(dir) ? "Envigado" : "Medellín";
      const street = dir.replace(/,\s*(Medellín|Envigado).*$/i, "");
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1&street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent("Antioquia")}&country=${encodeURIComponent("Colombia")}`;
      return throttledNominatim(url);
    }

    async function hitNominatimFree(dir) {
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1&q=${encodeURIComponent(dir)}`;
      return throttledNominatim(url);
    }

    async function hitPhoton(q) {
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lang=es&limit=1&lon=${BIAS.lon}&lat=${BIAS.lat}`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const j = await r.json();
      if (!j?.features?.length) return null;
      const f = j.features[0];
      const [lon, lat] = f.geometry.coordinates;
      if (f.properties?.countrycode && f.properties.countrycode !== "CO") return null;
      return [lat, lon];
    }

    async function geocode({ poi, dir }) {
      const cacheKey = `poi:${poi}|dir:${dir}`;
      const c = getFromCache(cacheKey);
      if (c) return c;

      // Photon primero (POI -> dir)
      let coords = await hitPhoton(poi);
      if (!coords) coords = await hitPhoton(dir);

      // Si Photon falla, Nominatim (POI -> structured -> libre), todo con throttle global
      if (!coords) coords = await hitNominatimPOI(poi);
      if (!coords) coords = await hitNominatimStructured(dir);
      if (!coords) coords = await hitNominatimFree(dir);

      if (coords && withinViewbox(coords)) {
        setInCache(cacheKey, coords);
        return coords;
      }
      return coords; // puede venir fuera; lo filtramos más abajo si quieres
    }

    // ——— evita que marcadores idénticos se tapen (micro-jitter) ———
    const used = new Map(); // key "lat,lon" -> count
    const nudge = ([lat, lon]) => {
      const key = `${lat.toFixed(6)},${lon.toFixed(6)}`;
      const c = (used.get(key) || 0) + 1;
      used.set(key, c);
      if (c === 1) return [lat, lon];
      // 6° ≈ 111km; 0.0001° ≈ 11m. Desplazamos radialmente unos metros.
      const r = 0.00012 * c; // metros ~13m, 26m...
      const ang = (c * 137.508) * (Math.PI / 180); // espiral de Vogel
      return [lat + r * Math.sin(ang), lon + r * Math.cos(ang)];
    };

    let cancelled = false;
    const bounds = L.latLngBounds([]);

    (async () => {
      for (const l of lugares) {
        if (cancelled) break;

        let coords = await geocode(l).catch(() => null);
        if (coords) {
          coords = nudge(coords);
          L.marker(coords, { icon: makePrettyIcon(l.tipo, l.nombre) })
            .addTo(map)
            .bindPopup(
              `<b>${l.nombre}</b><br/><small>${l.dir}</small><br/>
               <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.nombre} ${l.dir}`)}" target="_blank" rel="noopener">Ver en Google Maps</a>`
            )
            .bindTooltip(l.nombre, { direction: "top" });
          bounds.extend(coords);
          console.log("OK:", l.nombre, coords);
        } else {
          console.warn("NO ENCONTRADO:", l.nombre, "-", l.dir);
        }
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
