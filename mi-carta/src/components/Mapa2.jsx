import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ⚠️ Pega aquí tu token de Mapbox (pk.********)
// o usa variables: REACT_APP_MAPBOX_TOKEN / NEXT_PUBLIC_MAPBOX_TOKEN
const MAPBOX_TOKEN =
  process.env.REACT_APP_MAPBOX_TOKEN ||
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
  "<PON_AQUI_TU_TOKEN_MAPBOX>"; // ej: "pk.eyJ1Ijo..."

// Área de sesgo (Medellín/Envigado) y bbox (west,south,east,north)
const PROX = { lon: -75.57, lat: 6.23 };
const BBOX = [-75.75, 6.05, -75.35, 6.35].join(",");

function Mapa2() {
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return; // evita doble-montaje en dev
    inited.current = true;

    const map = L.map("map", { zoomControl: true }).setView([6.23, -75.57], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // ===== Pines SVG bonitos (sin assets) =====
    const TYPE = {
      sushi:{color:"#ff8fab",emoji:"🍣"}, gimnasio:{color:"#7aa2ff",emoji:"🏋️"},
      cine:{color:"#ffd166",emoji:"🎬"}, centro_comercial:{color:"#6ee7b7",emoji:"🛍️"},
      comida_rapida:{color:"#fca5a5",emoji:"🍔"}, restaurante:{color:"#f59e0b",emoji:"🍽️"},
      pasteleria:{color:"#d8b4fe",emoji:"🧁"}, deporte:{color:"#60a5fa",emoji:"🏟️"},
      pizza:{color:"#fb7185",emoji:"🍕"}, farmacia:{color:"#93c5fd",emoji:"💊"},
      bar:{color:"#f472b6",emoji:"🍹"}, default:{color:"#a3a3a3",emoji:"📍"}
    };
    const makePrettyIcon = (t="default", label="")=>{
      const {color,emoji}=TYPE[t]||TYPE.default;
      const svg = `
        <svg width="60" height="78" viewBox="0 0 60 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs><filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/></filter>
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
      return L.divIcon({ className:"svg-marker", html, iconSize:[60,78], iconAnchor:[30,76], popupAnchor:[0,-70] });
    };
    const style=document.createElement("style");
    style.innerHTML=`.svg-marker{position:relative}.marker-badge{position:relative;transform-origin:bottom center}
      .marker-badge:hover{transform:scale(1.06)}
      .marker-label{position:absolute;left:50%;transform:translateX(-50%);bottom:-18px;background:#111;color:#fff;font-size:12px;padding:2px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.25)}`;
    document.head.appendChild(style);

    // ===== Tus lugares (por DIRECCIÓN, para precisión) =====
    // Puedes añadir lat/lng para forzar una ubicación exacta; si no, se geocodifica y se cachea.
    const lugares = [
      // — los 11 iniciales —
      { nombre:"Takamar Sushi - Mall San Lucas", tipo:"sushi", direccion:"Calle 20 Sur #27-55, Medellín, Antioquia, Colombia" },
      { nombre:"Smart Fit - La Intermedia", tipo:"gimnasio", direccion:"Carrera 27 #23 Sur-241, Envigado, Antioquia, Colombia" },
      { nombre:"Cinépolis City Plaza", tipo:"cine", direccion:"Calle 36D Sur #27A, Envigado, Antioquia, Colombia" },
      { nombre:"Viva Envigado", tipo:"centro_comercial", direccion:"Carrera 48 #32B Sur-139, Envigado, Antioquia, Colombia" },
      { nombre:"Sushi Gama (Manila)", tipo:"sushi", direccion:"Calle 11A #43F-5, Medellín, Antioquia, Colombia" },
      { nombre:"Sr. Buñuelo (La 10)", tipo:"comida_rapida", direccion:"Calle 10 #43C-35, Medellín, Antioquia, Colombia" },
      { nombre:"El Bosque Era Rosado", tipo:"restaurante", direccion:"Calle 16A Sur #9E-150, Medellín, Antioquia, Colombia" },
      { nombre:"Gitana en las Nubes", tipo:"restaurante", direccion:"Transversal de la Montaña Km 0.3, Envigado, Antioquia, Colombia" },
      { nombre:"Tierra Alta (El Tesoro)", tipo:"restaurante", direccion:"Centro Comercial El Tesoro, Carrera 25A #1A Sur-45, Medellín, Antioquia, Colombia" },
      { nombre:"Biela Bakery (Manila)", tipo:"pasteleria", direccion:"Calle 11A #43F-5, Medellín, Antioquia, Colombia" },
      { nombre:"Estadio Atanasio Girardot", tipo:"deporte", direccion:"Calle 57 #42-1, Medellín, Antioquia, Colombia" },

      // — nuevos —
      { nombre:"Arepepa (Envigado)", tipo:"restaurante", direccion:"Cl. 37 Sur #31-55, Envigado, Antioquia, Colombia" },
      { nombre:"Los Perritos del Mono (Las Palmas)", tipo:"comida_rapida", direccion:"Mirador de Las Palmas, Medellín, Antioquia, Colombia" },
      { nombre:"ISAGEN (Los Balsos)", tipo:"default", direccion:"Transversal Inferior, Cra. 30 #10C-280, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Urb. Saltamonte Grand", tipo:"default", direccion:"Carrera 27G #35 Sur, Envigado, Antioquia, Colombia" },
      { nombre:"Urb. Balsos de Oviedo", tipo:"default", direccion:"Carrera 42 #7A Sur-92, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"¡Hasta la Pizza, Baby! (Q Office)", tipo:"pizza", direccion:"Cl. 2 #20-50, Q Office, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Las Chachas (Envigado)", tipo:"comida_rapida", direccion:"Cra. 43 #36 Sur-17, Zona 9, Envigado, Antioquia, Colombia" },
      { nombre:"Calle de la Buena Mesa (Sushi World)", tipo:"sushi", direccion:"Calle 37 Sur, Envigado, Antioquia, Colombia" },
      { nombre:"Farmatodo (La Intermedia)", tipo:"farmacia", direccion:"Cra. 27 #36 Sur-199, Envigado, Antioquia, Colombia" },
      { nombre:"Trap(p)ani Pizzería (Envigado)", tipo:"pizza", direccion:"Cl. 39B Sur #29A-37, Envigado, Antioquia, Colombia" },
      { nombre:"Pizza Loca (Sabaneta)", tipo:"pizza", direccion:"Cra. 43B #70 Sur-48, Sabaneta, Antioquia, Colombia" },
      { nombre:"Bramante (El Poblado)", tipo:"restaurante", direccion:"Cra. 29C #3B Sur-70, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Casa Verde Miel (Llanogrande)", tipo:"restaurante", direccion:"Km 1, Llanogrande - Rionegro, Rionegro, Antioquia, Colombia" },
      { nombre:"El Coctelazo (La Nubia)", tipo:"bar", direccion:"Cra. 83 #15A-21, Medellín, Antioquia, Colombia" },
      { nombre:"Tres Trigos – La Frontera", tipo:"pasteleria", direccion:"Cra. 43A #18 Sur-84, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Capira – Cl. 10 #37-38", tipo:"comida_rapida", direccion:"Cl. 10 #37-38, El Poblado, Medellín, Antioquia, Colombia" }
    ];

    // ===== Cache local =====
    const CACHE_KEY = "geo_mapbox_cache_v1";
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const saveCache = () => localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

    // ===== Geocoders =====
    async function geocodeMapbox(q) {
      const u = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json`);
      u.searchParams.set("access_token", MAPBOX_TOKEN);
      u.searchParams.set("limit", "1");
      u.searchParams.set("language", "es");
      u.searchParams.set("country", "co");
      u.searchParams.set("proximity", `${PROX.lon},${PROX.lat}`);
      u.searchParams.set("bbox", BBOX);
      u.searchParams.set("types", "poi,address,place,neighborhood");

      const r = await fetch(u.toString());
      if (!r.ok) throw new Error("mapbox fail");
      const j = await r.json();
      const f = j?.features?.[0];
      if (!f) throw new Error("mapbox sin resultados");
      const [lon, lat] = f.center;
      return { lat, lon };
    }

    // Fallback educado (solo si no hay token)
    let lastNom = 0;
    async function geocodeNominatim(q) {
      const now = Date.now();
      const wait = Math.max(0, 1100 - (now - lastNom));
      if (wait) await new Promise(r => setTimeout(r, wait));
      lastNom = Date.now();
      const u = new URL("https://nominatim.openstreetmap.org/search");
      u.searchParams.set("format","json");
      u.searchParams.set("q", q);
      u.searchParams.set("addressdetails","0");
      u.searchParams.set("limit","1");
      u.searchParams.set("countrycodes","co");
      u.searchParams.set("viewbox", BBOX);
      u.searchParams.set("bounded","1");
      const r = await fetch(u.toString(), { headers: { "Accept-Language": "es" }});
      const j = await r.json();
      if (!Array.isArray(j) || !j.length) throw new Error("nominatim sin resultados");
      return { lat: parseFloat(j[0].lat), lon: parseFloat(j[0].lon) };
    }

    // ===== Orquestador con concurrencia (rápido) =====
    const bounds = L.latLngBounds([]);
    const markers = [];
    const used = new Map();
    const nudge = (lat,lng) => {
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const c = (used.get(key)||0)+1; used.set(key,c);
      if (c===1) return [lat,lng];
      const r=0.00012*c, ang=(c*137.508)*Math.PI/180;
      return [lat+r*Math.sin(ang), lng+r*Math.cos(ang)];
    };

    const placeMarker = (l, lat, lon) => {
      const [nLat, nLon] = nudge(lat, lon);
      const m = L.marker([nLat, nLon], { icon: makePrettyIcon(l.tipo, l.nombre) })
        .addTo(map)
        .bindPopup(`<b>${l.nombre}</b><br/><small>${l.direccion}</small>`)
        .bindTooltip(l.nombre, { direction:"top" });
      bounds.extend([nLat, nLon]);
      markers.push(m);
    };

    (async () => {
      const pool = 8; // velocidad sin pasarse
      let i = 0;

      const worker = async () => {
        while (i < lugares.length) {
          const idx = i++; const l = lugares[idx];
          const key = l.direccion || l.nombre;
          try {
            let hit = cache[key];
            if (!hit) {
              // usa Mapbox si hay token válido; si no, Nominatim
              const useMb = MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith("pk.");
              hit = useMb ? await geocodeMapbox(key) : await geocodeNominatim(key);
              cache[key] = hit; saveCache();
            }
            placeMarker(l, hit.lat, hit.lon);
          } catch (e) {
            console.warn("No geocodificado:", key, e?.message);
          }
        }
      };

      await Promise.all(Array.from({ length: pool }, worker));
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
      setTimeout(()=>map.invalidateSize(),0);
    })();

    // SHIFT+click para corregir a mano (rápido): imprime lat,lng
    map.on("click", (e) => {
      if (e.originalEvent?.shiftKey) {
        const { lat, lng } = e.latlng;
        console.log("✅ Usa estas coords lat,lng:", lat.toFixed(6), lng.toFixed(6));
      }
    });

    return () => { map.remove(); document.head.removeChild(style); };
  }, []);

  return <div id="map" style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }} />;
}

export default Mapa2;
