import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MBTIType, LoveType, DiagnosisResult } from "../types";

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Animated bubbles */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-lovy rounded-full opacity-60 animate-ping"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-lovy rounded-full opacity-80 animate-pulse"></div>
            </div>
            <div className="relative w-32 h-32 flex items-center justify-center">
              <div className="w-12 h-12 bg-pink-400 rounded-full"></div>
              <div className="absolute top-4 right-8 w-8 h-8 bg-purple-400 rounded-full"></div>
              <div className="absolute bottom-8 right-12 w-6 h-6 bg-purple-300 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-3">
          Analyzing...
        </h1>
        <p className="text-center text-gray-600 mb-2">
          あなたの成分を抽出中...
        </p>
        <p className="text-center text-gray-600 mb-12">
          恋の反応式を計算しています...
        </p>

        {/* Video Ad Area */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
          <p className="text-gray-400 font-semibold text-lg mb-2">
            Video AD Area
          </p>
          <p className="text-gray-400 text-sm">ここに動画広告が表示されます</p>
        </div>
      </div>
    </div>
  );
}
