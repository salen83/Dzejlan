import React, { useRef, useContext } from "react";
import { MatchesContext } from "./MatchesContext";

const columns = ["time", "home", "away"];

export default function Screen3() {
  const { futureMatches, setFutureMatches } = useContext(MatchesContext);

  const pasteRef = useRef(null);
  const pastePosition = useRef({ row: 0, col: 0 });

  const emptyRow = () => ({ time: "", home: "", away: "" });

  const focusPaste = (r, c) => {
    pastePosition.current = { row: r, col: c };
    pasteRef.current.focus();
  };

  const handlePaste = e => {
    const text = e.target.value;
    if (!text) return;

    const lines = text.trim().split(/\r?\n/);
    const newRows = [...futureMatches];
    const { row, col } = pastePosition.current;

    lines.forEach((line, i) => {
      const values = line.split("\t");
      const rIndex = row + i;

      if (!newRows[rIndex]) newRows[rIndex] = emptyRow();

      values.forEach((val, j) => {
        const key = columns[col + j];
        if (key) newRows[rIndex][key] = val;
      });
    });

    setFutureMatches(newRows);
    e.target.value = "";
  };

  const updateCell = (r, key, val) => {
    const copy = [...futureMatches];
    copy[r][key] = val;
    setFutureMatches(copy);
  };

  const deleteRow = r => {
    const copy = [...futureMatches];
    copy.splice(r, 1);
    setFutureMatches(copy);
  };

  return (
    <div className="container">
      <h1>Mozzart ponuda</h1>

      <button onClick={() => setFutureMatches([...futureMatches, emptyRow()])}>
        Dodaj red
      </button>

      <textarea
        ref={pasteRef}
        onChange={handlePaste}
        style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
      />

      <table>
        <thead>
          <tr>
            <th>Vreme</th>
            <th>Domaćin</th>
            <th>Gost</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          {futureMatches.map((row, r) => (
            <tr key={r}>
              {columns.map((col, c) => (
                <td key={c}>
                  <input
                    value={row[col]}
                    onChange={e => updateCell(r, col, e.target.value)}
                    onFocus={() => focusPaste(r, c)}
                  />
                </td>
              ))}
              <td>
                <button onClick={() => deleteRow(r)}>Obriši</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
