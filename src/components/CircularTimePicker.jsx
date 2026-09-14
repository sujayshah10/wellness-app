import { useState } from "react";
import "./CircularTimePicker.css";

export default function CircularTimePicker({ value, onChange, label }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(() => {
    if (value) {
      const [h, m] = value.split(':');
      return parseInt(h, 10);
    }
    return 12;
  });
  const [minutes, setMinutes] = useState(() => {
    if (value) {
      const [h, m] = value.split(':');
      return parseInt(m, 10);
    }
    return 0;
  });
  const [isHourMode, setIsHourMode] = useState(true);

  const formatTime = (h, m) => {
    const formattedHours = h.toString().padStart(2, '0');
    const formattedMinutes = m.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleOpen = () => {
    if (value) {
      const [h, m] = value.split(':');
      setHours(parseInt(h, 10));
      setMinutes(parseInt(m, 10));
    }
    setIsOpen(true);
    setIsHourMode(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsHourMode(true);
  };

  const handleConfirm = () => {
    onChange(formatTime(hours, minutes));
    handleClose();
  };

  const handleHourClick = (hour) => {
    setHours(hour);
    setIsHourMode(false);
  };

  const handleMinuteClick = (minute) => {
    setMinutes(minute);
  };

  const renderClock = () => {
    const numbers = isHourMode ? 
      Array.from({ length: 12 }, (_, i) => i + 1) : 
      Array.from({ length: 12 }, (_, i) => i * 5);
    
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    
    return (
      <div className="circular-time-picker-clock">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Clock face */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="var(--app-surface)"
            stroke="var(--app-border)"
            strokeWidth="2"
          />
          
          {/* Numbers */}
          {numbers.map((num) => {
            const angle = isHourMode ? 
              ((num - 3) * 30 * Math.PI) / 180 : 
              ((num / 60 - 0.25) * 360 * Math.PI) / 180;
            const x = centerX + radius * 0.8 * Math.cos(angle);
            const y = centerY + radius * 0.8 * Math.sin(angle);
            const isSelected = isHourMode ? 
              num === (hours % 12 || 12) : 
              num === minutes;
            
            return (
              <g key={num} onClick={() => isHourMode ? handleHourClick(num) : handleMinuteClick(num)}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 20 : 15}
                  fill={isSelected ? "var(--app-primary)" : "transparent"}
                  stroke={isSelected ? "var(--app-primary)" : "var(--app-muted)"}
                  strokeWidth={isSelected ? 3 : 1}
                  style={{ cursor: 'pointer' }}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? "white" : "var(--app-text)"}
                  fontSize={isSelected ? 14 : 12}
                  fontWeight={isSelected ? 600 : 400}
                  style={{ cursor: 'pointer', pointerEvents: 'none' }}
                >
                  {num}
                </text>
              </g>
            );
          })}
          
          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r={8}
            fill="var(--app-primary)"
          ></circle>
          
          {/* Current value indicator */}
          <text
            x={centerX}
            y={centerY + 40}
            textAnchor="middle"
            fill="var(--app-text)"
            fontSize={24}
            fontWeight="600"
          >
            {isHourMode ? hours.toString().padStart(2, '0') : minutes.toString().padStart(2, '0')}
          </text>
          <text
            x={centerX}
            y={centerY + 65}
            textAnchor="middle"
            fill="var(--app-muted)"
            fontSize={12}
          >
            {isHourMode ? 'Hours' : 'Minutes'}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="circular-time-picker">
      <label style={{ display: "block", marginBottom: "8px", fontWeight: 600, color: "var(--app-text)" }}>
        {label}
      </label>
      
      <button
        type="button"
        onClick={handleOpen}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid var(--app-border)",
          borderRadius: "8px",
          background: "var(--app-surface)",
          color: "var(--app-text)",
          fontSize: "16px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span>{value || "Select time"}</span>
        <span style={{ fontSize: "20px" }}>🕐</span>
      </button>

      {isOpen && (
        <div className="circular-time-picker-modal" onClick={handleClose}>
          <div className="circular-time-picker-content" onClick={(e) => e.stopPropagation()}>
            <div className="circular-time-picker-header">
              <button onClick={handleClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer" }}>
                ✕
              </button>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "var(--app-text)" }}>
                Select Time
              </span>
              <button onClick={handleConfirm} style={{ 
                background: "var(--app-primary)", 
                color: "white", 
                border: "none", 
                padding: "8px 16px", 
                borderRadius: "6px", 
                fontSize: "14px", 
                fontWeight: 600, 
                cursor: "pointer" 
              }}>
                Done
              </button>
            </div>
            
            {renderClock()}
            
            <div className="circular-time-picker-toggle">
              <button
                onClick={() => setIsHourMode(true)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: isHourMode ? "var(--app-primary)" : "var(--app-surface)",
                  color: isHourMode ? "white" : "var(--app-text)",
                  border: "1px solid var(--app-border)",
                  borderRadius: "8px 0 0 8px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Hours
              </button>
              <button
                onClick={() => setIsHourMode(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: !isHourMode ? "var(--app-primary)" : "var(--app-surface)",
                  color: !isHourMode ? "white" : "var(--app-text)",
                  border: "1px solid var(--app-border)",
                  borderRadius: "0 8px 8px 0",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Minutes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
