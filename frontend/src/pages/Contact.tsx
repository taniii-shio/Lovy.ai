import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleContactClick = () => {
    // Google Formへのリンク（実際のURLに置き換えてください）
    window.open('https://forms.google.com/your-form-url', '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-gray-600 hover:text-gray-800"
        >
          ← トップに戻る
        </button>

        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-lovy bg-clip-text text-transparent">
          お問い合わせ
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-700 mb-8">
            お問い合わせは以下のフォームからお願いいたします。
          </p>

          <button
            onClick={handleContactClick}
            className="w-full py-4 px-8 text-xl font-bold text-white bg-gradient-lovy rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            お問い合わせフォームへ
          </button>
        </div>
      </div>
    </div>
  );
}
