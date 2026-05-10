import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";

export default function Screen5() {
  const { futureMatches, rows } = useContext(MatchesContext);
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (!futureMatches || futureMatches.length === 0) {
      setPredictions([]);
      return;
    }

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

      if (goals[0] > 0 && goals[1] > 0) {
        teamsStats[home].gg += 1;
        teamsStats[away].gg += 1;
      }
      if (goals[0] === 0 || goals[1] === 0) {
        teamsStats[home].ng += 1;
        teamsStats[away].ng += 1;
      }
      if (goals[0] + goals[1] >= 2) {
        teamsStats[home].over2 += 1;
        teamsStats[away].over2 += 1;
      }
    });

    const preds = futureMatches.map(match => {
      const homeStats = teamsStats[match.home] || { total: 0, gg: 0, ng: 0, over2: 0 };
      const awayStats = teamsStats[match.away] || { total: 0, gg: 0, ng: 0, over2: 0 };
      const totalMatches = homeStats.total + awayStats.total || 1;

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

  const sortByGG = [...predictions].sort((a,b) => b.gg - a.gg);
  const sortByNG = [...predictions].sort((a,b) => b.ng - a.ng);
  const sortByOver2 = [...predictions].sort((a,b) => b.over2 - a.over2);

  return (
    <div className="container">
      <h1>Rangirani mečevi po verovatnoći</h1>
      <div style={{ display: "flex", gap: "20px", justifyContent: "space-between" }}>
        {/* GG */}
        <table>
          <thead>
            <tr><th colSpan={4}>GG %</th></tr>
            <tr><th>Vreme</th><th>Domaćin</th><th>Gost</th><th>GG %</th></tr>
          </thead>
          <tbody>
            {sortByGG.map((m,i) => (
              <tr key={i}><td>{m.time}</td><td>{m.home}</td><td>{m.away}</td><td>{m.gg}%</td></tr>
            ))}
          </tbody>
        </table>

        {/* NG */}
        <table>
          <thead>
            <tr><th colSpan={4}>NG %</th></tr>
            <tr><th>Vreme</th><th>Domaćin</th><th>Gost</th><th>NG %</th></tr>
          </thead>
          <tbody>
            {sortByNG.map((m,i) => (
              <tr key={i}><td>{m.time}</td><td>{m.home}</td><td>{m.away}</td><td>{m.ng}%</td></tr>
            ))}
          </tbody>
        </table>

        {/* 2+ */}
        <table>
          <thead>
            <tr><th colSpan={4}>2+ %</th></tr>
            <tr><th>Vreme</th><th>Domaćin</th><th>Gost</th><th>2+ %</th></tr>
          </thead>
          <tbody>
            {sortByOver2.map((m,i) => (
              <tr key={i}><td>{m.time}</td><td>{m.home}</td><td>{m.away}</td><td>{m.over2}%</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
