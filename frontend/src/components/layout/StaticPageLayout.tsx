import type { ReactNode } from "react";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import GradientText from "../common/GradientText";

interface StaticPageLayoutProps {
  title: string;
  children: ReactNode;
}

export default function StaticPageLayout({
  title,
  children,
}: StaticPageLayoutProps) {
  useScrollToTop();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <GradientText className="text-2xl font-bold block">
          {title}
        </GradientText>
        <div className="bg-white rounded-lg shadow-lg p-8">{children}</div>
      </div>
    </div>
  );
}
