import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ToneGenerator = ({ theme }) => {
  const navigate = useNavigate();
  const [frequency, setFrequency] = useState(440); // Standard A4
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  
  const audioCtx = useRef(null);
  const oscillator = useRef(null);
  const gainNode = useRef(null);

  // Security Guard
  useEffect(() => {
    if (!localStorage.getItem('username')) {
      navigate('/');
    }
  }, [navigate]);

  const startTone = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    oscillator.current = audioCtx.current.createOscillator();
    gainNode.current = audioCtx.current.createGain();

    oscillator.current.type = 'sine';
    oscillator.current.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
    
    gainNode.current.gain.setValueAtTime(volume, audioCtx.current.currentTime);

    oscillator.current.connect(gainNode.current);
    gainNode.current.connect(audioCtx.current.destination);

    oscillator.current.start();
    setIsPlaying(true);
  };

  const stopTone = () => {
    if (oscillator.current) {
      try {
        oscillator.current.stop();
        oscillator.current.disconnect();
      } catch (e) {
        // Handle cases where stop might be called twice
      }
      setIsPlaying(false);
    }
  };

  // Update frequency/volume in real-time
  useEffect(() => {
    if (isPlaying && oscillator.current && audioCtx.current) {
      oscillator.current.frequency.setTargetAtTime(frequency, audioCtx.current.currentTime, 0.05);
    }
  }, [frequency, isPlaying]);

  useEffect(() => {
    if (isPlaying && gainNode.current && audioCtx.current) {
      gainNode.current.gain.setTargetAtTime(volume, audioCtx.current.currentTime, 0.05);
    }
  }, [volume, isPlaying]);

  // Cleanup on leave
  useEffect(() => {
    return () => {
      if (isPlaying) stopTone();
    };
  }, [isPlaying]);

  const presetBtnStyle = {
    fontSize: '12px',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.1)',
    color: theme.text,
    border: `1px solid ${theme.accent}66`,
    borderRadius: '15px',
    cursor: 'pointer',
    transition: '0.3s'
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

      {/* 2. TONE GENERATOR CARD */}
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
        <h2 style={{ color: theme.text, letterSpacing: '2px', marginTop: 0 }}>TONE GENERATOR 🔊</h2>
        
        <div style={{ 
          fontSize: '50px', 
          fontWeight: 'bold', 
          margin: '20px 0', 
          color: theme.accent,
          textShadow: isPlaying ? `0 0 15px ${theme.accent}88` : 'none',
          transition: '0.3s'
        }}>
          {frequency} <span style={{ fontSize: '20px', opacity: 0.6 }}>Hz</span>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ color: theme.text, display: 'block', marginBottom: '10px', fontSize: '14px', opacity: 0.8 }}>Frequency</label>
          <input 
            type="range" min="100" max="2000" step="1"
            value={frequency} 
            onChange={(e) => setFrequency(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: theme.accent }}
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '15px' }}>
             <button onClick={() => setFrequency(440)} style={presetBtnStyle}>A (440Hz)</button>
             <button onClick={() => setFrequency(432)} style={presetBtnStyle}>Healing (432Hz)</button>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <label style={{ color: theme.text, display: 'block', marginBottom: '10px', fontSize: '14px', opacity: 0.8 }}>Volume</label>
          <input 
            type="range" min="0" max="1" step="0.01"
            value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: theme.accent }}
          />
        </div>

        <button 
          onClick={isPlaying ? stopTone : startTone}
          style={{ 
            backgroundColor: isPlaying ? '#ff4d4d' : theme.accent, 
            color: isPlaying ? 'white' : (theme.name === "Midnights Edition" ? "white" : "black"), 
            padding: '15px 40px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '30px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            boxShadow: isPlaying ? '0 0 20px rgba(255, 77, 77, 0.4)' : `0 0 20px ${theme.accent}44`,
            transition: '0.3s'
          }}
        >
          {isPlaying ? 'STOP TONE' : 'PLAY TONE'}
        </button>
      </div>
    </div>
  );
};

export default ToneGenerator;