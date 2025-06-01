import React from "react";


const updates = [
  {
    title: "Új Tech Hírek oldal",
    date: "2025-05-27",
    description: "Elindult a Tech Hírek oldal, ahol naprakész információkat találsz a legnagyobb technológiai cégekről."
  },
  {
    title: "Tanfolyam oldal hozzáadva",
    date: "2025-05-26",
    description: "Elérhető a tanfolyam oldal, ahol különböző témákban tanulhatsz és fejlődhetsz."
  },
  {
    title: "Teszt felület elérhető",
    date: "2025-05-25",
    description: "Mostantól tesztelheted tudásod a teszt felületen keresztül."
  },
  {
    title: "Projekt oldal indulása",
    date: "2025-05-24",
    description: "A projekt oldal segít gyakorlati tapasztalatot szerezni különböző fejlesztési feladatokon keresztül."
  },
  {
    title: "Modern dizájn és reszponzív felület",
    date: "2025-05-23",
    description: "Az oldal megújult, letisztult és mobilbarát dizájnt kapott."
  }
];

const Update = () => (
  <div style={{ maxWidth: 700, margin: "0 auto", padding: 24 }}>
    <h1 style={{ textAlign: "center", marginBottom: 32 }}>Frissítések & Újdonságok</h1>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {updates.map((item, idx) => (
        <li key={idx} style={{
          background: "#f1f7fa",
          marginBottom: 18,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: 18
        }}>
          <h2 style={{ margin: "0 0 6px 0", color: "#1976d2" }}>{item.title}</h2>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>
            {item.date}
          </div>
          <p style={{ margin: 0 }}>{item.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default Update;