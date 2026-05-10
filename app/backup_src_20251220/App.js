import React, { useState } from "react";
import Screen1 from "./Screen1";
import Screen2 from "./Screen2";
import Screen3 from "./Screen3";
import Screen4 from "./Screen4";
import Screen5 from "./Screen5";
import Screen6 from "./Screen6";
import Screen7 from "./Screen7";
import Screen8 from "./Screen8";
import Screen9 from "./Screen9";
import Screen10 from "./Screen10";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("screen1");

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setCurrentScreen("screen1")}>Screen1</button>
        <button onClick={() => setCurrentScreen("screen2")}>Screen2</button>
        <button onClick={() => setCurrentScreen("screen3")}>Screen3</button>
        <button onClick={() => setCurrentScreen("screen4")}>Screen4</button>
        <button onClick={() => setCurrentScreen("screen5")}>Screen5</button>
        <button onClick={() => setCurrentScreen("screen6")}>Screen6</button>
        <button onClick={() => setCurrentScreen("screen7")}>Screen7</button>
        <button onClick={() => setCurrentScreen("screen8")}>Screen8</button>
        <button onClick={() => setCurrentScreen("screen9")}>Screen9</button>
        <button onClick={() => setCurrentScreen("screen10")}>Screen10</button>
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
      {currentScreen === "screen10" && <Screen10 />}
    </>
  );
}
