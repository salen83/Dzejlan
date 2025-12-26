import React, { useContext } from "react";
import { MatchesContext } from "../MatchesContext";

// Funkcija za izračunavanje verovatnoće (primer)
const calculateProbabilities = (team) => {
  // Ovde staviš svoj model predikcije
  // Za sada vraća random vrednosti između 0 i 1
  return {
    gg: Math.random(),
    ng: Math.random(),
    twoPlus: Math.random(),
    sevenPlus: Math.random()
  };
};

export default function Screen4() {
  const { futureMatches } = useContext(MatchesContext);

  const predictions = (futureMatches || []).map(match => {
    const homeProb = calculateProbabilities(match.home);
    const awayProb = calculateProbabilities(match.away);

    return {
      ...match,
      homeProb,
      awayProb
    };
  });

  return (
    <div>
      <h2>Predikcije budućih mečeva</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Datum</th>
            <th>Vreme</th>
            <th>Liga</th>
            <th>Domacin</th>
            <th>Gost</th>
            <th>GG</th>
            <th>NG</th>
            <th>2+</th>
            <th>7+</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((p, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{p.datum}</td>
              <td>{p.vreme}</td>
              <td>{p.liga}</td>
              <td>{p.home}</td>
              <td>{p.away}</td>
              <td>{(p.homeProb.gg + p.awayProb.gg) / 2}</td>
              <td>{(p.homeProb.ng + p.awayProb.ng) / 2}</td>
              <td>{(p.homeProb.twoPlus + p.awayProb.twoPlus) / 2}</td>
              <td>{(p.homeProb.sevenPlus + p.awayProb.sevenPlus) / 2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
