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

        {/* Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="opacity-[0.03]"
            style={{
              transform: "scale(3.5)",
              width: "78px",
              height: "101px",
            }}
          >
            <svg
              width="78"
              height="101"
              viewBox="0 0 78 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="logoGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.7049 1.596C19.2289 3.375 20.2669 7.144 22.2319 7.144C23.3789 7.144 23.6649 9.118 23.6649 17.049V26.954L19.4149 29.448C5.54091 37.591 -2.21609 53.81 0.558911 68.873C3.38691 84.219 12.5819 94.567 27.4779 99.168C36.5 101 41 101 48.7329 99.556C59.6129 96.374 68.0659 89.14 73.2579 78.565C75.8609 73.262 77.1259 68.873 77.1259 63.144C77.1259 57.415 75.6009 52.422 73.8049 47.897C71.0569 40.974 63.5029 32.397 57.2169 29.062L52.6649 26.647V16.896C52.6649 9.098 52.9519 7.144 54.0979 7.144C56.0629 7.144 57.1009 3.375 55.6249 1.596C53.8589 -0.532 22.4709 -0.532 20.7049 1.596ZM47.6649 19.078V30L53.1649 33.416C60.3609 37.597 64.3649 41.797 67.7989 48.769C73.8479 61.047 70.9259 77.04 60.9549 86.231C54.0359 92.608 48.6929 95.623 38.6649 95.634C31.5699 95.642 29.2419 94.211 24.5789 92.024C17.4779 88.694 12.1149 83.331 8.78491 76.23C5.35091 68.908 5.20391 57.187 8.45491 49.924C11.2399 43.702 17.8679 36.353 23.6649 33.416C26.415 31.315 29 30 29.6649 29.448C30.0089 28.552 29.6649 23.275 29.6649 17.523V7.066H38.5L47.5 7L47.6649 19.078ZM31.0539 13.574C29.6649 16 31.4529 18.313 33.9109 17.964C36 17.5 36.3351 16.356 36.5 15C36.5 13.5 35.5 12.7129 34 12.5C32.647 12.308 32 12.5 31.0539 13.574ZM37.3849 30.432C36.5919 32.498 38.1399 34.392 40.2849 33.979C42.9419 33.467 43 29.609 40.0419 29.341C38.8749 29.175 38.4149 29.341 37.3849 30.432ZM43.7469 38.545C40.9709 41.89 45.2361 46.938 49.5 44.5C51.6649 43.2622 51.665 41.922 51.5 40.5C51.274 38.561 49.6436 37.2296 47.6649 37C46.2429 36.835 44.4329 37.719 43.7469 38.545ZM19 47C15.2971 48.126 12.1119 52.178 10.6269 58.33C7.50391 71.271 16.4269 85.56 30.2269 89.713C36.2719 91.532 40.0409 91.518 46.3199 89.654C56.5649 86.611 64.7549 77.383 66.2929 67.149C67.1509 61.439 65.2749 52.31 62.7179 49.753C60.8179 47.853 60.5659 47.844 54.7259 49.467C46.6489 51.713 43.5079 51.59 33.6649 48.644C24.0379 45.762 21.0988 46.3618 19 47ZM36.7919 59.759C38.4359 61.246 38.7059 61.246 40.1929 59.759C44.1839 55.768 51.6649 59.335 51.6649 65.231C51.6649 67.651 50.3359 69.701 45.5059 74.731C42.1189 78.258 38.9249 81.144 38.4069 81.144C37.8889 81.144 34.7209 78.491 31.3649 75.248C26.0409 70.101 25.2649 68.877 25.2649 65.619C25.2649 59.36 32.3639 55.752 36.7919 59.759Z"
                fill="url(#logoGradient)"
              />
            </svg>
          </div>
        </div>
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
