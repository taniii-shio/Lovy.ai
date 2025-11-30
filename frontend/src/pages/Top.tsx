import { useNavigate } from "react-router-dom";
import { useScrollToTop } from "../hooks/useScrollToTop";
import Button from "../components/common/Button";
import AdArea from "../components/advertising/AdArea";

export default function Top() {
  const navigate = useNavigate();
  useScrollToTop();

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          {/* Logo Icon */}
          <div className="flex justify-center mb-2">
            <img
              src="/logo.svg"
              alt="Lovy.ai Logo"
              className="w-40 h-40 animate-float"
            />
          </div>

          {/* Title */}
          <div className="flex justify-center mb-4">
            <img src="/typo.svg" alt="Lovy.ai" className="h-16" />
          </div>

          {/* Subtitle */}
          <p className="text-center text-gray-700 text-lg mb-4">
            AIが解き明かす、
          </p>
          <p className="text-center text-gray-700 text-lg mb-12">
            あなたの恋と人生の反応式。
          </p>

          {/* Start Button */}
          <Button onClick={() => navigate("/diagnosis/start")} fullWidth>
            診断をはじめる
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
