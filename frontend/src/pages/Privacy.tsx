import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivacyPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← トップに戻る
        </button>

        <h1 className="text-4xl font-bold mb-8 bg-gradient-lovy bg-clip-text text-transparent">
          プライバシーポリシー
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-700">
            プライバシーポリシーの内容がここに入ります。
          </p>
        </div>
      </div>
    </div>
  );
}
