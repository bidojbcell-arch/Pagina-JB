import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#f1f2fb",100:"#dfe1f3",200:"#c1c5e4",300:"#979ed0",400:"#6c76b8",500:"#454f9d",600:"#343e85",700:"#29316f",800:"#22295e",900:"#181e4a" },
        accent: { 50:"#fff3f2",100:"#ffe2df",200:"#ffc9c3",300:"#ffaaa1",400:"#f77a72",500:"#eb5752",600:"#df413f",700:"#bc302f",800:"#992a2b",900:"#7e292b" },
      },
      fontFamily: { sans:["Inter","system-ui","sans-serif"] },
      boxShadow: { card:"0 4px 24px -6px rgba(24, 30, 74, 0.12)", "card-hover":"0 12px 32px -8px rgba(24, 30, 74, 0.22)" },
    },
  },
  plugins: [],
};
export default config;