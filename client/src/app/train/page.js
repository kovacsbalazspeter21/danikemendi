"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./train.module.css";

const Train = () => {
    const [current, setCurrent] = useState(0);
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isStudyMode, setIsStudyMode] = useState(false);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const slideRefs = useRef([]);

    const courseList = [
        { title: "Kezdő lépések", file: "/api/train/start.json" },
        { title: "Alapvető HTML5", file: "/api/train/basichtml5.json" },
        { title: "Alapvető CSS3", file: "/api/train/basiccss3.json" },
        { title: "Alapvető JavaScript", file: "/api/train/basicjs.json" },
        { title: "Alapvető Webdesign", file: "/api/train/basicwebdesign.json" },
        { title: "Alapvető Reszponzív Design", file: "/api/train/basicresponsivedesign.json" },
        { title: "Alapvető Web Akadálymentesség", file: "/api/train/basicwebaccessibility.json" },
        { title: "Alapvető SEO", file: "/api/train/basicseo.json" },
        { title: "Alapvető Web Teljesítmény", file: "/api/train/basicwebperformance.json" },
        { title: "Alapvető Web Biztonság", file: "/api/train/basicwebsecurity.json" },
        { title: "Alapvető Webfejlesztő Eszközök", file: "/api/train/basicwebdevelopmenttools.json" },
        { title: "Alapvető Verziókezelés Git-tel", file: "/api/train/basicversioncontrolwithgit.json" },
        { title: "Alapvető Parancssor Használat", file: "/api/train/basiccommandlineusage.json" },
        { title: "Alapvető Webhosting", file: "/api/train/basicwebhosting.json" },
        { title: "Alapvető Tartalomkezelő Rendszerek", file: "/api/train/basiccontentmanagementsystems.json" },
        { title: "Alapvető Web Analitika", file: "/api/train/basicwebanalytics.json" }
    ];

    useEffect(() => {
        const loadSlides = async () => {
            try {
                const allSlides = [];
                const progressStep = 80 / courseList.length;

                for (let i = 0; i < courseList.length; i++) {
                    const course = courseList[i];
                    setLoadingProgress(10 + (i * progressStep));
                    await new Promise(resolve => setTimeout(resolve, 100));
                    try {
                        const lessonResponse = await fetch(course.file);
                        if (!lessonResponse.ok) {
                            allSlides.push({
                                title: course.title,
                                content: 'Tanfolyam betöltése folyamatban...',
                                anchor: null,
                                dataSource: course.file
                            });
                            continue;
                        }
                        const lessonData = await lessonResponse.json();
                        allSlides.push({
                            title: lessonData.title || course.title,
                            content: lessonData.description || lessonData.content || 'Tanfolyam leírása...',
                            anchor: lessonData.anchor || null,
                            dataSource: course.file
                        });
                    } catch {
                        allSlides.push({
                            title: course.title,
                            content: 'Tanfolyam jelenleg nem elérhető.',
                            anchor: null,
                            dataSource: course.file
                        });
                    }
                }
                setLoadingProgress(95);
                await new Promise(resolve => setTimeout(resolve, 100));
                setSlides(allSlides);
                setLoadingProgress(100);
                await new Promise(resolve => setTimeout(resolve, 200));
            } finally {
                setLoading(false);
            }
        };
        loadSlides();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;
        const handleKeyDown = (e) => {
            if (isStudyMode) {
                if (e.key === "ArrowRight" || e.key === "PageDown") {
                    e.preventDefault();
                    nextPage();
                }
                if (e.key === "ArrowLeft" || e.key === "PageUp") {
                    e.preventDefault();
                    prevPage();
                }
                if (e.key === "Escape") {
                    e.preventDefault();
                    exitStudyMode();
                }
            } else {
                if (e.key === "ArrowRight" || e.key === "PageDown") {
                    e.preventDefault();
                    nextSlide();
                }
                if (e.key === "ArrowLeft" || e.key === "PageUp") {
                    e.preventDefault();
                    prevSlide();
                }
                if (e.key === "Enter") {
                    e.preventDefault();
                    enterStudyMode();
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [current, slides.length, isStudyMode, currentPage, currentCourse]);

    const nextSlide = () => setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrent((prev) => Math.max(prev - 1, 0));
    const nextPage = () => {
        if (currentCourse && currentCourse.pages && currentPage < currentCourse.pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };
    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(prev => prev - 1);
    };

    const enterStudyMode = async () => {
        const currentSlide = slides[current];
        if (!currentSlide || !currentSlide.dataSource) {
            alert('Ez a tanfolyam még nem elérhető!');
            return;
        }
        try {
            const response = await fetch(currentSlide.dataSource);
            const courseDetail = await response.json();
            setCurrentCourse({
                ...currentSlide,
                pages: courseDetail.pages || []
            });
            setCurrentPage(0);
            setIsStudyMode(true);
        } catch {
            alert('Nem sikerült betölteni a tanfolyamot!');
        }
    };

    const exitStudyMode = () => {
        setIsStudyMode(false);
        setCurrentCourse(null);
        setCurrentPage(0);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingContent}>
                    <div className={styles.loadingSpinner}></div>
                    <h2 className={styles.loadingTitle}>Tanfolyamok betöltése</h2>
                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: `${loadingProgress}%` }}
                        ></div>
                    </div>
                    <div className={styles.progressText}>{loadingProgress}%</div>
                </div>
            </div>
        );
    }

    // Study mode view
    if (isStudyMode && currentCourse && currentCourse.pages && currentCourse.pages.length > 0) {
        const currentPageData = currentCourse.pages[currentPage];
        return (
            <div className={styles.studyModeContainer}>
                <div className={styles.studyHeader}>
                    <button 
                        className={styles.exitButton}
                        onClick={exitStudyMode}
                        aria-label="Kilépés a tanulási módból"
                    >
                        ← Vissza az áttekintéshez
                    </button>
                    <div className={styles.courseProgress}>
                        <h3>{currentCourse.title}</h3>
                        <span className={styles.progressText}>
                            {currentPage + 1} / {currentCourse.pages.length}
                        </span>
                    </div>
                </div>
                <div className={styles.slidebookContainer}>
                    <div className={styles.slidebook}>
                        <button
                            className={styles.arrowLeft}
                            onClick={prevPage}
                            disabled={currentPage === 0}
                            aria-label="Előző oldal"
                        >
                            &#8592;
                        </button>
                        <div className={styles.slide}>
                            <h2>{currentPageData?.title || 'Cím betöltése...'}</h2>
                            <div className={styles.pageContent}>
                                {currentPageData?.content && (
                                    <p>{currentPageData.content}</p>
                                )}
                                {currentPageData?.keyPoints && (
                                    <div className={styles.keyPoints}>
                                        <h4>Kulcspontok:</h4>
                                        <ul>
                                            {currentPageData.keyPoints.map((point, index) => (
                                                <li key={index}>{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {currentPageData?.codeExample && (
                                    <div className={styles.codeBlock}>
                                        <h4>Kód példa:</h4>
                                        <pre><code>{currentPageData.codeExample}</code></pre>
                                    </div>
                                )}
                            </div>
                            <div className={styles.slideIndicator}>
                                {currentPage + 1} / {currentCourse.pages.length}
                            </div>
                            <div className={styles.slideHint}>
                                Nyilak: lapozás | Esc: kilépés
                            </div>
                        </div>
                        <button
                            className={styles.arrowRight}
                            onClick={nextPage}
                            disabled={currentPage === currentCourse.pages.length - 1}
                            aria-label="Következő oldal"
                        >
                            &#8594;
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main slideshow view
    return (
        <div className={styles.slidebookContainer}>
            <div className={styles.slidebook}>
                <button
                    className={styles.arrowLeft}
                    onClick={prevSlide}
                    disabled={current === 0}
                    aria-label="Előző oldal"
                >
                    &#8592;
                </button>
                <div
                    className={styles.slide}
                    ref={el => (slideRefs.current[current] = el)}
                    tabIndex={0}
                    onClick={enterStudyMode}
                    style={{ cursor: "pointer" }}
                    title="Kattints a tanfolyam indításához!"
                >
                    {slides[current] && (
                        <>
                            <h2>{slides[current].title}</h2>
                            <p>{slides[current].content}</p>
                            <div className={styles.slideIndicator}>
                                {current + 1} / {slides.length}
                            </div>
                            <div className={styles.slideHint}>
                                Kattints vagy nyomj Entert a tanfolyam indításához!
                            </div>
                        </>
                    )}
                </div>
                <button
                    className={styles.arrowRight}
                    onClick={nextSlide}
                    disabled={current === slides.length - 1}
                    aria-label="Következő oldal"
                >
                    &#8594;
                </button>
            </div>
        </div>
    );
};

export default Train;