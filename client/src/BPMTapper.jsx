import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BPMTapper = ({ theme }) => {
  const navigate = useNavigate();
  const [taps, setTaps] = useState([]);
  const [bpm, setBpm] = useState(0);

  // Security Guard: Kick out if not logged in
  useEffect(() => {
    if (!localStorage.getItem('username')) {
      navigate('/');
    }
  }, [navigate]);

  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...taps, now].slice(-10); // Keep only the last 10 taps for accuracy
    setTaps(newTaps);

    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      setBpm(calculatedBpm);
    }
  };

  const resetTaps = () => {
    setTaps([]);
    setBpm(0);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* 1. THEMED BACK BUTTON */}
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          alignSelf: 'flex-start',
          background: 'transparent',
          color: theme.text,
          border: `1px solid ${theme.accent}`,
          padding: '10px 25px',
          borderRadius: '30px',
          cursor: 'pointer',
          marginBottom: '30px',
          fontSize: '13px',
          fontWeight: 'bold',
          letterSpacing: '1px',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(5px)',
          boxShadow: `0 0 10px ${theme.accent}33`
        }}
        onMouseOver={(e) => {
          e.target.style.background = theme.accent;
          e.target.style.color = theme.name === "Midnights Edition" ? "#fff" : "#000";
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'transparent';
          e.target.style.color = theme.text;
        }}
      >
        ← BACK TO TOOLS
      </button>

      {/* 2. TAPPER CARD */}
      <div style={{ 
        background: theme.card, 
        padding: '40px', 
        borderRadius: '30px', 
        width: '100%', 
        maxWidth: '400px', 
        textAlign: 'center',
        boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
        border: `1px solid ${theme.accent}33`,
        transition: 'all 0.5s ease'
      }}>
        <h2 style={{ color: theme.text, letterSpacing: '2px', marginTop: 0 }}>BPM TAPPER 👆</h2>
        <p style={{ color: theme.text, opacity: 0.7, fontSize: '14px' }}>
          Tap the button to find the tempo of your favorite era.
        </p>

        <div style={{ 
          fontSize: '80px', 
          fontWeight: 'bold', 
          margin: '20px 0', 
          color: theme.accent,
          textShadow: `0 0 20px ${theme.accent}66`,
          transition: 'color 0.5s ease'
        }}>
          {bpm > 0 ? bpm : '--'}
        </div>

        <button 
          onClick={handleTap}
          style={{ 
            width: '160px', 
            height: '160px', 
            borderRadius: '50%', 
            backgroundColor: 'transparent', 
            fontSize: '24px', 
            color: theme.text,
            border: `4px solid ${theme.accent}`,
            cursor: 'pointer',
            boxShadow: `0 0 20px ${theme.accent}44`,
            transition: 'all 0.2s ease',
            fontWeight: 'bold',
            marginBottom: '20px',
            outline: 'none'
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'scale(0.95)';
            e.target.style.backgroundColor = `${theme.accent}22`;
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.backgroundColor = 'transparent';
          }}
        >
          TAP
        </button>

        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={resetTaps} 
            style={{ 
              background: 'transparent', 
              color: theme.text, 
              border: 'none', 
              textDecoration: 'underline', 
              cursor: 'pointer',
              opacity: 0.6,
              fontSize: '14px'
            }}
          >
            Reset Taps
          </button>
        </div>
      </div>
    </div>
  );
};

export default BPMTapper;