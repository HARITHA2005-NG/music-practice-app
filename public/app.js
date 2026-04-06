import React from 'react';
import './App.css';

function App() {
  return (
    <div className="musicca-clone">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">MUSIC PRACTICE</div>
        <div className="nav-links">
          <span>Exercises</span>
          <span>Instruments</span>
          <span className="active">Tools</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="content">
        <h1>Metronome</h1>
        <div className="tool-container">
          {/* Your Metronome Logic goes here */}
          <div className="bpm-display">120</div>
          <button className="play-btn">START</button>
        </div>
      </main>
    </div>
  );
}

export default App;