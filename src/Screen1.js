import React, { useState } from 'react';

export default function Screen1() {
  const [rows, setRows] = useState([
    { rb: 1, datum: '21.12.2025', vreme: '20:00', home: 'Team A', away: 'Team B', ft: 2, ht: 1, sh: 0 },
    { rb: 2, datum: '22.12.2025', vreme: '18:30', home: 'Team C', away: 'Team D', ft: 1, ht: 0, sh: 1 }
  ]);

  const deleteRow = (i) => {
    const newRows = [...rows];
    newRows.splice(i, 1);
    newRows.forEach((r, idx) => r.rb = idx + 1);
    setRows(newRows);
  };

  return (
    <div>
      <table style={{ borderCollapse: 'collapse', width: '100%', backgroundColor: 'lightblue' }}>
        <thead>
          <tr>
            <th style={{ width: '30px', color: 'red' }}>RB</th>
            <th style={{ width: '80px' }}>Datum</th>
            <th style={{ width: '60px' }}>Vreme</th>
            <th style={{ width: '120px' }}>Home</th>
            <th style={{ width: '120px' }}>Away</th>
            <th style={{ width: '40px' }}>FT</th>
            <th style={{ width: '40px' }}>HT</th>
            <th style={{ width: '40px' }}>SH</th>
            <th style={{ width: '30px' }}>x</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ height: '24px', fontSize: '12px', lineHeight: '12px' }}>
              <td style={{ color: 'red' }}>{row.rb}</td>
              <td>{row.datum}</td>
              <td>{row.vreme}</td>
              <td>{row.home}</td>
              <td>{row.away}</td>
              <td>{row.ft}</td>
              <td>{row.ht}</td>
              <td>{row.sh}</td>
              <td>
                <button style={{ padding: '0', fontSize: '10px', lineHeight: '10px', height: '16px' }} onClick={() => deleteRow(i)}>x</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
