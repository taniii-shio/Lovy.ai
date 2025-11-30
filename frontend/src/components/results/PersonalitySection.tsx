import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface PersonalityTrait {
  label: string;
  text: string;
}

interface PersonalitySectionProps {
  traits: PersonalityTrait[];
}

export default function PersonalitySection({ traits }: PersonalitySectionProps) {
  const { ref, isVisible } = useScrollAnimation();
  const icons = ["🎭", "🌟", "💫"];

  if (!traits || traits.length === 0) {
    return null;
  }

  return (
    <div ref={ref}>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        性格ベクトル Top3
      </h3>
      <div className="space-y-3">
        {traits.map((trait, index) => (
          <div
            key={index}
            className={`bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 ${
              isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
            style={
              isVisible ? { animationDelay: `${index * 0.15}s` } : {}
            }
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                {icons[index]}
              </div>
              <span className="text-base font-bold text-gray-800">
                {trait.label}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed pl-13 font-medium">
              {trait.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
