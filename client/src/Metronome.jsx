import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure this path matches your folder structure exactly!
import { commitToolUsage } from './utils/progress'; 

const Metronome = ({ theme }) => {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  const beatsPerMeasure = 4;
  const timer = useRef(null);
  const audioCtx = useRef(null);
  const beatRef = useRef(-1);
  const secondCounter = useRef(null);

  // Initialize Audio Context on first interaction
  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playClick = () => {
    initAudio();
    beatRef.current = (beatRef.current + 1) % beatsPerMeasure;
    setCurrentBeat(beatRef.current);

    const osc = audioCtx.current.createOscillator();
    const envelope = audioCtx.current.createGain();
    
    // Higher pitch for the "Downbeat" (Beat 1)
    osc.frequency.setValueAtTime(beatRef.current === 0 ? 1000 : 600, audioCtx.current.currentTime);
    osc.type = 'sine';

    envelope.gain.setValueAtTime(1, audioCtx.current.currentTime);
    envelope.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);

    osc.connect(envelope);
    envelope.connect(audioCtx.current.destination);

    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  };

  const startStop = () => {
    if (playing) {
      // STOPPING LOGIC
      clearInterval(timer.current);
      clearInterval(secondCounter.current);
      
      // Calculate practice time
      const minutes = Math.max(1, Math.round(sessionSeconds / 60));
      if (sessionSeconds >= 5) {
        commitToolUsage("Metronome", minutes);
      }
      
      setPlaying(false);
      setCurrentBeat(-1);
      beatRef.current = -1;
      setSessionSeconds(0); 
    } else {
      // STARTING LOGIC
      initAudio();
      setPlaying(true);
      playClick(); 
      timer.current = setInterval(playClick, (60 / bpm) * 1000);
      secondCounter.current = setInterval(() => {
        setSessionSeconds(s => s + 1);
      }, 1000);
    }
  };

  // Sync BPM changes while playing
  useEffect(() => {
    if (playing) {
      clearInterval(timer.current);
      timer.current = setInterval(playClick, (60 / bpm) * 1000);
    }
    return () => {
      clearInterval(timer.current);
      clearInterval(secondCounter.current);
    };
  }, [bpm, playing]);

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate('/dashboard')} style={backBtnStyle(theme)}>
        ← BACK TO TOOLS
      </button>

      <div style={glassCardStyle(theme)}>
        <h2 style={{ color: theme.accent, letterSpacing: '3px', fontSize: '14px', marginBottom: '20px' }}>
          PRACTICE ENGINE
        </h2>

        {playing && (
          <div style={sessionTimerStyle(theme)}>
             LIVE SESSION: {Math.floor(sessionSeconds / 60)}m {sessionSeconds % 60}s
          </div>
        )}

        {/* Pulsing Visualizer */}
        <div style={visualizerContainer}>
          {[...Array(beatsPerMeasure)].map((_, i) => (
            <div key={i} style={beatDotStyle(i, currentBeat, playing, theme)} />
          ))}
        </div>

        <div style={bpmDisplayStyle(theme)}>
          {bpm} <span style={{ fontSize: '18px', opacity: 0.5 }}>BPM</span>
        </div>

        <input 
          type="range" min="40" max="240" value={bpm} 
          onChange={(e) => setBpm(e.target.value)} 
          style={rangeInputStyle(theme)}
        />

        <div style={buttonGroupStyle}>
          <button onClick={() => setBpm(b => Math.max(40, parseInt(b) - 1))} style={circleBtnStyle(theme)}> - </button>
          
          <button onClick={startStop} style={mainActionBtn(playing, theme)}>
            {playing ? 'STOP & SAVE' : 'START SESSION'}
          </button>
          
          <button onClick={() => setBpm(b => Math.min(240, parseInt(b) + 1))} style={circleBtnStyle(theme)}> + </button>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---

const containerStyle = {
  padding: '40px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minHeight: '100vh'
};

const glassCardStyle = (theme) => ({
  background: 'rgba(255, 255, 255, 0.03)',
  backdropFilter: 'blur(20px)',
  padding: '40px',
  borderRadius: '40px',
  width: '100%',
  maxWidth: '420px',
  textAlign: 'center',
  border: `1px solid ${theme.accent}22`,
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
});

const visualizerContainer = {
  display: 'flex', 
  justifyContent: 'center', 
  gap: '20px', 
  margin: '30px 0'
};

const bpmDisplayStyle = (theme) => ({
  fontSize: '72px', 
  fontWeight: '900', 
  color: 'white', 
  marginBottom: '10px',
  fontFamily: 'monospace'
});

const sessionTimerStyle = (theme) => ({
  background: `${theme.accent}15`,
  color: theme.accent,
  padding: '8px 15px',
  borderRadius: '12px',
  fontSize: '11px',
  fontWeight: 'bold',
  display: 'inline-block',
  marginBottom: '20px'
});

const rangeInputStyle = (theme) => ({
  width: '100%', 
  marginBottom: '40px', 
  accentColor: theme.accent,
  cursor: 'pointer'
});

const buttonGroupStyle = {
  display: 'flex', 
  gap: '20px', 
  alignItems: 'center'
};

const mainActionBtn = (playing, theme) => ({
  backgroundColor: playing ? '#ff4d4d' : theme.accent,
  color: 'white',
  padding: '18px 40px',
  borderRadius: '20px',
  border: 'none',
  fontSize: '14px',
  fontWeight: 'bold',
  cursor: 'pointer',
  flex: 2,
  boxShadow: playing ? '0 0 20px #ff4d4d44' : `0 0 20px ${theme.accent}44`,
  transition: 'all 0.3s ease'
});

const circleBtnStyle = (theme) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  color: 'white',
  border: `1px solid ${theme.accent}44`,
  width: '55px',
  height: '55px',
  borderRadius: '18px',
  fontSize: '24px',
  cursor: 'pointer',
  transition: '0.2s'
});

const backBtnStyle = (theme) => ({
  alignSelf: 'flex-start',
  background: 'transparent',
  color: theme.accent,
  border: `1px solid ${theme.accent}44`,
  padding: '12px 24px',
  borderRadius: '15px',
  cursor: 'pointer',
  marginBottom: '40px',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1px'
});

const beatDotStyle = (i, currentBeat, playing, theme) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: currentBeat === i && playing ? theme.accent : 'rgba(255,255,255,0.1)',
  boxShadow: currentBeat === i && playing ? `0 0 20px ${theme.accent}` : 'none',
  transform: currentBeat === i && playing ? 'scale(1.5)' : 'scale(1)',
  transition: 'all 0.08s ease'
});

export default Metronome;