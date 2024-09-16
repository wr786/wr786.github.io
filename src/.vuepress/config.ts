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
        href: "https://fonts.googleapis.com/css2?family=Recursive:wght,CASL,MONO@300..1000,1,1&display=swap",
        rel: "stylesheet",
      },
    ],
    [
      "link",
      {
        href: "https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.1.0/lxgwwenkai-regular.css",
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
      title: "wr786的空间",
      description: "日々進化中",
    },
  },

  theme

  // Enable it with pwa
  // shouldPrefetch: false,
});
