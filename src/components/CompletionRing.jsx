import "./CompletionRing.css";

export default function CompletionRing({ completion = 0, size = 120, strokeWidth = 8, showLabel = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (completion * circumference);
  
  const getCompletionColor = (value) => {
    if (value >= 0.8) return "#10B981"; // Green
    if (value >= 0.5) return "#F59E0B"; // Amber
    return "#EF4444"; // Red
  };

  const strokeColor = getCompletionColor(completion);
  const percentage = Math.round(completion * 100);

  return (
    <div className="completion-ring" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="completion-ring-svg"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2937"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="completion-ring-progress"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease"
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="completion-ring-label">
          <span className="completion-percentage">{percentage}%</span>
          <span className="completion-text">Complete</span>
        </div>
      )}
    </div>
  );
}
