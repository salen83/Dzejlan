import React, { useContext, useMemo } from "react";
import { MatchesContext } from "../MatchesContext";

export default function Screen4() {
  const { rows, teamStats, futureMatches } = useContext(MatchesContext);

  // Funkcija za uzimanje poslednjih N mečeva tima
  const getLastMatches = (team, N = 5) => {
    const matches = rows
      .filter(r => r.home === team || r.away === team)
      .sort((a,b) => new Date(b.datum.split('.').reverse().join('-')) - new Date(a.datum.split('.').reverse().join('-')));
    return matches.slice(0, N);
  };

  // Računanje verovatnoće GG, NG, 2+, 7+ za dati tim
  const calculateProbabilities = (team) => {
    const lastMatches = getLastMatches(team);
    if (!lastMatches.length) return { GG: 0, NG: 0, "2+": 0, "7+": 0 };

    let GG = 0, NG = 0, twoPlus = 0, sevenPlus = 0;
    let totalWeight = 0;

    lastMatches.forEach((m, i) => {
      const weight = i+1; // noviji meč = veća težina
      const goalsHome = parseInt(m.ft.split(':')[0] || 0);
      const goalsAway = parseInt(m.ft.split(':')[1] || 0);
      const totalGoals = goalsHome + goalsAway;

      // GG
      if (goalsHome > 0 && goalsAway > 0) GG += weight;
      // NG
      if (goalsHome === 0 || goalsAway === 0) NG += weight;
      // 2+
      if (totalGoals >= 2) twoPlus += weight;
      // 7+
      if (totalGoals >= 7) sevenPlus += weight;

      totalWeight += weight;
    });

    return {
      GG: Math.round((GG / totalWeight) * 100),
      NG: Math.round((NG / totalWeight) * 100),
      "2+": Math.round((twoPlus / totalWeight) * 100),
      "7+": Math.round((sevenPlus / totalWeight) * 100)
    };
  };

  // Kombinovanje verovatnoća za buduće mečeve
  const predictions = useMemo(() => {
    return (futureMatches || []).map(match => {
      const homeProb = calculateProbabilities(match.home);
      const awayProb = calculateProbabilities(match.away);

      // Prosek domaćin/gost
      return {
        ...match,
        GG: Math.round((homeProb.GG + awayProb.GG)/2),
        NG: Math.round((homeProb.NG + awayProb.NG)/2),
        "2+": Math.round((homeProb["2+"] + awayProb["2+"])/2),
        "7+": Math.round((homeProb["7+"] + awayProb["7+"])/2)
      };
    });
  }, [futureMatches, rows]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{ width:'28px' }}>#</th>
            <th style={{ width:'80px' }}>Datum</th>
            <th style={{ width:'60px' }}>Vreme</th>
            <th style={{ width:'120px' }}>Liga</th>
            <th style={{ width:'120px' }}>Domacin</th>
            <th style={{ width:'120px' }}>Gost</th>
            <th style={{ width:'40px' }}>x</th>
            <th>GG %</th>
            <th>NG %</th>
            <th>2+ %</th>
            <th>7+ %</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((m, i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{m.datum}</td>
              <td>{m.vreme}</td>
              <td>{m.liga}</td>
              <td style={{ textAlign:'left' }}>{m.home}</td>
              <td style={{ textAlign:'left' }}>{m.away}</td>
              <td>
                <button
                  onClick={() => {
                    const copy = [...futureMatches];
                    copy.splice(i,1);
                    localStorage.setItem("futureMatches", JSON.stringify(copy));
                    window.location.reload();
                  }}
                  style={{ padding:'0', fontSize:'10px', height:'16px', width:'16px' }}
                >
                  x
                </button>
              </td>
              <td>{m.GG}%</td>
              <td>{m.NG}%</td>
              <td>{m["2+"]}%</td>
              <td>{m["7+"]}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}