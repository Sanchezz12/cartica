import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Mapa2() {
  useEffect(() => {
    const map = L.map("map").setView([6.2442, -75.5812], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    const lugares = [
  { nombre: "Takamar Sushi - Mall San Lucas", coords: [6.1806623, -75.5795] },
  { nombre: "Gimnasio Smart Fit - La Intermedia", coords: [6.1675, -75.5919] },
  { nombre: "Cinépolis City Plaza", coords: [6.1792, -75.5923] },
  { nombre: "Centro Comercial Viva Envigado", coords: [6.1763, -75.5917] },
  { nombre: "Calle de la Buena Mesa (Sushi World, Canibal, Sushi Roll Up, El Barral)", coords: [6.1764, -75.5918] },
  { nombre: "Sushi Gama", coords: [6.2040, -75.5616] },
  { nombre: "Sr. Buñuelo", coords: [6.2041, -75.5605] },
  { nombre: "El Bosque Era Rosado", coords: [6.2045, -75.5612] },
  { nombre: "Gitana en las Nubes", coords: [6.2043, -75.5614] },
  { nombre: "Tierra Alta", coords: [6.2042, -75.5613] },
  { nombre: "Biela Bakery", coords: [6.2044, -75.5611] },
  { nombre: "El Diamante (Estadio Atanasio Girardot)", coords: [6.2569, -75.5906] }
];

    lugares.forEach(lugar => {
      L.marker(lugar.coords).addTo(map).bindPopup(`<b>${lugar.nombre}</b>`);
    });

    return () => map.remove();
  }, []);

  return <div id="map" className="map"></div>;
}

export default Mapa2;
