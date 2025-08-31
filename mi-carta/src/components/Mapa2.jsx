import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Mapa2() {
  const [lugaresConCoords, setLugaresConCoords] = useState([]);

  useEffect(() => {
    const map = L.map("map").setView([6.2442, -75.5812], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
    }).addTo(map);

    const lugares = [
      { nombre: "Takamar Sushi - Mall San Lucas", direccion: "Mall San Lucas, Medellín, Colombia", tipo: "sushi" },
      { nombre: "Gimnasio Smart Fit - La Intermedia", direccion: "La Intermedia, Medellín, Colombia", tipo: "gimnasio" },
      { nombre: "Cinépolis City Plaza", direccion: "City Plaza, Medellín, Colombia", tipo: "cine" },
      { nombre: "Centro Comercial Viva Envigado", direccion: "Viva Envigado, Envigado, Colombia", tipo: "centro_comercial" },
      { nombre: "Sushi Gama", direccion: "Sushi Gama, Medellín, Colombia", tipo: "sushi" },
      { nombre: "Sr. Buñuelo", direccion: "Sr. Buñuelo, Medellín, Colombia", tipo: "comida_rapida" },
      { nombre: "El Bosque Era Rosado", direccion: "El Bosque Era Rosado, Medellín, Colombia", tipo: "restaurante" },
      { nombre: "Gitana en las Nubes", direccion: "Gitana en las Nubes, Medellín, Colombia", tipo: "restaurante" },
      { nombre: "Tierra Alta", direccion: "Tierra Alta, Medellín, Colombia", tipo: "restaurante" },
      { nombre: "Biela Bakery", direccion: "Biela Bakery, Medellín, Colombia", tipo: "pasteleria" },
      { nombre: "El Diamante (Estadio Atanasio Girardot)", direccion: "Estadio Atanasio Girardot, Medellín, Colombia", tipo: "deporte" }
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

    // Función para geocodificar con Nominatim
    const fetchCoords = async (lugar) => {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lugar.direccion)}`);
      const data = await res.json();
      if (data.length > 0) {
        return { ...lugar, coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)] };
      } else {
        console.warn("No se encontró coords para:", lugar.nombre);
        return null;
      }
    };

    // Geocodificar todos los lugares
    Promise.all(lugares.map(fetchCoords)).then(results => {
      const validResults = results.filter(r => r !== null);
      setLugaresConCoords(validResults);

      // Agregar markers
      validResults.forEach(lugar => {
        L.marker(lugar.coords, { icon: iconos[lugar.tipo] })
          .addTo(map)
          .bindPopup(`
            <b>${lugar.nombre}</b><br/>
            <a href="https://www.google.com/maps/search/?api=1&query=${lugar.coords[0]},${lugar.coords[1]}" target="_blank">Ver en Google Maps</a>
          `);
      });
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}

export default Mapa2;

