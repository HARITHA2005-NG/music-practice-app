import React, { useEffect, useState } from 'react';

const ProgressTracker = ({ theme }) => {
  const [stats, setStats] = useState({
    level: 'Beginner',
    xp: 0,
    streak: 0,
    percentage: 0,
    totalMinutes: 0,
    history: [] 
  });

  useEffect(() => {
    // 1. Pull data from LocalStorage
    const savedLevel = localStorage.getItem('userLevel') || 'Beginner';
    const savedXP = parseInt(localStorage.getItem('userXP')) || 0;
    const savedStreak = parseInt(localStorage.getItem('userStreak')) || 1;
    const savedMinutes = parseInt(localStorage.getItem('totalPracticeMinutes')) || 0;
    
    // Fetch History Records
    const savedHistory = JSON.parse(localStorage.getItem('practice_sessions')) || [];
    // Sort so newest practice is at the top using timestamp
    const sortedHistory = savedHistory.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // 2. Daily Goal Logic (500 XP goal)
    const dailyGoal = 500;
    const calcPercentage = Math.min(Math.round((savedXP / dailyGoal) * 100), 100);

    setStats({
      level: savedLevel,
      xp: savedXP,
      streak: savedStreak,
      percentage: calcPercentage,
      totalMinutes: savedMinutes,
      history: sortedHistory
    });
  }, []);

  return (
    <div className="page-fade" style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%' }}>
      
      {/* --- SECTION 1: TOP STATS CARD --- */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(16px)',
        padding: '25px 30px',
        borderRadius: '24px',
        border: `1px solid ${theme.accent}33`,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', opacity: 0.5, letterSpacing: '1.5px', display: 'block', marginBottom: '4px' }}>CURRENT ERA</span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: theme.accent, textShadow: `0 0 10px ${theme.accent}44` }}>
                {stats.level.toUpperCase()}
            </span>
          </div>

          <div style={{ 
            background: `linear-gradient(135deg, ${theme.accent}22, transparent)`, 
            padding: '12px 24px', 
            borderRadius: '18px', 
            border: `1px solid ${theme.accent}44`,
            textAlign: 'center',
            minWidth: '140px'
          }}>
            <span style={{ fontSize: '10px', color: theme.accent, display: 'block', fontWeight: 'bold', letterSpacing: '1px' }}>TOTAL PRACTICE</span>
            <span style={{ fontSize: '24px', fontWeight: '900' }}>{stats.totalMinutes} <small style={{fontSize: '12px', opacity: 0.6}}>MINS</small></span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '28px', display: 'block' }}>🔥 {stats.streak}</span>
            <span style={{ fontSize: '11px', opacity: 0.5, fontWeight: 'bold' }}>DAY STREAK</span>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
            <span style={{ opacity: 0.8 }}>Daily Goal Progress <strong>({stats.xp}/500 XP)</strong></span>
            <span style={{ fontWeight: 'bold', color: theme.accent }}>{stats.percentage}%</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '2px' }}>
            <div style={{ 
              width: `${stats.percentage}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, ${theme.accent}, #fff)`, 
              borderRadius: '8px',
              boxShadow: `0 0 15px ${theme.accent}88`,
              transition: 'width 2s cubic-bezier(0.34, 1.56, 0.64, 1)' 
            }}></div>
          </div>
        </div>
      </div>

      {/* --- SECTION 2: HISTORY RECORDS TABLE --- */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        backdropFilter: 'blur(12px)',
        padding: '30px',
        borderRadius: '24px',
        border: `1px solid rgba(255,255,255,0.08)`,
        color: 'white',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '12px', fontWeight: '700' }}>
            <span style={{ filter: `drop-shadow(0 0 5px ${theme.accent})` }}>📅</span> PRACTICE JOURNAL
            </h3>
            <span style={{ fontSize: '12px', opacity: 0.4 }}>{stats.history.length} Sessions Total</span>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', color: theme.accent }}>
                <th style={{ padding: '15px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: `2px solid ${theme.accent}33` }}>Tool Used</th>
                <th style={{ padding: '15px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: `2px solid ${theme.accent}33` }}>Duration</th>
                <th style={{ padding: '15px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: `2px solid ${theme.accent}33` }}>XP Gained</th>
                <th style={{ padding: '15px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: `2px solid ${theme.accent}33` }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.history.length > 0 ? (
                stats.history.map((record, index) => (
                  <tr 
                    key={index} 
                    className="hover-row"
                    style={{ 
                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                        background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
                    }}
                  >
                    <td style={{ padding: '18px 15px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.accent }}></div>
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{record.tool}</span>
                      </div>
                    </td>
                    <td style={{ padding: '18px 15px', fontSize: '14px' }}>
                      {record.duration} <span style={{ opacity: 0.5 }}>mins</span>
                    </td>
                    <td style={{ padding: '18px 15px', fontSize: '14px', fontWeight: 'bold', color: theme.accent }}>
                      +{record.xp || record.duration * 10}
                    </td>
                    <td style={{ padding: '18px 15px', opacity: 0.6, fontSize: '13px' }}>
                      {record.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '60px', textAlign: 'center', opacity: 0.4, fontSize: '15px', fontStyle: 'italic' }}>
                    "The story's just beginning..." <br/> No sessions recorded yet. ✨
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProgressTracker;