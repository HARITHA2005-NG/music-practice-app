import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PracticeLog = ({ theme }) => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('practice_sessions')) || [];
    setLogs(savedLogs.reverse()); // Show newest first
  }, []);

  const totalMinutes = logs.reduce((sum, log) => sum + (log.duration || 0), 0);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button onClick={() => navigate('/dashboard')} style={backBtnStyle(theme)}>← BACK TO TOOLS</button>

      <div style={{ width: '100%', maxWidth: '600px' }}>
        <h2 style={{ color: theme.text, textAlign: 'center', letterSpacing: '2px' }}>PRACTICE JOURNAL 📖</h2>
        
        {/* Total Stats Summary */}
        <div className="card" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', background: theme.card }}>
           <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', opacity: 0.7, color: theme.text }}>TOTAL SESSIONS</span>
              <h3 style={{ color: theme.accent, margin: '5px 0' }}>{logs.length}</h3>
           </div>
           <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', opacity: 0.7, color: theme.text }}>TOTAL MINUTES</span>
              <h3 style={{ color: theme.accent, margin: '5px 0' }}>{totalMinutes}</h3>
           </div>
        </div>

        {/* The Data Table */}
        <div style={{ background: theme.card, borderRadius: '20px', padding: '10px', border: `1px solid ${theme.accent}33` }}>
          {logs.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', opacity: 0.5 }}>No sessions recorded yet. Start practicing!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', color: theme.text }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.accent}33`, fontSize: '12px' }}>
                  <th style={{ padding: '15px', textAlign: 'left' }}>DATE</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>TOOL</th>
                  <th style={{ padding: '15px', textAlign: 'right' }}>MINS</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '15px', fontSize: '14px' }}>{log.date}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.tool}</td>
                    <td style={{ padding: '15px', textAlign: 'right', color: theme.accent }}>{log.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const backBtnStyle = (theme) => ({
  alignSelf: 'flex-start',
  background: 'transparent',
  color: theme.text,
  border: `1px solid ${theme.accent}`,
  padding: '10px 20px',
  borderRadius: '30px',
  cursor: 'pointer',
  marginBottom: '20px'
});

export default PracticeLog;