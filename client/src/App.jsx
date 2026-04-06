import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Metronome from './Metronome';
import Tuner from './Tuner';
import Dashboard from './Dashboard';
import PracticeTimer from './PracticeTimer';
import BPMTapper from './BPMTapper';
import ToneGenerator from './ToneGenerator';
import PitchPipe from './PitchPipe';
import ChordPlayer from './ChordPlayer'; 
import LevelSelection from './LevelSelection'; 
import Piano from './Piano'; // 1. Renamed SightReading to Piano

const themes = {
  midnights: {
    name: "Midnights Edition",
    bg: 'linear-gradient(-45deg, #0f172a, #1e293b, #334155, #020617)',
    nav: 'linear-gradient(90deg, #1e1b4b 0%, #312e81 100%)',
    text: '#e2e8f0',
    card: 'rgba(30, 41, 59, 0.7)',
    accent: '#818cf8',
    button: '#6366f1'
  },
  reputation: {
    name: "Reputation's Version",
    bg: 'linear-gradient(-45deg, #000000, #1a1a1a, #333333, #000000)',
    nav: '#000000',
    text: '#ffffff',
    card: 'rgba(30, 30, 30, 0.9)',
    accent: '#d4af37',
    button: '#333333'
  }
};

const Navbar = ({ era, setEra, theme }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <nav style={{ 
      padding: '15px 25px', 
      background: theme.nav, 
      display: 'flex', 
      alignItems: 'center',
      transition: 'background 0.5s ease',
      minHeight: '60px'
    }}>
      <span style={{ color: 'white', fontWeight: 'bold', letterSpacing: '1px' }}>
        🎵 MUSIC PRACTICE WEB 
      </span>
      
      <div style={{ flex: 1 }}></div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setEra(era === 'midnights' ? 'reputation' : 'midnights')}
          style={{ 
            background: 'white', 
            color: 'black',
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '20px', 
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          {era === 'midnights' ? "GO REPUTATION" : "GO MIDNIGHTS"}
        </button>

        {username && (
          <button 
            onClick={handleLogout} 
            style={{ 
              background: 'transparent', 
              color: 'white', 
              border: '1px solid white', 
              padding: '8px 15px', 
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            LOGOUT
          </button>
        )}
      </div>
    </nav>
  );
};

export default function App() {
  const [era, setEra] = useState('midnights');
  const [loading, setLoading] = useState(true); 
  const currentTheme = themes[era];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); 
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100%',
        background: 'linear-gradient(45deg, #0f172a, #1e1b4b)', 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#e2e8f0',
        fontFamily: "'Georgia', serif"
      }}>
        <div className="sparkle-text" style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '10px' }}>
          ✨ Music Practice Web ✨
        </div>
        <p style={{ letterSpacing: '3px', opacity: 0.8 }}>PROFESSIONAL TOOLKIT</p>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <div style={{ 
        minHeight: '100vh', 
        background: currentTheme.bg, 
        color: currentTheme.text,
        transition: 'all 0.5s ease',
        fontFamily: "'Georgia', serif"
      }}>
        <Navbar era={era} setEra={setEra} theme={currentTheme} />
        
        <div className="page-container">
          <Routes>
            <Route path="/" element={<Login theme={currentTheme} />} />
            <Route path="/register" element={<Register theme={currentTheme} />} />
            <Route path="/select-level" element={<LevelSelection theme={currentTheme} />} />
            
            {/* 2. Updated path and component name */}
            <Route path="/piano" element={<Piano theme={currentTheme} />} />
            
            <Route path="/dashboard" element={<Dashboard theme={currentTheme} />} />
            <Route path="/metronome" element={<Metronome theme={currentTheme} />} />
            <Route path="/tuner" element={<Tuner theme={currentTheme} />} /> 
            <Route path="/timer" element={<PracticeTimer theme={currentTheme} />} />
            <Route path="/tapper" element={<BPMTapper theme={currentTheme} />} />
            <Route path="/tone" element={<ToneGenerator theme={currentTheme} />} />
            <Route path="/pitch-pipe" element={<PitchPipe theme={currentTheme} />} />
            <Route path="/chord-player" element={<ChordPlayer theme={currentTheme} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}