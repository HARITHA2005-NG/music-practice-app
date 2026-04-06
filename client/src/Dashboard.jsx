import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProgressTracker from './ProgressTracker'; 

const Dashboard = ({ theme }) => { 
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      navigate('/');
    }
  }, [navigate]);

  const username = localStorage.getItem('username') || 'Musician';
  const userLevel = localStorage.getItem('userLevel') || 'Beginner';

  const tools = [
    { id: 'metronome', title: 'Metronome', icon: '🎸', desc: 'Stay in the 22 rhythm', color: '#d4af37' },
    { id: 'tuner', title: 'Tuner', icon: '🎼', desc: 'Pitch perfect like Taylor', color: '#7c5c9d' },
    // 1. UPDATED ID TO 'piano' AND DESCRIPTION TO MATCH YOUR NEW TOOL
    { id: 'piano', title: 'Virtual Piano', icon: '🎹', desc: 'Compose a love story', color: '#ffffff' }, 
    { id: 'pitch-pipe', title: 'Pitch Pipe', icon: '🎼', desc: 'Find your starting note', color: '#818cf8' },
    { id: 'tone', title: 'Tone Generator', icon: '📡', desc: 'Generate pure frequencies', color: '#6366f1' },
    { id: 'chord-player', title: 'Chord Player', icon: '🎹', desc: 'Harmonies from the lakes', color: '#5b7065' },
    { id: 'tapper', title: 'BPM Tapper', icon: '🧣', desc: 'All Too Well tempo', color: '#8b0000' },
    { id: 'timer', title: 'Timer', icon: '🏹', desc: 'The Archer practice', color: '#f7cfd8' },
    { id: 'select-level', title: 'Update Level', icon: '✨', desc: 'Change your musical era', color: '#1e293b' }
  ];

  const lyrics = [
    "It's a love story, baby, just say, 'Yes.'",
    "Best believe I'm still bejeweled...",
    "Long story short, I survived.",
    "I'm the problem, it's me!",
    "Shake it off!",
    "And I was enchanting to meet you."
  ];

  const randomLyric = lyrics[Math.floor(Math.random() * lyrics.length)];

  return (
    <div className="page-fade" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER SECTION */}
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: theme.text, fontSize: '38px', marginBottom: '10px' }}>
          Hello, {username}!
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ 
            background: theme.accent, 
            color: 'white', 
            padding: '5px 15px', 
            borderRadius: '20px', 
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}>
            {userLevel.toUpperCase()}
          </span>
          <p style={{ margin: 0, fontStyle: 'italic', color: theme.accent, fontSize: '16px', opacity: 0.8 }}>
            "{randomLyric}"
          </p>
        </div>
      </header>

      {/* PROGRESS TRACKER SECTION */}
      <div style={{ marginBottom: '40px' }}>
        <ProgressTracker theme={theme} />
      </div>

      {/* TOOLS GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '25px' 
      }}>
        {tools.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => navigate(`/${tool.id}`)}
            className="tool-card"
            style={{
              background: theme.card, 
              padding: '30px',
              borderRadius: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              borderTop: `6px solid ${tool.color}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: theme.text 
            }}
          >
            <div style={{ fontSize: '45px', marginBottom: '15px' }}>{tool.icon}</div>
            <h3 style={{ margin: '0 0 10px 0', color: theme.text, fontSize: '20px' }}>{tool.title}</h3>
            <p style={{ fontSize: '14px', opacity: 0.7, lineHeight: '1.4' }}>{tool.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;