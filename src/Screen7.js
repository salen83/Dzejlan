import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";

export default function Screen7() {
  const { futureMatches, rows } = useContext(MatchesContext);
  const [ranked, setRanked] = useState({
    gg: [],
    ng: [],
    over2: []
  });

  useEffect(() => {
    if (!futureMatches || !rows) return;

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

    const safe = (t, k) =>
      t && t.total ? (t[k] / t.total) * 100 : 0;

    const all = futureMatches.map(m => {
      const h = teamStats[m.home];
      const a = teamStats[m.away];

      return {
        label: `${m.home} - ${m.away}`,
        gg: ((safe(h, "gg") + safe(a, "gg")) / 2).toFixed(1),
        ng: ((safe(h, "ng") + safe(a, "ng")) / 2).toFixed(1),
        over2: ((safe(h, "over2") + safe(a, "over2")) / 2).toFixed(1)
      };
    });

    setRanked({
      gg: [...all].sort((a, b) => b.gg - a.gg),
      ng: [...all].sort((a, b) => b.ng - a.ng),
      over2: [...all].sort((a, b) => b.over2 - a.over2)
    });
  }, [futureMatches, rows]);

  return (
    <div className="container">
      <h1>Rangiranje – Metoda 2</h1>

      <div style={{ display: "flex", gap: "30px" }}>
        {["gg", "ng", "over2"].map(type => (
          <table key={type}>
            <thead>
              <tr>
                <th>{type.toUpperCase()}</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {ranked[type].map((m, i) => (
                <tr key={i}>
                  <td>{m.label}</td>
                  <td>{m[type]}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </div>
    </div>
  );
}
