import "./StreakCounter.css";

export default function StreakCounter({ currentStreak = 0, longestStreak = 0, compact = false }) {
  const getStreakIcon = (count) => {
    if (count >= 30) return "🔥🔥🔥";
    if (count >= 14) return "🔥🔥";
    if (count >= 7) return "🔥";
    if (count >= 3) return "⚡";
    return "✨";
  };

  const getStreakMessage = (count) => {
    if (count === 0) return "Start your streak today!";
    if (count === 1) return "You're on fire! Keep going!";
    if (count < 7) return "Building momentum!";
    if (count < 14) return "Great consistency!";
    if (count < 30) return "Amazing dedication!";
    return "You're unstoppable!";
  };

  if (compact) {
    return (
      <div className="streak-counter compact">
        <span className="streak-icon">{getStreakIcon(currentStreak)}</span>
        <span className="streak-count">{currentStreak}</span>
        <span className="streak-label">day streak</span>
      </div>
    );
  }

  return (
    <div className="streak-counter">
      <div className="streak-icon-large">{getStreakIcon(currentStreak)}</div>
      <div className="streak-info">
        <div className="streak-current">
          <span className="streak-number">{currentStreak}</span>
          <span className="streak-label">day streak</span>
        </div>
        <div className="streak-message">{getStreakMessage(currentStreak)}</div>
        {longestStreak > 0 && (
          <div className="streak-best">
            Best: <span className="streak-best-number">{longestStreak}</span> days
          </div>
        )}
      </div>
    </div>
  );
}
