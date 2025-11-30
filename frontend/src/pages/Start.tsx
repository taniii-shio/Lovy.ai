import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MBTIType, LoveType, UserProfileInput } from "../types";
import { MBTI_TYPES, LOVE_TYPES, isValidUserProfile } from "../types";
import { userProfileStorage, diagnosisResultStorage } from "../utils/storage";
import {
  validateUserProfile,
  getFieldError,
  type ValidationError,
} from "../utils/validation";
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

  // MBTI診断モーダルの状態管理
  const [isMbtiModalOpen, setIsMbtiModalOpen] = useState(false);
  const [mbtiCurrentQuestion, setMbtiCurrentQuestion] = useState(0);
  const [mbtiSelectedAnswers, setMbtiSelectedAnswers] = useState<string[]>([]);

  // ラブタイプ診断モーダルの状態管理
  const [isLoveTypeModalOpen, setIsLoveTypeModalOpen] = useState(false);
  const [loveTypeCurrentQuestion, setLoveTypeCurrentQuestion] = useState(0);
  const [loveTypeSelectedAnswers, setLoveTypeSelectedAnswers] = useState<
    string[]
  >([]);

  // MBTI診断の質問データ
  const mbtiQuestions = [
    {
      title: "【1/4】エネルギーの方向は？",
      options: [
        { label: "E: 人と会って充電するタイプ", value: "E" },
        { label: "I: 一人でじっくり充電するタイプ", value: "I" },
      ],
    },
    {
      title: "【2/4】物事の見方は？",
      options: [
        { label: "S: 事実や経験を重視するタイプ", value: "S" },
        { label: "N: 全体像や可能性を重視するタイプ", value: "N" },
      ],
    },
    {
      title: "【3/4】判断の基準は？",
      options: [
        { label: "T: 論理や公平さを重視するタイプ", value: "T" },
        { label: "F: 気持ちや調和を重視するタイプ", value: "F" },
      ],
    },
    {
      title: "【4/4】行動のスタイルは？",
      options: [
        { label: "J: 計画を立てて進めたいタイプ", value: "J" },
        { label: "P: 状況に合わせて柔軟に進めたいタイプ", value: "P" },
      ],
    },
  ];

  // ラブタイプ診断の質問データ
  const loveTypeQuestions = [
    {
      title: "【1/4】恋愛の主導権は？",
      options: [
        { label: "L: 自分がリードしたいタイプ", value: "L" },
        { label: "F: 相手にリードしてほしいタイプ", value: "F" },
      ],
    },
    {
      title: "【2/4】恋人との理想の関係は？",
      options: [
        { label: "C: 甘えたいタイプ", value: "C" },
        { label: "A: 甘えられたいタイプ", value: "A" },
      ],
    },
    {
      title: "【3/4】どんな恋愛に憧れる？",
      options: [
        { label: "R: 現実的で穏やかな恋を望むタイプ", value: "R" },
        { label: "P: 情熱的でドラマチックな恋を望むタイプ", value: "P" },
      ],
    },
    {
      title: "【4/4】恋愛へのスタンスは？",
      options: [
        { label: "O: 自由でいたいタイプ", value: "O" },
        { label: "E: 真面目でいたいタイプ", value: "E" },
      ],
    },
  ];

  // MBTI診断モーダルのハンドラー
  const handleOpenMbtiModal = () => {
    setIsMbtiModalOpen(true);
    setMbtiCurrentQuestion(0);
    setMbtiSelectedAnswers([]);
  };

  const handleCloseMbtiModal = () => {
    setIsMbtiModalOpen(false);
    setMbtiCurrentQuestion(0);
    setMbtiSelectedAnswers([]);
  };

  const handleMbtiSelectAnswer = (value: string) => {
    const newAnswers = [...mbtiSelectedAnswers, value];
    setMbtiSelectedAnswers(newAnswers);

    if (mbtiCurrentQuestion < mbtiQuestions.length - 1) {
      // 次の質問へ
      setMbtiCurrentQuestion(mbtiCurrentQuestion + 1);
    } else {
      // 全ての質問に回答済み → MBTIタイプを生成
      const mbtiType = newAnswers.join("") as MBTIType;
      handleMbtiChange(mbtiType);
    }
  };

  // ラブタイプ診断モーダルのハンドラー
  const handleOpenLoveTypeModal = () => {
    setIsLoveTypeModalOpen(true);
    setLoveTypeCurrentQuestion(0);
    setLoveTypeSelectedAnswers([]);
  };

  const handleCloseLoveTypeModal = () => {
    setIsLoveTypeModalOpen(false);
    setLoveTypeCurrentQuestion(0);
    setLoveTypeSelectedAnswers([]);
  };

  const handleLoveTypeSelectAnswer = (value: string) => {
    const newAnswers = [...loveTypeSelectedAnswers, value];
    setLoveTypeSelectedAnswers(newAnswers);

    if (loveTypeCurrentQuestion < loveTypeQuestions.length - 1) {
      // 次の質問へ
      setLoveTypeCurrentQuestion(loveTypeCurrentQuestion + 1);
    } else {
      // 全ての質問に回答済み → ラブタイプを生成
      const loveTypeValue = newAnswers.join("") as LoveType;
      handleLoveTypeChange(loveTypeValue);
    }
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

  // フィールド変更時にエラーをクリア
  const handleNicknameChange = (value: string) => {
    setNickname(value);
    if (errors.length > 0) {
      setErrors(errors.filter((e) => e.field !== "nickname"));
    }
  };

  const handleMbtiChange = (value: MBTIType | "") => {
    setMbti(value);
    if (errors.length > 0) {
      setErrors(errors.filter((e) => e.field !== "mbti"));
    }
  };

  const handleLoveTypeChange = (value: LoveType | "") => {
    setLoveType(value);
    if (errors.length > 0) {
      setErrors(errors.filter((e) => e.field !== "loveType"));
    }
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
                onChange={(e) => handleNicknameChange(e.target.value)}
                placeholder="例: らびーちゃん"
                maxLength={10}
                aria-label="ニックネーム入力"
                aria-invalid={
                  touched.nickname && !!getFieldError(errors, "nickname")
                }
                aria-describedby={
                  touched.nickname && getFieldError(errors, "nickname")
                    ? "nickname-error"
                    : undefined
                }
                className={`w-full px-6 py-4 bg-white rounded-2xl border-2 focus:outline-none text-gray-700 placeholder-gray-400 transition-all ${
                  touched.nickname && getFieldError(errors, "nickname")
                    ? "border-red-400 focus:border-red-500"
                    : "border-transparent focus:border-purple-400"
                }`}
              />
              {touched.nickname && getFieldError(errors, "nickname") && (
                <p
                  id="nickname-error"
                  className="mt-2 text-sm text-red-500"
                  role="alert"
                >
                  {getFieldError(errors, "nickname")}
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
                  onChange={(e) => handleMbtiChange(e.target.value as MBTIType)}
                  aria-label="16タイプ性格診断選択"
                  aria-invalid={touched.mbti && !!getFieldError(errors, "mbti")}
                  aria-describedby={
                    touched.mbti && getFieldError(errors, "mbti")
                      ? "mbti-error"
                      : undefined
                  }
                  className={`w-full px-6 py-4 bg-white rounded-2xl border-2 appearance-none cursor-pointer transition-all focus:outline-none ${
                    touched.mbti && getFieldError(errors, "mbti")
                      ? "border-red-400 focus:border-red-500 text-gray-800"
                      : mbti
                      ? "border-purple-400 text-gray-800 focus:border-purple-400"
                      : "border-transparent text-gray-400 focus:border-purple-400"
                  }`}
                >
                  <option value="">選択してください</option>
                  {MBTI_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
              {touched.mbti && getFieldError(errors, "mbti") && (
                <p
                  id="mbti-error"
                  className="mt-2 text-sm text-red-500"
                  role="alert"
                >
                  {getFieldError(errors, "mbti")}
                </p>
              )}
              {/* 診断ボタン */}
              <button
                type="button"
                onClick={handleOpenMbtiModal}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 underline transition-colors"
              >
                タイプが分からない方はこちら
              </button>
            </div>

            {/* Love Type Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">
                恋愛タイプ診断
              </label>
              <div className="relative">
                <select
                  value={loveType}
                  onChange={(e) =>
                    handleLoveTypeChange(e.target.value as LoveType)
                  }
                  aria-label="恋愛タイプ診断選択"
                  aria-invalid={
                    touched.loveType && !!getFieldError(errors, "loveType")
                  }
                  aria-describedby={
                    touched.loveType && getFieldError(errors, "loveType")
                      ? "loveType-error"
                      : undefined
                  }
                  className={`w-full px-6 py-4 bg-white rounded-2xl border-2 appearance-none cursor-pointer transition-all focus:outline-none ${
                    touched.loveType && getFieldError(errors, "loveType")
                      ? "border-red-400 focus:border-red-500 text-gray-800"
                      : loveType
                      ? "border-purple-400 text-gray-800 focus:border-purple-400"
                      : "border-transparent text-gray-400 focus:border-purple-400"
                  }`}
                >
                  <option value="">選択してください</option>
                  {LOVE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
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
              {touched.loveType && getFieldError(errors, "loveType") && (
                <p
                  id="loveType-error"
                  className="mt-2 text-sm text-red-500"
                  role="alert"
                >
                  {getFieldError(errors, "loveType")}
                </p>
              )}
              {/* 診断ボタン */}
              <button
                type="button"
                onClick={handleOpenLoveTypeModal}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 underline transition-colors"
              >
                タイプが分からない方はこちら
              </button>
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

      {/* MBTI診断モーダル */}
      {isMbtiModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
          onClick={handleCloseMbtiModal}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {mbtiSelectedAnswers.length < mbtiQuestions.length ? (
              <>
                {/* 質問画面 */}
                <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">
                  {mbtiQuestions[mbtiCurrentQuestion].title}
                </h2>
                <div className="space-y-3">
                  {mbtiQuestions[mbtiCurrentQuestion].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleMbtiSelectAnswer(option.value)}
                      className="w-full px-5 py-3.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-2xl text-sm font-medium transition-all transform hover:scale-105 active:scale-95"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCloseMbtiModal}
                  className="mt-8 w-full text-gray-500 hover:text-gray-700 text-xs transition-colors"
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                {/* 結果画面 */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-8">
                    診断完了！
                  </h2>
                  <p className="text-base text-gray-600">あなたのタイプは</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1 mb-2">
                    {mbtiSelectedAnswers.join("")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ですね！</p>
                </div>
                <button
                  onClick={handleCloseMbtiModal}
                  className="mt-8 w-full text-gray-500 hover:text-gray-700 text-xs transition-colors"
                >
                  閉じる
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ラブタイプ診断モーダル */}
      {isLoveTypeModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
          onClick={handleCloseLoveTypeModal}
        >
          <div
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loveTypeSelectedAnswers.length < loveTypeQuestions.length ? (
              <>
                {/* 質問画面 */}
                <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">
                  {loveTypeQuestions[loveTypeCurrentQuestion].title}
                </h2>
                <div className="space-y-3">
                  {loveTypeQuestions[loveTypeCurrentQuestion].options.map(
                    (option) => (
                      <button
                        key={option.value}
                        onClick={() => handleLoveTypeSelectAnswer(option.value)}
                        className="w-full px-5 py-3.5 bg-pink-50 hover:bg-pink-100 text-pink-900 rounded-2xl text-sm font-medium transition-all transform hover:scale-105 active:scale-95"
                      >
                        {option.label}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={handleCloseLoveTypeModal}
                  className="mt-8 w-full text-gray-500 hover:text-gray-700 text-xs transition-colors"
                >
                  キャンセル
                </button>
              </>
            ) : (
              <>
                {/* 結果画面 */}
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-800 mb-8">
                    診断完了！
                  </h2>
                  <p className="text-base text-gray-600">
                    あなたの恋愛タイプは
                  </p>
                  <p className="text-3xl font-bold text-pink-600 mt-1 mb-2">
                    {loveTypeSelectedAnswers.join("")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">ですね！</p>
                </div>
                <button
                  onClick={handleCloseLoveTypeModal}
                  className="mt-8 w-full text-gray-500 hover:text-gray-700 text-xs transition-colors"
                >
                  閉じる
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Bottom Banner Area */}
      <div className="pb-6 px-6">
        <AdArea variant="banner" />
      </div>
    </div>
  );
}
