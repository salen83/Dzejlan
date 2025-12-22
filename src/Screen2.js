import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";

export default function Screen2() {
  const { rows } = useContext(MatchesContext);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const teamsMap = {};

    rows.forEach(row => {
      const home = row.home;
      const away = row.away;
      const fullScore = row.full;
      if (!home || !away || !fullScore) return;
      const goals = fullScore.split(":").map(x => parseInt(x, 10));
      if (goals.length !== 2) return;

      [home, away].forEach(team => {
        if (!teamsMap[team]) {
          teamsMap[team] = { team, total: 0, gg: 0, ng: 0, over2: 0 };
        }
      });

      teamsMap[home].total += 1;
      teamsMap[away].total += 1;

      if (goals[0] > 0 && goals[1] > 0) {
        teamsMap[home].gg += 1;
        teamsMap[away].gg += 1;
      }
      if (goals[0] === 0 || goals[1] === 0) {
        teamsMap[home].ng += 1;
        teamsMap[away].ng += 1;
      }
      if (goals[0] + goals[1] >= 2) {
        teamsMap[home].over2 += 1;
        teamsMap[away].over2 += 1;
      }
    });

    const statsArr = Object.values(teamsMap).map(team => ({
      ...team,
      ggPerc: team.total ? ((team.gg / team.total) * 100).toFixed(1) : 0,
      ngPerc: team.total ? ((team.ng / team.total) * 100).toFixed(1) : 0,
      over2Perc: team.total ? ((team.over2 / team.total) * 100).toFixed(1) : 0,
    }));

    setStats(statsArr);
  }, [rows]);

  return (
    <div className="container">
      <h1>Statistika timova</h1>
      <table>
        <thead>
          <tr>
            <th>Tim</th>
            <th>Ukupno utakmica</th>
            <th>GG</th>
            <th>NG</th>
            <th>2+</th>
            <th>% GG</th>
            <th>% NG</th>
            <th>% 2+</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((team, idx) => (
            <tr key={idx}>
              <td>{team.team}</td>
              <td>{team.total}</td>
              <td>{team.gg}</td>
              <td>{team.ng}</td>
              <td>{team.over2}</td>
              <td>{team.ggPerc}%</td>
              <td>{team.ngPerc}%</td>
              <td>{team.over2Perc}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
