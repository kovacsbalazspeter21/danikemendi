"use client";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { use } from "react";
import { useState } from "react";

// Feltételezve, hogy a komponensek külön oldalként vannak route-olva (pl. /train, /test, stb.)

// ...existing code...

function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        zIndex: 1000,
      }}
    >
      <button
        className={`${styles.hamburgerBtn} ${open ? styles.hamburgerOpen : ""}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menü megnyitása"
      >
        <span className={styles.hamburgerIcon}>
          <span className={styles.top}></span>
          <span className={styles.bottom}></span>
        </span>
      </button>
      {/* Menü tartalom */}
      {open && (
        <div className={styles.hamburgerMenuBox}>
          <Link href="/ai" className={styles.hamburgerMenuLink}>
            <Image src="/ai.svg" alt="AI" width={28} height={28} style={{ opacity: 0.8 }} />
            AI Asszisztens
          </Link>
        </div>
      )}
    </div>
  );
}

const modules = [
  {
    name: "Tanfolyam",
    href: "/train",
    icon: "/train.svg",
    desc: "Tanulj új technológiákat, leckék és útmutatók."
  },
  {
    name: "Teszt",
    href: "/test",
    icon: "/test.svg",
    desc: "Teszteld tudásod interaktív feladatokkal."
  },
  {
    name: "Projektek",
    href: "/projekt",
    icon: "/projekt.svg",
    desc: "Gyakorlati projektek, valós feladatok."
  },
  {
    name: "Hírek",
    href: "/news",
    icon: "/news.svg",
    desc: "Friss tech hírek a nagyvilágból."
  },
  {
    name: "Frissítések",
    href: "/update",
    icon: "/update.svg",
    desc: "Az oldal újdonságai, fejlesztések."
  },
  {
    name: "Profil",
    href: "/profile",
    icon: "/profile.svg",
    desc: "Személyes adatok, beállítások."
  }
];

export default function Home() {

 const [aiResponse, setAiResponse] = useState('');

  const testAI = async () => {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Hello, AI!" },
    ];
    
    try {
      const response = await fetch('./api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      
      const data = await response.json();
      setAiResponse(data.result);
      console.log(data.result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles.page}>
      <HamburgerMenu />
      <main className={styles.main}>
        <h1 style={{ margin: "32px 0 24px 0", textAlign: "center" }}>
          Tanulási Platform Modulok
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 1fr)",
            gap: 28,
            maxWidth: 900,
            margin: "0 auto 40px auto"
          }}
        >
          {modules.map((mod, idx) => (
            <Link href={mod.href} key={mod.name} style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: "#f7fafd",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  padding: 28,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer",
                  minHeight: 180
                }}
              >
                
                <h2 style={{ margin: "0 0 10px 0", color: "#1976d2" }}>{mod.name}</h2>
                <p style={{ margin: 0, color: "#444", textAlign: "center" }}>{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      
    </div>
  );
}