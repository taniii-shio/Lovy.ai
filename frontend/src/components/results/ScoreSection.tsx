import React from "react";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface ScoreSectionProps {
  scores: {
    chance: number;
    firstImpression: number;
    lastingLikeability: number;
  };
}

const ScoreSection = React.memo(function ScoreSection({ scores }: ScoreSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className="space-y-4">
      {/* 出会いの機会 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-semibold text-gray-700">
              出会いの機会
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${scores.chance}%` : "0%",
              background: "linear-gradient(to right, #a855f7, #ec4899)",
            }}
          />
        </div>
      </div>

      {/* 第一印象 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">✨</span>
            <span className="text-sm font-semibold text-gray-700">
              第一印象
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${scores.firstImpression}%` : "0%",
              background: "linear-gradient(to right, #ec4899, #f472b6)",
            }}
          />
        </div>
      </div>

      {/* 長期的好感度 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">💝</span>
            <span className="text-sm font-semibold text-gray-700">
              長期的好感度
            </span>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: isVisible ? `${scores.lastingLikeability}%` : "0%",
              background: "linear-gradient(to right, #a855f7, #ec4899)",
            }}
          />
        </div>
      </div>
    </div>
  );
});

export default ScoreSection;
