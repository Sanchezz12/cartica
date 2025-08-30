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
      { nombre: "Takamar Sushi - Mall San Lucas", coords: [6.1806623, -75.5795], tipo: "sushi" },
      { nombre: "Gimnasio Smart Fit - La Intermedia", coords: [6.1675, -75.5919], tipo: "gimnasio" },
      { nombre: "Cinépolis City Plaza", coords: [6.1792, -75.5923], tipo: "cine" },
      { nombre: "Centro Comercial Viva Envigado", coords: [6.1763, -75.5917], tipo: "centro_comercial" },
      { nombre: "Sushi Gama", coords: [6.2040, -75.5616], tipo: "sushi" },
      { nombre: "Sr. Buñuelo", coords: [6.2041, -75.5605], tipo: "comida_rapida" },
      { nombre: "El Bosque Era Rosado", coords: [6.2045, -75.5612], tipo: "restaurante" },
      { nombre: "Gitana en las Nubes", coords: [6.2043, -75.5614], tipo: "restaurante" },
      { nombre: "Tierra Alta", coords: [6.2042, -75.5613], tipo: "restaurante" },
      { nombre: "Biela Bakery", coords: [6.2044, -75.5611], tipo: "pasteleria" },
      { nombre: "El Diamante (Estadio Atanasio Girardot)", coords: [6.2569, -75.5906], tipo: "deporte" }
    ];

    const iconos = {
      sushi: L.icon({ iconUrl: "/icons/sushi.png", iconSize: [30, 30] }),
      gimnasio: L.icon({ iconUrl: "/icons/gym.png", iconSize: [30, 30] }),
      cine: L.icon({ iconUrl: "/icons/cine.png", iconSize: [30, 30] }),
      centro_comercial: L.icon({ iconUrl: "/icons/shop.png", iconSize: [30, 30] }),
      comida_rapida: L.icon({ iconUrl: "/icons/fast_food.png", iconSize: [30, 30] }),
      restaurante: L.icon({ iconUrl: "/icons/restaurant.png", iconSize: [30, 30] }),
      pasteleria: L.icon({ iconUrl: "/icons/bakery.png", iconSize: [30, 30] }),
      deporte: L.icon({ iconUrl: "/icons/sport.png", iconSize: [30, 30] })
    };

    lugares.forEach(lugar => {
      L.marker(lugar.coords, { icon: iconos[lugar.tipo] })
        .addTo(map)
        .bindPopup(`
          <b>${lugar.nombre}</b><br/>
          <a href="https://www.google.com/maps/search/?api=1&query=${lugar.coords[0]},${lugar.coords[1]}" target="_blank">Ver en Google Maps</a>
        `);
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}

export default Mapa2;
