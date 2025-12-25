import React, { useContext, useMemo } from "react";
import { MatchesContext } from "../MatchesContext";

export default function Screen5() {
  const { futureMatches, rows } = useContext(MatchesContext);

  // Uzmi poslednjih N mečeva za dati tim
  const getLastMatches = (team, N = 5) => {
    const matches = rows
      .filter(r => r.home === team || r.away === team)
      .sort((a, b) => new Date(b.datum.split('.').reverse().join('-')) - new Date(a.datum.split('.').reverse().join('-')));
    return matches.slice(0, N);
  };

  // Izračunavanje verovatnoće GG
  const calculateProbabilities = (team) => {
    const lastMatches = getLastMatches(team);
    if (!lastMatches.length) return { GG: 0 };
    let GG = 0, totalWeight = 0;
    lastMatches.forEach((m, i) => {
      const weight = i + 1;
      const goalsHome = parseInt(m.ft.split(':')[0] || 0);
      const goalsAway = parseInt(m.ft.split(':')[1] || 0);
      if (goalsHome > 0 && goalsAway > 0) GG += weight;
      totalWeight += weight;
    });
    return { GG: Math.round((GG / totalWeight) * 100) };
  };

  // Rangiranje budućih mečeva po GG %
  const rankedMatches = useMemo(() => {
    return (futureMatches || [])
      .map(m => {
        const homeProb = calculateProbabilities(m.home);
        const awayProb = calculateProbabilities(m.away);
        return { ...m, GG: Math.round((homeProb.GG + awayProb.GG) / 2) };
      })
      .sort((a, b) => b.GG - a.GG);
  }, [futureMatches, rows]);

  // Brisanje reda
  const deleteRow = (index) => {
    const copy = [...futureMatches];
    copy.splice(index, 1);
    localStorage.setItem("futureMatches", JSON.stringify(copy));
  };

  return (
    <div>
      <h3>Rangiranje po GG % (opadajuće)</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Datum</th>
            <th>Vreme</th>
            <th>Liga</th>
            <th>Domacin</th>
            <th>Gost</th>
            <th>GG %</th>
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
              <td>{m.GG}%</td>
              <td>
                <button
                  onClick={() => {
                    deleteRow(i);
                  }}
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