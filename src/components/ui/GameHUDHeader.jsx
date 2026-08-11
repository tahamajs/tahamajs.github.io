// src/components/ui/GameHUDHeader.jsx
import { useState, useEffect } from 'react';

export default function GameHUDHeader({ onOpenQuest, beep }) {
  const [xp, setXp] = useState(4850);
  const [level, setLevel] = useState(12);
  const [questOpen, setQuestOpen] = useState(false);
  const [quests, setQuests] = useState([
    { id: 'cli', text: 'Launch Terminal Shell (⌘J)', done: true, xp: 200 },
    { id: 'nn', text: 'Train 2D Neural Network Classifier', done: true, xp: 300 },
    { id: 'paper', text: 'Read Math Formulation in Paper Reader', done: false, xp: 250 },
    { id: 'arcade', text: 'Score 1,000+ FLOPS in Cyberpunk Arcade', done: false, xp: 500 },
    { id: 'contact', text: 'Send Collaboration Proposal or Copy Email', done: false, xp: 400 },
  ]);

  const toggleQuest = (id) => {
    setQuests(prev => prev.map(q => {
      if (q.id === id && !q.done) {
        beep?.(880, 'sine');
        setXp(x => {
          const newXp = x + q.xp;
          if (newXp >= 5000) {
            setLevel(l => l + 1);
            return newXp - 5000;
          }
          return newXp;
        });
        return { ...q, done: true };
      }
      return q;
    }));
  };

  const completedCount = quests.filter(q => q.done).length;

  return (
    <div className="game-hud-bar">
      <div className="hud-pill" onClick={() => { setQuestOpen(!questOpen); beep?.(700); }}>
        <span className="hud-avatar">🤖</span>
        <div className="hud-info">
          <div className="hud-title">LVL {level} TAHA-ARCHITECT</div>
          <div className="hud-xp-bar">
            <div className="hud-xp-fill" style={{ width: `${Math.min(100, (xp / 5000) * 100)}%` }} />
          </div>
        </div>
        <span className="hud-quest-badge">
          📜 Quests: {completedCount}/{quests.length}
        </span>
      </div>

      {questOpen && (
        <div className="quest-log-dropdown">
          <div className="quest-log-header">
            <i className="fas fa-scroll" style={{ color: 'var(--accent)' }} /> Quest Log &amp; Achievements
          </div>
          <div className="quest-list">
            {quests.map(q => (
              <div key={q.id} className={`quest-item ${q.done ? 'done' : ''}`} onClick={() => toggleQuest(q.id)}>
                <i className={`fas ${q.done ? 'fa-check-circle' : 'fa-circle'}`} style={{ color: q.done ? 'var(--emerald)' : 'var(--muted)' }} />
                <span>{q.text}</span>
                <span className="quest-xp">+{q.xp} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
