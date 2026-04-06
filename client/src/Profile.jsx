import React from 'react';
import './App.css';

const Profile = () => {
    // These values match what is currently on your Practice Hub screen
    const userData = {
        username: "dina",
        streak: 1,
        totalMins: 3,
        xp: 30,
        level: "Intermediate"
    };

    return (
        <div className="profile-page-wrapper">
            <div className="profile-container page-fade">
                <header className="profile-header">
                    <div className="profile-avatar">
                        <span>{userData.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="profile-info">
                        <h1>{userData.username}'s Profile</h1>
                        <p className="member-since">Rank: {userData.level}</p>
                    </div>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-value">{userData.streak}</span>
                        <span className="stat-label">Day Streak</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{userData.totalMins}</span>
                        <span className="stat-label">Minutes Practiced</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-value">{userData.xp}</span>
                        <span className="stat-label">Total XP</span>
                    </div>
                </div>

                <section className="progress-section">
                    <h3>Goal Progress (6%)</h3>
                    <div className="progress-bar-bg">
                        {/* Rectified: Uses the 6% progress shown in your screenshot */}
                        <div className="progress-bar-fill" style={{ width: '6%' }}></div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Profile;