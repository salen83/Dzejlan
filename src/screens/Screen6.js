import React, { useContext, useMemo } from "react";
import { MatchesContext } from "../MatchesContext";

export default function Screen6() {
  const { futureMatches, rows } = useContext(MatchesContext);

  const getLastMatches = (team, N = 5) => {
    const matches = rows
      .filter(r => r.home === team || r.away === team)
      .sort((a, b) => new Date(b.datum.split('.').reverse().join('-')) - new Date(a.datum.split('.').reverse().join('-')));
    return matches.slice(0, N);
  };

  // Izračunavanje verovatnoće NG
  const calculateProbabilities = (team) => {
    const lastMatches = getLastMatches(team);
    if (!lastMatches.length) return { NG: 0 };
    let NG = 0, totalWeight = 0;
    lastMatches.forEach((m, i) => {
      const weight = i + 1;
      const goalsHome = parseInt(m.ft.split(':')[0] || 0);
      const goalsAway = parseInt(m.ft.split(':')[1] || 0);
      if (goalsHome === 0 || goalsAway === 0) NG += weight;
      totalWeight += weight;
    });
    return { NG: Math.round((NG / totalWeight) * 100) };
  };

  const rankedMatches = useMemo(() => {
    return (futureMatches || [])
      .map(m => {
        const homeProb = calculateProbabilities(m.home);
        const awayProb = calculateProbabilities(m.away);
        return { ...m, NG: Math.round((homeProb.NG + awayProb.NG) / 2) };
      })
      .sort((a, b) => b.NG - a.NG);
  }, [futureMatches, rows]);

  const deleteRow = (index) => {
    const copy = [...futureMatches];
    copy.splice(index, 1);
    localStorage.setItem("futureMatches", JSON.stringify(copy));
  };

  return (
    <div>
      <h3>Rangiranje po NG % (opadajuće)</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Datum</th>
            <th>Vreme</th>
            <th>Liga</th>
            <th>Domacin</th>
            <th>Gost</th>
            <th>NG %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rankedMatches.map((m, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{m.datum}</td>
              <td>{m.vreme}</td>
              <td>{m.liga}</td>
              <td style={{ textAlign: 'left' }}>{m.home}</td>
              <td style={{ textAlign: 'left' }}>{m.away}</td>
              <td>{m.NG}%</td>
              <td>
                <button
                  onClick={() => deleteRow(i)}
                  style={{ padding: '0', fontSize: '10px', height: '16px', width: '16px' }}
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
