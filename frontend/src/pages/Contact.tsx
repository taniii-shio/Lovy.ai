import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import Button from "../components/common/Button";
import GradientText from "../components/common/GradientText";

export default function Contact() {
  const navigate = useNavigate();
  useScrollToTop();

  const handleContactClick = () => {
    // Google Formへのリンク（実際のURLに置き換えてください）
    window.open("https://forms.google.com/your-form-url", "_blank");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← トップに戻る
        </Button>

        <GradientText as="h1" className="text-4xl font-bold mb-8 text-center">
          お問い合わせ
        </GradientText>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-700 mb-8">
            お問い合わせは以下のフォームからお願いいたします。
          </p>

          <Button onClick={handleContactClick} fullWidth>
            お問い合わせフォームへ
          </Button>
        </div>
      </div>
    </div>
  );
}
