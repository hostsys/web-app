/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.css", "./*.html", "./src/pages/*", "./src/main.js"],
  theme: {
    fontFamily: {
      hack: ["hack"],
      pixel: ["Birch Leaf"],
    },
    fontSize: {
      sm: "0.9rem",
      base: "1.1rem",
      xl: "1.5rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
    },
    container: {
      // center: true,
    },
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        tertiary: "rgb(var(--color-tertiary) / <alpha-value>)",
        scene: "rgb(var(--color-scene) / <alpha-value>)",
        box: "var(--box-color)",
      },
      cursor: {
        default: "var(--cursor-primary), default",
        active: "url(/cursor/cursor-active.png), pointer",
        stab: "url(/cursor/cursor-stab.png), pointer",
        stabbing: "url(/cursor/cursor-active-stab.png), pointer",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
