import React, { useState } from "react";
import "./App.css";
import { MatchesProvider } from "./MatchesContext";

import Screen1 from "./screens/Screen1";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";
import Screen4 from "./screens/Screen4";
import Screen5 from "./screens/Screen5";
import Screen6 from "./screens/Screen6";
import Screen7 from "./screens/Screen7";
import Screen8 from "./screens/Screen8";
import Screen9 from "./screens/Screen9";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("screen1");

  return (
    <MatchesProvider>
      <div className="container">
        <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
          <button onClick={() => setCurrentScreen("screen1")}>Završeni</button>
          <button onClick={() => setCurrentScreen("screen2")}>Sve statistike</button>
          <button onClick={() => setCurrentScreen("screen3")}>Screen3</button>
          <button onClick={() => setCurrentScreen("screen4")}>Screen4</button>
          <button onClick={() => setCurrentScreen("screen5")}>Screen5</button>
          <button onClick={() => setCurrentScreen("screen6")}>Screen6</button>
          <button onClick={() => setCurrentScreen("screen7")}>Screen7</button>
          <button onClick={() => setCurrentScreen("screen8")}>Screen8</button>
          <button onClick={() => setCurrentScreen("screen9")}>Screen9</button>
        </div>
        <div className="screen">
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
      </div>
    </MatchesProvider>
  );
}
