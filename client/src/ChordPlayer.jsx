import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChordPlayer = ({ theme }) => {
  const navigate = useNavigate();
  const [root, setRoot] = useState('C');
  const [type, setType] = useState('Major');
  const [octave, setOctave] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioCtx = useRef(null);
  const activeOscillators = useRef([]);

  // Note to Frequency mapping (Octave 0)
  const noteBaseFreqs = {
    'C': 16.35, 'C#': 17.32, 'D': 18.35, 'D#': 19.45,
    'E': 20.60, 'F': 21.83, 'F#': 23.12, 'G': 24.50,
    'G#': 25.96, 'A': 27.50, 'A#': 29.14, 'B': 30.87
  };

  // Semitone offsets for chord types
  const chordIntervals = {
    'Major': [0, 4, 7],
    'Minor': [0, 3, 7],
    'Diminished': [0, 3, 6],
    'Augmented': [0, 4, 8],
    'Major 7': [0, 4, 7, 11],
    'Minor 7': [0, 3, 7, 10],
    'Dominant 7': [0, 4, 7, 10],
    'Suspended 4': [0, 5, 7]
  };

  const stopChord = () => {
    activeOscillators.current.forEach(osc => {
      try { osc.stop(); } catch (e) {}
    });
    activeOscillators.current = [];
    setIsPlaying(false);
  };

  const playChord = () => {
    stopChord();

    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const intervals = chordIntervals[type];
    const baseFreq = noteBaseFreqs[root] * Math.pow(2, octave);

    intervals.forEach((interval) => {
      const freq = baseFreq * Math.pow(2, interval / 12);
      
      const osc = audioCtx.current.createOscillator();
      const gain = audioCtx.current.createGain();
      
      osc.type = 'triangle'; // Softer, more "organ-like" than sine
      osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      
      gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, audioCtx.current.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(audioCtx.current.destination);
      
      osc.start();
      activeOscillators.current.push(osc);
    });

    setIsPlaying(true);
  };

  // Cleanup
  useEffect(() => {
    return () => stopChord();
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
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
          fontSize: '12px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        ← BACK TO TOOLS
      </button>

      <div style={{ 
        background: theme.card, 
        padding: '40px', 
        borderRadius: '30px', 
        width: '100%', 
        maxWidth: '500px', 
        textAlign: 'center',
        border: `1px solid ${theme.accent}33`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ color: theme.text, letterSpacing: '3px', margin: '0 0 30px 0' }}>CHORD PLAYER</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* ROOT SELECTOR */}
          <div>
            <label style={{ color: theme.text, display: 'block', marginBottom: '10px', fontSize: '12px', opacity: 0.7 }}>ROOT</label>
            <select 
              value={root} 
              onChange={(e) => setRoot(e.target.value)}
              style={selectStyle(theme)}
            >
              {Object.keys(noteBaseFreqs).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* TYPE SELECTOR */}
          <div>
            <label style={{ color: theme.text, display: 'block', marginBottom: '10px', fontSize: '12px', opacity: 0.7 }}>TYPE</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              style={selectStyle(theme)}
            >
              {Object.keys(chordIntervals).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* OCTAVE CONTROL */}
        <div style={{ marginBottom: '40px' }}>
           <span style={{ color: theme.text, fontSize: '14px', marginRight: '15px' }}>Octave: {octave}</span>
           <input 
             type="range" min="2" max="6" step="1" 
             value={octave} 
             onChange={(e) => setOctave(parseInt(e.target.value))}
             style={{ verticalAlign: 'middle', accentColor: theme.accent }}
           />
        </div>

        <button 
          onMouseDown={playChord}
          onMouseUp={stopChord}
          onMouseLeave={stopChord}
          style={{ 
            backgroundColor: theme.accent, 
            color: theme.name === "Midnights Edition" ? "white" : "black",
            width: '100%',
            padding: '20px',
            borderRadius: '15px',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: `0 0 20px ${theme.accent}44`,
            transition: '0.2s'
          }}
        >
          {isPlaying ? `PLAYING ${root} ${type}...` : `HOLD TO PLAY ${root} ${type}`}
        </button>

        <p style={{ marginTop: '20px', color: theme.text, fontSize: '12px', opacity: 0.5 }}>
            Hold the button to sustain the chord.
        </p>
      </div>
    </div>
  );
};

const selectStyle = (theme) => ({
  width: '100%',
  padding: '12px',
  background: ' hsla(245, 93%, 47%, 0.85)',
  color: theme.text,
  border: `1px solid ${theme.accent}66`,
  borderRadius: '10px',
  outline: 'none',
  cursor: 'pointer'
});

export default ChordPlayer;