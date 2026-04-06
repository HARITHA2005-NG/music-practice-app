// src/utils/progress.js

export const commitToolUsage = (toolName, minutesPracticed) => {
  if (minutesPracticed <= 0) return;

  // 1. XP Multipliers for different tools
  const xpMultipliers = {
    "Metronome": 20,
    "Timer": 10,
    "Tuner": 5,
    "Chord Player": 15
  };

  const xpGained = minutesPracticed * (xpMultipliers[toolName] || 10);

  // 2. Get current global stats
  const currentXP = parseInt(localStorage.getItem('userXP')) || 0;
  const currentTotalMins = parseInt(localStorage.getItem('totalPracticeMinutes')) || 0;

  // 3. Save updated global stats
  localStorage.setItem('userXP', currentXP + xpGained);
  localStorage.setItem('totalPracticeMinutes', currentTotalMins + minutesPracticed);

  // 4. Update the Practice Journal (History Log)
  const existingLogs = JSON.parse(localStorage.getItem('practice_sessions')) || [];
  const newEntry = {
    tool: toolName,
    duration: minutesPracticed,
    xp: xpGained,
    date: new Date().toLocaleDateString(),
    timestamp: Date.now()
  };
  localStorage.setItem('practice_sessions', JSON.stringify([...existingLogs, newEntry]));

  console.log(`%c 📈 Progression Saved: ${toolName} | +${xpGained} XP`, "color: #7c5c9d; font-weight: bold;");
  
  return xpGained; // Return the value so the component can show it in an alert
};