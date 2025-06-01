"use client";
import React, { useEffect, useState } from 'react';
import styles from './test.module.css';


// Helper a színhez
const getResultColor = (percent, submitted) => {
    if (!submitted) return styles.progressPurple;
    if (percent === 100) return styles.progressGold;
    if (percent >= 98) return styles.progressSilver;
    if (percent >= 95) return styles.progressBronze;
    if (percent >= 80) return styles.progressGreen;
    if (percent <= 30) return styles.progressRed;
    if (percent <= 50) return styles.progressOrange;
    if (percent < 80) return styles.progressYellow;
    return styles.progressPurple;
};

const getStoredResults = () => {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem("testResults") || "{}");
    } catch {
        return {};
    }
};

const setStoredResults = (results) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("testResults", JSON.stringify(results));
};

// ÚJ: answers mentése/feltöltése
const getStoredAnswers = () => {
    if (typeof window === "undefined") return {};
    try {
        return JSON.parse(localStorage.getItem("testAnswers") || "{}");
    } catch {
        return {};
    }
};
const setStoredAnswers = (answersObj) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("testAnswers", JSON.stringify(answersObj));
};

const Test = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTest, setSelectedTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [results, setResults] = useState(getStoredResults());
    const [answersObj, setAnswersObj] = useState(getStoredAnswers());

    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/tests.json');
                const data = await response.json();
                setTests(data);
            } catch (error) {
                // hibakezelés
            }
            setLoading(false);
        };

        fetchTests();
    }, []);

    // Frissítsd a results state-et, ha localStorage változik
    useEffect(() => {
        setResults(getStoredResults());
    }, []);

    const handleTestSelect = async (test) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/${test.file}`);
            const data = await response.json();
            // Ha a JSON tömb, akkor data[0], ha objektum, akkor data
            setSelectedTest(Array.isArray(data) ? data[0] : data);

            // answersObj-ból visszatöltjük a korábbit, ha van
            const prevAnswers = getStoredAnswers();
            setAnswers(prevAnswers[test.id] || {});
            setSubmitted(false);
            setScore(0);
        } catch (error) {
            // hibakezelés
        }
        setLoading(false);
    };

    // Válaszadáskor answersObj frissítése és mentése
    const handleAnswer = (qIdx, optIdx) => {
        if (submitted) return;
        const newAnswers = { ...answers, [qIdx]: optIdx };
        setAnswers(newAnswers);

        // answersObj frissítése
        const updatedAnswersObj = { ...getStoredAnswers(), [selectedTest.id]: newAnswers };
        setAnswersObj(updatedAnswersObj);
        setStoredAnswers(updatedAnswersObj);
    };

    const handleSubmit = () => {
        if (!selectedTest) return;
        let correct = 0;
        selectedTest.questions.forEach((q, idx) => {
            if (answers[idx] === q.answer) correct++;
        });
        setScore(correct);
        setSubmitted(true);

        // Eredmény mentése
        const percent = Math.round((correct / selectedTest.questions.length) * 100);
        const newResults = {
            ...getStoredResults(),
            [selectedTest.id]: { percent, submitted: true }
        };
        setStoredResults(newResults);
        setResults(newResults);

        // answersObj-ból töröld a leadott tesztet
        const updatedAnswersObj = { ...getStoredAnswers() };
        delete updatedAnswersObj[selectedTest.id];
        setAnswersObj(updatedAnswersObj);
        setStoredAnswers(updatedAnswersObj);
    };

    // Százalék számítása
    const getProgress = () => {
        if (!selectedTest) return 0;
        const total = selectedTest.questions.length;
        const answered = Object.keys(answers).length;
        return Math.round((answered / total) * 100);
    };

    // Kilépéskor mentés
    const handleExit = () => {
        if (selectedTest) {
            const percent = getProgress();
            const newResults = {
                ...getStoredResults(),
                [selectedTest.id]: { percent, submitted: false }
            };
            setStoredResults(newResults);
            setResults(newResults);

            // answersObj mentése
            const updatedAnswersObj = { ...getStoredAnswers(), [selectedTest.id]: answers };
            setAnswersObj(updatedAnswersObj);
            setStoredAnswers(updatedAnswersObj);
        }
        setSelectedTest(null);
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    };

    if (loading) {
        return <div>Loading tests...</div>;
    }

    // Tesztválasztó nézet
    if (!selectedTest) {
        return (
            <div className={styles.testContainer}>
                <h1>Elérhető tesztek</h1>
                <div className={styles.testGrid}>
                    {tests.map((test) => {
                        const res = results[test.id];
                        let percent = res ? res.percent : 0;
                        let colorClass = res ? getResultColor(percent, res.submitted) : "";
                        let label = "";
                        if (res) {
                            if (res.submitted) label = "Leadva";
                            else label = "Folyamatban";
                        }
                        return (
                            <div
                                key={test.id}
                                className={styles.testCard}
                                onClick={() => handleTestSelect(test)}
                            >
                                <h2>{test.title}</h2>
                                {res && (
                                    <div className={`${styles.progressBox} ${colorClass}`}>
                                        {label && <span className={styles.progressLabel}>{label}: </span>}
                                        {percent}%
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Teszt kitöltő nézet
    return (
        <div className={styles.testContainer}>
            <div className={styles.testHeader}>
                <button
                    type="button"
                    className={styles.exitBtn}
                    onClick={handleExit}
                    title="Kilépés a tesztből"
                >
                    <span style={{ fontSize: 22, marginRight: 8 }}>←</span>
                    Kilépés ({getProgress()}%)
                </button>
            </div>
            <h1>{selectedTest.title}</h1>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                {selectedTest.questions.map((q, qIdx) => (
                    <div key={qIdx} className={styles.questionBox}>
                        <strong>{q.question}</strong>
                        <div className={styles.optionsGrid}>
                            {q.options.map((opt, optIdx) => (
                                <button
                                    type="button"
                                    key={optIdx}
                                    className={`${styles.optionBtn} ${answers[qIdx] === optIdx ? styles.selected : ""}`}
                                    onClick={() => handleAnswer(qIdx, optIdx)}
                                    disabled={submitted}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                {!submitted ? (
                    <button type="submit" className={styles.submitBtn}>
                        Teszt lezárása és kiértékelés
                    </button>
                ) : (
                    <div className={styles.resultBox}>
                        <h2>Eredmény: {score} / {selectedTest.questions.length}</h2>
                        <button
                            type="button"
                            className={styles.backBtn}
                            onClick={() => setSelectedTest(null)}
                        >
                            Vissza a tesztekhez
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Test;