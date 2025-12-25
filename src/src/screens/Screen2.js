import React, { useContext, useMemo } from "react";
import { MatchesContext } from "../MatchesContext";
import "./Screen2.css";

export default function Screen2() {
  const { rows } = useContext(MatchesContext); // koristi podatke iz Screen1

  // statistike
  const stats = useMemo(() => {
    const total = { gg: 0, ng: 0, over2: 0, over7: 0, goalsFor: 0, goalsAgainst: 0 };
    const last5 = [];

    rows.forEach((row, idx) => {
      const fullScore = row.full ? row.full.split(":") : [0, 0];
      const home = parseInt(fullScore[0] || 0);
      const away = parseInt(fullScore[1] || 0);
      const totalGoals = home + away;

      if (home > 0 && away > 0) total.gg++;
      if (home === 0 || away === 0) total.ng++;
      if (totalGoals >= 2) total.over2++;
      if (totalGoals >= 7) total.over7++;

      total.goalsFor += home;
      total.goalsAgainst += away;

      if (rows.length - idx <= 5) {
        last5.push({
          gg: home > 0 && away > 0 ? 1 : 0,
          ng: home === 0 || away === 0 ? 1 : 0,
          over2: totalGoals >= 2 ? 1 : 0,
          over7: totalGoals >= 7 ? 1 : 0,
        });
      }
    });

    const sumLast5 = last5.reduce(
      (acc, cur) => ({
        gg: acc.gg + cur.gg,
        ng: acc.ng + cur.ng,
        over2: acc.over2 + cur.over2,
        over7: acc.over7 + cur.over7,
      }),
      { gg: 0, ng: 0, over2: 0, over7: 0 }
    );

    return { total, last5: sumLast5 };
  }, [rows]);

  const avgGoals = rows.length ? (stats.total.goalsFor + stats.total.goalsAgainst) / rows.length : 0;

  return (
    <div className="container">
      <h2>Sve statistike</h2>
      <table>
        <thead>
          <tr>
            <th>RB</th>
            <th>Tim</th>
            <th>Mečeva</th>
            <th>GG %</th>
            <th>NG %</th>
            <th>2+ %</th>
            <th>7+ %</th>
            <th>Prosek golova</th>
            <th>Golovi dati</th>
            <th>Golovi primljeni</th>
            <th>GG(posl.5)</th>
            <th>NG(posl.5)</th>
            <th>2+(posl.5)</th>
            <th>7+(posl.5)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>UKUPNO</td>
            <td>{rows.length}</td>
            <td>{((stats.total.gg / rows.length) * 100).toFixed(1)}%</td>
            <td>{((stats.total.ng / rows.length) * 100).toFixed(1)}%</td>
            <td>{((stats.total.over2 / rows.length) * 100).toFixed(1)}%</td>
            <td>{((stats.total.over7 / rows.length) * 100).toFixed(1)}%</td>
            <td>{avgGoals.toFixed(2)}</td>
            <td>{stats.total.goalsFor}</td>
            <td>{stats.total.goalsAgainst}</td>
            <td>{((stats.last5.gg / 5) * 100).toFixed(1)}%</td>
            <td>{((stats.last5.ng / 5) * 100).toFixed(1)}%</td>
            <td>{((stats.last5.over2 / 5) * 100).toFixed(1)}%</td>
            <td>{((stats.last5.over7 / 5) * 100).toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}