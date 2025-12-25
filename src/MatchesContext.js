import React, { createContext, useState } from "react";

export const MatchesContext = createContext();

export function MatchesProvider({ children }) {
  // Ovo su završeni mečevi (Screen1)
  const [rows, setRows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rows")) || [];
    } catch {
      return [];
    }
  });

  // Čuvanje u localStorage kad se menja
  React.useEffect(() => {
    localStorage.setItem("rows", JSON.stringify(rows));
  }, [rows]);

  // Budući mečevi (Screen3+)
  const [futureMatches, setFutureMatches] = useState([]);

  return (
    <MatchesContext.Provider value={{ rows, setRows, futureMatches, setFutureMatches }}>
      {children}
    </MatchesContext.Provider>
  );
}
