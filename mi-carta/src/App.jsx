import React from "react";
import Carta from "./components/Carta";
import Mapa2 from "./components/Mapa2";
import "./index.css";

function App() {
  return (
    <div className="app">
      <header className="header">🌸 Una carta para mi niña🌸</header>
      <Carta />
      <Mapa2 />
      <footer className="footer">Hecho con 💕 desde Medellín</footer>
    </div>
  );
}

export default App;