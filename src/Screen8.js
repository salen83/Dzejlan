import React, { useContext, useEffect, useState } from "react";
import { MatchesContext } from "./MatchesContext";

export default function Screen8() {
  const { futureMatches, rows } = useContext(MatchesContext);
  const [predictions, setPredictions] = useState([]);

  const lastN = 5; // broj poslednjih mečeva koji se uzimaju u obzir

  useEffect(() => {
    if (!futureMatches || !rows) return;

    const calcPredictions = futureMatches.map(match => {
      const { home, away } = match;

      // filtriramo zadnjih n mečeva za domaćina i gosta
      const homeGames = rows.filter(r => r.home === home || r.away === home).slice(-lastN);
      const awayGames = rows.filter(r => r.home === away || r.away === away).slice(-lastN);

      const calcGG = games => games.length 
        ? games.filter(r => {
            const [h,a] = r.full.split(":").map(Number);
            return h > 0 && a > 0;
          }).length / games.length
        : 0;

      const calcOver2 = games => games.length
        ? games.filter(r => {
            const [h,a] = r.full.split(":").map(Number);
            return h + a >= 2;
          }).length / games.length
        : 0;

      const homeGG = calcGG(homeGames);
      const awayGG = calcGG(awayGames);
      const homeOver2 = calcOver2(homeGames);
      const awayOver2 = calcOver2(awayGames);

      // istorija međusobnih susreta
      const headToHead = rows.filter(r =>
        (r.home === home && r.away === away) || (r.home === away && r.away === home)
      ).slice(-lastN);

      const h2hGG = calcGG(headToHead);
      const h2hOver2 = calcOver2(headToHead);

      // ponderisana formula: 50% domaćin/gost, 30% h2h, 20% random faktor
      const gg = Math.min(Math.round((homeGG*0.4 + awayGG*0.4 + h2hGG*0.2)*100), 100);
      const over2 = Math.min(Math.round((homeOver2*0.4 + awayOver2*0.4 + h2hOver2*0.2)*100), 100);
      const ng = 100 - gg;

      return {
        time: match.time,
        home,
        away,
        gg,
        ng,
        over2
      };
    });

    setPredictions(calcPredictions);
  }, [futureMatches, rows]);

  return (
    <div className="container">
      <h1>Napredna predikcija (Screen8 – Najteža metoda)</h1>
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
          {predictions.map((row, idx) => (
            <tr key={idx}>
              <td>{row.time}</td>
              <td>{row.home}</td>
              <td>{row.away}</td>
              <td>{row.gg}%</td>
              <td>{row.ng}%</td>
              <td>{row.over2}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
