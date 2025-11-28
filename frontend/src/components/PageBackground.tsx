export default function PageBackground() {
  return (
    <>
      {/* Background with Gradient and Bubbles */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: -1 }}
      >
        {/* Gradient Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(243, 232, 255, 0.85) 0%, rgba(252, 231, 243, 0.85) 50%, rgba(243, 232, 255, 0.85) 100%)",
          }}
        />

        {/* Bubbles */}
        {[...Array(6)].map((_, i) => {
          const sizes = [60, 70, 55, 65, 58, 72];
          const leftPositions = [15, 35, 55, 75, 25, 65];
          const durations = [7.5, 9, 8, 9.5, 8, 9];
          const delays = [0, 1.5, 3, 4.5, 6, 7.5];
          const opacities = [0.26, 0.28, 0.24, 0.3, 0.25, 0.27];
          const swayAmount = [35, -40, 30, -35, 32, -38];

          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={
                {
                  width: `${sizes[i]}px`,
                  height: `${sizes[i]}px`,
                  left: `${leftPositions[i]}%`,
                  bottom: "-100px",
                  background:
                    i % 3 === 0
                      ? "linear-gradient(135deg, rgba(139, 92, 246, 0.6), rgba(236, 72, 153, 0.6))"
                      : i % 3 === 1
                      ? "linear-gradient(135deg, rgba(236, 72, 153, 0.6), rgba(244, 114, 182, 0.6))"
                      : "linear-gradient(135deg, rgba(168, 85, 247, 0.6), rgba(219, 39, 119, 0.6))",
                  opacity: opacities[i],
                  animation: `bubble-rise-sway-${i} ${durations[i]}s ease-in-out infinite`,
                  animationDelay: `${delays[i]}s`,
                  filter: "blur(1.5px)",
                  boxShadow: "0 0 20px rgba(236, 72, 153, 0.3)",
                  "--sway-amount": `${swayAmount[i]}px`,
                } as React.CSSProperties & { "--sway-amount": string }
              }
            />
          );
        })}
      </div>

      {/* CSS Animation */}
      <style>{`
        ${[...Array(6)]
          .map(
            (_, i) => `
          @keyframes bubble-rise-sway-${i} {
            0% {
              transform: translateY(0) translateX(0) scale(1) rotate(0deg);
              opacity: 0;
            }
            3% {
              opacity: 0.3;
            }
            25% {
              transform: translateY(-25vh) translateX(var(--sway-amount)) scale(1.05) rotate(90deg);
            }
            50% {
              transform: translateY(-50vh) translateX(0) scale(1.1) rotate(180deg);
            }
            75% {
              transform: translateY(-75vh) translateX(calc(var(--sway-amount) * -0.7)) scale(1.15) rotate(270deg);
            }
            97% {
              opacity: 0.3;
            }
            100% {
              transform: translateY(-110vh) translateX(0) scale(1.3) rotate(360deg);
              opacity: 0;
            }
          }
        `
          )
          .join("")}
      `}</style>
    </>
  );
}
