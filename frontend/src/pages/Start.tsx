import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MBTIType, LoveType } from "../types";
import {
  MBTI_TYPES,
  LOVE_TYPES,
  MBTI_LABELS,
  LOVE_TYPE_LABELS,
} from "../types";
import { userProfileStorage } from "../utils/storage";
import Button from "../components/common/Button";

export default function Start() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [mbti, setMbti] = useState<MBTIType | "">("");
  const [loveType, setLoveType] = useState<LoveType | "">("");

  const handleSubmit = () => {
    if (!nickname || !mbti || !loveType) {
      alert("すべての項目を入力してください");
      return;
    }

    // Store data in session storage using typed helper
    userProfileStorage.save({
      nickname,
      mbti,
      loveType,
    });

    navigate("/diagnosis/processing");
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-12">
          プロフィール入力
        </h1>

        <div className="space-y-8">
          {/* Nickname Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              NICKNAME
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例: らびーちゃん"
              className="w-full px-6 py-4 bg-white rounded-2xl border-2 border-transparent focus:border-purple-400 focus:outline-none text-gray-700 placeholder-gray-400 transition-all"
            />
          </div>

          {/* MBTI Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              16タイプ性格診断
            </label>
            <div className="relative">
              <select
                value={mbti}
                onChange={(e) => setMbti(e.target.value as MBTIType)}
                className={`w-full px-6 py-4 bg-white rounded-2xl border-2 appearance-none cursor-pointer transition-all ${
                  mbti
                    ? "border-purple-400 text-gray-800"
                    : "border-transparent text-gray-400"
                } focus:border-purple-400 focus:outline-none`}
              >
                <option value="">選択してください</option>
                {MBTI_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type} ({MBTI_LABELS[type]})
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Love Type Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
              ラブタイプ診断
            </label>
            <div className="relative">
              <select
                value={loveType}
                onChange={(e) => setLoveType(e.target.value as LoveType)}
                className={`w-full px-6 py-4 bg-white rounded-2xl border-2 appearance-none cursor-pointer transition-all ${
                  loveType
                    ? "border-purple-400 text-gray-800"
                    : "border-transparent text-gray-400"
                } focus:border-purple-400 focus:outline-none`}
              >
                <option value="">選択してください</option>
                {LOVE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {LOVE_TYPE_LABELS[type]} ({type})
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-12">
          <Button onClick={handleSubmit} fullWidth>
            分析する
          </Button>
        </div>

        {/* Back Link */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          fullWidth
          className="mt-6"
        >
          ← 戻る
        </Button>
      </div>
    </div>
  );
}
