import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";
import Screen2 from "./Screen2";

export default function Screen4() {
  const { futureMatches, rows } = useContext(MatchesContext); // rows = zavrseni mecevi (Screen1)
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!futureMatches || futureMatches.length === 0) {
      setPredictions([]);
      return;
    }

    // Kreiramo mapu statistike timova iz Screen2
    const teamsStats = {};
    rows.forEach(row => {
      const home = row.home;
      const away = row.away;
      const full = row.full;
      if (!home || !away || !full) return;
      const goals = full.split(":").map(x => parseInt(x, 10));
      if (goals.length !== 2) return;

      [home, away].forEach(team => {
        if (!teamsStats[team]) {
          teamsStats[team] = { total: 0, gg: 0, ng: 0, over2: 0 };
        }
      });

      teamsStats[home].total += 1;
      teamsStats[away].total += 1;

      // GG: oba tima daju gol
      if (goals[0] > 0 && goals[1] > 0) {
        teamsStats[home].gg += 1;
        teamsStats[away].gg += 1;
      }

      // NG: bar jedan tim ne daje gol
      if (goals[0] === 0 || goals[1] === 0) {
        teamsStats[home].ng += 1;
        teamsStats[away].ng += 1;
      }

      // 2+: ukupno golova >= 2
      if (goals[0] + goals[1] >= 2) {
        teamsStats[home].over2 += 1;
        teamsStats[away].over2 += 1;
      }
    });

    const preds = futureMatches.map(match => {
      const homeStats = teamsStats[match.home] || { total: 0, gg: 0, ng: 0, over2: 0 };
      const awayStats = teamsStats[match.away] || { total: 0, gg: 0, ng: 0, over2: 0 };

      const totalMatches = homeStats.total + awayStats.total || 1; // izbegavamo deljenje nulom

      return {
        time: match.time,
        home: match.home,
        away: match.away,
        gg: Math.round((homeStats.gg + awayStats.gg) / totalMatches * 100),
        ng: Math.round((homeStats.ng + awayStats.ng) / totalMatches * 100),
        over2: Math.round((homeStats.over2 + awayStats.over2) / totalMatches * 100)
      };
    });

    setPredictions(preds);
  }, [futureMatches, rows]);

  return (
    <div className="container">
      <h1>Predikcije (Metoda 1)</h1>
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
          {predictions.map((m, i) => (
            <tr key={i}>
              <td>{m.time}</td>
              <td>{m.home}</td>
              <td>{m.away}</td>
              <td>{m.gg}%</td>
              <td>{m.ng}%</td>
              <td>{m.over2}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
