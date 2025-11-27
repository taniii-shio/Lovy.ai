import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MBTIType, LoveType, DiagnosisResult } from "../types";
import PageBackground from "../components/PageBackground";

export default function AnalyzingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const analyze = async () => {
      // Get user profile from sessionStorage
      const profileData = sessionStorage.getItem("userProfile");
      if (!profileData) {
        navigate("/input");
        return;
      }

      const { nickname, mbti, loveType } = JSON.parse(profileData) as {
        nickname: string;
        mbti: MBTIType;
        loveType: LoveType;
      };

      try {
        // Call API
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mbti, loveType }),
        });

        if (!response.ok) {
          throw new Error("分析に失敗しました");
        }

        const result: DiagnosisResult = await response.json();

        // Store result with nickname
        sessionStorage.setItem(
          "diagnosisResult",
          JSON.stringify({ ...result, nickname })
        );

        // Wait a minimum time for UX
        await new Promise((resolve) => setTimeout(resolve, 3000));

        navigate("/result");
      } catch (error) {
        console.error("Analysis error:", error);
        alert("分析中にエラーが発生しました。もう一度お試しください。");
        navigate("/input");
      }
    };

    analyze();
  }, [navigate]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <PageBackground />

      <div className="max-w-lg w-full">
        {/* Text */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-12">
          診断中...
        </h1>

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <img
              src="/logo.svg"
              alt="Loading"
              className="w-30 h-30"
              style={{
                animation: "gentle-rotate 1s ease-in-out infinite",
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
        <p className="text-center text-gray-700 text-lg mb-2">
          あなたの成分を抽出中...
        </p>
        <p className="text-center text-gray-700 text-lg mb-12">
          恋と人生の反応式を計算しています...
        </p>

        {/* Video Ad Area */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-2 border-dashed border-gray-300 p-24 text-center">
          <p className="text-gray-400 font-semibold text-lg mb-2">
            Video AD Area
          </p>
          <p className="text-gray-400 text-sm">ここに動画広告が表示されます</p>
        </div>
      </div>
    </div>
  );
}
