import React, { useContext } from "react";
import { MatchesContext } from "../MatchesContext";
import "./Screen3.css";

export default function Ponuda() {
  const { futureMatches, setFutureMatches } = useContext(MatchesContext);

  const deleteRow = (index) => {
    const copy = [...futureMatches];
    copy.splice(index, 1);
    setFutureMatches(copy);
    localStorage.setItem("futureMatches", JSON.stringify(copy));
  };

  return (
    <div>
      <input
        type="file"
        accept=".xls,.xlsx"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (evt) => {
            const XLSX = require("xlsx");
            const wb = XLSX.read(evt.target.result, { type: "binary" });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
            const newRows = data.map((r, i) => ({
              rb: futureMatches.length + i + 1,
              datum: r["datum"] || "",
              vreme: r["Time"] || "",
              liga: r["Liga"] || "",
              home: r["Home"] || "",
              away: r["Away"] || "",
            }));
            const allRows = [...futureMatches, ...newRows];
            setFutureMatches(allRows);
            localStorage.setItem("futureMatches", JSON.stringify(allRows));
          };
          reader.readAsBinaryString(file);
        }}
      />

      <table className="ponuda-table">
        <thead>
          <tr>
            <th style={{ width: '28px' }}>#</th>
            <th style={{ width: '55px' }}>Datum</th>
            <th style={{ width: '45px' }}>Vreme</th>
            <th style={{ width: '90px' }}>Liga</th>
            <th style={{ width: '40px', backgroundColor: '#d8f0d8', textAlign: 'left' }}>Domacin</th>
            <th style={{ width: '40px', backgroundColor: '#d8f0d8', textAlign: 'left' }}>Gost</th>
            <th style={{ width: '20px' }}></th>
          </tr>
        </thead>
        <tbody>
          {(futureMatches || []).map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.datum}</td>
              <td>{r.vreme}</td>
              <td>{r.liga}</td>
              <td className="team-cell">{r.home}</td>
              <td className="team-cell">{r.away}</td>
              <td>
                <button
                  onClick={() => deleteRow(i)}
                  className="delete-btn"
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
