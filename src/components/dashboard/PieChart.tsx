// PieChart component stub
// Simple SVG Pie Chart for completion stats
interface PieChartProps {
  percent?: number;
}

export default function PieChart({ percent = 72 }: PieChartProps) {
  const radius = 60;
  const stroke = 16;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="#334155"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="#10b981"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy="0.3em"
          fontSize="2rem"
          fill="#fff"
        >
          {percent}%
        </text>
      </svg>
      <div className="mt-2 text-slate-400 text-sm">Completion</div>
    </div>
  );
}
