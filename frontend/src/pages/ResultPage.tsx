import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { DiagnosisResult } from "../types";
import html2canvas from "html2canvas";
import AdArea from "../components/AdArea";

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<
    (DiagnosisResult & { nickname: string }) | null
  >(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string>("");
  const [animateScores, setAnimateScores] = useState(false);
  const [animateLoveLanguage, setAnimateLoveLanguage] = useState(false);
  const [animateLifeAllocation, setAnimateLifeAllocation] = useState(false);
  const [animatePersonality, setAnimatePersonality] = useState(false);
  const [animateCompatibility, setAnimateCompatibility] = useState(false);
  const [slotPercentage, setSlotPercentage] = useState(0);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const scoresSectionRef = useRef<HTMLDivElement>(null);
  const loveLanguageSectionRef = useRef<HTMLDivElement>(null);
  const lifeAllocationSectionRef = useRef<HTMLDivElement>(null);
  const personalitySectionRef = useRef<HTMLDivElement>(null);
  const compatibilitySectionRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const resultData = sessionStorage.getItem("diagnosisResult");
    if (!resultData) {
      navigate("/input");
      return;
    }

    setResult(JSON.parse(resultData));
  }, [navigate]);

  // Title animation effect
  useEffect(() => {
    if (!result) return;

    const fullTitle = `${result.nickname}のLovyな人生`;
    const duration = 50; // milliseconds per character
    let currentChar = 0;

    const interval = setInterval(() => {
      if (currentChar < fullTitle.length) {
        currentChar++;
        setTitleCharCount(currentChar);
      } else {
        clearInterval(interval);
      }
    }, duration);

    return () => clearInterval(interval);
  }, [result]);

  // Slot animation effect
  useEffect(() => {
    if (!result) return;

    const targetValue = 100 / 256;
    const duration = 1000; // 2 seconds
    const steps = 30;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < steps) {
        // Random values during animation
        const randomValue = Math.random() * 10;
        setSlotPercentage(randomValue);
      } else {
        // Final value
        setSlotPercentage(targetValue);
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [result]);

  // Scroll direction detection for footer
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDiff = currentScrollY - lastScrollY.current;

      // 最上部付近では常に表示
      if (currentScrollY < 50) {
        setShowFooter(true);
      } else {
        // 一定以上スクロールした場合のみ反応（感度調整）
        if (Math.abs(scrollDiff) > 5) {
          // 下にスクロール → 非表示、上にスクロール → 表示
          if (scrollDiff > 0) {
            setShowFooter(false);
          } else {
            setShowFooter(true);
          }
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const scoresObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Element is visible, start animation
            setAnimateScores(true);
          } else {
            // Element is not visible, reset animation
            setAnimateScores(false);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
      }
    );

    const loveLanguageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateLoveLanguage(true);
          } else {
            setAnimateLoveLanguage(false);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const lifeAllocationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateLifeAllocation(true);
          } else {
            setAnimateLifeAllocation(false);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (scoresSectionRef.current) {
      scoresObserver.observe(scoresSectionRef.current);
    }

    if (loveLanguageSectionRef.current) {
      loveLanguageObserver.observe(loveLanguageSectionRef.current);
    }

    if (lifeAllocationSectionRef.current) {
      lifeAllocationObserver.observe(lifeAllocationSectionRef.current);
    }

    const personalityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatePersonality(true);
          } else {
            setAnimatePersonality(false);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    const compatibilityObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateCompatibility(true);
          } else {
            setAnimateCompatibility(false);
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (personalitySectionRef.current) {
      personalityObserver.observe(personalitySectionRef.current);
    }

    if (compatibilitySectionRef.current) {
      compatibilityObserver.observe(compatibilitySectionRef.current);
    }

    return () => {
      if (scoresSectionRef.current) {
        scoresObserver.unobserve(scoresSectionRef.current);
      }
      if (loveLanguageSectionRef.current) {
        loveLanguageObserver.unobserve(loveLanguageSectionRef.current);
      }
      if (lifeAllocationSectionRef.current) {
        lifeAllocationObserver.unobserve(lifeAllocationSectionRef.current);
      }
      if (personalitySectionRef.current) {
        personalityObserver.unobserve(personalitySectionRef.current);
      }
      if (compatibilitySectionRef.current) {
        compatibilityObserver.unobserve(compatibilitySectionRef.current);
      }
    };
  }, [result]);

  const handleShare = async () => {
    const element = document.getElementById("share-score-content");
    if (!element) return;

    try {
      // Find the score element and temporarily change its style for rendering
      const scoreElement = element.querySelector(".score-text");
      const originalClass = scoreElement?.className;

      if (scoreElement) {
        // Replace gradient text with solid color for html2canvas
        scoreElement.className = "text-5xl font-bold text-purple-600";
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      // Restore original styling
      if (scoreElement && originalClass) {
        scoreElement.className = originalClass;
      }

      const imageUrl = canvas.toDataURL("image/png");
      setShareImageUrl(imageUrl);
      setShowShareModal(true);
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("画像の生成に失敗しました");
    }
  };

  const handleSaveImage = () => {
    if (!shareImageUrl) return;

    const link = document.createElement("a");
    link.download = `lovy-result-${result?.nickname || "user"}.png`;
    link.href = shareImageUrl;
    link.click();
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const { attractiveness, personalityAxis } = result.results;

  // Debug: Log the result to see the actual structure
  console.log("Diagnosis Result:", result);

  return (
    <div className="relative min-h-screen">
      {/* CSS Animation */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        @keyframes cursor-blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        .animate-cursor-blink {
          animation: cursor-blink 1.2s infinite;
        }

        @keyframes fade-in-left {
          0% {
            opacity: 0;
            transform: translateX(-40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes fade-in-right {
          0% {
            opacity: 0;
            transform: translateX(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Banner Area */}
        <AdArea variant="banner" />

        {/* Title */}
        <div className="text-center">
          {/* <p className="text-gray-500 text-sm mb-2">AI Analysis Report</p> */}
          <div className="text-2xl font-bold text-gray-800 mb-3">
            {(() => {
              const fullTitle = `${result.nickname}のLovyな人生`;
              const displayedText = fullTitle.slice(0, titleCharCount);
              const parts = displayedText.split("の");

              if (parts.length === 1) {
                // Still showing the nickname part
                return <span className="text-pink-500">{parts[0]}</span>;
              } else {
                // Showing both parts
                return (
                  <>
                    <span className="text-pink-500">{parts[0]}</span>の
                    {parts[1]}
                  </>
                );
              }
            })()}
            <span className="animate-cursor-blink">|</span>
          </div>
        </div>

        {/* Total Score */}
        <div>
          <div
            id="share-score-content"
            className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50"
          >
            {/* MBTI/Love Type badges and Pattern Percentage - Side by Side */}
            <div className="flex flex-row items-center mb-6 pb-6 border-b border-gray-200">
              {/* MBTI and Love Type badges */}
              <div className="flex flex-col items-center justify-center flex-1">
                {/* MBTI Card */}
                <div
                  className="border-2 border-purple-300 px-6 py-1 rounded-xl animate-fade-in-left"
                  style={{ animationDelay: "0.2s" }}
                >
                  <p className="text-base font-bold text-purple-700">
                    {result.mbti}
                  </p>
                </div>

                <span
                  className="text-gray-300 text-md font-light animate-fade-in-up"
                  style={{ animationDelay: "0.35s" }}
                >
                  ×
                </span>

                {/* Love Type Card */}
                <div
                  className="border-2 border-pink-300 px-6 py-1 rounded-xl animate-fade-in-right"
                  style={{ animationDelay: "0.5s" }}
                >
                  <p className="text-base font-bold text-pink-700">
                    {result.loveType}
                  </p>
                </div>
              </div>

              {/* Pattern Percentage */}
              <div
                className="text-center flex-1 animate-fade-in-up"
                style={{ animationDelay: "0.65s" }}
              >
                <p className="text-gray-500 text-xs mb-2">
                  このパターンは全体の
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-6xl font-bold bg-gradient-lovy bg-clip-text text-transparent tabular-nums">
                    {slotPercentage.toFixed(2)}
                  </span>
                  <span className="text-3xl text-gray-400">%</span>
                </div>
              </div>
            </div>

            <p
              className="text-gray-700 text-base mb-6 leading-relaxed font-medium animate-fade-in-up"
              style={{ animationDelay: "0.8s" }}
            >
              {attractiveness.texts.summary}
            </p>

            {/* Score Breakdown with Bar Charts */}
            <div ref={scoresSectionRef} className="space-y-4">
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
                      width: animateScores
                        ? `${attractiveness.scores.chance}%`
                        : "0%",
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
                      width: animateScores
                        ? `${attractiveness.scores.firstImpression}%`
                        : "0%",
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
                      width: animateScores
                        ? `${attractiveness.scores.lastingLikeability}%`
                        : "0%",
                      background: "linear-gradient(to right, #a855f7, #ec4899)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Personality Vector Top 3 */}
        {personalityAxis?.top3 && personalityAxis.top3.length > 0 && (
          <div ref={personalitySectionRef}>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              性格ベクトル Top3
            </h3>
            <div className="space-y-3">
              {personalityAxis.top3.map((trait, index) => {
                const icons = ["🎭", "🌟", "💫"];
                return (
                  <div
                    key={index}
                    className={`bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 ${
                      animatePersonality ? "animate-fade-in-up" : "opacity-0"
                    }`}
                    style={
                      animatePersonality
                        ? { animationDelay: `${index * 0.15}s` }
                        : {}
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
                );
              })}
            </div>
          </div>
        )}

        {/* Best Compatibility */}
        {result.results.compatibility?.bestMatches &&
          result.results.compatibility.bestMatches.length > 0 && (
            <div ref={compatibilitySectionRef}>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ベスト相性
              </h3>
              <div className="space-y-4">
                {result.results.compatibility.bestMatches
                  .slice(0, 3)
                  .map((match, index) => {
                    const gradients = [
                      "linear-gradient(135deg, #ec4899, #a855f7)",
                      "linear-gradient(135deg, #f472b6, #c084fc)",
                      "linear-gradient(135deg, #f9a8d4, #d8b4fe)",
                    ];
                    const isEven = index % 2 === 0;
                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isEven ? "justify-start" : "justify-end"
                        } ${
                          animateCompatibility
                            ? "animate-fade-in-up"
                            : "opacity-0"
                        }`}
                        style={
                          animateCompatibility
                            ? { animationDelay: `${index * 0.15}s` }
                            : {}
                        }
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
          )}

        {/* Love Language */}
        {result.results.loveLanguage?.items &&
          result.results.loveLanguage.items.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                重視する愛情表現
              </h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50">
                <div ref={loveLanguageSectionRef} className="space-y-4">
                  {result.results.loveLanguage.items
                    .sort((a, b) => a.rank - b.rank)
                    .map((item, index) => {
                      const icons = ["💕", "💬", "🎁", "⏰", "🤝"];
                      const bgColors = [
                        "bg-pink-100",
                        "bg-purple-100",
                        "bg-pink-100",
                        "bg-purple-100",
                        "bg-pink-100",
                      ];
                      return (
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
                            {/* <span className="text-2xl font-bold text-pink-500">
                            {Math.round(item.score)}点
                          </span> */}
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: animateLoveLanguage
                                  ? `${item.score}%`
                                  : "0%",
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
                          {index <
                            result.results.loveLanguage.items.length - 1 && (
                            <hr className="my-4 border-gray-200" />
                          )}
                        </div>
                      );
                    })}
                </div>

                {result.results.loveLanguage.summaryText && (
                  <>
                    <hr className="my-4 border-gray-200" />
                    <div>
                      <h4 className="text-gray-800 text-sm font-bold mb-2">
                        まとめ
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {result.results.loveLanguage.summaryText}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        {/* Life Allocation */}
        {result.results.lifeAllocation?.items &&
          result.results.lifeAllocation.items.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                人生の時間配分
              </h3>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                {/* Pie Chart */}
                <div
                  ref={lifeAllocationSectionRef}
                  className="flex items-center justify-center mb-6"
                >
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
                          strokeDashoffset={animateLifeAllocation ? 0 : 754}
                          style={{
                            transition: "stroke-dashoffset 1.5s ease-out",
                          }}
                        />
                      </mask>
                    </defs>
                    <g mask="url(#reveal-mask)">
                      {(() => {
                        const sortedItems = [
                          ...result.results.lifeAllocation.items,
                        ].sort((a, b) => b.percent - a.percent);
                        const colors = [
                          "#e9d5ff", // purple-200
                          "#fbcfe8", // pink-200
                          "#ddd6fe", // violet-200
                          "#fce7f3", // pink-100
                          "#f3e8ff", // purple-100
                        ];
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
                      const sortedItems = [
                        ...result.results.lifeAllocation.items,
                      ].sort((a, b) => b.percent - a.percent);
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
                  {result.results.lifeAllocation.items
                    .sort((a, b) => b.percent - a.percent)
                    .map((item, index) => {
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
                      return (
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
                      );
                    })}
                </div>

                {result.results.lifeAllocation.summaryText && (
                  <>
                    <hr className="my-4 border-gray-200" />
                    <div>
                      <h4 className="text-gray-800 text-sm font-bold mb-2">
                        まとめ
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed font-medium">
                        {result.results.lifeAllocation.summaryText}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        {/* Bottom Banner Area */}
        <AdArea variant="banner" />

        {/* Action Buttons */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white/85 to-transparent pb-6 pt-8 transition-transform duration-500 ease-in-out ${
            showFooter ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center gap-4">
              {/* 診断結果表示 */}
              <div className="flex flex-col items-start flex-shrink-0 max-w-[160px]">
                <p className="text-xs text-gray-800 font-bold mb-1 w-full flex items-center">
                  <span className="truncate flex-shrink">
                    {result.nickname}
                  </span>
                  <span className="flex-shrink-0">さんの診断結果</span>
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-700 flex-shrink-0">
                  <div className="border-2 border-purple-300 px-2 py-0.5 rounded-lg">
                    <p className="text-xs font-bold text-purple-700">
                      {result.mbti}
                    </p>
                  </div>
                  <span className="text-gray-300 text-xs font-light">×</span>
                  <div className="border-2 border-pink-300 px-2 py-0.5 rounded-lg">
                    <p className="text-xs font-bold text-pink-700">
                      {result.loveType}
                    </p>
                  </div>
                </div>
              </div>

              {/* シェアボタン */}
              <button
                onClick={handleShare}
                className="flex-1 py-3 px-6 text-base font-bold text-white bg-gradient-lovy rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <div className="flex flex-col items-center leading-tight">
                  <div>結果をシェア！</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/50 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-800 text-center mb-6">
                シェア画像が完成！
              </h3>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <img
                  src={shareImageUrl}
                  alt="Share"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-3 px-6 text-gray-600 bg-gray-100 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  閉じる
                </button>
                <button
                  onClick={handleSaveImage}
                  className="flex-1 py-3 px-6 text-white bg-gradient-lovy rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  画像保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
