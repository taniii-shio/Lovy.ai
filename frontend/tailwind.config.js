/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "lovy-purple": "#8B6CFF",
        "lovy-pink": "#FF69B4",
        "lovy-bg": "#F6F3FF",
        "lovy-card": "#FFFFFF",
      },
      backgroundImage: {
        "gradient-lovy": "linear-gradient(135deg, #8B6CFF 0%, #FF69B4 100%)",
        "gradient-lovy-soft":
          "linear-gradient(135deg, #E9D5FF 0%, #FCE7F3 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
