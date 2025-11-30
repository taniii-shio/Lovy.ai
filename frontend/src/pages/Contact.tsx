import StaticPageLayout from "../components/layout/StaticPageLayout";
import Button from "../components/common/Button";

export default function Contact() {
  const handleContactClick = () => {
    // Google Formへのリンク（実際のURLに置き換えてください）
    window.open("https://forms.google.com/your-form-url", "_blank");
  };

  return (
    <StaticPageLayout title="お問い合わせ">
      <p className="text-gray-700 mb-8">
        お問い合わせは以下のフォームからお願いいたします。
      </p>

      <Button onClick={handleContactClick}>
        お問い合わせフォームへ
      </Button>
    </StaticPageLayout>
  );
}
