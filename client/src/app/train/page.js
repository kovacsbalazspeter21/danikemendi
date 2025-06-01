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
    
    // Remove the autoAdvanceSlides function call that doesn't exist
    useEffect(() => {
        const loadSlides = async () => {
            try {
                const indexResponse = await fetch('/api/train.json');
                const courseList = await indexResponse.json();

                const allSlides = [];
                const progressStep = 80 / courseList.length;

                for (let i = 0; i < courseList.length; i++) {
                    const course = courseList[i];

                    setLoadingProgress(10 + (i * progressStep));
                    await new Promise(resolve => setTimeout(resolve, 300));

                    const lessonResponse = await fetch(course.file);
                    const lessonData = await lessonResponse.json();

                    const lessonSlides = Array.isArray(lessonData) ? lessonData : [lessonData];

                    lessonSlides.forEach(entry => {
                        allSlides.push({
                            title: entry.title,
                            content: entry.content,
                            anchor: entry.anchor || null,
                            dataSource: course.file
                        });
                    });
                }

                setLoadingProgress(95);
                await new Promise(resolve => setTimeout(resolve, 200));

                setSlides(allSlides);
                setLoadingProgress(100);
                await new Promise(resolve => setTimeout(resolve, 500));

                // Remove the autoAdvanceSlides() call - this function doesn't exist
            } catch (error) {
                console.error('❌ Hiba a tananyag betöltésekor:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSlides();
    }, []);

    // Fix the keyboard event handlers with proper dependencies
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
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [current, slides.length, isStudyMode, currentPage, currentCourse]); // Fixed dependencies

    // Define functions before they're used in useEffect
    const nextSlide = () => {
        setCurrent((prev) => Math.min(prev + 1, slides.length - 1));
    };
    
    const prevSlide = () => {
        setCurrent((prev) => Math.max(prev - 1, 0));
    };

    const nextPage = () => {
        if (currentCourse && currentCourse.pages && currentPage < currentCourse.pages.length - 1) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prev => prev - 1);
        }
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
        } catch (error) {
            console.error('Hiba a tanfolyam betöltésekor:', error);
            alert('Nem sikerült betölteni a tanfolyamot!');
        }
    };

    const exitStudyMode = () => {
        setIsStudyMode(false);
        setCurrentCourse(null);
        setCurrentPage(0);
    };

    // Remove unused function or implement it properly
    const goToAnchor = (anchor) => {
        if (!isStudyMode) {
            const el = document.getElementById(anchor);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
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

    // Main slideshow view - FIXED: Remove duplicate exit button
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
