import React, { useState } from "react";

export default function Screen2() {
  const [rows, setRows] = useState([]);

  // Ovde ide logika za popunjavanje rows iz tabele/excela
  // Primer:
  // useEffect(() => { fetchRows(); }, []);

  return (
    <div>
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{i+1}</td>
              <td>{row.team}</td>
              <td>{row.matches}</td>
              <td>{row.gg}</td>
              <td>{row.ng}</td>
              <td>{row.twoPlus}</td>
              <td>{row.sevenPlus}</td>
              <td>{row.avgGoals}</td>
              <td>{row.goalsFor}</td>
              <td>{row.goalsAgainst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
