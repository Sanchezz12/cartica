import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Mapa2() {
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return; // evita doble montaje en React 18 StrictMode
    inited.current = true;

    const map = L.map("map", { zoomControl: true }).setView([6.23, -75.57], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // ===== Pines SVG (sin assets) =====
    const TYPE = {
      sushi:{color:"#ff8fab",emoji:"🍣"}, gimnasio:{color:"#7aa2ff",emoji:"🏋️"},
      cine:{color:"#ffd166",emoji:"🎬"}, centro_comercial:{color:"#6ee7b7",emoji:"🛍️"},
      comida_rapida:{color:"#fca5a5",emoji:"🍔"}, restaurante:{color:"#f59e0b",emoji:"🍽️"},
      pasteleria:{color:"#d8b4fe",emoji:"🧁"}, deporte:{color:"#60a5fa",emoji:"🏟️"},
      default:{color:"#a3a3a3",emoji:"📍"}
    };
    const makePrettyIcon = (t="default", label="")=>{
      const {color,emoji}=TYPE[t]||TYPE.default;
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
      return L.divIcon({ className:"svg-marker", html, iconSize:[60,78], iconAnchor:[30,76], popupAnchor:[0,-70] });
    };

    const style=document.createElement("style");
    style.innerHTML=`.svg-marker{position:relative}.marker-badge{position:relative;transform-origin:bottom center}
      .marker-badge:hover{transform:scale(1.06)}
      .marker-label{position:absolute;left:50%;transform:translateX(-50%);bottom:-18px;background:#111;color:#fff;font-size:12px;padding:2px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.25)}`;
    document.head.appendChild(style);

    // ===== Lugares SOLO con coordenadas (todos tienen lat/lng) =====
    const lugares = [
      // ——— tus 11 iniciales ———
      { nombre:"Takamar Sushi - Mall San Lucas", tipo:"sushi",         lat:6.175500, lng:-75.566800 },
      { nombre:"Smart Fit - La Intermedia",       tipo:"gimnasio",      lat:6.170700, lng:-75.584500 },
      { nombre:"Cinépolis City Plaza",            tipo:"cine",          lat:6.169200, lng:-75.584900 },
      { nombre:"Viva Envigado",                   tipo:"centro_comercial", lat:6.176377, lng:-75.591653 },
      { nombre:"Sushi Gama (Manila)",             tipo:"sushi",         lat:6.210700, lng:-75.569900 },
      { nombre:"Sr. Buñuelo (La 10)",             tipo:"comida_rapida", lat:6.209700, lng:-75.567400 },
      { nombre:"El Bosque Era Rosado",            tipo:"restaurante",   lat:6.186200, lng:-75.555500 },
      { nombre:"Gitana en las Nubes",             tipo:"restaurante",   lat:6.165700, lng:-75.548800 },
      { nombre:"Tierra Alta (El Tesoro)",         tipo:"restaurante",   lat:6.200200, lng:-75.553100 },
      { nombre:"Biela Bakery (Manila)",           tipo:"pasteleria",    lat:6.210900, lng:-75.569600 },
      { nombre:"Estadio Atanasio Girardot",       tipo:"deporte",       lat:6.256600, lng:-75.590600 },

      // ——— nuevos (todas con lat/lng para que SIEMPRE rendericen) ———
      { nombre:"Arepepa (Envigado)", tipo:"restaurante",  lat:6.166390, lng:-75.581110 },   // Cl. 37 Sur #31-55
      { nombre:"Los Perritos del Mono (Las Palmas)", tipo:"comida_rapida", lat:6.214850, lng:-75.540600 }, // Mirador Las Palmas
      { nombre:"ISAGEN (Transversal Inferior 10C-280)", tipo:"default", lat:6.204950, lng:-75.565900 },
      { nombre:"Urb. Saltamonte Grand (Envigado)", tipo:"default", lat:6.174950, lng:-75.582600 }, // 27G con 35 Sur
      { nombre:"Urb. Balsos de Oviedo", tipo:"default", lat:6.195330, lng:-75.573490 }, // Cra 42 #7A Sur-92
      { nombre:"¡Hasta la Pizza, Baby!", tipo:"restaurante", lat:6.211790, lng:-75.566680 }, // Cra 35 #8A-81
      { nombre:"Las Chachas (Envigado)", tipo:"comida_rapida", lat:6.177100, lng:-75.586900 }, // Cra. 43 #36 Sur-17
      { nombre:"Sushi World – Buena Mesa", tipo:"sushi", lat:6.177557, lng:-75.586216 }, // Cl 30 Sur #44A-45
      { nombre:"Farmatodo – La Intermedia", tipo:"default", lat:6.171950, lng:-75.585980 }, // Cra 27 #36 Sur-199
      { nombre:"Trap(p)ani Pizzería (Envigado)", tipo:"restaurante", lat:6.170800, lng:-75.583000 }, // Cl. 39B Sur #29A-37
      { nombre:"Pizza Loca (Sabaneta)", tipo:"restaurante", lat:6.151900, lng:-75.616100 }, // Cra. 43B #70 Sur-48
      { nombre:"Bramante (El Poblado)", tipo:"restaurante", lat:6.204700, lng:-75.561700 }, // Cra. 29C #3B Sur-70
      { nombre:"Casa Verde Miel (Llanogrande)", tipo:"restaurante", lat:6.128500, lng:-75.418900 }, // Km 1 Llanogrande
      { nombre:"El Coctelazo (Belén La Nubia)", tipo:"comida_rapida", lat:6.198800, lng:-75.585300 }, // Cra 83 #15A-21
      { nombre:"Tres Trigos – La Frontera", tipo:"pasteleria", lat:6.176300, lng:-75.584000 },
      { nombre:"Capira – Cl. 10 #37-38", tipo:"comida_rapida", lat:6.208900, lng:-75.568500 }
    ];

    // ——— evita que marcadores idénticos se tapen ———
    const used = new Map();
    const nudge = (lat,lng) => {
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const c = (used.get(key) || 0) + 1; used.set(key,c);
      if (c===1) return [lat,lng];
      const r=0.00012*c, ang=(c*137.508)*Math.PI/180;
      return [lat + r*Math.sin(ang), lng + r*Math.cos(ang)];
    };

    const bounds = L.latLngBounds([]);
    let pintados = 0;

    for (const l of lugares) {
      try {
        const nudged = nudge(l.lat, l.lng);
        if (!nudged) { console.warn("Coordenada inválida:", l); continue; }
        const [lat,lng] = nudged;
        L.marker([lat,lng], { icon: makePrettyIcon(l.tipo, l.nombre) })
          .addTo(map)
          .bindPopup(`<b>${l.nombre}</b>`)
          .bindTooltip(l.nombre, { direction:"top" });
        bounds.extend([lat,lng]);
        pintados++;
      } catch (e) {
        console.error("Error dibujando", l.nombre, e);
      }
    }

    if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
    setTimeout(()=>map.invalidateSize(),0);
    console.log(`✅ Marcadores pintados: ${pintados}/${lugares.length}`);

    return ()=>{ map.remove(); document.head.removeChild(style); };
  }, []);

  return <div id="map" style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }} />;
}

export default Mapa2;
