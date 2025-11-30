import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface LoveLanguageItem {
  rank: number;
  label: string;
  score: number;
  text: string;
}

interface LoveLanguageSectionProps {
  items: LoveLanguageItem[];
  summaryText?: string;
}

export default function LoveLanguageSection({
  items,
  summaryText,
}: LoveLanguageSectionProps) {
  const { ref, isVisible } = useScrollAnimation();

  if (!items || items.length === 0) {
    return null;
  }

  const icons = ["💕", "💬", "🎁", "⏰", "🤝"];
  const bgColors = [
    "bg-pink-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        重視する愛情表現
      </h3>
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
        <div ref={ref} className="space-y-4">
          {items
            .sort((a, b) => a.rank - b.rank)
            .map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 ${bgColors[index]} rounded-xl flex items-center justify-center text-xl`}
                    >
                      {icons[index]}
                    </div>
                    <span className="text-base font-bold text-gray-800">
                      {item.label}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: isVisible ? `${item.score}%` : "0%",
                      background:
                        index % 2 === 0
                          ? "linear-gradient(to right, #ec4899, #f472b6)"
                          : "linear-gradient(to right, #a855f7, #ec4899)",
                    }}
                  />
                </div>
                <p className="text-gray-700 text-sm leading-relaxed pl-13 mb-4 font-medium">
                  {item.text}
                </p>
                {index < items.length - 1 && (
                  <hr className="my-4 border-gray-200" />
                )}
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
