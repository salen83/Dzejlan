import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";

export default function Screen6() {
  const { futureMatches, rows } = useContext(MatchesContext);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!futureMatches || !rows) return;

    // statistika po timu iz Screen2 logike
    const teamStats = {};

    rows.forEach(r => {
      if (!r.home || !r.away || !r.full) return;
      const g = r.full.split(":").map(Number);
      if (g.length !== 2) return;

      [r.home, r.away].forEach(t => {
        if (!teamStats[t]) {
          teamStats[t] = { total: 0, gg: 0, ng: 0, over2: 0 };
        }
      });

      teamStats[r.home].total++;
      teamStats[r.away].total++;

      if (g[0] > 0 && g[1] > 0) {
        teamStats[r.home].gg++;
        teamStats[r.away].gg++;
      }

      if (g[0] === 0 || g[1] === 0) {
        teamStats[r.home].ng++;
        teamStats[r.away].ng++;
      }

      if (g[0] + g[1] >= 2) {
        teamStats[r.home].over2++;
        teamStats[r.away].over2++;
      }
    });

    const calc = futureMatches.map(m => {
      const h = teamStats[m.home];
      const a = teamStats[m.away];

      const safe = (x, y) => (x && x.total ? (y / x.total) * 100 : 0);

      const gg =
        (safe(h, h?.gg || 0) + safe(a, a?.gg || 0)) / 2;
      const ng =
        (safe(h, h?.ng || 0) + safe(a, a?.ng || 0)) / 2;
      const over2 =
        (safe(h, h?.over2 || 0) + safe(a, a?.over2 || 0)) / 2;

      return {
        time: m.time,
        home: m.home,
        away: m.away,
        gg: gg.toFixed(1),
        ng: ng.toFixed(1),
        over2: over2.toFixed(1)
      };
    });

    setPredictions(calc);
  }, [futureMatches, rows]);

  return (
    <div className="container">
      <h1>Predviđanja – Metoda 2 (Tim vs Tim)</h1>
      <table>
        <thead>
          <tr>
            <th>Vreme</th>
            <th>Domaćin</th>
            <th>Gost</th>
            <th>GG %</th>
            <th>NG %</th>
            <th>2+ %</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((r, i) => (
            <tr key={i}>
              <td>{r.time}</td>
              <td>{r.home}</td>
              <td>{r.away}</td>
              <td>{r.gg}%</td>
              <td>{r.ng}%</td>
              <td>{r.over2}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
