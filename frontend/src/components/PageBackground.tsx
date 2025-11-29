import React, { useState, useEffect, useRef } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  swayAmount: number;
  opacity: number;
  colorType: number;
}

export default function PageBackground(): React.JSX.Element {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const bubbleIdRef = useRef<number>(0);

  useEffect(() => {
    // 初期バブルを生成（少なめに）
    const initialBubbles: Bubble[] = Array.from({ length: 8 }, (_, i) =>
      createBubble(i)
    );
    setBubbles(initialBubbles);
    bubbleIdRef.current = 8;

    // ゆっくり新しいバブルを追加（2秒ごとに1個）
    const interval = setInterval(() => {
      setBubbles((prev) => {
        // 古いバブルを削除（最大4個まで）
        const filtered = prev.length > 4 ? prev.slice(-12) : prev;
        // 新しいバブルを1個追加
        const newBubble = createBubble(bubbleIdRef.current);
        bubbleIdRef.current += 1;
        return [...filtered, newBubble];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  function createBubble(id: number): Bubble {
    const size = Math.random() * 50 + 30; // 30-80px
    const left = Math.random() * 90 + 5; // 5-95%
    const duration = Math.random() * 6 + 10;
    const delay = Math.random() * 1;
    const swayAmount = (Math.random() - 0.5) * 40;
    const opacity = Math.random() * 0.2 + 0.15;
    const colorType = Math.floor(Math.random() * 4);

    return {
      id,
      size,
      left,
      duration,
      delay,
      swayAmount,
      opacity,
      colorType,
    };
  }

  const getGradient = (type: number): string => {
    const gradients = [
      "linear-gradient(135deg, rgba(139, 92, 246, 0.7), rgba(236, 72, 153, 0.7))",
      "linear-gradient(135deg, rgba(236, 72, 153, 0.7), rgba(244, 114, 182, 0.7))",
      "linear-gradient(135deg, rgba(168, 85, 247, 0.7), rgba(219, 39, 119, 0.7))",
      "linear-gradient(135deg, rgba(251, 146, 60, 0.6), rgba(236, 72, 153, 0.6))",
    ];
    return gradients[type];
  };

  // 小さな気泡用の固定値（数を減らす）
  const tinyBubbles = useRef(
    [...Array(6)].map((_, i) => ({
      id: i,
      size: 5 + (i % 4) * 2,
      left: (i * 12 + 6) % 100,
      duration: 8 + (i % 3) * 2,
      delay: i * 1.5,
    }))
  ).current;

  // 中サイズバブル用の固定値（数を減らす）
  const midBubbles = useRef(
    [...Array(3)].map((_, i) => ({
      id: i,
      size: 25 + (i % 4) * 8,
      left: 15 + i * 17,
      duration: 10 + (i % 3) * 3,
      delay: i * 2,
      sway: (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 8),
    }))
  ).current;

  return (
    <>
      {/* Background with Gradient and Bubbles */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
      >
        {/* Gradient Background - より温かみのある色 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(253, 224, 235, 0.9) 0%, rgba(252, 211, 230, 0.95) 30%, rgba(251, 194, 220, 0.9) 60%, rgba(250, 180, 210, 0.85) 100%)",
          }}
        />

        {/* 底部のグロー効果（熱源イメージ） */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background:
              "linear-gradient(to top, rgba(236, 72, 153, 0.3), transparent)",
          }}
        />

        {/* メインバブル - infinite ループ */}
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
                animation: `boil-rise ${bubble.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) infinite`,
                animationDelay: `${bubble.delay}s`,
                filter: `blur(${bubble.size > 50 ? 2.5 : 1.5}px)`,
                boxShadow: `0 0 ${
                  bubble.size / 3
                }px rgba(236, 72, 153, 0.4), inset 0 0 ${
                  bubble.size / 4
                }px rgba(255, 255, 255, 0.3)`,
                "--sway-amount": `${bubble.swayAmount}px`,
                "--base-opacity": `${bubble.opacity}`,
              } as React.CSSProperties & {
                "--sway-amount": string;
                "--base-opacity": string;
              }
            }
          />
        ))}

        {/* 小さな気泡 - infinite ループ */}
        {tinyBubbles.map((bubble) => (
          <div
            key={`tiny-${bubble.id}`}
            className="absolute rounded-full"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              bottom: "-20px",
              background: "rgba(255, 255, 255, 0.6)",
              animation: `tiny-rise ${bubble.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
              animationDelay: `${bubble.delay}s`,
              boxShadow: "0 0 4px rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}

        {/* 中サイズの連続バブル - infinite ループ */}
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
                background: getGradient(bubble.id % 4),
                animation: `boil-rise-loop ${bubble.duration}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                animationDelay: `${bubble.delay}s`,
                filter: "blur(1.5px)",
                boxShadow: `0 0 15px rgba(236, 72, 153, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.2)`,
                "--sway-amount": `${bubble.sway}px`,
              } as React.CSSProperties & { "--sway-amount": string }
            }
          />
        ))}
      </div>

      {/* CSS Animation - すべて infinite でループ */}
      <style>{`
        @keyframes boil-rise {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          5% {
            opacity: var(--base-opacity, 0.25);
          }
          15% {
            transform: translateY(-15vh) translateX(calc(var(--sway-amount) * 0.4)) scale(1.03);
            opacity: var(--base-opacity, 0.25);
          }
          35% {
            transform: translateY(-35vh) translateX(var(--sway-amount)) scale(1.06);
            opacity: calc(var(--base-opacity, 0.25) * 0.95);
          }
          55% {
            transform: translateY(-55vh) translateX(calc(var(--sway-amount) * 0.2)) scale(1.08);
            opacity: calc(var(--base-opacity, 0.25) * 0.8);
          }
          75% {
            transform: translateY(-75vh) translateX(calc(var(--sway-amount) * -0.3)) scale(1.1);
            opacity: calc(var(--base-opacity, 0.25) * 0.5);
          }
          90% {
            transform: translateY(-90vh) translateX(0) scale(1.12);
            opacity: calc(var(--base-opacity, 0.25) * 0.2);
          }
          97% {
            transform: translateY(-100vh) translateX(0) scale(1.14);
            opacity: 0;
          }
        }

        @keyframes boil-rise-loop {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 0.22;
          }
          20% {
            transform: translateY(-20vh) translateX(calc(var(--sway-amount) * 0.5)) scale(1.03);
            opacity: 0.22;
          }
          40% {
            transform: translateY(-40vh) translateX(var(--sway-amount)) scale(1.05);
            opacity: 0.18;
          }
          60% {
            transform: translateY(-60vh) translateX(calc(var(--sway-amount) * 0.2)) scale(1.07);
            opacity: 0.12;
          }
          80% {
            transform: translateY(-80vh) translateX(calc(var(--sway-amount) * -0.2)) scale(1.09);
            opacity: 0.06;
          }
          95% {
            transform: translateY(-98vh) translateX(0) scale(1.1);
            opacity: 0;
          }
        }

        @keyframes tiny-rise {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          5% {
            opacity: 0.45;
          }
          25% {
            transform: translateY(-25vh) scale(1.05);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-50vh) scale(1.1);
            opacity: 0.3;
          }
          75% {
            transform: translateY(-75vh) scale(1.05);
            opacity: 0.15;
          }
          92% {
            transform: translateY(-95vh) scale(1.0);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
