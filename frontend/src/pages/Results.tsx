import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { DiagnosisResult } from "../types";
import AdArea from "../components/advertising/AdArea";
import { diagnosisResultStorage, userProfileStorage } from "../utils/storage";
import { useShareImage } from "../hooks/useShareImage";
import ScoreSection from "../components/results/ScoreSection";
import PersonalitySection from "../components/results/PersonalitySection";
import CompatibilitySection from "../components/results/CompatibilitySection";
import LoveLanguageSection from "../components/results/LoveLanguageSection";
import LifeAllocationChart from "../components/results/LifeAllocationChart";

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [slotPercentage, setSlotPercentage] = useState(0);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollY = useRef(0);

  const {
    shareImageUrl,
    showShareModal,
    setShowShareModal,
    generateShareImage,
    saveImage,
  } = useShareImage();

  useEffect(() => {
    const resultData = diagnosisResultStorage.get();
    const profileData = userProfileStorage.get();

    if (!resultData || !profileData) {
      navigate("/diagnosis/start");
      return;
    }

    setResult(resultData);
    setNickname(profileData.nickname);
  }, [navigate]);

  // Title animation effect
  useEffect(() => {
    if (!result || !nickname) return;

    const fullTitle = `${nickname}のLovyな人生`;
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
  }, [result, nickname]);

  // Slot animation effect
  useEffect(() => {
    if (!result) return;

    const targetValue = 100 / 256;
    const duration = 1000;
    const steps = 30;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;

      if (currentStep < steps) {
        const randomValue = Math.random() * 10;
        setSlotPercentage(randomValue);
      } else {
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

      if (currentScrollY < 50) {
        setShowFooter(true);
      } else {
        if (Math.abs(scrollDiff) > 5) {
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

  const handleShare = async () => {
    await generateShareImage("share-score-content");
  };

  const handleSaveImage = () => {
    if (nickname) {
      saveImage(nickname);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const {
    attractiveness,
    personalityAxis,
    compatibility,
    loveLanguage,
    lifeAllocation,
  } = result.results;
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
          <div className="text-2xl font-bold text-gray-800 mb-3">
            {(() => {
              const fullTitle = `${nickname}のLovyな人生`;
              const displayedText = fullTitle.slice(0, titleCharCount);
              const parts = displayedText.split("の");

              if (parts.length === 1) {
                return <span className="text-pink-500">{parts[0]}</span>;
              } else {
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
            {/* MBTI/Love Type badges and Pattern Percentage */}
            <div className="flex flex-row items-center mb-6 pb-6 border-b border-gray-200">
              {/* MBTI and Love Type badges */}
              <div className="flex flex-col items-center justify-center flex-1">
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

            {/* Score Breakdown */}
            <ScoreSection scores={attractiveness.scores} />
          </div>
        </div>

        {/* Personality Vector Top 3 */}
        {personalityAxis?.top3 && personalityAxis.top3.length > 0 && (
          <PersonalitySection traits={personalityAxis.top3} />
        )}

        {/* Best Compatibility */}
        {compatibility?.bestMatches && compatibility.bestMatches.length > 0 && (
          <CompatibilitySection matches={compatibility.bestMatches} />
        )}

        {/* Love Language */}
        {loveLanguage?.items && loveLanguage.items.length > 0 && (
          <LoveLanguageSection
            items={loveLanguage.items}
            summaryText={loveLanguage.summaryText}
          />
        )}

        {/* Life Allocation */}
        {lifeAllocation?.items && lifeAllocation.items.length > 0 && (
          <LifeAllocationChart
            items={lifeAllocation.items}
            summaryText={lifeAllocation.summaryText}
          />
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
                    {nickname}
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
                aria-label="診断結果を画像としてシェア"
              >
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-modal-title"
          >
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full border border-white/50 shadow-2xl">
              <h3 id="share-modal-title" className="text-2xl font-bold text-gray-800 text-center mb-6">
                シェア画像が完成！
              </h3>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <img
                  src={shareImageUrl}
                  alt="診断結果のシェア画像"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 py-3 px-6 text-gray-600 bg-gray-100 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                  aria-label="モーダルを閉じる"
                >
                  閉じる
                </button>
                <button
                  onClick={handleSaveImage}
                  className="flex-1 py-3 px-6 text-white bg-gradient-lovy rounded-2xl font-semibold hover:shadow-lg transition-all"
                  aria-label="画像をダウンロード"
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
