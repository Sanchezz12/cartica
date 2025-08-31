// src/components/Mapa2.jsx
import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ========= Overrides de emojis por lugar (usa NOMBRES EXACTOS) ========= */
const EMOJI_OVERRIDES = {
  "ISAGEN (Los Balsos)": "🎾",                     // raqueta
  "El Coctelazo (La Nubia)": "💋",                 // primer beso
  "Tierra Alta (El Tesoro)": "🍺",                 // birra
  "Bramante (El Poblado)": "🍔",                   // hamburguesa
  "Los Perritos del Mono (Las Palmas)": "🌭"       // hot dog
};

/* ========= Pines por tipo (color + emoji base) ========= */
const TYPE = {
  sushi:{color:"#ff8fab",emoji:"🍣"}, gimnasio:{color:"#7aa2ff",emoji:"🏋️"},
  cine:{color:"#ffd166",emoji:"🎬"}, centro_comercial:{color:"#6ee7b7",emoji:"🛍️"},
  comida_rapida:{color:"#fca5a5",emoji:"🍔"}, restaurante:{color:"#f59e0b",emoji:"🍽️"},
  pasteleria:{color:"#d8b4fe",emoji:"🧁"}, deporte:{color:"#60a5fa",emoji:"🏟️"},
  farmacia:{color:"#93c5fd",emoji:"💊"}, pizza:{color:"#fb7185",emoji:"🍕"},
  bar:{color:"#f472b6",emoji:"🍹"}, default:{color:"#a3a3a3",emoji:"📍"},
};

/* ========= Ícono SVG (acepta override de emoji) ========= */
const makeIcon = (t = "default", label = "", emojiOverride) => {
  const { color, emoji } = TYPE[t] || TYPE.default;
  const useEmoji = emojiOverride || emoji;

  const svg = `
    <svg width="60" height="78" viewBox="0 0 60 78" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.25"/>
        </filter>
        <linearGradient id="g" x1="0" y="0" x2="0" y="1">
          <stop offset="0%" stop-color="${color}"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <path d="M30 76 C30 76 6 50 6 32 A24 24 0 1 1 54 32 C54 50 30 76 30 76Z" fill="url(#g)" filter="url(#shadow)"/>
      <circle cx="30" cy="30" r="16" fill="white"/>
      <foreignObject x="18" y="18" width="24" height="24">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-size:20px;line-height:24px;text-align:center">${useEmoji}</div>
      </foreignObject>
    </svg>`;
  const html = `<div class="marker-badge">${svg}<div class="marker-label">${label}</div></div>`;
  return L.divIcon({ className:"svg-marker", html, iconSize:[60,78], iconAnchor:[30,76], popupAnchor:[0,-70] });
};

/* ========= Component ========= */
export default function Mapa2() {
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    const map = L.map("map", { zoomControl: true }).setView([6.23, -75.57], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);

    // estilos (marcadores + toolbar + toast)
    const style = document.createElement("style");
    style.innerHTML = `
      .svg-marker{position:relative}
      .marker-badge{position:relative;transform-origin:bottom center}
      .marker-badge:hover{transform:scale(1.06)}
      .marker-label{position:absolute;left:50%;transform:translateX(-50%);bottom:-18px;background:#111;color:#fff;font-size:12px;padding:2px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.25)}
      .toolbar{position:absolute;z-index:9999;top:10px;left:10px;display:flex;gap:8px;flex-wrap:wrap}
      .toolbar button{background:#111;color:#fff;border:0;border-radius:999px;padding:8px 12px;font-size:12px;box-shadow:0 1px 3px rgba(0,0,0,.3);cursor:pointer}
      .toolbar input[type=file]{display:none}
      .toast{position:absolute;z-index:9999;top:10px;right:10px;background:#111;color:#fff;border-radius:999px;padding:8px 12px;font-size:12px;box-shadow:0 1px 3px rgba(0,0,0,.3)}
    `;
    document.head.appendChild(style);

    /* ===== 23 lugares (con coordenadas base; tus ajustes se leen de localStorage) ===== */
    const lugares = [
      { nombre:"Takamar Sushi - Mall San Lucas", tipo:"sushi", lat:6.175500, lng:-75.566800 },
      { nombre:"Smart Fit - La Intermedia",       tipo:"gimnasio", lat:6.170700, lng:-75.584500 },
      { nombre:"Cinépolis City Plaza",            tipo:"cine",     lat:6.169200, lng:-75.584900 },
      { nombre:"Viva Envigado",                   tipo:"centro_comercial", lat:6.176377, lng:-75.591653 },
      { nombre:"Sushi Gama (Manila)",             tipo:"sushi",    lat:6.210700, lng:-75.569900 },
      { nombre:"Sr. Buñuelo (La 10)",             tipo:"comida_rapida", lat:6.209700, lng:-75.567400 },
      { nombre:"El Bosque Era Rosado",            tipo:"restaurante", lat:6.186200, lng:-75.555500 },
      { nombre:"Tierra Alta (El Tesoro)",         tipo:"restaurante", lat:6.200200, lng:-75.553100 },
      { nombre:"Biela Bakery (Manila)",           tipo:"pasteleria", lat:6.210900, lng:-75.569600 },

      { nombre:"Arepepa (Envigado)",              tipo:"comida_rapida", lat:6.171800, lng:-75.582800 },
      { nombre:"Los Perritos del Mono (Las Palmas)", tipo:"comida_rapida", lat:6.214850, lng:-75.540600 },
      { nombre:"ISAGEN (Los Balsos)",             tipo:"default",  lat:6.205000, lng:-75.565900 },
      { nombre:"Urb. Saltamonte Grand",           tipo:"default",  lat:6.174950, lng:-75.582600 },
      { nombre:"Urb. Balsos de Oviedo",           tipo:"default",  lat:6.195330, lng:-75.573490 },
      { nombre:"¡Hasta la Pizza, Baby! (Q Office)",tipo:"pizza",    lat:6.211790, lng:-75.566680 },
      { nombre:"Las Chachas (Envigado)",          tipo:"comida_rapida", lat:6.177100, lng:-75.586900 },
      { nombre:"Farmatodo – La Intermedia",       tipo:"farmacia", lat:6.171950, lng:-75.585980 },

      { nombre:"Trapani Pizzería (Envigado)",     tipo:"pizza",    lat:6.170800, lng:-75.583000 },
      { nombre:"Pizza Loca (Sabaneta)",           tipo:"pizza",    lat:6.151900, lng:-75.616100 },
      { nombre:"Bramante (El Poblado)",           tipo:"restaurante", lat:6.204700, lng:-75.561700 },
      { nombre:"El Coctelazo (La Nubia)",         tipo:"bar",      lat:6.198800, lng:-75.585300 },
      { nombre:"Tres Trigos – La Frontera",       tipo:"pasteleria", lat:6.176300, lng:-75.584000 },
      { nombre:"Capira – Cl. 10 #37-38",          tipo:"comida_rapida", lat:6.208900, lng:-75.568500 },
    ];
    // 👆 23 exactos

    /* ===== Storage de ajustes (NO cambies la clave si quieres conservarlos) ===== */
    const STORE_KEY = "lugares_fix_v1"; // <- tus posiciones arrastradas viven aquí
    const fixes = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    const saveFixes = () => localStorage.setItem(STORE_KEY, JSON.stringify(fixes));

    /* ===== Anti-superposición (por si dos comparten coords) ===== */
    const used = new Map();
    const nudge = (lat, lng) => {
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const c = (used.get(key) || 0) + 1; used.set(key, c);
      if (c === 1) return [lat, lng];
      const r = 0.00012 * c, ang = (c * 137.508) * Math.PI / 180; // ~13m, 26m...
      return [lat + r * Math.sin(ang), lng + r * Math.cos(ang)];
    };

    /* ===== Pintado ===== */
    const bounds = L.latLngBounds([]);
    const final = lugares.map(l => {
      const fix = fixes[l.nombre];
      return { ...l, lat: fix?.lat ?? l.lat, lng: fix?.lng ?? l.lng };
    });

    for (const l of final) {
      const [lat, lng] = nudge(l.lat, l.lng);
      const icon = makeIcon(l.tipo, l.nombre, EMOJI_OVERRIDES[l.nombre]);

      const marker = L.marker([lat, lng], {
        icon,
        draggable: true,
        autoPan: true,
      })
        .addTo(map)
        .bindPopup(`<b>${l.nombre}</b>`)
        .bindTooltip(l.nombre, { direction: "top" });

      marker.on("dragend", (e) => {
        const p = e.target.getLatLng();
        fixes[l.nombre] = { lat: p.lat, lng: p.lng };
        saveFixes();
        showToast(`Guardado: ${l.nombre} (${p.lat.toFixed(6)}, ${p.lng.toFixed(6)})`);
      });

      bounds.extend([lat, lng]);
    }

    if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
    setTimeout(() => map.invalidateSize(), 0);

    /* ===== Toolbar: Exportar / Importar / Copiar arreglo ===== */
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    const btnExport = document.createElement("button");
    btnExport.textContent = "Exportar ubicaciones (JSON)";
    const btnImport = document.createElement("button");
    btnImport.textContent = "Importar ubicaciones";
    const btnCopyArr = document.createElement("button");
    btnCopyArr.textContent = "Copiar arreglo actualizado";
    const file = document.createElement("input");
    file.type = "file"; file.accept = "application/json";

    btnExport.onclick = () => {
      const data = JSON.stringify(fixes, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const a = document.createElement("a");
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = URL.createObjectURL(blob);
      a.download = `ubicaciones-${ts}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      showToast("Descargado JSON con tus ubicaciones");
    };

    btnImport.onclick = () => file.click();
    file.onchange = () => {
      const f = file.files?.[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const obj = JSON.parse(reader.result);
          if (obj && typeof obj === "object") {
            localStorage.setItem(STORE_KEY, JSON.stringify(obj));
            showToast("Importado. Recarga la página.");
          } else {
            showToast("Archivo inválido.");
          }
        } catch {
          showToast("No se pudo leer el JSON.");
        }
      };
      reader.readAsText(f);
    };

    btnCopyArr.onclick = async () => {
      const arr = lugares.map(l => {
        const fix = fixes[l.nombre];
        const lat = (fix?.lat ?? l.lat).toFixed(6);
        const lng = (fix?.lng ?? l.lng).toFixed(6);
        return `  { nombre:${JSON.stringify(l.nombre)}, tipo:${JSON.stringify(l.tipo)}, lat:${lat}, lng:${lng} }`;
      }).join(",\n");
      const code = `const lugares = [\n${arr}\n];`;
      try {
        await navigator.clipboard.writeText(code);
        showToast("¡Copiado! Pega el arreglo en tu código.");
      } catch {
        const w = window.open("", "_blank");
        w.document.write(`<pre>${code.replace(/</g,"&lt;")}</pre>`);
        w.document.close();
        showToast("Se abrió una pestaña con el arreglo para copiar.");
      }
    };

    toolbar.append(btnExport, btnImport, btnCopyArr, file);
    map.getContainer().appendChild(toolbar);

    /* ===== Toast chiquito ===== */
    let toast; let tmo;
    function showToast(msg){
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        map.getContainer().appendChild(toast);
      }
      toast.textContent = msg;
      clearTimeout(tmo);
      tmo = setTimeout(()=> toast.remove(), 3000);
    }

    return () => { map.remove(); document.head.removeChild(style); };
  }, []);

  return (
    <div
      id="map"
      style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden", position: "relative" }}
    />
  );
}
