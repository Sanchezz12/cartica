import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ========= Overrides de emojis por lugar ========= */
const EMOJI_OVERRIDES = {
  "ISAGEN (Los Balsos)": "🎾",
  "El Coctelazo (La Nubia)": "💋",
  "Tierra Alta (El Tesoro)": "🍺",
  "Bramante (El Poblado)": "🍔",
  "Los Perritos del Mono (Las Palmas)": "🌭",
  "Urb. Balsos de Oviedo": "🏡",
  "Urb. Saltamonte Grand": "🏘️",
  "Sr. Buñuelo (La 10)": "🍩",
  "Capira – Cl. 10 #37-38": "🍟"
};

/* ========= Pines por tipo ========= */
const TYPE = {
  sushi: { color: "#ff8fab", emoji: "🍣" },
  gimnasio: { color: "#7aa2ff", emoji: "🏋️" },
  cine: { color: "#ffd166", emoji: "🎬" },
  centro_comercial: { color: "#6ee7b7", emoji: "🛍️" },
  comida_rapida: { color: "#fca5a5", emoji: "🍔" },
  restaurante: { color: "#f59e0b", emoji: "🍽️" },
  pasteleria: { color: "#d8b4fe", emoji: "🧁" },
  deporte: { color: "#60a5fa", emoji: "🏟️" },
  farmacia: { color: "#93c5fd", emoji: "💊" },
  pizza: { color: "#fb7185", emoji: "🍕" },
  bar: { color: "#f472b6", emoji: "🍹" },
  default: { color: "#a3a3a3", emoji: "📍" },
};

/* ========= Ícono SVG ========= */
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
  return L.divIcon({
    className: "svg-marker",
    html,
    iconSize: [60, 78],
    iconAnchor: [30, 76],
    popupAnchor: [0, -70],
  });
};

export default function Mapa2() {
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    const map = L.map("map", { zoomControl: true }).setView([6.23, -75.57], 13);

    // TileLayer con fallback
    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    let switched = false;
    osm.on("tileerror", () => {
      if (switched) return;
      switched = true;
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap, HOT",
      }).addTo(map);
    });

    // Estilos de marcador/toolbar
    const style = document.createElement("style");
    style.innerHTML = `
      .svg-marker{position:relative}
      .marker-badge{position:relative;transform-origin:bottom center}
      .marker-badge:hover{transform:scale(1.06)}
      .marker-label{position:absolute;left:50%;transform:translateX(-50%);bottom:-18px;background:#111;color:#fff;font-size:12px;padding:2px 6px;border-radius:999px;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,.25)}
      .toolbar{position:absolute;z-index:9999;top:10px;left:10px;display:flex;gap:8px;flex-wrap:wrap}
      .toolbar button{
        all: unset; display:inline-block; cursor:pointer;
        background:#111; color:#fff; padding:8px 12px; border-radius:999px;
        font-size:12px; font-weight:700; box-shadow:0 1px 3px rgba(0,0,0,.3)
      }
      .toolbar input[type=file]{display:none}
      .toast{position:absolute;z-index:9999;top:10px;right:10px;background:#111;color:#fff;border-radius:999px;padding:8px 12px;font-size:12px;box-shadow:0 1px 3px rgba(0,0,0,.3)}
    `;
    document.head.appendChild(style);

    // ===== 23 lugares (19 con coords tuyas + 4 restantes) =====
    const lugares = [
      { nombre: "Tres Trigos – La Frontera", tipo: "pasteleria", lat: 6.185824786257377, lng: -75.5782985687256 },
      { nombre: "Tierra Alta (El Tesoro)", tipo: "restaurante", lat: 6.1972163455912535, lng: -75.55932998657228 },
      { nombre: "Bramante (El Poblado)", tipo: "restaurante", lat: 6.19798430703986, lng: -75.56085348129274 },
      { nombre: "ISAGEN (Los Balsos)", tipo: "default", lat: 6.187868898154968, lng: -75.55986642837524 },
      { nombre: "El Coctelazo (La Nubia)", tipo: "bar", lat: 6.222345169871904, lng: -75.60599505901338 },
      { nombre: "Cinépolis City Plaza", tipo: "cine", lat: 6.163744941764003, lng: -75.57368516921998 },
      { nombre: "Farmatodo – La Intermedia", tipo: "farmacia", lat: 6.164022278849558, lng: -75.56969404220582 },
      { nombre: "Urb. Saltamonte Grand", tipo: "default", lat: 6.167803648875635, lng: -75.57723104953767 },
      { nombre: "Smart Fit - La Intermedia", tipo: "gimnasio", lat: 6.172598323287917, lng: -75.56799888610841 },
      { nombre: "Capira – Cl. 10 #37-38", tipo: "comida_rapida", lat: 6.209559590472579, lng: -75.56692332029343 },
      { nombre: "Sr. Buñuelo (La 10)", tipo: "comida_rapida", lat: 6.210922156059604, lng: -75.5715662240982 },
      { nombre: "Sushi Gama (Manila)", tipo: "sushi", lat: 6.213567283099483, lng: -75.57360470294954 },
      { nombre: "Biela Bakery (Manila)", tipo: "pasteleria", lat: 6.213844594035383, lng: -75.57173788547517 },
      { nombre: "Trapani Pizzería (Envigado)", tipo: "pizza", lat: 6.163162186740615, lng: -75.5819356441498 },
      { nombre: "Arepepa (Envigado)", tipo: "comida_rapida", lat: 6.166526306163032, lng: -75.58115243911743 },
      { nombre: "Las Chachas (Envigado)", tipo: "comida_rapida", lat: 6.171502325342038, lng: -75.58726519346239 },
      { nombre: "El Bosque Era Rosado", tipo: "restaurante", lat: 6.184555486816265, lng: -75.55025339126588 },
      { nombre: "¡Hasta la Pizza, Baby! (Q Office)", tipo: "pizza", lat: 6.197642990978473, lng: -75.55650293827058 },
      { nombre: "Los Perritos del Mono (Las Palmas)", tipo: "comida_rapida", lat: 6.16547029608571, lng: -75.54496943950654 },

      // 4 restantes (como en la versión anterior)
      { nombre: "Takamar Sushi - Mall San Lucas", tipo: "sushi", lat: 6.1755, lng: -75.5668 },
      { nombre: "Viva Envigado", tipo: "centro_comercial", lat: 6.176377, lng: -75.591653 },
      { nombre: "Urb. Balsos de Oviedo", tipo: "default", lat: 6.19533, lng: -75.57349 },
      { nombre: "Pizza Loca (Sabaneta)", tipo: "pizza", lat: 6.1519, lng: -75.6161 },
    ]; // 23 ✅

    // Storage de ajustes
    const STORE_KEY = "lugares_fix_v1";
    const fixes = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    const saveFixes = () => localStorage.setItem(STORE_KEY, JSON.stringify(fixes));

    // Anti-superposición
    const used = new Map();
    const nudge = (lat, lng) => {
      const key = `${lat.toFixed(6)},${lng.toFixed(6)}`;
      const c = (used.get(key) || 0) + 1;
      used.set(key, c);
      if (c === 1) return [lat, lng];
      const r = 0.00012 * c,
        ang = (c * 137.508) * Math.PI / 180;
      return [lat + r * Math.sin(ang), lng + r * Math.cos(ang)];
    };

    const bounds = L.latLngBounds([]);

    // Toast helper
    let toast;
    let tmo;
    const showToast = (msg) => {
      if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        map.getContainer().appendChild(toast);
      }
      toast.textContent = msg;
      clearTimeout(tmo);
      tmo = setTimeout(() => toast.remove(), 3000);
    };

    // Pintado
    const final = lugares.map((l) => {
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

    // invalidateSize para que aparezca bien dentro del Paper de MUI
    const handleResize = () => map.invalidateSize();
    setTimeout(handleResize, 300);
    window.addEventListener("resize", handleResize);

    // Toolbar (export/import/copiar)
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";
    const btnExport = document.createElement("button");
    btnExport.textContent = "Exportar ubicaciones (JSON)";
    const btnImport = document.createElement("button");
    btnImport.textContent = "Importar ubicaciones";
    const btnCopyArr = document.createElement("button");
    btnCopyArr.textContent = "Copiar arreglo actualizado";
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "application/json";

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
      const arr = lugares
        .map((l) => {
          const fix = fixes[l.nombre];
          const lat = (fix?.lat ?? l.lat).toFixed(6);
          const lng = (fix?.lng ?? l.lng).toFixed(6);
          return `  { nombre:${JSON.stringify(l.nombre)}, tipo:${JSON.stringify(l.tipo)}, lat:${lat}, lng:${lng} }`;
        })
        .join(",\n");
      const code = `const lugares = [\n${arr}\n];`;
      try {
        await navigator.clipboard.writeText(code);
        showToast("¡Copiado! Pega el arreglo en tu código.");
      } catch {
        const w = window.open("", "_blank");
        w.document.write(`<pre>${code.replace(/</g, "&lt;")}</pre>`);
        w.document.close();
        showToast("Se abrió una pestaña con el arreglo para copiar.");
      }
    };

    toolbar.append(btnExport, btnImport, btnCopyArr, file);
    map.getContainer().appendChild(toolbar);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      try { document.head.removeChild(style); } catch {}
      try { toolbar.remove(); } catch {}
      map.remove();
    };
  }, []);

  return (
    <div
      id="map"
      style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }}
    />
  );
}
