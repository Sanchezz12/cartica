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

    // ===== Pines SVG lindos (sin assets) =====
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

    // ===== Lugares (con nombre + dirección) =====
    const lugares = [
      { nombre:"Takamar Sushi - Mall San Lucas", tipo:"sushi", dir:"Calle 20 Sur #27-55, Medellín, Antioquia, Colombia" },
      { nombre:"Smart Fit - La Intermedia", tipo:"gimnasio", dir:"Carrera 27 #23 Sur-241, Envigado, Antioquia, Colombia" },
      { nombre:"Cinépolis City Plaza", tipo:"cine", dir:"Calle 36D Sur #27A, Envigado, Antioquia, Colombia" },
      { nombre:"Viva Envigado", tipo:"centro_comercial", dir:"Carrera 48 #32B Sur-139, Envigado, Antioquia, Colombia" },
      { nombre:"Sushi Gama (Manila)", tipo:"sushi", dir:"Calle 11A #43F-5, Medellín, Antioquia, Colombia" },
      { nombre:"Sr. Buñuelo (La 10)", tipo:"comida_rapida", dir:"Calle 10 #43C-35, Medellín, Antioquia, Colombia" },
      { nombre:"El Bosque Era Rosado", tipo:"restaurante", dir:"Calle 16A Sur #9E-150, Medellín, Antioquia, Colombia" },
      { nombre:"Gitana en las Nubes", tipo:"restaurante", dir:"Transversal de la Montaña Km 0.3, Envigado, Antioquia, Colombia" },
      { nombre:"Tierra Alta (El Tesoro)", tipo:"restaurante", dir:"Centro Comercial El Tesoro, Carrera 25A #1A Sur-45, Medellín, Antioquia, Colombia" },
      { nombre:"Biela Bakery (Manila)", tipo:"pasteleria", dir:"Calle 11A #43F-5, Medellín, Antioquia, Colombia" },
      { nombre:"Estadio Atanasio Girardot", tipo:"deporte", dir:"Calle 57 #42-1, Medellín, Antioquia, Colombia" }
    ];

    // ===== Constantes de geocodio =====
    const BIAS = { lat: 6.23, lon: -75.57 };        // Poblado/Envigado
    const RADIUS_M = 20000;                         // 20 km alrededor
    const VIEWBOX = { left:-75.70, top:6.39, right:-75.50, bottom:6.15 };
    const HEADERS = { "Accept-Language":"es", "User-Agent":"mapita-bonito/1.0 (mailto:you@example.com)" };
    const NOMI_GAP = 1200;
    let lastNominatim = 0;

    // ===== Cache (30 días) =====
    const CACHE_KEY = "geo_cache_v2"; const TTL = 30*24*60*60*1000;
    const cache = (()=>{ try{return JSON.parse(localStorage.getItem(CACHE_KEY)||"{}");}catch{return{}}})();
    const save = ()=>{ try{localStorage.setItem(CACHE_KEY, JSON.stringify(cache));}catch{} };
    const getC = (k)=> cache[k] && (Date.now()-cache[k].t<TTL) ? cache[k].v : null;
    const setC = (k,v)=> (cache[k]={v,t:Date.now()}, save());

    // ===== Utilidades =====
    const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
    const withinView = ([lat,lon]) => lon>=VIEWBOX.left&&lon<=VIEWBOX.right&&lat>=VIEWBOX.bottom&&lat<=VIEWBOX.top;
    const jitter = (()=>{ const used=new Map();
      return ([lat,lon])=>{ const key=`${lat.toFixed(6)},${lon.toFixed(6)}`; const c=(used.get(key)||0)+1; used.set(key,c);
        if(c===1) return [lat,lon]; const r=0.00012*c, ang=(c*137.508)*Math.PI/180; return [lat+r*Math.sin(ang), lon+r*Math.cos(ang)];
      };
    })();

    // ====== Overpass (POI por nombre cerca de Medellín) ======
    // tags comunes de negocios/POI
    const TAGS = ['amenity','shop','leisure','tourism','sport','building','name'];
    async function overpassByName(name){
      const q = `
        [out:json][timeout:25];
        (
          node[~"^(${TAGS.join("|")})$"~"."](around:${RADIUS_M},${BIAS.lat},${BIAS.lon})["name"~"${name}",i];
          way [ "name"~"${name}",i ](around:${RADIUS_M},${BIAS.lat},${BIAS.lon});
          rel [ "name"~"${name}",i ](around:${RADIUS_M},${BIAS.lat},${BIAS.lon});
        );
        out center 1;`;
      const r = await fetch("https://overpass-api.de/api/interpreter", {
        method:"POST", body:q, headers:{ "Content-Type":"text/plain" }
      });
      if(!r.ok) return null;
      const j = await r.json();
      if(!j?.elements?.length) return null;
      const e = j.elements[0];
      const lat = e.lat ?? e.center?.lat, lon = e.lon ?? e.center?.lon;
      return (lat&&lon) ? [lat,lon] : null;
    }

    // ====== Photon primero (nombre/dir) ======
    async function photon(q){
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lang=es&limit=1&lon=${BIAS.lon}&lat=${BIAS.lat}`;
      const r = await fetch(url);
      if(!r.ok) return null;
      const j = await r.json();
      const f = j?.features?.[0]; if(!f) return null;
      if (f.properties?.countrycode && f.properties.countrycode !== "CO") return null;
      const [lon,lat]=f.geometry.coordinates; return [lat,lon];
    }

    // ====== Nominatim con throttle global ======
    async function throttledNominatim(url){
      const now = Date.now(); const wait = Math.max(0, NOMI_GAP-(now-lastNominatim));
      if(wait) await sleep(wait);
      lastNominatim = Date.now();
      const r = await fetch(url,{ headers:HEADERS }); if(!r.ok) return null;
      const j = await r.json(); const it = j?.[0]; if(!it) return null;
      return [parseFloat(it.lat), parseFloat(it.lon)];
    }
    async function nominatimFree(q){
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&q=${encodeURIComponent(q)}&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1`;
      return throttledNominatim(url);
    }
    async function nominatimStructured(dir){
      const city = /Envigado/i.test(dir) ? "Envigado" : "Medellín";
      const street = dir.replace(/,\s*(Medellín|Envigado).*$/i, "");
      const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent("Antioquia")}&country=Colombia&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1`;
      return throttledNominatim(url);
    }

    // ====== Orquestador con cache ======
    async function geocodeOne({nombre, dir}) {
      const key = `name:${nombre}|dir:${dir}`;
      const c = getC(key); if (c) return c;

      // 1) Overpass por nombre (POI real)
      let coords = await overpassByName(nombre);
      // 2) Photon (nombre -> dirección)
      if(!coords) coords = await photon(nombre);
      if(!coords) coords = await photon(dir);
      // 3) Nominatim (structured -> libre, siempre throttled)
      if(!coords) coords = await nominatimStructured(dir);
      if(!coords) coords = await nominatimFree(dir);

      if (coords && withinView(coords)) { setC(key, coords); }
      return coords;
    }

    // ====== Pintado ======
    const bounds = L.latLngBounds([]);
    (async ()=>{
      for (const l of lugares) {
        let coords = await geocodeOne(l);
        if (coords) {
          coords = jitter(coords); // evito que se tapen
          L.marker(coords, { icon: makePrettyIcon(l.tipo, l.nombre) })
            .addTo(map)
            .bindPopup(`<b>${l.nombre}</b><br/><small>${l.dir}</small><br/>
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.nombre} ${l.dir}`)}" target="_blank" rel="noopener">Ver en Google Maps</a>`)
            .bindTooltip(l.nombre, { direction:"top" });
          bounds.extend(coords);
          console.log("OK:", l.nombre, coords);
        } else {
          console.warn("NO ENCONTRADO:", l.nombre);
        }
      }
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.15));
      setTimeout(()=>map.invalidateSize(),0);
    })();

    return ()=>{ map.remove(); document.head.removeChild(style); };
  }, []);

  return <div id="map" style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }} />;
}

export default Mapa2;
