// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // 이 곳에 원하는 커스텀 값을 추가하면 됩니다.
      colors: {
        "tmap-blue": "#0284C7",
        "tmap-sky": "#0EA5E9",
      },
    },
  },
  plugins: [],
};
