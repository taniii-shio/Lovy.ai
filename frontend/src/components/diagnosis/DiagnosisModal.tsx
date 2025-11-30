import { useState } from "react";

export type DiagnosisQuestion = {
  title: string;
  options: {
    label: string;
    value: string;
  }[];
};

type DiagnosisModalProps = {
  isOpen: boolean;
  questions: DiagnosisQuestion[];
  onClose: () => void;
  onComplete: (result: string) => void;
  colorScheme?: "purple" | "pink";
  resultLabel: string;
};

export default function DiagnosisModal({
  isOpen,
  questions,
  onClose,
  onComplete,
  colorScheme = "purple",
  resultLabel,
}: DiagnosisModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleSelectAnswer = (value: string) => {
    const newAnswers = [...selectedAnswers, value];
    setSelectedAnswers(newAnswers);

    // アニメーション完了を待ってから次の質問へ遷移
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        // 次の質問へ
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // 全ての質問に回答済み → 結果を生成
        const result = newAnswers.join("");
        onComplete(result);
      }
    }, 150);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      // 前の質問に戻る
      setCurrentQuestion(currentQuestion - 1);
      // 最後の回答を削除
      setSelectedAnswers(selectedAnswers.slice(0, -1));
    }
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    onClose();
  };

  const handleBackdropClick = () => {
    handleClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const isCompleted = selectedAnswers.length === questions.length;

  // 色スキームに基づいたクラス名
  const colorClasses = {
    purple: {
      bg: "bg-purple-50",
      bgHover: "hover:bg-purple-100",
      text: "text-purple-900",
      result: "text-purple-600",
    },
    pink: {
      bg: "bg-pink-50",
      bgHover: "hover:bg-pink-100",
      text: "text-pink-900",
      result: "text-pink-600",
    },
  };

  const colors = colorClasses[colorScheme];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        onClick={handleModalClick}
      >
        {!isCompleted ? (
          <>
            {/* 質問画面 */}
            <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">
              {questions[currentQuestion].title}
            </h2>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectAnswer(option.value)}
                  className={`w-full px-5 py-3.5 ${colors.bg} ${colors.bgHover} ${colors.text} rounded-2xl text-sm font-medium transition-all transform hover:scale-105 active:scale-95`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex gap-4 mt-8">
              {currentQuestion > 0 && (
                <button
                  onClick={handleBack}
                  className="flex-1 text-gray-500 hover:text-gray-700 text-xs transition-colors"
                >
                  ← 戻る
                </button>
              )}
              <button
                onClick={handleClose}
                className={`${currentQuestion > 0 ? 'flex-1' : 'w-full'} text-gray-500 hover:text-gray-700 text-xs transition-colors`}
              >
                キャンセル
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 結果画面 */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-8">
                診断完了！
              </h2>
              <p className="text-base text-gray-600">{resultLabel}</p>
              <p className={`text-3xl font-bold ${colors.result} mt-1 mb-2`}>
                {selectedAnswers.join("")}
              </p>
              <p className="text-xs text-gray-500 mt-1">ですね！</p>
            </div>
            <button
              onClick={handleClose}
              className="mt-8 w-full text-gray-500 hover:text-gray-700 text-xs transition-colors"
            >
              閉じる
            </button>
          </>
        )}
      </div>
    </div>
  );
}
