import { defineUserConfig, viteBundler } from "vuepress";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  head: [
    // font, see  https://theme-hope.vuejs.press/cookbook/customize/font.html#font-library
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    [
      "link",
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    ],
    [
      "link",
      {
        href: "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500",
        // href: "https://fonts.googleapis.com/css?family=Noto+Serif+SC",
        rel: "stylesheet",
      },
    ],
    [
      "meta",
      {
        name: "google-site-verification",
        content: "gfgp2xIoIKS2k4g-qRelpJ49JlXBs78W1GzRzshSWIw"
      }
    ]
  ],

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
      title: "KOWA7的空间",
      description: "日々進化中",
    },
  },

  theme

  // Enable it with pwa
  // shouldPrefetch: false,
});
