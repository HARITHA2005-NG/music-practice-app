import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tone from 'tone';

const Piano = ({ theme }) => {
  const navigate = useNavigate();

  // Create the synthesizer
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();

  const playNote = (note) => {
    // Start audio context if it's suspended (browser security)
    if (Tone.context.state !== 'running') {
      Tone.start();
    }
    synth.triggerAttackRelease(note, "8n");
  };

  const keys = [
    { note: 'C4', type: 'white' },
    { note: 'C#4', type: 'black' },
    { note: 'D4', type: 'white' },
    { note: 'D#4', type: 'black' },
    { note: 'E4', type: 'white' },
    { note: 'F4', type: 'white' },
    { note: 'F#4', type: 'black' },
    { note: 'G4', type: 'white' },
    { note: 'G#4', type: 'black' },
    { note: 'A4', type: 'white' },
    { note: 'A#4', type: 'black' },
    { note: 'B4', type: 'white' },
    { note: 'C5', type: 'white' }
  ];

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        style={{ 
            alignSelf: 'flex-start', 
            background: 'transparent', 
            color: theme.text, 
            border: `1px solid ${theme.accent}`, 
            padding: '10px 20px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            fontWeight: 'bold',
            marginBottom: '40px'
        }}
      >
        ← BACK TO DASHBOARD
      </button>

      <div style={{ 
        background: theme.card, 
        padding: '40px 20px', 
        borderRadius: '30px', 
        width: '100%', 
        maxWidth: '800px', 
        textAlign: 'center', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        border: `1px solid ${theme.accent}22` 
      }}>
        <h2 style={{ color: theme.text, letterSpacing: '2px', marginBottom: '10px' }}>VIRTUAL PIANO</h2>
        <p style={{ color: theme.text, opacity: 0.6, marginBottom: '40px' }}>Play melodies from the Folklore era</p>

        {/* PIANO KEYBOARD CONTAINER */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          position: 'relative', 
          height: '250px',
          paddingBottom: '20px'
        }}>
          {keys.map((key, index) => (
            <div 
              key={key.note}
              onClick={() => playNote(key.note)}
              onMouseDown={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseUp={(e) => e.currentTarget.style.opacity = '1'}
              style={{
                width: key.type === 'white' ? '60px' : '40px',
                height: key.type === 'white' ? '200px' : '120px',
                backgroundColor: key.type === 'white' ? '#fff' : '#000',
                border: '1px solid #ccc',
                borderRadius: '0 0 5px 5px',
                cursor: 'pointer',
                zIndex: key.type === 'white' ? 1 : 2,
                marginLeft: key.type === 'white' ? '-1px' : '-20px',
                marginRight: key.type === 'white' ? '0' : '-20px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: '10px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: key.type === 'white' ? '#888' : '#fff',
                transition: 'all 0.1s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            >
              {key.type === 'white' ? key.note.replace('4', '').replace('5', '') : ''}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px', color: theme.accent, fontSize: '14px', fontStyle: 'italic' }}>
          Tap the keys to play. Best experienced with headphones.
        </div>
      </div>
    </div>
  );
};

export default Piano;