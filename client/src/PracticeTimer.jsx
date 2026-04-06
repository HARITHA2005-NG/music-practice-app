import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeTimer = ({ theme }) => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(1500); 
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(25);

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    let interval;

    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0 && isActive) {
      clearInterval(interval);
      setIsActive(false);
      
      // --- UPDATED SAVE LOGIC: XP + LOGS ---
      const handleSessionCompletion = () => {
        const mins = parseInt(inputMinutes) || 1;
        const xpGained = mins * 10; // Award 10 XP per minute

        // 1. Update Global Progress (For the Dashboard Tracker)
        const currentXP = parseInt(localStorage.getItem('userXP')) || 0;
        const currentTotalMins = parseInt(localStorage.getItem('totalPracticeMinutes')) || 0;
        
        localStorage.setItem('userXP', currentXP + xpGained);
        localStorage.setItem('totalPracticeMinutes', currentTotalMins + mins);

        // 2. Add to Practice Journal (History)
        const existingLogs = JSON.parse(localStorage.getItem('practice_sessions')) || [];
        const newEntry = {
          tool: "Timer",
          duration: mins,
          date: new Date().toLocaleDateString(),
          timestamp: new Date().getTime()
        };
        localStorage.setItem('practice_sessions', JSON.stringify([...existingLogs, newEntry]));
      };

      handleSessionCompletion();
      playCompletionSound();
      alert(`Session Complete! You earned ${parseInt(inputMinutes) * 10} XP.`);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds, inputMinutes]);

  const playCompletionSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(inputMinutes * 60);
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="page-fade" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <button 
        onClick={() => navigate('/dashboard')}
        style={backBtnStyle(theme)}
        className="hover-effect"
      >
        ← BACK TO TOOLS
      </button>

      <div style={{ 
        background: theme.card, 
        padding: '40px', 
        borderRadius: '30px', 
        width: '100%', 
        maxWidth: '420px', 
        textAlign: 'center',
        boxShadow: `0 20px 40px rgba(0,0,0,0.4)`,
        border: `1px solid ${theme.accent}33`,
        position: 'relative'
      }}>
        <h2 style={{ color: theme.text, letterSpacing: '2px', fontWeight: '800' }}>
          SESSION TIMER
        </h2>
        
        <div style={{ 
          fontSize: '90px', 
          fontFamily: 'monospace',
          fontWeight: 'bold', 
          margin: '10px 0', 
          color: isActive ? theme.accent : theme.text,
          filter: isActive ? `drop-shadow(0 0 10px ${theme.accent})` : 'none',
          transition: 'all 0.3s ease'
        }}>
          {formatTime(seconds)}
        </div>

        {!isActive && (
          <div style={{ marginBottom: '30px', animation: 'fadeIn 0.5s' }}>
            <label style={{ display: 'block', color: theme.text, opacity: 0.6, fontSize: '12px', marginBottom: '8px' }}>SET DURATION (MINS)</label>
            <input 
              type="number" 
              value={inputMinutes} 
              onChange={(e) => {
                const val = e.target.value;
                setInputMinutes(val);
                setSeconds(val * 60);
              }}
              style={inputStyle(theme)}
            />
          </div>
        )}

        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={toggleTimer} 
            style={primaryBtnStyle(isActive, theme)}
          >
            {isActive ? 'PAUSE' : 'START PRACTICE'}
          </button>
          <button 
            onClick={resetTimer} 
            style={secondaryBtnStyle(theme)}
          >
            RESET
          </button>
        </div>

        <p style={{ marginTop: '30px', color: theme.accent, opacity: 0.7, fontSize: '13px', fontStyle: 'italic', letterSpacing: '0.5px' }}>
          "Long live all the magic we made."
        </p>
      </div>
    </div>
  );
};

// --- STYLES ---

const backBtnStyle = (theme) => ({
  alignSelf: 'flex-start',
  background: 'transparent',
  color: theme.text,
  border: `1px solid ${theme.accent}66`,
  padding: '12px 24px',
  borderRadius: '30px',
  cursor: 'pointer',
  marginBottom: '40px',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  transition: '0.3s'
});

const inputStyle = (theme) => ({
  width: '100px', 
  padding: '12px', 
  borderRadius: '15px', 
  border: `2px solid ${theme.accent}44`,
  background: 'rgba(255,255,255,0.05)',
  color: theme.text,
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'center',
  outline: 'none'
});

const primaryBtnStyle = (isActive, theme) => ({
  backgroundColor: isActive ? 'transparent' : theme.accent, 
  color: isActive ? theme.accent : (theme.name === "Midnights Edition" ? "white" : "black"), 
  border: isActive ? `2px solid ${theme.accent}` : 'none',
  padding: '18px 25px',
  borderRadius: '40px',
  fontWeight: '900',
  flex: 2,
  cursor: 'pointer',
  fontSize: '15px',
  letterSpacing: '1px',
  transition: '0.3s'
});

const secondaryBtnStyle = (theme) => ({
  backgroundColor: 'rgba(255,255,255,0.05)', 
  color: theme.text, 
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '18px 25px',
  borderRadius: '40px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: '0.3s'
});

export default PracticeTimer;