import React, { useContext } from "react";
import { MatchesContext } from "../MatchesContext";

export default function Screen'$i'() {
  const { predictions } = useContext(MatchesContext);

  const list = [...predictions]
    .filter(p => !isNaN(p.$(echo $i | awk '{print ($1==5?"gg":$1==6?"ng":$1==7?"over2":"over7")}')))
    .sort((a,b) => b.$(echo $i | awk '{print ($1==5?"gg":$1==6?"ng":$1==7?"over2":"over7")}') - a.$(echo $i | awk '{print ($1==5?"gg":$1==6?"ng":$1==7?"over2":"over7")}'));

  const probKey = $(echo $i | awk '{print ($1==5?"gg":$1==6?"ng":$1==7?"over2":"over7")}');

  return (
    <div>
      <h2>Rang {probKey.toUpperCase()} %</h2>
      <table style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{textAlign:"left"}}>#</th>
            <th style={{textAlign:"left"}}>Meč</th>
            <th style={{textAlign:"left"}}>{probKey.toUpperCase()} %</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p,i)=> {
            const prob = p[probKey];
            const bgColor = prob>80?"#c8facc":"transparent";
            return (
              <tr key={i} style={{backgroundColor:bgColor}}>
                <td style={{textAlign:"left", padding:"2px 5px"}}>{i+1}</td>
                <td style={{textAlign:"left", padding:"2px 5px"}}>{p.home} - {p.away}</td>
                <td style={{textAlign:"left", padding:"2px 5px"}}>{prob}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
