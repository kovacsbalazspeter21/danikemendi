"use client";
import React, { useState } from "react";
import styles from "./profile.module.css";
import Image from "next/image";


const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileData, setProfileData] = useState({
        email: "",
        username: "",
        birthDate: "",
        profileImage: "",
        description: "",
        displayName: ""
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleLogin = (provider) => {
        // Szimulált bejelentkezés
        setProfileData({
            email: provider === 'google' ? "teszt@gmail.com" : "teszt@icloud.com",
            displayName: provider === 'google' ? "Google Felhasználó" : "Apple Felhasználó",
            profileImage: "https://via.placeholder.com/120/667eea/ffffff?text=U",
            username: "",
            birthDate: "",
            description: ""
        });
        setIsLoggedIn(true);
    };

    const handleInputChange = (field, value) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        setIsEditing(false);
        // Itt mentenéd az adatokat
        console.log('Profil mentve:', profileData);
    };

    if (!isLoggedIn) {
        return (
            <div className={styles.authContainer}>
                <div className={styles.authCard}>
                    <div className={styles.authHeader}>
                        <h1>Bejelentkezés szükséges</h1>
                        <p>A profil eléréséhez jelentkezz be az alábbi szolgáltatások egyikével</p>
                    </div>
                    
                    <div className={styles.authButtons}>
                        <button 
                            className={styles.googleButton}
                            onClick={() => handleLogin('google')}
                        >
                            <svg className={styles.authIcon} viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Bejelentkezés Google-lel
                        </button>
                        
                        <button 
                            className={styles.appleButton}
                            onClick={() => handleLogin('apple')}
                        >
                            <svg className={styles.authIcon} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                            </svg>
                            Bejelentkezés Apple-lel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isIncomplete = !profileData.username || !profileData.birthDate;

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                {/* Header */}
                <div className={styles.profileHeader}>
                    <div className={styles.profileImageSection}>
                        <div className={styles.imageWrapper}>
                            <Image 
                                src={profileData.profileImage} 
                                alt="Profile"
                                className={styles.profileImage}
                            />
                        </div>
                    </div>
                    
                    <div className={styles.profileInfo}>
                        <h1>{profileData.displayName}</h1>
                        <p className={styles.email}>{profileData.email}</p>
                        
                        <div className={styles.headerActions}>
                            {!isEditing ? (
                                <button 
                                    className={styles.editButton}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Profil szerkesztése
                                </button>
                            ) : (
                                <div className={styles.editActions}>
                                    <button 
                                        className={styles.saveButton}
                                        onClick={handleSave}
                                    >
                                        Mentés
                                    </button>
                                    <button 
                                        className={styles.cancelButton}
                                        onClick={() => setIsEditing(false)}
                                    >
                                        Mégse
                                    </button>
                                </div>
                            )}
                            
                            <button 
                                className={styles.signOutButton}
                                onClick={() => setIsLoggedIn(false)}
                            >
                                Kijelentkezés
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hiányzó mezők figyelmeztetés */}
                {isIncomplete && (
                    <div className={styles.incompleteWarning}>
                        <div className={styles.warningIcon}>⚠️</div>
                        <div>
                            <h3>Profil kiegészítése szükséges</h3>
                            <p>Kérjük, töltsd ki a hiányzó kötelező mezőket a teljes profil eléréséhez.</p>
                        </div>
                    </div>
                )}

                {/* Profil mezők */}
                <div className={styles.profileFields}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Felhasználónév <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            className={styles.fieldInput}
                            value={profileData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            placeholder="Válassz egy egyedi felhasználónevet"
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Születési dátum <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="date"
                            className={styles.fieldInput}
                            value={profileData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>Bemutatkozás</label>
                        <textarea
                            className={styles.fieldTextarea}
                            value={profileData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Írj magadról pár sort..."
                            disabled={!isEditing}
                            rows={4}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
