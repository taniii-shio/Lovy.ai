import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MBTIType, LoveType, UserProfileInput } from "../types";
import {
  MBTI_TYPES,
  LOVE_TYPES,
  MBTI_LABELS,
  LOVE_TYPE_LABELS,
  isValidUserProfile,
} from "../types";
import { userProfileStorage, diagnosisResultStorage } from "../utils/storage";
import { validateUserProfile, getFieldError, type ValidationError } from "../utils/validation";
import Button from "../components/common/Button";
import AdArea from "../components/advertising/AdArea";

export default function Start() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [mbti, setMbti] = useState<MBTIType | "">("");
  const [loveType, setLoveType] = useState<LoveType | "">("");
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState({
    nickname: false,
    mbti: false,
    loveType: false,
  });

  const handleBlur = (field: 'nickname' | 'mbti' | 'loveType') => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate on blur
    const input: UserProfileInput = { nickname, mbti, loveType };
    const validationResult = validateUserProfile(input);
    setErrors(validationResult.errors);
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({
      nickname: true,
      mbti: true,
      loveType: true,
    });

    const input: UserProfileInput = { nickname, mbti, loveType };
    const validationResult = validateUserProfile(input);

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      return;
    }

    // Type guard ensures we have a valid UserProfile
    if (!isValidUserProfile(input)) {
      return;
    }

    // Clear previous diagnosis result to ensure fresh analysis
    diagnosisResultStorage.remove();

    // Store data in session storage using typed helper
    userProfileStorage.save(input);

    navigate("/diagnosis/processing");
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="h-screen flex items-center justify-center p-6">
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
              onBlur={() => handleBlur('nickname')}
              placeholder="例: らびーちゃん"
              maxLength={10}
              aria-label="ニックネーム入力"
              aria-invalid={touched.nickname && !!getFieldError(errors, 'nickname')}
              aria-describedby={touched.nickname && getFieldError(errors, 'nickname') ? "nickname-error" : undefined}
              className={`w-full px-6 py-4 bg-white rounded-2xl border-2 focus:outline-none text-gray-700 placeholder-gray-400 transition-all ${
                touched.nickname && getFieldError(errors, 'nickname')
                  ? 'border-red-400 focus:border-red-500'
                  : 'border-transparent focus:border-purple-400'
              }`}
            />
            {touched.nickname && getFieldError(errors, 'nickname') && (
              <p id="nickname-error" className="mt-2 text-sm text-red-500" role="alert">
                {getFieldError(errors, 'nickname')}
              </p>
            )}
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
                onBlur={() => handleBlur('mbti')}
                aria-label="16タイプ性格診断選択"
                aria-invalid={touched.mbti && !!getFieldError(errors, 'mbti')}
                aria-describedby={touched.mbti && getFieldError(errors, 'mbti') ? "mbti-error" : undefined}
                className={`w-full px-6 py-4 bg-white rounded-2xl border-2 appearance-none cursor-pointer transition-all focus:outline-none ${
                  touched.mbti && getFieldError(errors, 'mbti')
                    ? 'border-red-400 focus:border-red-500 text-gray-800'
                    : mbti
                    ? "border-purple-400 text-gray-800 focus:border-purple-400"
                    : "border-transparent text-gray-400 focus:border-purple-400"
                }`}
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
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {touched.mbti && getFieldError(errors, 'mbti') && (
              <p id="mbti-error" className="mt-2 text-sm text-red-500" role="alert">
                {getFieldError(errors, 'mbti')}
              </p>
            )}
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
                onBlur={() => handleBlur('loveType')}
                aria-label="ラブタイプ診断選択"
                aria-invalid={touched.loveType && !!getFieldError(errors, 'loveType')}
                aria-describedby={touched.loveType && getFieldError(errors, 'loveType') ? "loveType-error" : undefined}
                className={`w-full px-6 py-4 bg-white rounded-2xl border-2 appearance-none cursor-pointer transition-all focus:outline-none ${
                  touched.loveType && getFieldError(errors, 'loveType')
                    ? 'border-red-400 focus:border-red-500 text-gray-800'
                    : loveType
                    ? "border-purple-400 text-gray-800 focus:border-purple-400"
                    : "border-transparent text-gray-400 focus:border-purple-400"
                }`}
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
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            {touched.loveType && getFieldError(errors, 'loveType') && (
              <p id="loveType-error" className="mt-2 text-sm text-red-500" role="alert">
                {getFieldError(errors, 'loveType')}
              </p>
            )}
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

      {/* Bottom Banner Area */}
      <div className="pb-6 px-6">
        <AdArea variant="banner" />
      </div>
    </div>
  );
}
