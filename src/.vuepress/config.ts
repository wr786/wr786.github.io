import { defineUserConfig, viteBundler } from "vuepress";
import { commentPlugin } from "vuepress-plugin-comment2";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  locales: {
    "/": {
      lang: "en-US",
      title: "Blog Demo",
      description: "A blog demo for vuepress-theme-hope",
    },
    "/zh/": {
      lang: "zh-CN",
      title: "博客演示",
      description: "vuepress-theme-hope 的博客演示",
    },
  },

  bundler: viteBundler({
    viteOptions: {
      css: {
        postcss: {
          plugins: [tailwindcss, autoprefixer],
        },
      },
    },
  }),

  plugins: [
    commentPlugin({
      provider: "Giscus", //评论服务提供者。
      comment: true, //启用评论功能
      repo: "wr786/wr786.github.io", //远程仓库
      repoId: "R_kgDOJUK89A", //对应自己的仓库Id
      category: "Announcements",
      categoryId: "DIC_kwDOJUK89M4CVoKO" //对应自己的分类Id
    }),
  ],

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
