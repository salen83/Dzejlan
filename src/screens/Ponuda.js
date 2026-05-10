import React, { useContext } from "react";
import { MatchesContext } from "../MatchesContext";
import * as XLSX from "xlsx";
import "./Ponuda.css";

export default function Ponuda() {
  const { futureMatches, setFutureMatches } = useContext(MatchesContext);

  // Brisanje reda
  const deleteRow = (index) => {
    const copy = [...futureMatches];
    copy.splice(index, 1);
    setFutureMatches(copy);
    localStorage.setItem("futureMatches", JSON.stringify(copy));
  };

  // Import Excel fajla
  const importExcel = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, { type: "binary" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "", raw: false });

      const newMatches = data.map((r, i) => ({
        rb: futureMatches.length + i + 1,
        datum: r["datum"] ?? "",
        vreme: r["Time"] ?? "",
        liga: r["Liga"] ?? "",
        home: r["Home"] ?? "",
        away: r["Away"] ?? "",
      }));

      const allMatches = [...futureMatches, ...newMatches];
      setFutureMatches(allMatches);
      localStorage.setItem("futureMatches", JSON.stringify(allMatches));
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept=".xls,.xlsx" onChange={importExcel} style={{ marginBottom: "10px" }} />
      <table>
        <thead>
          <tr>
            <th style={{ width: "28px" }}>#</th>
            <th style={{ width: "55px" }}>Datum</th>
            <th style={{ width: "45px" }}>Vreme</th>
            <th style={{ width: "90px" }}>Liga</th>
            <th style={{ width: "30%" }}>Domacin</th>
            <th style={{ width: "30%" }}>Gost</th>
            <th style={{ width: "18px" }}></th>
          </tr>
        </thead>
        <tbody>
          {(futureMatches || []).map((r, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{r.datum}</td>
              <td>{r.vreme}</td>
              <td>{r.liga}</td>
              <td style={{ textAlign: "left" }}>{r.home}</td>
              <td style={{ textAlign: "left" }}>{r.away}</td>
              <td>
                <button
                  onClick={() => deleteRow(i)}
                  style={{ padding: "0", fontSize: "10px", height: "16px", width: "16px" }}
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
