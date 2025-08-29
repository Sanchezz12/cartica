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
      { nombre: "Pueblito Paisa", coords: [6.2359, -75.5751] },
      { nombre: "Jardín Botánico", coords: [6.2705, -75.5657] },
      { nombre: "Parque Arví", coords: [6.3106, -75.5036] },
      { nombre: "El Tesoro", coords: [6.1928, -75.5463] },
      { nombre: "Estadio Atanasio Girardot", coords: [6.2569, -75.5906] }
    ];

    lugares.forEach(lugar => {
      L.marker(lugar.coords).addTo(map).bindPopup(`<b>${lugar.nombre}</b>`);
    });

    return () => map.remove();
  }, []);

  return <div id="map" className="map"></div>;
}

export default Mapa2;
