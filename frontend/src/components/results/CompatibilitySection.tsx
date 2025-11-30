import React from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface CompatibilityMatch {
  partner: {
    mbti: string;
    loveType: string;
  };
  description: string;
}

interface CompatibilitySectionProps {
  matches: CompatibilityMatch[];
}

const CompatibilitySection = React.memo(function CompatibilitySection({
  matches,
}: CompatibilitySectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  if (!matches || matches.length === 0) {
    return null;
  }

  const gradients = [
    "linear-gradient(135deg, #ec4899, #a855f7)",
    "linear-gradient(135deg, #f472b6, #c084fc)",
    "linear-gradient(135deg, #f9a8d4, #d8b4fe)",
  ];

  return (
    <div ref={ref}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">ベスト相性</h3>
      <div className="space-y-4">
        {matches.slice(0, 3).map((match, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className={`flex ${isEven ? "justify-start" : "justify-end"} ${
                isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={isVisible ? { animationDelay: `${index * 0.15}s` } : {}}
            >
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 w-[85%] relative overflow-hidden">
                {/* Background number with gradient */}
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[180px] font-bold"
                  style={{
                    background: gradients[index],
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    opacity: 0.15,
                  }}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="text-base font-bold text-gray-800 mb-1">
                    {match.partner.mbti} - {match.partner.loveType}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">
                    {match.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default CompatibilitySection;
