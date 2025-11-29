import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import Button from "../components/common/Button";
import GradientText from "../components/common/GradientText";

export default function Privacy() {
  const navigate = useNavigate();
  useScrollToTop();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          ← トップに戻る
        </Button>

        <GradientText as="h1" className="text-4xl font-bold mb-8">
          プライバシーポリシー
        </GradientText>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700">
            プライバシーポリシーの内容がここに入ります。
          </p>
        </div>
      </div>
    </div>
  );
}
