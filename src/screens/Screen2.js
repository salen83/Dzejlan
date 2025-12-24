import React, { useContext, useMemo } from "react";
import { MatchesContext } from "../MatchesContext";
import "./Screen2.css";

export default function Screen2() {
  const { rows } = useContext(MatchesContext);

  const calculateStats = (rows) => {
    const teams = {};
    rows.forEach(r => {
      if (!teams[r.home]) teams[r.home] = { games: 0, goalsFor: 0, goalsAgainst: 0, GG: 0, NG: 0, twoPlus: 0, sevenPlus: 0 };
      if (!teams[r.away]) teams[r.away] = { games: 0, goalsFor: 0, goalsAgainst: 0, GG: 0, NG: 0, twoPlus: 0, sevenPlus: 0 };

      const [homeGoals, awayGoals] = (r.ft || "0:0").split(":").map(Number);

      teams[r.home].games += 1;
      teams[r.away].games += 1;

      teams[r.home].goalsFor += homeGoals;
      teams[r.home].goalsAgainst += awayGoals;

      teams[r.away].goalsFor += awayGoals;
      teams[r.away].goalsAgainst += homeGoals;

      if (homeGoals > 0 && awayGoals > 0) {
        teams[r.home].GG += 1;
        teams[r.away].GG += 1;
      }

      if (homeGoals === 0 || awayGoals === 0) {
        teams[r.home].NG += 1;
        teams[r.away].NG += 1;
      }

      if (homeGoals + awayGoals >= 2) {
        teams[r.home].twoPlus += 1;
        teams[r.away].twoPlus += 1;
      }

      if (homeGoals + awayGoals >= 7) {
        teams[r.home].sevenPlus += 1;
        teams[r.away].sevenPlus += 1;
      }
    });
    return teams;
  };

  const teamStats = useMemo(() => calculateStats(rows || []), [rows]);

  return (
    <div>
      <h2>Statistika timova</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tim</th>
            <th>Mečeva</th>
            <th>Golovi dati</th>
            <th>Golovi primljeni</th>
            <th>GG %</th>
            <th>NG %</th>
            <th>2+ %</th>
            <th>7+ %</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(teamStats).map(([team, stats], index) => (
            <tr key={team}>
              <td>{index + 1}</td>
              <td>{team}</td>
              <td>{stats.games}</td>
              <td>{stats.goalsFor}</td>
              <td>{stats.goalsAgainst}</td>
              <td>{((stats.GG / stats.games) * 100).toFixed(0)}%</td>
              <td>{((stats.NG / stats.games) * 100).toFixed(0)}%</td>
              <td>{((stats.twoPlus / stats.games) * 100).toFixed(0)}%</td>
              <td>{((stats.sevenPlus / stats.games) * 100).toFixed(0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
