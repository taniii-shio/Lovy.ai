import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TopPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
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
        <button
          onClick={() => navigate("/diagnosis/start")}
          className="w-full py-4 px-8 text-xl font-bold text-white bg-gradient-lovy rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          診断をはじめる
        </button>
      </div>
    </div>
  );
}
