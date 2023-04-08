/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // 由于 . 开头的文件夹无法被通配符匹配
    // 因此需要手动指定其路径
    "./src/.vuepress/**/*.{vue,ts,js,jsx,tsx,md,html}",
    "./src/**/*.{vue,ts,js,jsx,tsx,md,html}",
  ],
  corePlugins: {
    // 禁用 preflight，防止覆盖原有样式
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        // 以下颜色变量来自 Hope 主题
        // 添加它们以便在 Tailwind 中使用
        "theme-color": "var(--theme-color)",
        "bg-primary": "var(--bg-color)",
        "bg-secondary": "var(--bg-color-secondary)",
        "bg-tertiary": "var(--bg-color-tertiary)",
        "border-color": "var(--border-color)",
        "box-shadow": "var(--box-shadow)",
        "text-color": "var(--text-color)",
        "card-shadow": "var(--card-shadow)",
      },
      screens: {
        // 参照 Hope 主题的配置，调整部分响应式断点
        sm: "720px",
        lg: "960px",
        xl: "1440px",
      },
    },
  },
  plugins: [],
};
