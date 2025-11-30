import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDiagnosis } from "../hooks/useDiagnosis";
import { userProfileStorage, diagnosisResultStorage } from "../utils/storage";
import AdArea from "../components/advertising/AdArea";
import Button from "../components/common/Button";

export default function Processing() {
  const navigate = useNavigate();
  const { isAnalyzing, isComplete, error, runDiagnosis } = useDiagnosis(3000);
  const [hasExistingResult, setHasExistingResult] = useState(false);

  useEffect(() => {
    // Check if diagnosis result already exists (e.g., from browser back)
    const existingResult = diagnosisResultStorage.get();

    if (existingResult) {
      // Result already exists, skip diagnosis and show complete state
      setHasExistingResult(true);
      return;
    }

    // Get user profile from session storage
    const profile = userProfileStorage.get();

    if (!profile) {
      // No profile found, redirect to start page
      navigate("/diagnosis/start");
      return;
    }

    // Run diagnosis
    runDiagnosis(profile);
  }, [navigate, runDiagnosis]);

  // Handle error - redirect back to start
  useEffect(() => {
    if (error) {
      alert(error);
      navigate("/diagnosis/start");
    }
  }, [error, navigate]);

  const showComplete = isComplete || hasExistingResult;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Text */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-12">
          {showComplete ? "分析完了！" : "分析中..."}
        </h1>

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <img
              src="/logo.svg"
              alt="Loading"
              className="w-30 h-30"
              style={{
                animation: showComplete
                  ? "none"
                  : "gentle-rotate 1s ease-in-out infinite",
              }}
            />
          </div>
        </div>

        <style>{`
          @keyframes gentle-rotate {
            0%, 100% {
              transform: rotate(0deg) scale(1);
              opacity: 0.7;
            }
            50% {
              transform: rotate(5deg) scale(1.05);
              opacity: 1;
            }
          }
        `}</style>

        {/* Caption */}
        {!showComplete ? (
          <p className="text-center text-gray-700 text-lg mb-12">
            あなたの成分を抽出中...
          </p>
        ) : (
          <p className="text-center text-gray-700 text-lg mb-12">
            恋と人生の反応式が解明されました！
          </p>
        )}

        {/* Video Ad Area */}
        <AdArea className="mb-12" />

        {/* Result Button */}
        {showComplete && (
          <Button
            onClick={() => navigate("/diagnosis/results")}
            fullWidth
            disabled={isAnalyzing}
          >
            結果を見る
          </Button>
        )}
      </div>
    </div>
  );
}
