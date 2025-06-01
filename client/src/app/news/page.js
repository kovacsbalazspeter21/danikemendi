import React from "react";

const techNews = [
  {
    title: "Google bemutatja az új AI fejlesztéseit",
    source: "Google",
    link: "https://blog.google/technology/ai/",
    date: "2025-05-27",
    summary: "A Google új AI modelleket és fejlesztéseket jelentett be a fejlesztői konferencián."
  },
  {
    title: "Apple új iPhone-t jelentett be",
    source: "Apple",
    link: "https://www.apple.com/newsroom/",
    date: "2025-05-26",
    summary: "Az Apple bemutatta a legújabb iPhone-t, amely forradalmi kamerával érkezik."
  },
  {
    title: "Samsung új Galaxy készüléket dob piacra",
    source: "Samsung",
    link: "https://news.samsung.com/global/",
    date: "2025-05-25",
    summary: "A Samsung bemutatta a Galaxy széria legújabb tagját, fejlett kijelző technológiával."
  },
  {
    title: "Snapdragon új processzort mutatott be",
    source: "Snapdragon",
    link: "https://www.qualcomm.com/news/releases",
    date: "2025-05-24",
    summary: "A Snapdragon új generációs mobil processzora gyorsabb és energiatakarékosabb."
  },
  {
    title: "Intel áttörést ért el a chipgyártásban",
    source: "Intel",
    link: "https://newsroom.intel.com/news/",
    date: "2025-05-23",
    summary: "Az Intel új gyártási technológiát vezetett be, amely növeli a teljesítményt."
  },
  {
    title: "Python 4.0 előzetes kiadás",
    source: "Python",
    link: "https://www.python.org/blogs/",
    date: "2025-05-22",
    summary: "Megjelent a Python 4.0 első előzetese, új szintaxissal és teljesítményjavításokkal."
  },
  {
    title: "JavaScript új ECMAScript szabvány",
    source: "JavaScript",
    link: "https://tc39.es/",
    date: "2025-05-21",
    summary: "Az ECMAScript új verziója számos modernizációt és fejlesztést tartalmaz."
  },
  {
    title: "Node.js 22 megjelent",
    source: "Node.js",
    link: "https://nodejs.org/en/blog/",
    date: "2025-05-20",
    summary: "A Node.js 22 új funkciókkal és teljesítményjavításokkal érkezik."
  },
  {
    title: "React 19 újdonságok",
    source: "React",
    link: "https://react.dev/blog/",
    date: "2025-05-19",
    summary: "A React 19 új hookokat és optimalizációkat vezet be."
  },
  {
    title: "Next.js 15 kiadás",
    source: "Next.js",
    link: "https://nextjs.org/blog/",
    date: "2025-05-18",
    summary: "A Next.js 15 gyorsabb oldalbetöltést és fejlettebb routingot kínál."
  }
];

const News = () => (
  <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
    <h1 style={{ textAlign: "center", marginBottom: 32 }}>Tech Hírek</h1>
    <ul style={{ listStyle: "none", padding: 0 }}>
      {techNews.map((news, idx) => (
        <li key={idx} style={{
          background: "#f9f9f9",
          marginBottom: 20,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          padding: 20
        }}>
          <a href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#1a73e8" }}>
            <h2 style={{ margin: "0 0 8px 0" }}>{news.title}</h2>
          </a>
          <div style={{ fontSize: 14, color: "#888", marginBottom: 8 }}>
            {news.source} &middot; {news.date}
          </div>
          <p style={{ margin: 0 }}>{news.summary}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default News;