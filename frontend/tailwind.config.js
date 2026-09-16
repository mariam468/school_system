/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1E2A32",
        paper: "#F7F5F0",
        brand: {
          50: "#EFF7F4",
          100: "#D9EEE5",
          200: "#B3DDCB",
          400: "#4C9A7E",
          500: "#2F7A61",
          600: "#24604D",
          700: "#1B4A3B",
        },
        clay: "#C97B4A",
        gold: "#D9A441",
      },
      fontFamily: {
        display: ["'Cairo'", "sans-serif"],
        body: ["'Almarai'", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(30,42,50,0.06), 0 8px 24px rgba(30,42,50,0.06)",
      },
    },
  },
  plugins: [],
};
