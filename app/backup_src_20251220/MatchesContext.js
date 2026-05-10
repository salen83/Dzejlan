import React, { createContext, useState, useEffect } from "react";

export const MatchesContext = createContext();

export function MatchesProvider({ children }) {
  // SCREEN 1
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem("finishedMatches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("finishedMatches", JSON.stringify(rows));
  }, [rows]);

  // SCREEN 3 (BUDUĆI MEČEVI)
  const [futureMatches, setFutureMatches] = useState(() => {
    const saved = localStorage.getItem("futureMatches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("futureMatches", JSON.stringify(futureMatches));
  }, [futureMatches]);

  return (
    <MatchesContext.Provider
      value={{
        rows,
        setRows,
        futureMatches,
        setFutureMatches
      }}
    >
      {children}
    </MatchesContext.Provider>
  );
}
