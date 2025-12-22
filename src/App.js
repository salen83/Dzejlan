import React, { useState } from "react";
import "./App.css";

import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen4 from "./Screen4";
import Screen5 from "./Screen5";
import Screen6 from "./Screen6";
import Screen7 from "./Screen7";
import Screen8 from "./Screen8";
import Screen9 from "./Screen9";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("screen1");

  return (
    <div className="container">
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setCurrentScreen("screen1")}>Završeni</button>
        <button onClick={() => setCurrentScreen("screen2")}>Statistika</button>
        <button onClick={() => setCurrentScreen("screen3")}>Ponuda</button>
        <button onClick={() => setCurrentScreen("screen4")}>Metoda 1</button>
        <button onClick={() => setCurrentScreen("screen5")}>Rang M1</button>
        <button onClick={() => setCurrentScreen("screen6")}>Metoda 2</button>
        <button onClick={() => setCurrentScreen("screen7")}>Rang M2</button>
        <button onClick={() => setCurrentScreen("screen8")}>Metoda 3</button>
        <button onClick={() => setCurrentScreen("screen9")}>Dashboard</button>
      </div>

      {currentScreen === "screen1" && <Screen1 />}
      {currentScreen === "screen2" && <Screen2 />}
      {currentScreen === "screen3" && <Screen3 />}
      {currentScreen === "screen4" && <Screen4 />}
      {currentScreen === "screen5" && <Screen5 />}
      {currentScreen === "screen6" && <Screen6 />}
      {currentScreen === "screen7" && <Screen7 />}
      {currentScreen === "screen8" && <Screen8 />}
      {currentScreen === "screen9" && <Screen9 />}
    </div>
  );
}
