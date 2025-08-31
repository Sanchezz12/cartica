import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

// Lee la key de .env (Vite/CRA/Next)
const GOOGLE_KEY =
  process.env.REACT_APP_GOOGLE_MAPS_KEY ||
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  "<PON_AQUI_TU_API_KEY_DE_GOOGLE>"; // reemplaza si no usas .env

// Sesgo a Medellín/Envigado
const LOCATION_BIAS = { lat: 6.23, lng: -75.57 };
const BOUNDS_SW = { lat: 6.05, lng: -75.75 };
const BOUNDS_NE = { lat: 6.35, lng: -75.35 };

// Pin SVG (bonito, sin assets)
const pinSvg = (emoji = "📍", color = "#ff7aa2") =>
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
      <defs>
        <filter id='s' x='-50%' y='-50%' width='200%' height='200%'>
          <feDropShadow dx='0' dy='2' stdDeviation='3' flood-opacity='.35'/>
        </filter>
      </defs>
      <g filter='url(#s)'>
        <path d='M32 6c-10 0-18 8-18 18 0 14 18 32 18 32s18-18 18-32c0-10-8-18-18-18z' fill='${color}' stroke='#c84e7b' stroke-width='2'/>
        <circle cx='32' cy='24' r='9' fill='white'/>
        <text x='32' y='28' text-anchor='middle' font-size='14'>${emoji}</text>
      </g>
    </svg>`
  );

const ICONS = {
  sushi: pinSvg("🍣", "#ff8fab"),
  gimnasio: pinSvg("🏋️", "#7aa2ff"),
  cine: pinSvg("🎬", "#ffd166"),
  centro_comercial: pinSvg("🛍️", "#6ee7b7"),
  comida_rapida: pinSvg("🍔", "#fca5a5"),
  restaurante: pinSvg("🍽️", "#f59e0b"),
  pasteleria: pinSvg("🧁", "#d8b4fe"),
  deporte: pinSvg("🏟️", "#60a5fa"),
  farmacia: pinSvg("💊", "#93c5fd"),
  pizza: pinSvg("🍕", "#fb7185"),
  bar: pinSvg("🍹", "#f472b6"),
  default: pinSvg("📍", "#a3a3a3"),
};

export default function Mapa2Google() {
  const mapRef = useRef(null);
  const inited = useRef(false);

  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    const loader = new Loader({
      apiKey: GOOGLE_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    let map;
    let info;

    const CACHE_KEY = "gmaps_geo_cache_v1";
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    const saveCache = () => localStorage.setItem(CACHE_KEY, JSON.stringify(cache));

    const lugares = [
      // ——— Tus 11 originales ———
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
      // ——— Nuevos (por dirección, como pediste) ———
      { nombre:"Arepepa (Envigado)", tipo:"comida_rapida", direccion:"Cl. 37 Sur #31-55, Envigado, Antioquia, Colombia" },
      { nombre:"Los Perritos del Mono (Las Palmas)", tipo:"comida_rapida", direccion:"Mirador de Las Palmas, Medellín, Antioquia, Colombia" },
      { nombre:"ISAGEN (Los Balsos)", tipo:"default", direccion:"Transversal Inferior, Cra. 30 #10C-280, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Urb. Saltamonte Grand", tipo:"default", direccion:"Carrera 27G #35 Sur, Envigado, Antioquia, Colombia" },
      { nombre:"Urb. Balsos de Oviedo", tipo:"default", direccion:"Carrera 42 #7A Sur-92, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"¡Hasta la Pizza, Baby! (Q Office)", tipo:"pizza", direccion:"Cl. 2 #20-50, Q Office, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Las Chachas (Envigado)", tipo:"comida_rapida", direccion:"Cra. 43 #36 Sur-17, Zona 9, Envigado, Antioquia, Colombia" },
      { nombre:"Calle de la Buena Mesa (Sushi World)", tipo:"sushi", direccion:"Calle 37 Sur, Envigado, Antioquia, Colombia" },
      { nombre:"Farmatodo (La Intermedia)", tipo:"farmacia", direccion:"Cra. 27 #36 Sur-199, Envigado, Antioquia, Colombia" },
      { nombre:"Trapani Pizzería (Envigado)", tipo:"pizza", direccion:"Cl. 39B Sur #29A-37, Envigado, Antioquia, Colombia" },
      { nombre:"Pizza Loca (Sabaneta)", tipo:"pizza", direccion:"Cra. 43B #70 Sur-48, Sabaneta, Antioquia, Colombia" },
      { nombre:"Bramante (El Poblado)", tipo:"restaurante", direccion:"Cra. 29C #3B Sur-70, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Casa Verde Miel (Llanogrande)", tipo:"restaurante", direccion:"Km 1, Llanogrande - Rionegro, Rionegro, Antioquia, Colombia" },
      { nombre:"El Coctelazo (La Nubia)", tipo:"bar", direccion:"Cra. 83 #15A-21, Medellín, Antioquia, Colombia" },
      { nombre:"Tres Trigos – La Frontera", tipo:"pasteleria", direccion:"Cra. 43A #18 Sur-84, El Poblado, Medellín, Antioquia, Colombia" },
      { nombre:"Capira – Cl. 10 #37-38", tipo:"comida_rapida", direccion:"Cl. 10 #37-38, El Poblado, Medellín, Antioquia, Colombia" },
    ];

    const addMarker = (g, place) => {
      const icon = {
        url: ICONS[place.tipo] || ICONS.default,
        scaledSize: new g.Size(42, 42),
        anchor: new g.Point(21, 40),
      };
      const marker = new g.Marker({
        position: { lat: place.lat, lng: place.lng },
        map,
        title: place.nombre,
        icon,
      });
      marker.addListener("click", () => {
        info.setContent(
          `<div style="min-width:200px">
            <b>${place.nombre}</b><br/>
            <small>${place.direccion || ""}</small>
          </div>`
        );
        info.open(map, marker);
      });
      return marker;
    };

    // Buscar con Places (TextSearch) y fallback a Geocoder; sesgo local fuerte
    const findCoords = async (g, query) => {
      const k = query.trim();
      if (cache[k]) return cache[k];

      const svc = new g.places.PlacesService(map);

      const textRes = await new Promise((resolve) => {
        svc.textSearch(
          {
            query: k,
            location: LOCATION_BIAS,
            radius: 35000, // 35 km alrededor de Medellín
            region: "co",
          },
          (results, status) => {
            if (status === g.places.PlacesServiceStatus.OK && results && results[0]) {
              const r = results[0].geometry?.location;
              if (r) return resolve({ lat: r.lat(), lng: r.lng(), src: "places-text" });
            }
            resolve(null);
          }
        );
      });
      if (textRes) {
        cache[k] = textRes; saveCache();
        return textRes;
      }

      // fallback: Geocoding
      const geocoder = new g.Geocoder();
      const geoRes = await new Promise((resolve) => {
        geocoder.geocode(
          {
            address: k,
            region: "co",
            bounds: new g.LatLngBounds(BOUNDS_SW, BOUNDS_NE),
            componentRestrictions: { country: "CO" },
          },
          (results, status) => {
            if (status === "OK" && results && results[0]) {
              const r = results[0].geometry?.location;
              if (r) return resolve({ lat: r.lat(), lng: r.lng(), src: "geocode" });
            }
            resolve(null);
          }
        );
      });
      if (geoRes) {
        cache[k] = geoRes; saveCache();
        return geoRes;
      }
      throw new Error("Sin resultados");
    };

    const boot = async () => {
      const g = await loader.load();
      if (!GOOGLE_KEY || GOOGLE_KEY.startsWith("<")) {
        console.error("⚠️ Falta GOOGLE_KEY");
      }

      map = new g.maps.Map(mapRef.current, {
        center: LOCATION_BIAS,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      info = new g.maps.InfoWindow();

      const bounds = new g.maps.LatLngBounds();
      const markers = [];

      // 1) pinta primero los que YA están en caché (carga ultrarrápida)
      const pendientes = [];
      for (const l of lugares) {
        const key = l.direccion || l.nombre;
        const hit = cache[key];
        if (hit) {
          markers.push(addMarker(g.maps, { ...l, lat: hit.lat, lng: hit.lng }));
          bounds.extend(new g.maps.LatLng(hit.lat, hit.lng));
        } else {
          pendientes.push(l);
        }
      }
      if (!bounds.isEmpty()) map.fitBounds(bounds);

      // 2) resuelve el resto en paralelo, con concurrencia controlada
      let i = 0;
      const pool = 8;
      const worker = async () => {
        while (i < pendientes.length) {
          const idx = i++;
          const l = pendientes[idx];
          const key = l.direccion || l.nombre;
          try {
            const hit = await findCoords(g.maps, key);
            markers.push(addMarker(g.maps, { ...l, lat: hit.lat, lng: hit.lng }));
            bounds.extend(new g.maps.LatLng(hit.lat, hit.lng));
          } catch (e) {
            console.warn("No geocodificado:", key);
          }
        }
      };
      await Promise.all(Array.from({ length: pool }, worker));
      if (!bounds.isEmpty()) map.fitBounds(bounds);
    };

    boot();

    return () => {
      // Google Maps limpia solo al desmontar
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{ height: 640, width: "100%", borderRadius: 14, overflow: "hidden" }}
    />
  );
}

