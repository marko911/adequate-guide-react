module.exports = {
  extends: `react-app`,
  rules: {
    "react/display-name": "off", // Memo triggers false positive
    "react/self-closing-comp": "error",
    "react-hooks/exhaustive-deps": "off",
  },
};
