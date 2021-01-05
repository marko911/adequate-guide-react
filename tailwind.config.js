module.exports = {
  purge: {
    mode: "all",
    content: ["./src/**/*.jsx", "./src/**/*.js", "./public/index.html"],
    defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      maxWidth: {
        cell: 400,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
