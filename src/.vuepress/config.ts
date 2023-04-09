import { defineUserConfig, viteBundler } from "vuepress";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  bundler: viteBundler({
    viteOptions: {
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
    },
  }),

  locales: {
    "/": {
      lang: "zh-CN",
      title: "wr786的空间",
      description: "分享明天",
    },
  },

  theme

  // Enable it with pwa
  // shouldPrefetch: false,
});
