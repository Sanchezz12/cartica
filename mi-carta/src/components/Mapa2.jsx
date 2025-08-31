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
      { nombre: "Takamar Sushi - Mall San Lucas", direccion: "Calle 20 Sur #27-55, Medellín, Colombia", tipo: "sushi" },
      { nombre: "Gimnasio Smart Fit - La Intermedia", direccion: "Carrera 27 #23 Sur-241, El Esmeraldal, Envigado, Antioquia, Colombia", tipo: "gimnasio" },
      { nombre: "Cinépolis City Plaza", direccion: "Calle 36D Sur #27A, El Escobero, Envigado, Antioquia, Colombia", tipo: "cine" },
      { nombre: "Centro Comercial Viva Envigado", direccion: "Carrera 48 #32B Sur-139, Envigado, Antioquia, Colombia", tipo: "centro_comercial" },
      { nombre: "Sushi Gama", direccion: "Calle 11A #43F-5, Barrio Manila, El Poblado, Medellín, Colombia", tipo: "sushi" },
      { nombre: "Sr. Buñuelo", direccion: "Calle 33 #42B-06, La Candelaria, Medellín, Colombia", tipo: "comida_rapida" },
      { nombre: "El Bosque Era Rosado", direccion: "Calle 16A Sur #9E-150, Los Balsos, El Poblado, Medellín, Colombia", tipo: "restaurante" },
      { nombre: "Gitana en las Nubes", direccion: "Km 0.3, Transversal de la Montaña, Envigado, Antioquia, Colombia", tipo: "restaurante" },
      { nombre: "Tierra Alta", direccion: "Calle 11A #43F-5, Barrio Manila, El Poblado, Medellín, Colombia", tipo: "restaurante" },
      { nombre: "Biela Bakery", direccion: "Calle 11A #43F-5, Barrio Manila, El Poblado, Medellín, Colombia", tipo: "pasteleria" },
      { nombre: "Estadio Atanasio Girardot", direccion: "Calle 57 #42-1, Medellín, Antioquia, Colombia", tipo: "deporte" }
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
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lugar.direccion)}`;
      fetch(geocodeUrl)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            L.marker(coords, { icon: iconos[lugar.tipo] })
              .addTo(map)
              .bindPopup(`
                <b>${lugar.nombre}</b><br/>
                <a href="https://www.google.com/maps/search/?api=1&query=${coords[0]},${coords[1]}" target="_blank">Ver en Google Maps</a>
              `);
          } else {
            console.warn(`No se encontraron coordenadas para: ${lugar.nombre}`);
          }
        })
        .catch(error => console.error(`Error al geooocodificar ${lugar.nombre}:`, error));
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ height: "600px", width: "100%" }}></div>;
}

export default Mapa2;
