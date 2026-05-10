import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";

export default function Screen9() {
  const { futureMatches, rows } = useContext(MatchesContext); // Screen3 i Screen1
  const [rankedMatches, setRankedMatches] = useState([]);

  useEffect(() => {
    if (!futureMatches) return;

    // Izračunavamo najtežu metodu (isto kao Screen8)
    const calcPredictions = futureMatches.map(match => {
      const homeStats = rows.filter(r => r.home === match.home || r.away === match.home);
      const awayStats = rows.filter(r => r.home === match.away || r.away === match.away);

      const totalHome = homeStats.length || 1;
      const totalAway = awayStats.length || 1;

      const gg = Math.round(
        ((homeStats.filter(r => r.full.split(":")[0] > 0 && r.full.split(":")[1] > 0).length / totalHome) +
         (awayStats.filter(r => r.full.split(":")[0] > 0 && r.full.split(":")[1] > 0).length / totalAway)) / 2 * 100
      );

      const ng = 100 - gg;

      const over2 = Math.round(
        ((homeStats.filter(r => {
          const goals = r.full.split(":").map(x=>parseInt(x));
          return goals[0]+goals[1]>=2;
        }).length / totalHome) +
         (awayStats.filter(r => {
          const goals = r.full.split(":").map(x=>parseInt(x));
          return goals[0]+goals[1]>=2;
         }).length / totalAway)) /2 * 100
      );

      // Weighted score: može da se menja
      const score = Math.round((gg + over2) / 2); 

      return {
        label: match.home + " vs " + match.away,
        time: match.time,
        gg,
        ng,
        over2,
        score
      };
    });

    // Sortiranje po ukupnom score-u (GG+2+)
    setRankedMatches(calcPredictions.sort((a,b) => b.score - a.score));
  }, [futureMatches, rows]);

  return (
    <div className="container">
      <h1>Dashboard – Najteža predikcija (Screen9)</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Meč</th>
            <th>Vreme</th>
            <th>GG %</th>
            <th>NG %</th>
            <th>2+ %</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rankedMatches.map((m, idx) => (
            <tr key={idx} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{m.label}</td>
              <td>{m.time}</td>
              <td>
                <div style={{ background: "#ddd", width: "100%", height: "15px", borderRadius: "5px" }}>
                  <div style={{ width: m.gg + "%", background: "green", height: "100%", borderRadius: "5px" }} />
                </div>
                {m.gg}%
              </td>
              <td>
                <div style={{ background: "#ddd", width: "100%", height: "15px", borderRadius: "5px" }}>
                  <div style={{ width: m.gg + "%", background: "red", height: "100%", borderRadius: "5px" }} />
                </div>
                {m.ng}%
              </td>
              <td>
                <div style={{ background: "#ddd", width: "100%", height: "15px", borderRadius: "5px" }}>
                  <div style={{ width: m.gg + "%", background: "blue", height: "100%", borderRadius: "5px" }} />
                </div>
                {m.over2}%
              </td>
              <td>{m.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
