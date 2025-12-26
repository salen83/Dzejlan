import React, { useContext } from "react";
import { MatchesContext } from "../MatchesContext";

const calculateProbabilities = (team) => {
  return {
    gg: Math.random(),
    ng: Math.random(),
    twoPlus: Math.random(),
    sevenPlus: Math.random()
  };
};

export default function Screen5() {
  const { futureMatches } = useContext(MatchesContext);

  const rankedMatches = (futureMatches || []).map(m => {
    const homeProb = calculateProbabilities(m.home);
    const awayProb = calculateProbabilities(m.away);

    return {
      ...m,
      homeProb,
      awayProb
    };
  });

  return (
    <div>
      <h2>Rangirani mečevi po verovatnoći GG %</h2>
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
          {rankedMatches.map((p, i) => (
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
