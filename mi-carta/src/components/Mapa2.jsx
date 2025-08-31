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

    // ====== Pines SVG (sin assets) ======
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

    // ====== Datos con direcciones afinadas ======
    const lugares = [
      { nombre: "Takamar Sushi - Mall San Lucas", tipo: "sushi",
        dir: "Calle 20 Sur #27-55, Medellín, Antioquia, Colombia",
        poi: "Takamar Sushi Mall San Lucas Medellín"
      },
      { nombre: "Smart Fit - La Intermedia", tipo: "gimnasio",
        dir: "Carrera 27 #23 Sur-241, Envigado, Antioquia, Colombia",
        poi: "Smart Fit La Intermedia Envigado"
      },
      { nombre: "Cinépolis City Plaza", tipo: "cine",
        dir: "Calle 36D Sur #27A, Envigado, Antioquia, Colombia",
        poi: "Cinépolis City Plaza Envigado"
      },
      { nombre: "Viva Envigado", tipo: "centro_comercial",
        dir: "Carrera 48 #32B Sur-139, Envigado, Antioquia, Colombia",
        poi: "Centro Comercial Viva Envigado"
      },
      { nombre: "Sushi Gama (Manila)", tipo: "sushi",
        dir: "Calle 11A #43F-5, Medellín, Antioquia, Colombia",
        poi: "Sushi Gama Manila Medellín"
      },
      { nombre: "Sr. Buñuelo (La 10)", tipo: "comida_rapida",
        dir: "Calle 10 #43C-35, Medellín, Antioquia, Colombia",
        poi: "Sr Buñuelo Calle 10 43C-35 Medellín"
      },
      { nombre: "El Bosque Era Rosado", tipo: "restaurante",
        dir: "Calle 16A Sur #9E-150, Medellín, Antioquia, Colombia",
        poi: "El Bosque Era Rosado Medellín Los Balsos"
      },
      { nombre: "Gitana en las Nubes", tipo: "restaurante",
        dir: "Transversal de la Montaña Km 0.3, Envigado, Antioquia, Colombia",
        poi: "Gitana en las Nubes Envigado"
      },
      { nombre: "Tierra Alta (El Tesoro)", tipo: "restaurante",
        dir: "Centro Comercial El Tesoro, Carrera 25A #1A Sur-45, Medellín, Antioquia, Colombia",
        poi: "Tierra Alta Restaurante El Tesoro Medellín"
      },
      { nombre: "Biela Bakery (Manila)", tipo: "pasteleria",
        dir: "Calle 11A #43F-5, Medellín, Antioquia, Colombia",
        poi: "Biela Bakery Manila Medellín"
      },
      { nombre: "Estadio Atanasio Girardot", tipo: "deporte",
        dir: "Calle 57 #42-1, Medellín, Antioquia, Colombia",
        poi: "Estadio Atanasio Girardot"
      }
    ];

    // ====== Geocoder multiproveedor con bias Medellín ======
    const VIEWBOX = { left: -75.70, top: 6.39, right: -75.50, bottom: 6.15 }; // (lon1, lat1, lon2, lat2)
    const HEADERS = {
      "Accept-Language": "es",
      "User-Agent": "mapita-bonito/1.0 (contacto: email@dominio.com)"
    };
    const BIAS = { lon: -75.57, lat: 6.23 }; // centro Poblado/Envigado

    async function hitNominatim(query, structured = false) {
      const url = structured
        ? `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1&${query}`
        : `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=0&countrycodes=co&viewbox=${VIEWBOX.left},${VIEWBOX.top},${VIEWBOX.right},${VIEWBOX.bottom}&bounded=1&q=${encodeURIComponent(query)}`;
      const r = await fetch(url, { headers: HEADERS });
      if (!r.ok) return null;
      const j = await r.json();
      if (!j || !j.length) return null;
      return [parseFloat(j[0].lat), parseFloat(j[0].lon)];
    }

    async function hitPhoton(q) {
      // bias por Medellín; lang es, filtro por Colombia
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lang=es&limit=1&lon=${BIAS.lon}&lat=${BIAS.lat}`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const j = await r.json();
      if (!j || !j.features || !j.features.length) return null;
      const [lon, lat] = j.features[0].geometry.coordinates;
      // filtro bruto por país si viene en properties
      if (j.features[0].properties?.countrycode && j.features[0].properties.countrycode !== "CO") return null;
      return [lat, lon];
    }

    async function geocodePOIFirst({ poi, dir }) {
      // 1) Nominatim por POI
      let coords = await hitNominatim(poi, false);
      if (coords) return coords;

      // 2) Photon por POI
      coords = await hitPhoton(poi);
      if (coords) return coords;

      // 3) Nominatim structured por dirección (street+city+state+country)
      const city = /Envigado/i.test(dir) ? "Envigado" : "Medellín";
      const street = dir.replace(/,\s*(Medellín|Envigado).*$/i, "");
      const structured = `street=${encodeURIComponent(street)}&city=${encodeURIComponent(city)}&state=${encodeURIComponent("Antioquia")}&country=${encodeURIComponent("Colombia")}`;
      coords = await hitNominatim(structured, true);
      if (coords) return coords;

      // 4) Nominatim libre por dirección
      coords = await hitNominatim(dir, false);
      if (coords) return coords;

      // 5) Photon libre por dirección
      coords = await hitPhoton(dir);
      if (coords) return coords;

      return null;
    }

    let cancelled = false;
    const bounds = L.latLngBounds([]);

    (async () => {
      for (const l of lugares) {
        if (cancelled) break;

        // respeta a Nominatim: 1.1s entre llamadas a él
        const t0 = performance.now();
        const coords = await geocodePOIFirst(l).catch(() => null);
        const elapsed = performance.now() - t0;
        if (coords) {
          L.marker(coords, { icon: makePrettyIcon(l.tipo, l.nombre) })
            .addTo(map)
            .bindPopup(
              `<b>${l.nombre}</b><br/><small>${l.dir}</small><br/>
               <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                 `${l.nombre} ${l.dir}`
               )}" target="_blank" rel="noopener">Ver en Google Maps</a>`
            )
            .bindTooltip(l.nombre, { direction: "top" });
          bounds.extend(coords);
          console.log("OK:", l.nombre, coords);
        } else {
          console.warn("NO ENCONTRADO:", l.nombre, "-", l.dir);
        }

        // espera para no pasar el rate de Nominatim (cuenta solo si tardó poco)
        const minGap = 1150;
        if (elapsed < minGap) await new Promise((r) => setTimeout(r, minGap - elapsed));
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
