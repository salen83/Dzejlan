import React, { useState, useEffect } from "react";

function Table() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("matchesData");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("matchesData", JSON.stringify(data));
  }, [data]);

  const addRow = () => {
    setData([...data, { team1: "", team2: "", score1: "", score2: "" }]);
  };

  const deleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  const updateCell = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  return (
    <div>
      <button onClick={addRow}>Dodaj red</button>
      <table border="1" style={{ borderCollapse: "collapse", marginTop: "10px" }}>
        <thead>
          <tr>
            <th>Team 1</th>
            <th>Team 2</th>
            <th>Score 1</th>
            <th>Score 2</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td><input value={row.team1} onChange={(e) => updateCell(i, "team1", e.target.value)} /></td>
              <td><input value={row.team2} onChange={(e) => updateCell(i, "team2", e.target.value)} /></td>
              <td><input value={row.score1} onChange={(e) => updateCell(i, "score1", e.target.value)} /></td>
              <td><input value={row.score2} onChange={(e) => updateCell(i, "score2", e.target.value)} /></td>
              <td><button onClick={() => deleteRow(i)}>Izbriši red</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
