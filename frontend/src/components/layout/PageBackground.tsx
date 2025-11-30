import React, { useState, useEffect, useRef, useCallback } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  swayAmount: number;
  opacity: number;
  colorType: number;
  createdAt: number;
}

export default function PageBackground(): React.JSX.Element {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleIdRef = useRef<number>(0);

  const createBubble = useCallback((): Bubble => {
    const size = Math.random() * 50 + 30; // 30-80px
    const left = Math.random() * 90 + 5; // 5-95%
    const duration = Math.random() * 8 + 12; // 12-20秒
    const swayAmount = (Math.random() - 0.5) * 80; // 左右の揺れを大きく
    const opacity = Math.random() * 0.2 + 0.15;
    const colorType = Math.floor(Math.random() * 3);

    const bubble: Bubble = {
      id: bubbleIdRef.current,
      size,
      left,
      duration,
      swayAmount,
      opacity,
      colorType,
      createdAt: Date.now(),
    };

    bubbleIdRef.current += 1;
    return bubble;
  }, []);

  useEffect(() => {
    // 初期バブルを生成
    const initialBubbles: Bubble[] = Array.from({ length: 2 }, () =>
      createBubble()
    );
    setBubbles(initialBubbles);

    // 新しいバブルを追加（3秒ごと）
    const addInterval = setInterval(() => {
      setBubbles((prev) => [...prev, createBubble()]);
    }, 3000);

    // 古いバブルをクリーンアップ（アニメーション完了後のみ削除）
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setBubbles((prev) =>
        prev.filter((bubble) => {
          const maxLifetime = (bubble.duration + 2) * 1000;
          return now - bubble.createdAt < maxLifetime;
        })
      );
    }, 5000);

    return () => {
      clearInterval(addInterval);
      clearInterval(cleanupInterval);
    };
  }, [createBubble]);

  const getGradient = (type: number): string => {
    const gradients = [
      "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))",
      "linear-gradient(135deg, rgba(236, 72, 153, 0.6), rgba(244, 114, 182, 0.6))",
      "linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(219, 39, 119, 0.6))",
    ];
    return gradients[type];
  };

  // 小さな白い気泡用の固定値（速い動作）
  const tinyBubbles = useRef(
    [...Array(8)].map((_, i) => ({
      id: i,
      size: 6 + (i % 4) * 3, // 6-15px
      left: (i * 12 + 5) % 95,
      duration: 6 + (i % 3) * 1.5,
      delay: i * 1.2,
      sway: (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 10), // 左右の揺れ
    }))
  ).current;

  // 中サイズバブル用の固定値
  const midBubbles = useRef(
    [...Array(3)].map((_, i) => ({
      id: i,
      size: 28 + (i % 3) * 10,
      left: 20 + i * 25,
      duration: 12 + (i % 3) * 4,
      delay: i * 3,
      sway: (i % 2 === 0 ? 1 : -1) * (25 + (i % 3) * 15), // 左右の揺れを大きく
    }))
  ).current;

  return (
    <>
      {/* Background with Gradient and Bubbles */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
        aria-hidden="true"
        role="presentation"
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(243, 232, 255, 0.85) 0%, rgba(252, 231, 243, 0.85) 50%, rgba(243, 232, 255, 0.85) 100%)",
          }}
        />

        {/* メインバブル */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full"
            style={
              {
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: "-80px",
                background: getGradient(bubble.colorType),
                animation: `boil-rise ${bubble.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`,
                filter: `blur(${bubble.size > 50 ? 2.5 : 1.5}px)`,
                boxShadow: `0 0 ${bubble.size / 3}px rgba(236, 72, 153, 0.3)`,
                "--sway-amount": `${bubble.swayAmount}px`,
                "--base-opacity": `${bubble.opacity}`,
              } as React.CSSProperties & {
                "--sway-amount": string;
                "--base-opacity": string;
              }
            }
          />
        ))}

        {/* 小さな白い気泡 - 速い動作 */}
        {tinyBubbles.map((bubble) => (
          <div
            key={`tiny-${bubble.id}`}
            className="absolute rounded-full"
            style={
              {
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: "-20px",
                background: "rgba(255, 255, 255, 0.6)",
                animation: `tiny-rise ${bubble.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                animationDelay: `${bubble.delay}s`,
                boxShadow: "0 0 6px rgba(255, 255, 255, 0.5)",
                "--sway-amount": `${bubble.sway}px`,
              } as React.CSSProperties & { "--sway-amount": string }
            }
          />
        ))}

        {/* 中サイズの連続バブル */}
        {midBubbles.map((bubble) => (
          <div
            key={`mid-${bubble.id}`}
            className="absolute rounded-full"
            style={
              {
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: "-50px",
                background: getGradient(bubble.id % 3),
                animation: `boil-rise-loop ${bubble.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                animationDelay: `${bubble.delay}s`,
                filter: "blur(1.5px)",
                boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)",
                "--sway-amount": `${bubble.sway}px`,
              } as React.CSSProperties & { "--sway-amount": string }
            }
          />
        ))}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes boil-rise {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          3% {
            opacity: var(--base-opacity, 0.25);
          }
          12% {
            transform: translateY(-12vh) translateX(calc(var(--sway-amount) * 0.3)) scale(1.02);
            opacity: var(--base-opacity, 0.25);
          }
          25% {
            transform: translateY(-25vh) translateX(calc(var(--sway-amount) * -0.5)) scale(1.04);
            opacity: var(--base-opacity, 0.25);
          }
          40% {
            transform: translateY(-40vh) translateX(calc(var(--sway-amount) * 0.7)) scale(1.06);
            opacity: calc(var(--base-opacity, 0.25) * 0.9);
          }
          55% {
            transform: translateY(-55vh) translateX(calc(var(--sway-amount) * -0.4)) scale(1.08);
            opacity: calc(var(--base-opacity, 0.25) * 0.75);
          }
          70% {
            transform: translateY(-70vh) translateX(calc(var(--sway-amount) * 0.5)) scale(1.1);
            opacity: calc(var(--base-opacity, 0.25) * 0.5);
          }
          85% {
            transform: translateY(-85vh) translateX(calc(var(--sway-amount) * -0.2)) scale(1.12);
            opacity: calc(var(--base-opacity, 0.25) * 0.2);
          }
          100% {
            transform: translateY(-105vh) translateX(0) scale(1.14);
            opacity: 0;
          }
        }

        @keyframes boil-rise-loop {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          3% {
            opacity: 0.22;
          }
          15% {
            transform: translateY(-15vh) translateX(calc(var(--sway-amount) * 0.4)) scale(1.02);
            opacity: 0.22;
          }
          30% {
            transform: translateY(-30vh) translateX(calc(var(--sway-amount) * -0.6)) scale(1.04);
            opacity: 0.2;
          }
          45% {
            transform: translateY(-45vh) translateX(calc(var(--sway-amount) * 0.7)) scale(1.06);
            opacity: 0.16;
          }
          60% {
            transform: translateY(-60vh) translateX(calc(var(--sway-amount) * -0.5)) scale(1.07);
            opacity: 0.12;
          }
          75% {
            transform: translateY(-75vh) translateX(calc(var(--sway-amount) * 0.3)) scale(1.08);
            opacity: 0.07;
          }
          90% {
            transform: translateY(-90vh) translateX(calc(var(--sway-amount) * -0.1)) scale(1.09);
            opacity: 0.02;
          }
          97% {
            transform: translateY(-105vh) translateX(0) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes tiny-rise {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 0.6;
          }
          15% {
            transform: translateY(-15vh) translateX(calc(var(--sway-amount) * 0.5)) scale(1.05);
            opacity: 0.6;
          }
          30% {
            transform: translateY(-30vh) translateX(calc(var(--sway-amount) * -0.7)) scale(1.08);
            opacity: 0.5;
          }
          45% {
            transform: translateY(-45vh) translateX(calc(var(--sway-amount) * 0.8)) scale(1.1);
            opacity: 0.4;
          }
          60% {
            transform: translateY(-60vh) translateX(calc(var(--sway-amount) * -0.6)) scale(1.08);
            opacity: 0.28;
          }
          75% {
            transform: translateY(-75vh) translateX(calc(var(--sway-amount) * 0.4)) scale(1.05);
            opacity: 0.15;
          }
          90% {
            transform: translateY(-90vh) translateX(calc(var(--sway-amount) * -0.2)) scale(1.02);
            opacity: 0.05;
          }
          97% {
            transform: translateY(-105vh) translateX(0) scale(1.0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
