import React from 'react';
import { useNavigate } from 'react-router-dom';

const LevelSelection = ({ theme }) => {
  const navigate = useNavigate();

  const handleSelect = (level) => {
    // Save the choice so the Dashboard and Tools can see it
    localStorage.setItem('userLevel', level);
    
    // Navigate to the dashboard after selection
    navigate('/dashboard');
  };

  const levels = [
    { 
      id: 'beginner', 
      title: 'Beginner', 
      icon: '🎵', 
      desc: 'Master the basics: simple scales and steady rhythms.',
      color: '#4ade80' // Green
    },
    { 
      id: 'intermediate', 
      title: 'Intermediate', 
      icon: '🎸', 
      desc: 'Step it up: complex chords and faster tempos.',
      color: '#60a5fa' // Blue
    },
    { 
      id: 'experienced', 
      title: 'Experienced', 
      icon: '👑', 
      desc: 'Pro level: advanced theory and performance tools.',
      color: '#f87171' // Red
    }
  ];

  return (
    <div style={{ 
      minHeight: '80vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: 'white', marginBottom: '10px', fontSize: '2.5rem' }}>
        Select Your Practice Level
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
        This will customize your tools and tracking.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '25px',
        width: '100%',
        maxWidth: '1100px'
      }}>
        {levels.map((lvl) => (
          <div 
            key={lvl.id}
            onClick={() => handleSelect(lvl.title)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '40px 30px',
              borderRadius: '24px',
              border: `2px solid transparent`,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: 'white'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = lvl.color;
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>{lvl.icon}</div>
            <h2 style={{ marginBottom: '15px' }}>{lvl.title}</h2>
            <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: 0.8 }}>{lvl.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelSelection;