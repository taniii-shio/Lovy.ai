import { useNavigate } from 'react-router-dom';

export default function TopPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Logo Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg
              className="w-20 h-20"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              {/* Flask/Beaker shape */}
              <path
                d="M40 15 L40 35 L35 50 Q30 65 30 75 Q30 85 40 90 L60 90 Q70 85 70 75 Q70 65 65 50 L60 35 L60 15 Z"
                stroke="url(#logoGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Heart in the flask */}
              <circle cx="50" cy="65" r="8" fill="#EC4899" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-center mb-4">
          <span className="text-5xl font-bold bg-gradient-lovy bg-clip-text text-transparent">
            Lovy.ai
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-center text-gray-700 text-lg mb-4">
          AIが解き明かす、
        </p>
        <p className="text-center text-gray-700 text-lg mb-12">
          あなたの恋と人生の化学式。
        </p>

        {/* Start Button */}
        <button
          onClick={() => navigate('/input')}
          className="w-full py-4 px-8 text-xl font-bold text-white bg-gradient-lovy rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          診断をはじめる
        </button>
      </div>
    </div>
  );
}
