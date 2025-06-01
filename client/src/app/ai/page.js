"use client";
import { useState } from "react";
import styles from "./ai.module.css";
import Link from "next/link";

export default function AIPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('./api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [
            { role: "system", content: "You are a helpful coding and learning assistant. Respond in Hungarian." },
            ...newMessages
          ]
        }),
      });

      const data = await response.json();
      setMessages([...newMessages, { role: "assistant", content: data.result }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { role: "assistant", content: "Hiba történt. Próbáld újra!" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.aiPage}>
      <main className={styles.aiMain}>
        <div className={styles.header}>
          <Link href="/" className={styles.backButton}>
            ← Vissza a főoldalra
          </Link>
          <h1 className={styles.title}>🤖 AI Asszisztens</h1>
        </div>

        {/* Chat terület */}
        <div className={styles.chatContainer}>
          {messages.length === 0 ? (
            <div className={styles.emptyState}>
              <p>👋 Üdvözöllek! Miben segíthetek ma?</p>
              <p style={{ fontSize: '0.9rem', marginTop: '10px', opacity: 0.7 }}>
                Kérdezz bármit programozásról, tanulásról vagy technológiáról!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`${styles.message} ${
                  msg.role === "user" ? styles.userMessage : styles.assistantMessage
                }`}
              >
                <div className={styles.messageLabel}>
                  {msg.role === "user" ? "🧑‍💻 Te" : "🤖 AI Asszisztens"}
                </div>
                <p className={styles.messageContent}>{msg.content}</p>
              </div>
            ))
          )}
          {loading && (
            <div className={styles.loadingIndicator}>
              🤔 AI gondolkodik...
            </div>
          )}
        </div>

        {/* Input terület */}
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Írj egy üzenetet... (Enter = küldés)"
            className={styles.messageInput}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className={styles.sendButton}
          >
            {loading ? "⏳" : "📤"} Küldés
          </button>
        </div>
      </main>
    </div>
  );
}
