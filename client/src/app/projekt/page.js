"use client";
import React, { useState } from "react";


const projects = [
  {
    title: "Első weboldalam",
    short: "Készítsd el saját, egyszerű bemutatkozó weboldalad HTML és CSS segítségével.",
    details: "Ebben a projektben megtanulod, hogyan hozz létre egy alapvető weboldalt HTML és CSS használatával. A cél, hogy bemutasd magad, elhelyezz egy képet, néhány sort magadról, és elérhetőségeidet. A projekt során megismerkedsz az alapvető webes szerkezettel, címekkel, bekezdésekkel, képekkel és linkekkel."
  },
  {
    title: "Első Python programom",
    short: "Írj egy egyszerű Python programot, amely bekér egy nevet és köszön neki.",
    details: "Ebben a projektben egy alap Python programot készítesz, amely bekéri a felhasználó nevét, majd kiírja: 'Szia, [név]!'. Megtanulod a bemenet (input) és a kimenet (print) használatát, valamint az alapvető változókezelést."
  },
  {
    title: "Első kódmentes weboldalam AI-val",
    short: "Készíts weboldalt kódolás nélkül, mesterséges intelligencia segítségével.",
    details: "Ebben a projektben kipróbálhatsz egy AI-alapú weboldalkészítő eszközt (pl. Wix ADI, Framer AI, vagy hasonló). A cél, hogy néhány kattintással, kódolás nélkül hozz létre egy egyszerű, személyes vagy portfólió weboldalt. Megismered a no-code eszközök előnyeit és lehetőségeit."
  }
];

const Projekt = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>Projekt Feladatok</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {projects.map((proj, idx) => (
          <li key={idx} style={{
            background: "#f8fafc",
            marginBottom: 18,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            padding: 18,
            cursor: "pointer",
            border: selected === idx ? "2px solid #1976d2" : "2px solid transparent",
            transition: "border 0.2s"
          }}
            onClick={() => setSelected(selected === idx ? null : idx)}
          >
            <h2 style={{ margin: "0 0 8px 0", color: "#1976d2" }}>{proj.title}</h2>
            <p style={{ margin: 0, color: "#444" }}>{proj.short}</p>
            {selected === idx && (
              <div style={{ marginTop: 14, color: "#222", background: "#e3f2fd", borderRadius: 6, padding: 12 }}>
                <strong>Bővebben:</strong>
                <p style={{ margin: "8px 0 0 0" }}>{proj.details}</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projekt;