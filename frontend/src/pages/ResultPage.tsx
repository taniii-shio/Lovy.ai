import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DiagnosisResult } from "../types";
import html2canvas from "html2canvas";

export default function ResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<
    (DiagnosisResult & { nickname: string }) | null
  >(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string>("");
  const [showLifeAllocationDetail, setShowLifeAllocationDetail] =
    useState(false);
  const [showLoveLanguageDetail, setShowLoveLanguageDetail] = useState(false);

  useEffect(() => {
    const resultData = sessionStorage.getItem("diagnosisResult");
    if (!resultData) {
      navigate("/input");
      return;
    }

    setResult(JSON.parse(resultData));
  }, [navigate]);

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

  const handleBackToTop = () => {
    sessionStorage.clear();
    window.scrollTo(0, 0);
    navigate("/");
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
    <div className="max-w-2xl mx-auto p-8 space-y-8">
        {/* Title */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">AI Analysis Report</p>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">
            <span className="text-pink-500">{result.nickname}</span>の
          </h2>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Lovyな人生</h2>
          <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
            <span className="bg-purple-100 px-3 py-1 rounded-full font-medium">
              {result.mbti}
            </span>
            <span className="text-gray-400">×</span>
            <span className="bg-pink-100 px-3 py-1 rounded-full font-medium">
              {result.loveType}
            </span>
          </div>
        </div>

        {/* Total Score */}
        <div
          id="share-score-content"
          className="bg-white rounded-3xl p-6 shadow-md"
        >
          <p className="text-center text-gray-400 text-xs font-semibold tracking-wider mb-3">
            TOTAL LOVY SCORE
          </p>
          <div className="text-center">
            <span className="score-text text-5xl font-bold bg-gradient-lovy bg-clip-text text-transparent">
              {Math.round(attractiveness.scores.totalScore)}
            </span>
            <span className="text-2xl text-gray-400 ml-2">/ 100</span>
          </div>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            {attractiveness.texts.summary}
          </p>
        </div>

        {/* Personality Vector Top 3 */}
        {personalityAxis?.top3 && personalityAxis.top3.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              性格ベクトル Top3
            </h3>
            <div className="space-y-3">
              {personalityAxis.top3.map((trait, index) => {
                const icons = ["📅", "🧠", "🌙"];
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-4 shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {icons[index]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-base font-bold text-gray-800">
                            {trait.label}
                          </span>
                          <span className="text-2xl font-bold text-purple-500">
                            {trait.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Best Compatibility */}
        {result.results.compatibility?.bestMatches &&
          result.results.compatibility.bestMatches.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                ベスト相性
              </h3>
              <div className="bg-white rounded-2xl p-5 shadow-md space-y-4">
                {result.results.compatibility.bestMatches
                  .slice(0, 3)
                  .map((match, index) => (
                    <div key={index}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          💕
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between mb-1">
                            <h4 className="text-base font-bold text-gray-800">
                              {match.partner.mbti} ({match.partner.loveType})
                            </h4>
                            <span className="text-base font-bold text-pink-500 whitespace-nowrap ml-2">
                              Rank {index + 1} ({Math.round(match.score)}%)
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {match.description}
                          </p>
                        </div>
                      </div>
                      {index < 2 && <hr className="my-4 border-gray-200" />}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Love Language */}
        {result.results.loveLanguage?.items &&
          result.results.loveLanguage.items.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                愛のトリセツ
              </h3>
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <div className="space-y-4">
                  {result.results.loveLanguage.items
                    .sort((a, b) => a.rank - b.rank)
                    .map((item, index) => {
                      const colors = [
                        "bg-purple-500",
                        "bg-purple-500",
                        "bg-pink-400",
                        "bg-purple-500",
                        "bg-pink-400",
                      ];
                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-gray-700 font-medium text-base">
                              {item.label}
                            </span>
                            <span className="text-gray-600 font-bold text-base">
                              {Math.round(item.score)}点
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                colors[index % colors.length]
                              } rounded-full transition-all duration-500`}
                              style={{ width: `${item.score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>

                {result.results.loveLanguage.summaryText && (
                  <>
                    <hr className="my-4 border-gray-200" />
                    <div>
                      <button
                        onClick={() =>
                          setShowLoveLanguageDetail(!showLoveLanguageDetail)
                        }
                        className="w-full flex items-center justify-between mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                      >
                        <h4 className="text-gray-500 text-sm font-medium">
                          愛のトリセツ詳細解説
                        </h4>
                        <span className="text-purple-500 text-lg">
                          {showLoveLanguageDetail ? "✕" : "+"}
                        </span>
                      </button>
                      {showLoveLanguageDetail && (
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {result.results.loveLanguage.summaryText}
                        </p>
                      )}
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
              <div className="bg-white rounded-2xl p-5 shadow-md">
                {/* Pie Chart */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {(() => {
                        const colors = [
                          "#DDD6FE",
                          "#C4B5FD",
                          "#FBCFE8",
                          "#E9D5FF",
                          "#F9A8D4",
                        ];
                        let currentAngle = 0;
                        return result.results.lifeAllocation.items.map(
                          (item, index) => {
                            const percentage = item.percent;
                            const angle = (percentage / 100) * 360;
                            const startAngle = currentAngle;
                            currentAngle += angle;

                            // Convert angles to radians
                            const startRad = (startAngle * Math.PI) / 180;
                            const endRad = (currentAngle * Math.PI) / 180;

                            // Calculate coordinates for the arc
                            const x1 = 50 + 45 * Math.cos(startRad);
                            const y1 = 50 + 45 * Math.sin(startRad);
                            const x2 = 50 + 45 * Math.cos(endRad);
                            const y2 = 50 + 45 * Math.sin(endRad);

                            // Large arc flag
                            const largeArc = angle > 180 ? 1 : 0;

                            const pathData = [
                              `M 50 50`,
                              `L ${x1} ${y1}`,
                              `A 45 45 0 ${largeArc} 1 ${x2} ${y2}`,
                              `Z`,
                            ].join(" ");

                            return (
                              <path
                                key={index}
                                d={pathData}
                                fill={colors[index % colors.length]}
                                stroke="white"
                                strokeWidth="0.5"
                              />
                            );
                          }
                        );
                      })()}
                    </svg>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3">
                  {result.results.lifeAllocation.items.map((item, index) => {
                    const colors = [
                      "bg-purple-200",
                      "bg-purple-300",
                      "bg-pink-200",
                      "bg-purple-200",
                      "bg-pink-300",
                    ];
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              colors[index % colors.length]
                            }`}
                          />
                          <span className="text-gray-700 font-medium text-sm">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-gray-600 font-bold text-sm">
                          {Math.round(item.percent)}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                {result.results.lifeAllocation.summaryText && (
                  <>
                    <hr className="my-4 border-gray-200" />
                    <div>
                      <button
                        onClick={() =>
                          setShowLifeAllocationDetail(!showLifeAllocationDetail)
                        }
                        className="w-full flex items-center justify-between mb-2 cursor-pointer hover:opacity-70 transition-opacity"
                      >
                        <h4 className="text-gray-500 text-sm font-medium">
                          時間配分詳細解説
                        </h4>
                        <span className="text-purple-500 text-lg">
                          {showLifeAllocationDetail ? "✕" : "+"}
                        </span>
                      </button>
                      {showLifeAllocationDetail && (
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {result.results.lifeAllocation.summaryText}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="fixed bottom-12 left-1/2 transform -translate-x-1/2 w-[calc(100%-3rem)] max-w-md py-4 px-8 text-xl font-bold text-white bg-gradient-lovy rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          診断結果をシェアする！
        </button>

        {/* Back to Top */}
        <button
          onClick={handleBackToTop}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          最初に戻る
        </button>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full">
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
  );
}
