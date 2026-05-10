import React, { useState, useEffect } from "react";
import "./Screen2.css";

// Primer podataka – kasnije se puni iz Screen1 ili baze
const sampleTeamsData = [
  {
    name: "Barcelona",
    matches: [
      { league: "La Liga", ft: "3:1", gg: true, ng: false, plus2: true, plus7: false },
      { league: "Champions League", ft: "2:0", gg: false, ng: true, plus2: true, plus7: false },
      { league: "Copa del Rey", ft: "1:1", gg: true, ng: false, plus2: false, plus7: false },
    ],
  },
  {
    name: "Real Madrid",
    matches: [
      { league: "La Liga", ft: "2:2", gg: true, ng: false, plus2: true, plus7: false },
      { league: "Champions League", ft: "1:0", gg: false, ng: true, plus2: false, plus7: false },
    ],
  },
];

export default function Screen2() {
  const [teams, setTeams] = useState([]);
  const [expanded, setExpanded] = useState({}); // koji tim je otvoren za prikaz detalja

  useEffect(() => {
    // U praksi ovo se dobija iz Screen1 ili baze
    setTeams(sampleTeamsData.map(team => {
      const totalMatches = team.matches.length;
      const ggCount = team.matches.filter(m => m.gg).length;
      const ngCount = team.matches.filter(m => m.ng).length;
      const plus2Count = team.matches.filter(m => m.plus2).length;
      const plus7Count = team.matches.filter(m => m.plus7).length;
      const goalsFor = team.matches.reduce((acc, m) => acc + parseInt(m.ft.split(":")[0]), 0);
      const goalsAgainst = team.matches.reduce((acc, m) => acc + parseInt(m.ft.split(":")[1]), 0);
      return {
        name: team.name,
        totalMatches,
        ggPerc: ((ggCount / totalMatches) * 100).toFixed(1),
        ngPerc: ((ngCount / totalMatches) * 100).toFixed(1),
        plus2Perc: ((plus2Count / totalMatches) * 100).toFixed(1),
        plus7Perc: ((plus7Count / totalMatches) * 100).toFixed(1),
        avgGoals: (goalsFor + goalsAgainst) / totalMatches,
        goalsFor,
        goalsAgainst,
        matches: team.matches,
      };
    }));
  }, []);

  const toggleDetails = (teamName) => {
    setExpanded(prev => ({ ...prev, [teamName]: !prev[teamName] }));
  };

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
          {teams.map((team, index) => (
            <React.Fragment key={team.name}>
              <tr onClick={() => toggleDetails(team.name)}>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>{team.totalMatches}</td>
                <td>{team.ggPerc}</td>
                <td>{team.ngPerc}</td>
                <td>{team.plus2Perc}</td>
                <td>{team.plus7Perc}</td>
                <td>{team.avgGoals.toFixed(1)}</td>
                <td>{team.goalsFor}</td>
                <td>{team.goalsAgainst}</td>
              </tr>
              {expanded[team.name] && (
                <tr>
                  <td colSpan="10">
                    <div style={{ background: "#f9f9f9", padding: "5px", fontSize: "12px" }}>
                      <strong>Zadnjih 5 mečeva:</strong>
                      <ul>
                        {team.matches.slice(-5).map((m, i) => (
                          <li key={i}>
                            [{m.league}] FT: {m.ft}, GG: {m.gg ? "✔" : "✖"}, NG: {m.ng ? "✔" : "✖"}, 2+: {m.plus2 ? "✔" : "✖"}, 7+: {m.plus7 ? "✔" : "✖"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
