import { useState } from "react";
import html2canvas from "html2canvas";

export function useShareImage() {
  const [shareImageUrl, setShareImageUrl] = useState<string>("");
  const [showShareModal, setShowShareModal] = useState(false);

  const generateShareImage = async (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
      // Find the score element and temporarily change its style for rendering
      const scoreElement = element.querySelector(".score-text");
      const originalClass = scoreElement?.className;

      if (scoreElement) {
        // Replace gradient text with solid color for html2canvas
        scoreElement.className = "text-5xl font-bold text-purple-600";
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      // Restore original styling
      if (scoreElement && originalClass) {
        scoreElement.className = originalClass;
      }

      const imageUrl = canvas.toDataURL("image/png");
      setShareImageUrl(imageUrl);
      setShowShareModal(true);
    } catch (error) {
      console.error("Failed to generate image:", error);
      alert("画像の生成に失敗しました");
    }
  };

  const saveImage = (nickname: string) => {
    if (!shareImageUrl) return;

    const link = document.createElement("a");
    link.download = `lovy-result-${nickname}.png`;
    link.href = shareImageUrl;
    link.click();
  };

  return {
    shareImageUrl,
    showShareModal,
    setShowShareModal,
    generateShareImage,
    saveImage,
  };
}
