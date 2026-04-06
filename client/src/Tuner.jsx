import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PitchDetector } from 'pitchy';

const Tuner = ({ theme }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState('--');
  const [cents, setCents] = useState(0);
  const [isListening, setIsListening] = useState(false);
  
  // Refs for high-performance audio processing
  const audioCtx = useRef(null);
  const analyser = useRef(null);
  const requestRef = useRef(null);
  const isListeningRef = useRef(false);

  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  useEffect(() => {
    const user = localStorage.getItem('username');
    if (!user) navigate('/');

    return () => {
      stopTuner();
    };
  }, [navigate]);

  const updatePitch = () => {
    if (!isListeningRef.current || !analyser.current || !audioCtx.current) return;

    const detector = PitchDetector.forFloat32Array(analyser.current.fftSize);
    const input = new Float32Array(analyser.current.fftSize);
    analyser.current.getFloat32Values(input);
    const [pitch, clar] = detector.findPitch(input, audioCtx.current.sampleRate);

    if (clar > 0.8 && pitch > 0) {
      const noteNum = 12 * (Math.log(pitch / 440) / Math.log(2)) + 69;
      const roundedNote = Math.round(noteNum);
      const diff = (noteNum - roundedNote) * 50; 
      
      setNote(notes[roundedNote % 12]);
      setCents(diff);
    }
    requestRef.current = requestAnimationFrame(updatePitch);
  };

  const startTuner = async () => {
    try {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = audioCtx.current.createMediaStreamSource(stream);
      analyser.current = audioCtx.current.createAnalyser();
      analyser.current.fftSize = 2048;
      source.connect(analyser.current);

      isListeningRef.current = true;
      setIsListening(true);
      requestRef.current = requestAnimationFrame(updatePitch);
    } catch (err) {
      alert("Microphone access is required! ✨");
    }
  };

  const stopTuner = () => {
    isListeningRef.current = false;
    cancelAnimationFrame(requestRef.current);
    if (audioCtx.current) {
      audioCtx.current.close();
    }
    setIsListening(false);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* BACK BUTTON */}
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
          transition: 'all 0.3s ease',
        }}
      >
        ← BACK TO TOOLS
      </button>

      {/* THE OLD VERSION CARD */}
      <div style={{ 
        background: theme.card, 
        padding: '40px', 
        borderRadius: '30px', 
        width: '100%', 
        maxWidth: '450px', 
        textAlign: 'center',
        boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
        border: `1px solid ${theme.accent}33`,
      }}>
        <h2 style={{ color: theme.text, letterSpacing: '2px', marginTop: 0 }}>INSTRUMENT TUNER</h2>
        
        {!isListening ? (
          <button 
            onClick={startTuner} 
            style={{
              backgroundColor: theme.accent, 
              color: theme.name === "Midnights Edition" ? "white" : "black", 
              padding: '15px 30px',
              borderRadius: '30px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            START LISTENING 🎙️
          </button>
        ) : (
          <div>
            {/* The Big Digital Note Display */}
            <div style={{ 
              fontSize: '100px', 
              fontWeight: 'bold', 
              color: Math.abs(cents) < 5 ? '#2ecc71' : theme.accent,
              textShadow: Math.abs(cents) < 5 ? '0 0 20px #2ecc71' : 'none',
              transition: '0.2s'
            }}>
              {note}
            </div>

            {/* THE OLD HORIZONTAL GAUGE */}
            <div style={{ 
              position: 'relative', 
              height: '40px', 
              marginTop: '30px', 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '20px', 
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              {/* Center Target Mark */}
              <div style={{ position: 'absolute', left: '50%', width: '2px', height: '100%', background: '#2ecc71', zIndex: 2 }} />
              
              {/* The Needle */}
              <div style={{ 
                  position: 'absolute', 
                  left: `calc(50% + ${cents}%)`, 
                  width: '4px', 
                  height: '100%', 
                  background: Math.abs(cents) < 5 ? '#2ecc71' : '#ff4d4d', 
                  transition: 'left 0.1s ease-out',
                  zIndex: 3,
                  boxShadow: Math.abs(cents) < 5 ? '0 0 10px #2ecc71' : 'none'
              }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', color: theme.text, opacity: 0.6, fontSize: '11px', fontWeight: 'bold' }}>
              <span>FLAT</span>
              <span style={{ color: Math.abs(cents) < 5 ? '#2ecc71' : theme.text }}>
                {Math.abs(cents) < 5 ? 'PERFECT' : 'IN TUNE'}
              </span>
              <span>SHARP</span>
            </div>

            {/* Stop Button */}
            <button 
              onClick={stopTuner}
              style={{
                marginTop: '30px',
                background: 'transparent',
                border: `1px solid ${theme.accent}`,
                color: theme.text,
                padding: '8px 20px',
                borderRadius: '20px',
                cursor: 'pointer'
              }}
            >
              Stop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tuner;