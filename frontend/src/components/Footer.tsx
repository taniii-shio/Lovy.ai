import { Link } from 'react-router-dom';

interface FooterProps {
  withBottomMargin?: boolean;
}

export default function Footer({ withBottomMargin = false }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-6">
        <div className="flex flex-row justify-center items-center gap-4 text-sm">
          <Link
            to="/terms"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            利用規約
          </Link>
          <Link
            to="/privacy"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            to="/contact"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            お問い合わせ
          </Link>
        </div>
        <div className="text-center text-gray-500 text-xs mt-4">
          © 2025 Lovy.ai All rights reserved.
        </div>
      </div>
      {withBottomMargin && <div className="h-28 bg-white"></div>}
    </footer>
  );
}
