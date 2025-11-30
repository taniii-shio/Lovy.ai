import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface LifeAllocationItem {
  key: string;
  label: string;
  percent: number;
  text: string;
}

interface LifeAllocationChartProps {
  items: LifeAllocationItem[];
  summaryText?: string;
}

export default function LifeAllocationChart({
  items,
  summaryText,
}: LifeAllocationChartProps) {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) {
    return null;
  }

  const iconMap: Record<string, string> = {
    friends: "👥",
    partner: "💑",
    hobbies: "🎨",
    family: "👨‍👩‍👧‍👦",
    work: "💼",
  };

  const colors = [
    "#e9d5ff", // purple-200
    "#fbcfe8", // pink-200
    "#ddd6fe", // violet-200
    "#fce7f3", // pink-100
    "#f3e8ff", // purple-100
  ];

  const sortedItems = [...items].sort((a, b) => b.percent - a.percent);

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">人生の時間配分</h3>
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
        {/* Pie Chart */}
        <div ref={ref} className="flex items-center justify-center mb-6">
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            className="transform -rotate-90"
          >
            <defs>
              {/* Circular reveal mask that animates clockwise */}
              <mask id="reveal-mask">
                <circle cx="140" cy="140" r="120" fill="black" />
                <circle
                  cx="140"
                  cy="140"
                  r="120"
                  fill="none"
                  stroke="white"
                  strokeWidth="240"
                  strokeDasharray="754"
                  strokeDashoffset={isVisible ? 0 : 754}
                  style={{
                    transition: "stroke-dashoffset 1.5s ease-out",
                  }}
                />
              </mask>
            </defs>
            <g mask="url(#reveal-mask)">
              {(() => {
                let currentAngle = 0;
                const radius = 120;
                const centerX = 140;
                const centerY = 140;

                return sortedItems.map((item, index) => {
                  const percentage = item.percent;
                  const angle = (percentage / 100) * 360;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + angle;

                  // Convert angles to radians
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  // Calculate arc points
                  const x1 = centerX + radius * Math.cos(startRad);
                  const y1 = centerY + radius * Math.sin(startRad);
                  const x2 = centerX + radius * Math.cos(endRad);
                  const y2 = centerY + radius * Math.sin(endRad);

                  // Large arc flag
                  const largeArcFlag = angle > 180 ? 1 : 0;

                  // Create path
                  const pathData = [
                    `M ${centerX} ${centerY}`,
                    `L ${x1} ${y1}`,
                    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                    "Z",
                  ].join(" ");

                  currentAngle = endAngle;

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  );
                });
              })()}
            </g>
            {/* Labels and Icons */}
            {(() => {
              let currentAngle = 0;
              const centerX = 140;
              const centerY = 140;

              return sortedItems.map((item, index) => {
                const percentage = item.percent;
                const angle = (percentage / 100) * 360;
                const midAngle = currentAngle + angle / 2;
                currentAngle += angle;

                // Calculate label position (60% of radius from center)
                // SVG is rotated -90deg, so 0deg is at top
                const labelRadius = 70;
                const midRad = (midAngle * Math.PI) / 180;
                const labelX = centerX + labelRadius * Math.cos(midRad);
                const labelY = centerY + labelRadius * Math.sin(midRad);

                return (
                  <g key={`label-${index}`}>
                    {/* Percentage */}
                    <text
                      x={labelX}
                      y={labelY + 5}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="#374151"
                      transform={`rotate(90, ${labelX}, ${labelY + 5})`}
                    >
                      {Math.round(percentage)}
                      <tspan fontSize="11">%</tspan>
                    </text>
                  </g>
                );
              });
            })()}
          </svg>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          {sortedItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: colors[index % colors.length],
                  }}
                />
                <span className="text-xl">{iconMap[item.key]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm font-bold text-gray-800">
                    {item.label}
                  </span>
                  <span className="text-lg font-bold text-gray-800 ml-2">
                    {Math.round(item.percent)}%
                  </span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {summaryText && (
          <>
            <hr className="my-4 border-gray-200" />
            <div>
              <h4 className="text-gray-800 text-sm font-bold mb-2">まとめ</h4>
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {summaryText}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
