import "./ProgressChart.css";

export default function ProgressChart({ data, label, color = "#3B82F6", unit = "" }) {
  if (!data || data.length === 0) {
    return (
      <div className="progress-chart empty">
        <div className="empty-message">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;
  
  const chartHeight = 120;
  const chartWidth = 100; // percentage
  const padding = 10;
  
  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * (chartWidth - 2 * padding) + padding;
    const normalizedValue = (point.value - minValue) / range;
    const y = chartHeight - (normalizedValue * (chartHeight - 2 * padding)) - padding;
    return { x, y, value: point.value, label: point.label };
  });

  const pathD = points.map((point, index) => {
    return `${index === 0 ? 'M' : 'L'} ${point.x}% ${point.y}%`;
  }).join(' ');

  const areaD = `${pathD} L ${points[points.length - 1].x}% 100% L ${points[0].x}% 100% Z`;

  return (
    <div className="progress-chart">
      <div className="chart-header">
        <span className="chart-label">{label}</span>
        <span className="chart-value">
          {data[data.length - 1].value}{unit}
        </span>
      </div>
      
      <div className="chart-container">
        <svg
          viewBox="0 0 100 120"
          preserveAspectRatio="none"
          className="chart-svg"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <line
              key={fraction}
              x1="0"
              y1={fraction * 100}
              x2="100"
              y2={fraction * 100}
              stroke="#374151"
              strokeWidth="0.5"
              strokeDasharray="2,2"
              opacity="0.3"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={areaD}
            fill={color}
            opacity="0.2"
          />
          
          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="2"
              fill={color}
              className="chart-point"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="chart-labels">
          {points.filter((_, index) => index % Math.ceil(points.length / 5) === 0).map((point, index) => (
            <span key={index} className="chart-x-label">
              {point.label}
            </span>
          ))}
        </div>
      </div>
      
      {/* Min/Max values */}
      <div className="chart-stats">
        <span className="stat">
          Min: {minValue}{unit}
        </span>
        <span className="stat">
          Max: {maxValue}{unit}
        </span>
      </div>
    </div>
  );
}
