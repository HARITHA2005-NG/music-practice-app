import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const notes = [
  { name: 'C', freq: 261.63 }, { name: 'C#', freq: 277.18 },
  { name: 'D', freq: 293.66 }, { name: 'D#', freq: 311.13 },
  { name: 'E', freq: 329.63 }, { name: 'F', freq: 349.23 },
  { name: 'F#', freq: 369.99 }, { name: 'G', freq: 392.00 },
  { name: 'G#', freq: 415.30 }, { name: 'A', freq: 440.00 },
  { name: 'A#', freq: 466.16 }, { name: 'B', freq: 493.88 }
];

const PitchPipe = ({ theme }) => {
  const navigate = useNavigate();
  const [activeNote, setActiveNote] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const [octave, setOctave] = useState(4);
  const audioCtx = useRef(null);
  const osc = useRef(null);
  const gainNode = useRef(null);

  // RECTIFIED: This effect stops sound when navigating away
  useEffect(() => {
    return () => {
      stopNote(); // Stop oscillator immediately
      if (audioCtx.current && audioCtx.current.state !== 'closed') {
        audioCtx.current.close(); // Clean up audio resources
      }
    };
  }, []);

  const playNote = (note) => {
    if (activeNote === note.name) {
      stopNote();
      return;
    }
    stopNote();

    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    osc.current = audioCtx.current.createOscillator();
    gainNode.current = audioCtx.current.createGain();

    const baseFreq = note.freq;
    const frequency = baseFreq * Math.pow(2, octave - 4);

    osc.current.type = 'triangle'; 
    osc.current.frequency.setValueAtTime(frequency, audioCtx.current.currentTime);
    
    gainNode.current.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gainNode.current.gain.linearRampToValueAtTime(volume, audioCtx.current.currentTime + 0.05);

    osc.current.connect(gainNode.current);
    gainNode.current.connect(audioCtx.current.destination);

    osc.current.start();
    setActiveNote(note.name);
  };

  const stopNote = () => {
    if (osc.current) {
      try {
        osc.current.stop();
      } catch (e) {
        // Handle cases where oscillator was already stopped
      }
      osc.current = null;
      setActiveNote(null);
    }
  };

  const controlBtnStyle = {
    background: theme.accent,
    color: theme.name === "Midnights Edition" ? "white" : "black",
    border: 'none',
    padding: '5px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s'
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
      
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

      <h2 style={{ letterSpacing: '2px', color: theme.text }}>PITCH PIPE</h2>

      <div style={{ 
        position: 'relative', 
        width: '350px', 
        height: '350px', 
        margin: '30px 0',
        borderRadius: '50%',
        background: theme.card,
        border: `4px solid ${theme.accent}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.5s ease'
      }}>
        {notes.map((note, i) => {
          const angle = (i * 30) - 90;
          return (
            <button
              key={note.name}
              onClick={() => playNote(note)}
              style={{
                position: 'absolute',
                transform: `rotate(${angle}deg) translate(135px) rotate(${-angle}deg)`,
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                border: 'none',
                background: activeNote === note.name ? 'white' : theme.accent,
                color: activeNote === note.name ? 'black' : (theme.name === "Midnights Edition" ? "white" : "black"),
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: `0 4px 10px rgba(0,0,0,0.3)`,
                transition: '0.2s'
              }}
            >
              {note.name}
            </button>
          );
        })}

        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `2px solid ${theme.accent}`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.2)',
          color: theme.text
        }}>
          <span style={{ fontSize: '32px', fontWeight: 'bold' }}>{activeNote || '--'}</span>
          <span style={{ fontSize: '10px', opacity: 0.6 }}>OCTAVE {octave}</span>
        </div>
      </div>

      <div style={{ 
        background: theme.card, 
        padding: '20px', 
        borderRadius: '15px', 
        width: '100%', 
        maxWidth: '400px',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px',
        border: `1px solid ${theme.accent}33`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.text }}>Volume</span>
          <input 
            type="range" min="0" max="1" step="0.1" 
            value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{ accentColor: theme.accent }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: theme.text }}>Octave</span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setOctave(Math.max(1, octave - 1))} style={controlBtnStyle}>-</button>
            <button onClick={() => setOctave(Math.min(8, octave + 1))} style={controlBtnStyle}>+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchPipe;